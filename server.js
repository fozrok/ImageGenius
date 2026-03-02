import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import HOOKS_LIBRARY from './hooks-library.js';

// ── Prompt modules — edit these files to update any LLM system prompt ──────
import CONTENT_INTELLIGENCE_PROMPT from './prompts/content-intelligence.js';
import { buildVisualStrategistPrompt } from './prompts/visual-strategist.js';

import { buildRefinePrompt } from './prompts/refine-infographic.js';
import MOCKUP_SYSTEM_PROMPT from './prompts/mockup-templates.js';
import REVERSE_ENGINEER_PROMPT from './prompts/reverse-engineer.js';
import { buildThumbnailIdeaPrompt, THUMBNAIL_PROMPT_SYSTEM } from './prompts/thumbnail.js';


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

// ─── Content Sanitisation Helpers ───────────────────────────────────────────
/**
 * Removes duplicate sentences/phrases from raw pasted content.
 * Pass 1: exact duplicates (case-insensitive, stripped of punctuation).
 * Pass 2: near-duplicates where one sentence is ≥80% a substring of another.
 */
function deduplicateContent(text) {
  if (!text || typeof text !== 'string') return text;
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);
  const seen = [];
  const result = [];
  for (const sentence of sentences) {
    const norm = sentence.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
    if (!norm) continue;
    if (seen.includes(norm)) continue;
    const isDupe = seen.some(s => {
      const longer = s.length >= norm.length ? s : norm;
      const shorter = s.length < norm.length ? s : norm;
      return longer.includes(shorter) && shorter.length / longer.length >= 0.8;
    });
    if (isDupe) continue;
    seen.push(norm);
    result.push(sentence);
  }
  return result.join(' ');
}
// ───────────────────────────────────────────────────────────────────────

// GET /api/config — expose public config (model names) to the frontend
app.get('/api/config', (req, res) => {
  res.json({
    llmModel: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
    visionModel: process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.0-flash-001',
    visualStrategyModel: process.env.VISUAL_STRATEGY_MODEL || 'google/gemini-3-flash-preview',
  });
});

// POST /analyse-content — Visual Strategy: analyse raw website copy → recommend visuals

