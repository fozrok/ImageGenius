import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import HOOKS_LIBRARY from './hooks-library.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Rate limiters ─────────────────────────────────────────────────────────
// 30 image generations per IP per hour
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit reached — maximum 30 image generations per hour. Try again later or restart the server to reset.' }
});

// 120 prompt refinements per IP per hour (cheap, generous limit)
const refineLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit reached — maximum 120 prompt refinements per hour. Try again later.' }
});
// ──────────────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(join(__dirname, 'public')));

// GET / - Serve index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// POST /refine-prompt - OpenRouter API call
app.post('/refine-prompt', refineLimiter, async (req, res) => {
  const { topic, style, density, referenceImageBase64, mimeType, brandColors } = req.body;

  if (!topic || !style) {
    return res.status(400).json({ error: 'Missing topic or style' });
  }

  const densityInstructions = {
    Minimal: `
## DENSITY: MINIMAL
The user wants a clean, ultra-sparse infographic. Your Phase 1 analysis must extract ONLY the single most important insight. Your Phase 2 prompt must describe a composition with:
- Maximum 3 labelled visual elements total
- Generous negative space — at least 40% of the canvas is empty
- One dominant focal point (the hero stat/concept) and at most two supporting elements
- No sub-bullets, no annotation layers, no complex layouts
- Simple geometric shapes or a single bold icon — nothing decorative or ornate
- Clean, readable typography with no more than 2 font treatments`,
    Concise: `
## DENSITY: CONCISE
The user wants a balanced infographic. Your Phase 1 analysis should extract 1 hero insight and 3–5 supporting points. Your Phase 2 prompt must describe:
- 4–7 clearly labelled elements with visible hierarchy
- Comfortable whitespace between sections
- One primary layout metaphor (funnel, timeline, comparison, etc.)
- Clear typography hierarchy across 2–3 levels`,
    Detailed: `
## DENSITY: DETAILED
The user wants an information-rich infographic. Your Phase 1 analysis should extract all sub-topics, statistics, and nuances. Your Phase 2 prompt must describe:
- 8+ data points, multiple callout boxes, rich annotations
- Layered visual hierarchy with primary, secondary, and tertiary elements
- Multiple sections or panels with clearly differentiated content zones
- Dense but organised typography with 3+ levels of hierarchy`
  };

  const densitySection = densityInstructions[density] || densityInstructions['Concise'];

  const brandSection = brandColors
    ? `\n\nBRAND COLOURS — the prompt must instruct the image generator to use ONLY these colours throughout:\n${brandColors}`
    : '';

  const referenceNote = referenceImageBase64
    ? '\n\nA reference image has been provided. Study it carefully to extract: visual style, colour palette, layout structure, typography treatment, and overall aesthetic. Incorporate these specific visual characteristics into your prompt — the output should feel visually coherent with the reference image.'
    : '';

  const systemPrompt = `You are a world-class instructional designer and AI image prompt engineer specialising in infographic creation for the Nano Banana Pro image generation model.

Your task is a two-phase process:

## PHASE 1 — Instructional Analysis
Deeply analyse the user's raw input as an expert instructional designer. Extract and structure the content:
- A compelling, specific TITLE
- 1 HERO STAT or central insight (the most striking takeaway)
- Supporting concepts that reinforce the hero (quantity governed by density below)
- Actionable steps or conclusions (quantity governed by density below)
- The best VISUAL METAPHOR or layout structure (timeline, funnel, comparison, cycle, radial, before/after, etc.)

${densitySection}

## PHASE 2 — Image Prompt Construction
Using your structured content from Phase 1, construct a single detailed image generation prompt that:
1. Opens with the infographic title and layout structure
2. Describes each visual section in spatial terms (top, left panel, bottom row, central circle, etc.)
3. Explicitly describes the art style using the provided style description
4. Specifies typography hierarchy, color palette, background treatment, and mood
5. Ends with technical quality descriptors (resolution, rendering style, professional quality)

## RULES
- Treat the user's raw input as the ONLY content source — extract real insights, never invent placeholders
- The hero stat must lead visually
- Language must match the user's input language
- Return ONLY the final image prompt from Phase 2. No preamble, no labels, no markdown, no explanation.`;

  try {
    const useVision = !!referenceImageBase64;
    const model = useVision
      ? (process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.0-flash-001')
      : (process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet');

    const userContent = useVision
      ? [
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${referenceImageBase64}` } },
        { type: 'text', text: `Topic: ${topic}\n\nArt Style: ${style}${brandSection}${referenceNote}` }
      ]
      : `Topic: ${topic}\n\nArt Style: ${style}${brandSection}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errorText}` });
    }

    const data = await response.json();
    const prompt = data.choices?.[0]?.message?.content?.trim();
    if (!prompt) return res.status(500).json({ error: 'No prompt returned from OpenRouter' });

    res.json({ prompt });
  } catch (err) {
    console.error('Error calling OpenRouter:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});


// POST /generate-image - kie.ai createTask
app.post('/generate-image', generateLimiter, async (req, res) => {
  const { prompt, resolution, aspectRatio, outputFormat, referenceImageBase64, referenceImageMime } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // Build image_input array — include reference image if provided
  const imageInput = [];
  if (referenceImageBase64 && referenceImageMime) {
    imageInput.push(`data:${referenceImageMime};base64,${referenceImageBase64}`);
  }

  try {
    const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        input: {
          prompt,
          image_input: imageInput,
          aspect_ratio: aspectRatio || '1:1',
          resolution: resolution || '1K',
          output_format: outputFormat || 'png'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `kie.ai error: ${errorText}` });
    }

    const data = await response.json();
    const taskId = data?.data?.taskId;

    if (!taskId) {
      return res.status(500).json({ error: 'No taskId returned from kie.ai' });
    }

    res.json({ taskId });
  } catch (err) {
    console.error('Error calling kie.ai createTask:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /task-status/:taskId - kie.ai recordInfo polling
app.get('/task-status/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const response = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.KIE_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `kie.ai error: ${errorText}` });
    }

    const data = await response.json();
    const taskData = data?.data;

    if (!taskData) {
      return res.status(500).json({ error: 'No task data returned' });
    }

    const { state, resultJson, failCode, failMsg } = taskData;

    if (state === 'success') {
      let imageUrl = null;
      try {
        const result = JSON.parse(resultJson);
        imageUrl = result?.resultUrls?.[0] || null;
      } catch (e) {
        return res.status(500).json({ state: 'fail', failMsg: 'Failed to parse result JSON' });
      }

      if (!imageUrl) {
        return res.status(500).json({ state: 'fail', failMsg: 'No image URL in result' });
      }

      return res.json({ state: 'success', imageUrl });
    }

    if (state === 'fail') {
      return res.json({ state: 'fail', failMsg: failMsg || 'Generation failed' });
    }

    // waiting or any other state
    return res.json({ state: 'waiting' });
  } catch (err) {
    console.error('Error calling kie.ai recordInfo:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /refine-mockup - Generate a mockup text-to-image prompt
app.post('/refine-mockup', async (req, res) => {
  const { context, mockupType, referenceImageBase64, mimeType, brandColors } = req.body;

  if (!context || !mockupType) {
    return res.status(400).json({ error: 'Missing context or mockupType' });
  }

  const brandSection = brandColors
    ? `\n\nBRAND COLOURS (incorporate these into the design on screen/cover):\n${brandColors}`
    : '';

  const referenceNote = referenceImageBase64
    ? '\n\nA reference image has been provided. Use it to extract the product name, visual style, colour palette, key text, and iconography — then incorporate those specific details into the prompt placeholders.'
    : '';

  const systemPrompt = `You are an expert text-to-image prompt engineer specialising in product showcase mockups. You have mastered 7 mockup templates. Your job is to fill the correct template with the user's content and return a single, polished, ready-to-use image generation prompt.

## THE 7 TEMPLATES

### 1. LAPTOP
A professional laptop mockup centered on a neutral gray surface, screen facing forward. The laptop screen displays a high-contrast graphic design titled "[SCREEN_TITLE]" in [SCREEN_TITLE_FONT] and [SCREEN_TITLE_colour] typography. The background of the screen is a [relevant-background-theme] with [relevant background details]. In the center of the screen, [CENTER_ELEMENT] is connected by [LAYOUT_STYLE] to [ICON_COUNT] containing minimalist symbols: [ICON_SYMBOLS]. The layout is framed by a [brand_colour] rectangular border. Top center branding reads "[SCREEN_SUBTITLE]". Photorealistic 8k resolution, studio lighting, clean tech aesthetic, sharp focus on the screen contents with subtle reflections on the hardware.

### 2. 3D BOOK (PORTRAIT)
A professional 3D portrait-oriented book mockup titled "[BOOK_TITLE_MAIN]" angled at a three-quarter perspective against a [light-brand-colour] background. The book cover features a [relevant-background-theme] with [relevant background details]. At the top center, white sans-serif text reads "[PROGRAM_NAME]" accompanied by a minimalist logo. Centered on the cover is [COVER_ICON]. A teal rectangular border frames the cover elements. [LENS_FLARE_COUNT] bright orange-white lens flares with sharp diffraction spikes are positioned symmetrically. The top section reads "[BOOK_TITLE_TOP]" in bold white uppercase sans-serif, and "[BOOK_TITLE_MAIN]" is centered below in a [TITLE_BAR_COLOR] horizontal bar. Clean, sharp edges, high-gloss finish, studio lighting with soft drop shadows.

### 3. IMAC / DESKTOP MONITOR
A high-resolution 3D mockup of a silver all-in-one desktop computer centered on a clean white surface. The monitor displays a professional webinar interface with a [relevant-background-theme] background with [relevant background details]. In the [PRESENTER_POSITION] corner, a high-quality portrait of [PRESENTER_DESCRIPTION] is overlaid. The top center features [BRAND_TEXT_COLORS] text reading "[PROGRAM_NAME]". Centered on the screen is a large white line-art logo featuring [CENTER_LOGO]. [BG_DETAIL]. A [LIVE_INDICATOR] is in the bottom left. The hardware has a metallic finish with realistic screen reflections and a soft drop shadow. 8k resolution, minimalist corporate aesthetic, sharp focus.

### 4. TWIN MONITORS
A professional 3D product mockup of two silver all-in-one desktop monitors placed side-by-side on a seamless, soft-gray studio floor. The monitors are arranged in a shallow butterfly configuration, with each monitor subtly angled inward at exactly 15 degrees so their inner edges are slightly closer to the viewer than their outer edges. The monitors do not touch, leaving a sliver of space in the center. The left screen displays [LEFT_SCREEN_CONTENT] with [LEFT_TEXT_COLORS] text reading "[LEFT_SCREEN_TITLE]". The right screen displays [RIGHT_SCREEN_CONTENT] with the text "[RIGHT_SCREEN_TITLE]". High-key studio lighting, realistic metallic aluminum textures, soft ambient occlusion shadows, and 8k photorealistic resolution. The back of the monitors is not visible

### 5. IPAD / TABLET
A photorealistic 3D mockup of a sleek black tablet, in [ORIENTATION], floating at a [ANGLE] against a [BACKGROUND] background. The tablet screen displays a high-contrast graphic titled "[SCREEN_TITLE]" in bold white sans-serif typography. The middle portion of the title is set within a [TITLE_BANNER_COLOR] horizontal banner. The background on the screen is a [relevant-background-theme] with [relevant background details]. Centered in the lower half is [CENTER_ICON]. The layout is framed by a [BRAND_COLOR] double-line border. The tablet has a glossy glass finish with realistic screen glare and a soft drop shadow on the ground. 8k resolution, cinematic lighting, professional product photography style.

### 6. PAPERBACK BOOK
A professional 3D paperback book mockup floating in a minimalist light gray studio space. The book is angled at a three-quarter perspective, showing the front cover and the texture of the white page edges. The cover design has a white top banner with [LOGO_STYLE] and the text "[COLLECTION_NAME]". The center of the cover features [COVER_IMAGE] with "[MAIN_TITLE]" in bold white condensed sans-serif text. The bottom of the cover is a solid [ACCENT_COLOR] bar with the subtitle "[SUBTITLE]" in small white italics. High-resolution, photorealistic paper textures, soft ambient occlusion shadows, 8k resolution, clean and modern aesthetic.

### 7. RESPONSIVE DEVICE COMBO (PHONE + LAPTOP + TABLET)
A professional 3D responsive web design mockup featuring a silver MacBook Pro laptop, a black smartphone on a [STAND_STYLE], and a [TABLET_ORIENTATION]-oriented black-bezel tablet. The laptop is centered on a seamless light gray studio floor. To its right, the tablet floats in the air, angled at 15 degrees and positioned slightly in front of the laptop to create a layered overlap and depth. Just in front of the laptop, to the [PHONE_POSITION], is the smartphone, positioned slightly in front of the laptop to create depth. All three screens display "[SITE_NAME]" website featuring [HERO_VISUAL]. The [COLOR_PALETTE] color palette is consistent across all three screens. The tablet's dark bezel provides sharp contrast against the high-key gray environment. Photorealistic aluminum and glass textures, realistic screen glare, soft ambient occlusion shadows, 8k resolution, elegant and clean lifestyle tech aesthetic.

## YOUR TASK
The user will tell you their product/content details and which mockup type they want. Fill the correct template's placeholders with their content. Return ONLY the completed prompt text — no preamble, no template number, no markdown, no explanation. Just the raw filled-in prompt ready to paste into an image generator.`;

  try {
    const useVision = !!referenceImageBase64;
    const model = useVision
      ? (process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.0-flash-001')
      : (process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet');

    const userContent = useVision
      ? [
        {
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${referenceImageBase64}` }
        },
        {
          type: 'text',
          text: `Mockup type: ${mockupType}\n\nProduct/Content description:\n${context}${brandSection}${referenceNote}`
        }
      ]
      : `Mockup type: ${mockupType}\n\nProduct/Content description:\n${context}${brandSection}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errorText}` });
    }

    const data = await response.json();
    const prompt = data.choices?.[0]?.message?.content?.trim();

    if (!prompt) {
      return res.status(500).json({ error: 'No prompt returned from OpenRouter' });
    }

    res.json({ prompt });
  } catch (err) {
    console.error('Error calling /refine-mockup:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /reverse-engineer - Analyse image and produce two prompts
app.post('/reverse-engineer', async (req, res) => {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
  }

  const visionModel = process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.0-flash-001';

  const systemPrompt = `You are an expert AI image prompt engineer and visual design analyst. Your task is to analyse an infographic image and produce two text-to-image prompts.

CRITICAL: Return ONLY a raw JSON object — no markdown fences, no prose before or after. All newlines inside string values MUST be escaped as \\n so the JSON is valid.

The JSON object must have exactly this shape:
{
  "exactPrompt": "...",
  "templatePrompt": "..."
}

## exactPrompt
A structured, human-readable prompt that faithfully recreates the uploaded infographic. Format it as six clearly labelled sections using the exact headings below, each on its own line, separated by a blank line. Use plain text only (no markdown symbols like # or *).

Start with a single unlabelled sentence summarising the infographic subject, purpose, and overall visual format — no heading, just the sentence. Then leave a blank line before the next section.

ART STYLE:
Describe the visual design language: illustration style, colour mood, rendering technique, level of detail, and any distinctive aesthetic. Include the dominant colour palette with hex codes if identifiable.

SHAPE & COMPOSITION:
Describe the spatial layout in detail — the overall grid or flow structure, how sections are divided, the shapes used, aspect ratio feel, whitespace usage, and the visual hierarchy from top to bottom / left to right.

TEXT & TYPOGRAPHY:
Describe all text elements: the main title treatment, subheadings, body labels, callout statistics, and any icon labels. Note font style, capitalisation patterns, and how text is positioned relative to visuals.

KEY POINTS BY SECTION:
List each distinct section or panel of the infographic in order, with its exact heading/label, the specific data points, statistics, bullet text, or key phrases it contains, and any icons or visual elements associated with it.

MAIN INTENT:
State the primary message or call-to-action the infographic communicates to its audience, and any emotional or persuasive tone.

## templatePrompt
The same structural prompt but with ALL content-specific details replaced with fill-in-the-blank placeholders in [SQUARE BRACKETS]. Preserve everything about the design language: layout structure, typography hierarchy, visual style, art direction, colour palette. Replace: all specific text, statistics, data values, named entities, product names, dates. Use meaningful placeholder labels like [HERO STATISTIC], [SUPPORTING DATA POINT 1], [SECTION TITLE], [BRAND NAME], [CALL TO ACTION], etc.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: visionModel,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${imageBase64}` }
              },
              {
                type: 'text',
                text: 'Analyse this infographic and return the two prompts as specified.'
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errorText}` });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return res.status(500).json({ error: 'No response from vision model' });
    }

    // Robustly extract a JSON object even if the model adds prose or fences.
    let cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      try {
        const recovered = cleaned.replace(/(?<!\\)\n/g, '\\n');
        parsed = JSON.parse(recovered);
      } catch (e2) {
        console.error('RE raw response:', raw);
        return res.status(500).json({ error: 'Model returned invalid JSON', raw });
      }
    }

    const { exactPrompt, templatePrompt } = parsed;
    if (!exactPrompt || !templatePrompt) {
      return res.status(500).json({ error: 'Model response missing required fields', parsed });
    }

    res.json({ exactPrompt, templatePrompt });
  } catch (err) {
    console.error('Error in /reverse-engineer:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /thumbnail-idea - analyse raw user idea and suggest hooks, feeling, headline, subtext
app.post('/thumbnail-idea', refineLimiter, async (req, res) => {
  const { rawIdea } = req.body;
  if (!rawIdea?.trim()) {
    return res.status(400).json({ error: 'rawIdea is required' });
  }

  // Format the hook library as a readable list for the prompt
  const hooksByCategory = {};
  HOOKS_LIBRARY.forEach(h => {
    if (!hooksByCategory[h.category]) hooksByCategory[h.category] = [];
    hooksByCategory[h.category].push(h.template);
  });
  const hooksText = Object.entries(hooksByCategory).map(([cat, templates]) =>
    `${cat}:\n${templates.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}`
  ).join('\n\n');

  const systemPrompt = `You are an expert YouTube thumbnail strategist and hook writer.

You have access to the following hook template library. Each template uses [Placeholders] you fill in with the user's topic:

${hooksText}

## Your Task
Analyse the user's raw idea and return exactly this JSON (no markdown fences, no extra text):

{
  "topic": "concise 3-8 word description of the main topic",
  "hooks": [
    { "category": "CategoryName", "text": "Fully written hook with placeholders replaced — ready to use as a YouTube title" },
    { "category": "CategoryName", "text": "Second hook from a different category" },
    { "category": "CategoryName", "text": "Third hook from a different category" }
  ],
  "recommendedFeeling": "one of: Curious, Shocked, Inspired, Concerned, Excited, Confident",
  "headlineSuggestion": "3-5 word bold headline for the thumbnail overlay",
  "subtextSuggestion": "short secondary line (optional, 3-6 words)"
}

Rules:
- All 3 hooks must be from DIFFERENT categories
- Fill all [Placeholders] with the user's actual topic
- Hooks should be real, compelling, immediately usable as YouTube titles
- headlineSuggestion must be SHORT — it appears as large text on a thumbnail (max 5 words)
- Return ONLY the JSON object`;

  try {
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `My video idea:\n${rawIdea.trim()}` }
        ],
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errorText}` });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return res.status(500).json({ error: 'No response from AI' });

    let cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw });
    }

    if (!parsed.hooks?.length || !parsed.topic) {
      return res.status(500).json({ error: 'AI response missing required fields', parsed });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Error in /thumbnail-idea:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /thumbnail-prompt - AI thumbnail prompt assembly (Part 9 logic)
app.post('/thumbnail-prompt', refineLimiter, async (req, res) => {
  const {
    videoTitle, topic, niche, desiredEmotion, subjectPreference,
    brandColors, headlineText, subtextText,
    loopOverride, curiosityGapOverride, styleTag, expressionOverride,
    colorPreset, customAccentHex, layoutOverride,
    referenceImageBase64, referenceImageMime
  } = req.body;

  if (!videoTitle || !topic) {
    return res.status(400).json({ error: 'videoTitle and topic are required' });
  }

  const colorSection = customAccentHex
    ? `Custom accent colour: ${customAccentHex}`
    : colorPreset
      ? `Colour preset: ${colorPreset}`
      : brandColors
        ? `Brand colours: ${brandColors}`
        : 'No specific colours provided — choose a suitable preset from the 7 presets.';

  const overrides = [
    loopOverride ? `Loop type OVERRIDE (user selected): ${loopOverride}` : '',
    curiosityGapOverride ? `Curiosity gap OVERRIDE (user selected): ${curiosityGapOverride}` : '',
    styleTag ? `Style tag: ${styleTag}` : '',
    expressionOverride ? `Expression OVERRIDE (user selected): ${expressionOverride}` : '',
    layoutOverride ? `Layout OVERRIDE (user selected): ${layoutOverride}` : '',
  ].filter(Boolean).join('\n');

  const systemPrompt = `You are an expert YouTube thumbnail prompt engineer for Nano Banana Pro image generation.

PSYCHOLOGY FRAMEWORK:

Loop Types — classify from video title:
- desire: educational/how-to, pain+solution → show end state or transformation
- interest: entertainment/story/reaction → show tension, curiosity, unresolved moment
- aspiration: motivational/mindset/coaching → show the aspirational after state
- fear: warnings/mistakes/risk → show the painful before state

Curiosity Gaps:
- before_after: Split screen — relatable before, aspirational after
- challenge: Subject facing or overcoming high-stakes situation
- contradiction: Visually mismatched elements that feel "wrong"
- novelty: One bizarre/unexpected element that makes viewer stop
- result: End state clearly shown, journey hidden

Attention Triggers (choose MAX 3):
1. Color Contrast, 2. Strong Face + Expression, 3. Famous/Recognisable Person (only if in video), 4. Big Number/Dollar Figure, 5. Familiar Icon/Visual Shortcut, 6. Cinematic/Aesthetic Imagery, 7. Movement/Drama/Danger

Expression Library — map from desiredEmotion:
- Curious → "curious and engaged — warm and approachable, suggesting the topic is more accessible than expected"
- Shocked → "wide-eyed and genuinely surprised — not theatrical, but authentically caught off-guard"
- Inspired → "quietly confident and inspired — radiating the feeling of someone who has already made the transformation"
- Concerned → "slightly concerned but composed — the face of someone who knows something the viewer doesn't"
- Excited → "radiating quiet, earned confidence — the expression of someone who has come out the other side"
- Confident → "calm, assured, and professional — projecting quiet competence rather than loud confidence"

Layouts:
- offset: Subject on left/right third — most versatile, use for desire/aspiration loops
- centered: Subject in center — use for big reveals, challenges, authority
- split_screen: Two halves — use ONLY for before/after or comparison topics

3-Element Rule: NEVER more than 3 visual elements. Always: 1) Subject, 2) Context visual, 3) Text/graphic accent.

Color Psychology: green=good/positive, red=bad/warning, warm tones=aspiration, cool=tech/authority. Dark backgrounds with bright accents perform best on both dark and light mode.
Contrast Warning: If the chosen colour is light (white, cream, light yellow) on a light/white background, flag it.

2-Second Test: Key message must be comprehensible within 2 seconds. If complex or crowded, it fails.

Quality Modifiers — APPEND TO EVERY PROMPT:
"Soft, diffused cinematic lighting. [LAYOUT] composition using the Rule of Thirds. No key visual elements in the bottom-right corner (reserved for YouTube timestamp overlay). All text and graphic elements large enough to read clearly on a mobile phone screen at thumbnail size. Maximum 3 visual elements in the frame. High detail, photorealistic quality. The overall aesthetic is eye-catching, modern, and designed to maximise click-through rate. 16:9 aspect ratio, 1920x1080 resolution."

TASK: Using all inputs below, follow the 9-step assembly logic, then output ONLY a raw valid JSON object — no markdown, no prose, no code fences.

Required JSON shape:
{
  "loopType": "desire|interest|aspiration|fear",
  "curiosityGap": "before_after|challenge|contradiction|novelty|result",
  "attentionTriggers": ["trigger1", "trigger2"],
  "expressionUsed": "expression string from library above",
  "layoutUsed": "offset|centered|split_screen",
  "contrastWarning": null,
  "twoSecondTestPass": true,
  "twoSecondTestNote": "brief note only if false, else empty string",
  "prompts": {
    "offset": "FULL ready-to-generate prompt — offset composition — all variables resolved — quality modifiers appended",
    "centered": "FULL ready-to-generate prompt — centered composition — all variables resolved — quality modifiers appended",
    "splitScreen": "FULL ready-to-generate prompt — split screen composition or creative variation if not applicable — all variables resolved — quality modifiers appended"
  }
}

All three prompts must be fully written, detailed, and immediately usable with Nano Banana. Each must differ in layout and composition but share the same topic, style, and colour.`;

  const userMessage = `Video Title: ${videoTitle}
Topic/Niche: ${topic}${niche ? ` / ${niche}` : ''}
Target viewer emotion: ${desiredEmotion || 'Curious'}
Subject preference: ${subjectPreference || 'No preference'}
Headline text: ${headlineText || '(AI to suggest)'}
Subtext: ${subtextText || '(AI to suggest)'}
Colours: ${colorSection}
${overrides ? `\nUser overrides:\n${overrides}` : ''}`;

  const hasReferenceImage = !!referenceImageBase64;
  const referenceNote = hasReferenceImage
    ? '\nA reference photo of the person has been provided. Study their likeness carefully: note their hair colour, eye colour, skin tone, facial structure, any distinctive features, and approximate age. Incorporate a precise description of this person into all three thumbnail prompts so the image generator can reproduce their likeness accurately.'
    : '';

  try {
    // Use vision model if reference image provided, otherwise text model
    const textModel = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    const visionModel = process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.0-flash-001';
    const model = hasReferenceImage ? visionModel : textModel;

    // Build user message — multimodal if image is present
    const userContent = hasReferenceImage
      ? [
        {
          type: 'image_url',
          image_url: { url: `data:${referenceImageMime};base64,${referenceImageBase64}` }
        },
        {
          type: 'text',
          text: userMessage + referenceNote
        }
      ]
      : userMessage;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errorText}` });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim();

    if (!raw) return res.status(500).json({ error: 'No response from AI' });

    // Robustly extract JSON even if model wraps in fences
    let cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      try {
        parsed = JSON.parse(cleaned.replace(/(?<!\\)\n/g, '\\n'));
      } catch {
        return res.status(500).json({ error: 'AI returned invalid JSON', raw });
      }
    }

    if (!parsed.prompts?.offset) {
      return res.status(500).json({ error: 'AI response missing required prompt fields', parsed });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Error in /thumbnail-prompt:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /download - Stream image from CDN
app.get('/download', async (req, res) => {
  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const decodedUrl = decodeURIComponent(url);
  const rawFilename = filename ? decodeURIComponent(filename) : 'infographic.png';
  const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._\-]/g, '_');
  const contentType = safeFilename.endsWith('.jpg') ? 'image/jpeg' : 'image/png';

  try {
    const imageResponse = await fetch(decodedUrl);

    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ error: 'Failed to fetch image from CDN' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', contentType);

    const buffer = await imageResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Error downloading image:', err);
    res.status(500).json({ error: err.message || 'Failed to download image' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Infographic Designer running at http://localhost:${PORT}`);
});
