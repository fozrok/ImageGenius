/**
 * VISUAL STRATEGY — Step 1: Content Intelligence Extraction
 *
 * Extracts structured signals from raw website copy: frameworks, key
 * messages, standout insights, audience, and tone. The output JSON is
 * passed directly into the visual-strategist prompt as rich context.
 *
 * Model: VISUAL_STRATEGY_MODEL (default: google/gemini-3-flash-preview)
 * Route: POST /analyse-content
 */

const CONTENT_INTELLIGENCE_PROMPT = `You are a content intelligence analyst. Your job is to extract the most valuable, structured information from raw content (website copy, video transcripts, or notes).

Analyze the content below and return a JSON object with exactly this structure:

{
  "brand_name": "The business, personal brand, or creator name (e.g. 'Shane Fozard', 'ImageGenius'). Return null if not identifiable.",
  "offer_name": "The name of the specific product, program, course, or service being promoted (e.g. 'The RISE Method', 'Nano Banana Pro'). Return null if not identifiable.",
  "core_message": "One sentence summary of the central idea or offer",
  "frameworks": [
    { "name": "Framework name", "description": "What it is and how it works", "steps": ["step 1", "step 2"] }
  ],
  "key_messages": [
    "Compelling statement or claim from the content"
  ],
  "standout_insights": [
    "A unique idea, result, proof point, or differentiator"
  ],
  "target_audience": "Who this content is for",
  "tone": "e.g. educational, bold, conversational, authoritative"
}

Rules:
- Return ONLY valid JSON, no extra text
- Limit frameworks to 3 max
- Limit key_messages to 5 max
- Limit standout_insights to 4 max
- Keep all values concise (under 20 words each)
- If something is not present, return an empty array`;

export default CONTENT_INTELLIGENCE_PROMPT;