app.post('/analyse-content', refineLimiter, async (req, res) => {
  const { websiteCopy, visualStyle } = req.body;
  if (!websiteCopy || websiteCopy.trim().length < 80) {
    return res.status(400).json({ error: 'Please paste at least a few sentences of website copy.' });
  }

  const model = process.env.VISUAL_STRATEGY_MODEL || 'google/gemini-3-flash-preview';

  const rawCopy = websiteCopy.trim();

  // Helper: call OpenRouter with a 45s timeout and return the text content
  async function callLLM(systemPrompt, userMessage, maxTokens = 2000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    let r;
    try {
      r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }], max_tokens: maxTokens })
      });
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('AI request timed out after 45 seconds. Try again or use a shorter input.');
      throw e;
    } finally {
      clearTimeout(timeout);
    }
    if (!r.ok) { const e = await r.text(); throw new Error(`OpenRouter error (${r.status}): ${e.slice(0, 200)}`); }
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty response from AI');
    return text;
  }

  // Helper: robustly extract and parse the first valid JSON object or array
  // Handles: markdown fences anywhere, prose preamble, trailing prose, escaped newlines
  function parseJSON(raw, shape = 'object') {
    // Pass 1: strip all markdown code fences (```json ... ``` or ``` ... ```)
    let s = raw.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();

    // Pass 2: extract the outermost bracket block that matches the expected shape
    const open = shape === 'array' ? '[' : '{';
    const close = shape === 'array' ? ']' : '}';
    let start = -1, depth = 0, end = -1;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === open) { if (depth === 0) start = i; depth++; }
      if (s[i] === close) { depth--; if (depth === 0 && start !== -1) { end = i; break; } }
    }
    if (start !== -1 && end !== -1) s = s.slice(start, end + 1);

    // Pass 3: attempt parse; if it fails try escaping bare newlines inside strings
    try { return JSON.parse(s); } catch (_) { }
    try { return JSON.parse(s.replace(/(?<!\\)\n/g, '\\n')); } catch (e) {
      console.error('[parseJSON] Failed. Raw snippet:', raw.slice(0, 400));
      throw new Error(`JSON parse failed: ${e.message}`);
    }
  }


  try {
    // ── STEP 1: Content Intelligence Extraction ─────────────────────────────
    console.log('[analyse-content] Step 1: extracting content intelligence…');

    const step1System = CONTENT_INTELLIGENCE_PROMPT;

    const step1Raw = await callLLM(step1System, `RAW CONTENT:\n${rawCopy}`, 1500);
    let contentIntelligence;
    try {
      contentIntelligence = parseJSON(step1Raw, 'object');
    } catch {
      console.error('[analyse-content] Step 1 JSON parse failed:', step1Raw.slice(0, 300));
      return res.status(500).json({ error: 'Step 1 (content intelligence) returned invalid JSON', raw: step1Raw });
    }
    console.log('[analyse-content] Step 1 complete. core_message:', contentIntelligence.core_message);

    // ── STEP 2: Visual Recommendation Generation ────────────────────────────
    console.log('[analyse-content] Step 2: generating visual recommendations…');

    const step2System = buildVisualStrategistPrompt(visualStyle || 'infographic');

    const step2User = `CONTENT INTELLIGENCE REPORT:
${JSON.stringify(contentIntelligence, null, 2)}

ORIGINAL RAW COPY:
${rawCopy}`;

    const step2Raw = await callLLM(step2System, step2User, 4000);
    let recommendations;
    try {
      recommendations = parseJSON(step2Raw, 'array');
    } catch {
      console.error('[analyse-content] Step 2 JSON parse failed:', step2Raw.slice(0, 300));
      return res.status(500).json({ error: 'Step 2 (visual recommendations) returned invalid JSON', raw: step2Raw });
    }

    if (!Array.isArray(recommendations)) {
      return res.status(500).json({ error: 'Step 2 response was not an array', raw: step2Raw });
    }

    console.log(`[analyse-content] Done. ${recommendations.length} recommendations generated.`);
    res.json({ contentIntelligence, recommendations });

  } catch (err) {
    console.error('Error in /analyse-content:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});


// POST /refine-prompt - OpenRouter API call

app.post('/refine-prompt', refineLimiter, async (req, res) => {
  const { topic, style, density, referenceImageBase64, mimeType, brandColors } = req.body;

  if (!topic || !style) {
    return res.status(400).json({ error: 'Missing topic or style' });
  }

  // Deduplicate raw pasted content before it reaches the AI
  const cleanTopic = deduplicateContent(topic);

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
    ? `\n\nBRAND COLOUR PALETTE:\nThe following hex codes define the exact colour palette. Apply these to ALL visual elements (backgrounds, fills, typography, accents). DO NOT write these hex codes as visible text or labels anywhere in the image — they are for colour reference only, not text to render:\n${brandColors}`
    : '';


  const referenceNote = referenceImageBase64
    ? '\n\nA reference image has been provided. Study it carefully to extract: visual style, colour palette, layout structure, typography treatment, and overall aesthetic. Incorporate these specific visual characteristics into your prompt — the output should feel visually coherent with the reference image.'
    : '';

  const systemPrompt = buildRefinePrompt(density, brandSection, referenceNote);


  try {
    const useVision = !!referenceImageBase64;
    const model = useVision
      ? (process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.0-flash-001')
      : (process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet');

    const userContent = useVision
      ? [
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${referenceImageBase64}` } },
        { type: 'text', text: `Topic: ${cleanTopic}\n\nArt Style: ${style}${brandSection}${referenceNote}` }
      ]
      : `Topic: ${cleanTopic}\n\nArt Style: ${style}${brandSection}`;


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


// Helper: upload base64 image to imgbb → get a public URL for kie.ai's image_input
// kie.ai only accepts public URLs, not raw base64 data. imgbb gives us a 3-day temp URL.
async function uploadReferenceToImgbb(base64Data, mimeType) {
  const imgbbKey = process.env.IMGBB_API_KEY;
  if (!imgbbKey) {
    console.warn('[generate-image] IMGBB_API_KEY not set — skipping reference image upload. Add IMGBB_API_KEY to .env for reference image support.');
    return null;
  }
  try {
    const form = new URLSearchParams();
    form.append('key', imgbbKey);
    form.append('image', base64Data); // imgbb accepts raw base64 (no data: prefix)
    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data?.success && data?.data?.url) {
      console.log('[generate-image] Reference image uploaded to imgbb:', data.data.url);
      return data.data.url;
    }
    console.error('[generate-image] imgbb upload failed:', JSON.stringify(data).slice(0, 200));
    return null;
  } catch (err) {
    console.error('[generate-image] imgbb upload error:', err.message);
    return null;
  }
}

// POST /generate-image - kie.ai createTask
app.post('/generate-image', generateLimiter, async (req, res) => {
  const { prompt, resolution, aspectRatio, outputFormat, referenceImageBase64, referenceImageMime, model: requestedModel } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // Validate model — only these two are supported
  const ALLOWED_MODELS = ['nano-banana-2', 'nano-banana-pro'];
  const model = ALLOWED_MODELS.includes(requestedModel) ? requestedModel : 'nano-banana-2';

  // If a reference image is provided, upload it to imgbb to get a public URL
  // that kie.ai can fetch (kie.ai only accepts public URLs, not raw base64).
  let imageInput = [];
  if (referenceImageBase64 && referenceImageMime) {
    const publicUrl = await uploadReferenceToImgbb(referenceImageBase64, referenceImageMime);
    if (publicUrl) {
      imageInput = [publicUrl];
    }
    // If upload failed (e.g. no IMGBB_API_KEY), we proceed without image_input —
    // the text prompt already contains a detailed description from the vision model.
  }

  try {
    const kieBody = {
      model: model,

      input: {
        prompt,
        aspect_ratio: aspectRatio || '16:9',
        resolution: resolution || '2K',
        output_format: outputFormat || 'png'
      }
    };
    if (imageInput.length > 0) {
      kieBody.input.image_input = imageInput;
    }

    const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kieBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `kie.ai error: ${errorText}` });
    }

    const data = await response.json();
    const taskId = data?.data?.taskId;

    if (!taskId) {
      console.error('kie.ai createTask response (no taskId):', JSON.stringify(data));
      return res.status(500).json({
        error: 'No taskId returned from kie.ai',
        kieResponse: data
      });
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

  const systemPrompt = MOCKUP_SYSTEM_PROMPT;

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

  const systemPrompt = REVERSE_ENGINEER_PROMPT;

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

  const systemPrompt = buildThumbnailIdeaPrompt(hooksText);

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
        max_tokens: 1200
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
    colorPreset,
    customBrandBg, customBrandAccent, customBrandText,
    layoutOverride,
    referenceImageBase64, referenceImageMime
  } = req.body;

  if (!videoTitle || !topic) {
    return res.status(400).json({ error: 'videoTitle and topic are required' });
  }

  // Convert a hex color to a human-readable description.
  // CRITICAL: hex codes must NEVER appear in image generation prompts —
  // image models render them literally as color swatches/labels in the output.
  function hexToColorDesc(hex) {
    if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (l < 0.5 ? max + min : 510 - max - min);
    const h = max === min ? 0 :
      max === r ? ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60 :
        max === g ? ((b - r) / (max - min) + 2) * 60 :
          ((r - g) / (max - min) + 4) * 60;
    const light = l < 60 ? 'dark' : l > 200 ? 'light' : l > 150 ? 'pale' : 'mid';
    const sat = s < 30 ? 'neutral' : s < 80 ? 'muted' : 'vivid';
    const hueDesc =
      h < 15 || h >= 345 ? 'red' :
        h < 45 ? 'orange' :
          h < 75 ? 'yellow' :
            h < 150 ? 'green' :
              h < 195 ? 'teal' :
                h < 255 ? 'blue' :
                  h < 285 ? 'indigo' :
                    h < 320 ? 'purple' :
                      h < 345 ? 'pink' : 'red';
    if (r > 230 && g > 230 && b > 230) return 'crisp white';
    if (r < 25 && g < 25 && b < 25) return 'deep black';
    if (s < 20) return l < 80 ? 'dark charcoal grey' : l > 200 ? 'light silver grey' : 'mid stone grey';
    return `${light} ${sat} ${hueDesc}`;
  }

  let colorSection;
  if (customBrandBg && customBrandAccent) {
    const bgDesc = hexToColorDesc(customBrandBg) || 'dark background';
    const accentDesc = hexToColorDesc(customBrandAccent) || 'vivid accent';
    const textDesc = customBrandText ? hexToColorDesc(customBrandText) || 'white' : 'white';
    colorSection = `Custom brand palette — background: ${bgDesc}, accent: ${accentDesc}, text/typography: ${textDesc}. Apply these as the dominant colour mood of the scene.`;
  } else if (colorPreset) {
    colorSection = `Colour preset: ${colorPreset}`;
  } else if (brandColors) {
    colorSection = `Brand colour style: ${brandColors}`;
  } else {
    colorSection = 'No specific colours — choose a visually striking palette that suits the topic mood.';
  }

  const overrides = [
    loopOverride ? `Loop type OVERRIDE (user selected): ${loopOverride}` : '',
    curiosityGapOverride ? `Curiosity gap OVERRIDE (user selected): ${curiosityGapOverride}` : '',
    styleTag ? `Style tag: ${styleTag}` : '',
    expressionOverride ? `Expression OVERRIDE (user selected): ${expressionOverride}` : '',
    layoutOverride ? `Layout OVERRIDE (user selected): ${layoutOverride}` : '',
  ].filter(Boolean).join('\n');

  const systemPrompt = THUMBNAIL_PROMPT_SYSTEM;



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

// POST /refine-strategy-prompt — refine a single visual recommendation prompt
app.post('/refine-strategy-prompt', refineLimiter, async (req, res) => {
  const { currentPrompt, instruction } = req.body;
  if (!currentPrompt || !instruction) {
    return res.status(400).json({ error: 'Missing currentPrompt or instruction' });
  }
  const model = process.env.VISUAL_STRATEGY_MODEL || 'google/gemini-3-flash-preview';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const systemPrompt = `You are an expert AI image prompt engineer refining an existing image generation prompt.

Apply the given refinement instruction to improve the prompt, preserving the existing structure.

The prompt uses this 5-section format — preserve it exactly:

[Opening sentence — overall style and intent of the image]

Artwork Style: [Rendering technique and illustration style]

Colour Palette: [Main background colour + hex, primary accent + hex, highlight + hex, text colour + hex]

Design: [Central focal point, supporting elements, icons, steps — what an artist would draw]

Layout: [Spatial composition — what sits top, bottom, left, right, centre]

Typography: [Font treatment. All text that appears on the image is in "double quotation marks" here]

RULE: Only text in "double quotes" inside the Typography section renders visibly on the image. Everything else is art direction for the artist and must NOT be phrased as on-screen text.

Return ONLY the refined prompt in the same 5-section format — no preamble, no markdown, no explanation.`;


    const userMessage = `CURRENT PROMPT:\n${currentPrompt}\n\nINSTRUCTION:\n${instruction}`;
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }], max_tokens: 1200 })
    });
    clearTimeout(timeout);
    if (!r.ok) { const e = await r.text(); return res.status(r.status).json({ error: `OpenRouter error: ${e.slice(0, 200)}` }); }
    const d = await r.json();
    const refined = d.choices?.[0]?.message?.content?.trim();
    if (!refined) return res.status(500).json({ error: 'Empty response from AI' });
    res.json({ refinedPrompt: refined });
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') return res.status(504).json({ error: 'Request timed out' });
    res.status(500).json({ error: e.message });
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
