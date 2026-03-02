/**
 * REVERSE ENGINEER TAB — Image Analysis Prompt
 *
 * Sends an uploaded infographic to a vision model and receives:
 *   exactPrompt    — detailed prompt to faithfully recreate the image
 *   templatePrompt — same structure with content replaced by [PLACEHOLDERS]
 *
 * Model: OPENROUTER_VISION_MODEL (default: google/gemini-2.0-flash-001)
 * Route: POST /reverse-engineer
 */

const REVERSE_ENGINEER_PROMPT = `You are an expert AI image prompt engineer and visual design analyst. Your task is to analyse an infographic image and produce two text-to-image prompts.

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

export default REVERSE_ENGINEER_PROMPT;
