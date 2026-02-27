# PRD: AI Infographic Designer (Internal Tool)
**Version:** 1.0  
**Status:** Ready for Build  
**Access:** Internal team only (Shane, Sakeena, Patricia, Arthur)  
**No auth, no monetisation, no public access**

---

## 1. Overview

A local Node.js web application that enables the team to generate high-quality AI infographics by combining an OpenRouter LLM (for prompt refinement) with the kie.ai Nano Banana Pro API (for image generation). The user inputs a brief, selects an art style, reviews and edits the refined prompt, then approves it before image generation begins.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Front-end | HTML, CSS, Vanilla JavaScript |
| Back-end | Node.js + Express.js |
| Environment config | dotenv (.env file) |
| HTTP requests (server) | Native fetch (Node 18+) |
| Prompt refinement | OpenRouter API |
| Image generation | kie.ai Nano Banana Pro API |

### File Structure

```
infographic-designer/
├── server.js
├── .env
├── .env.example
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

### Environment Variables (.env)

```
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
KIE_API_KEY=your_kie_api_key_here
PORT=3000
```

### package.json Dependencies

```json
{
  "name": "infographic-designer",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  }
}
```

---

## 3. Back-End: server.js

Build an Express server with the following routes. All API keys are loaded from `.env` and never exposed to the front-end.

### Routes

#### `GET /`
Serves `public/index.html`.

#### `POST /refine-prompt`
Accepts JSON body: `{ topic: string, style: string }`

Calls OpenRouter API with a system prompt that instructs the LLM to generate a Nano Banana Pro optimised infographic image prompt. Returns the refined prompt string.

**OpenRouter API call:**
- URL: `https://openrouter.ai/api/v1/chat/completions`
- Auth: `Bearer ${OPENROUTER_API_KEY}`
- Model: from `.env`
- System prompt (use exactly):

```
You are an expert AI image prompt engineer specialising in infographic design for the Nano Banana Pro image generation model. 

When given a topic and an art style description, you must return a single, detailed, highly descriptive image generation prompt that:
1. Opens with a clear infographic title concept
2. Explicitly describes the art style in full detail using the provided style description
3. Describes the visual layout, stages or sections of the infographic
4. Specifies typography style, color palette, background, and mood
5. Ends with technical quality descriptors (resolution, detail level, professional quality)

Return ONLY the prompt text. No preamble, no explanation, no markdown formatting. Just the raw prompt.
```

- User message: `Topic: ${topic}\n\nArt Style: ${style}`

**Response:** `{ prompt: string }`

**Error handling:** Return `{ error: string }` with appropriate HTTP status.

#### `POST /generate-image`
Accepts JSON body: `{ prompt: string, resolution: string, aspectRatio: string, outputFormat: string }`

Calls kie.ai createTask endpoint. Returns the taskId.

**kie.ai createTask API call:**
- URL: `POST https://api.kie.ai/api/v1/jobs/createTask`
- Auth: `Bearer ${KIE_API_KEY}`
- Content-Type: `application/json`
- Body:

```json
{
  "model": "nano-banana-pro",
  "input": {
    "prompt": "<prompt from request>",
    "image_input": [],
    "aspect_ratio": "<aspectRatio from request>",
    "resolution": "<resolution from request>",
    "output_format": "<outputFormat from request>"
  }
}
```

**Response:** `{ taskId: string }`

#### `GET /task-status/:taskId`
Polls kie.ai recordInfo endpoint for the given taskId.

**kie.ai recordInfo API call:**
- URL: `GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`
- Auth: `Bearer ${KIE_API_KEY}`

**Response:** Return the full data object as-is: `{ taskId, state, resultJson, failCode, failMsg }`

States: `waiting`, `success`, `fail`

When state is `success`, parse `resultJson` (it is a JSON string) and extract `resultUrls[0]`.

**Response on success:** `{ state: "success", imageUrl: string }`
**Response on waiting:** `{ state: "waiting" }`
**Response on fail:** `{ state: "fail", failMsg: string }`

#### `GET /download`
Accepts query param: `?url=<encoded image URL>&filename=<filename>`

Fetches the image from the kie.ai CDN URL server-side, then streams it back to the browser as a file download with the correct Content-Disposition header.

This is required because kie.ai result URLs are external CDN links. Streaming via the server avoids CORS issues.

**Response headers:**
```
Content-Disposition: attachment; filename="<filename>"
Content-Type: image/png (or image/jpg based on format)
```

---

## 4. Front-End: index.html

Single page. No routing. Load `style.css` and `app.js` from the same public directory.

### HTML Structure (in order, top to bottom)

```html
<!-- App Header -->
<header>
  <h1>AI Infographic Designer</h1>
  <p class="subtitle">Internal Tool</p>
</header>

<main>

  <!-- Section 1: Brief Input -->
  <section id="section-brief">
    <label for="topic-input">What is your infographic about?</label>
    <textarea id="topic-input" placeholder="Describe the topic, concept, or message of your infographic..." rows="4"></textarea>
  </section>

  <!-- Section 2: Art Style Selector -->
  <section id="section-styles">
    <h2>Select Art Style</h2>
    <div id="style-grid" class="style-grid">
      <!-- Cards injected by app.js from STYLES array -->
    </div>
  </section>

  <!-- Section 3: Settings Row -->
  <section id="section-settings">
    <div class="settings-row">
      <div class="setting-group">
        <label>Resolution</label>
        <div class="toggle-group" id="resolution-toggle">
          <button class="toggle-btn active" data-value="1K">1K</button>
          <button class="toggle-btn" data-value="2K">2K</button>
          <button class="toggle-btn" data-value="4K">4K</button>
        </div>
      </div>
      <div class="setting-group">
        <label>Aspect Ratio</label>
        <div class="toggle-group" id="ratio-toggle">
          <button class="toggle-btn active" data-value="1:1">1:1</button>
          <button class="toggle-btn" data-value="16:9">16:9</button>
          <button class="toggle-btn" data-value="9:16">9:16</button>
          <button class="toggle-btn" data-value="3:4">3:4</button>
          <button class="toggle-btn" data-value="4:3">4:3</button>
        </div>
      </div>
      <div class="setting-group">
        <label>Output Format</label>
        <div class="toggle-group" id="format-toggle">
          <button class="toggle-btn active" data-value="png">PNG</button>
          <button class="toggle-btn" data-value="jpg">JPG</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 4: Refine Prompt -->
  <section id="section-refine">
    <button id="btn-refine" class="btn-primary">Refine Prompt</button>
    <div id="refine-status" class="status-message hidden"></div>
    <div id="prompt-output-container" class="hidden">
      <label for="refined-prompt">Refined Prompt (editable)</label>
      <textarea id="refined-prompt" rows="8" placeholder="Your refined prompt will appear here..."></textarea>
      <button id="btn-copy-prompt" class="btn-secondary">Copy Prompt</button>
      <span id="copy-confirm" class="copy-confirm hidden">Copied to clipboard</span>
    </div>
  </section>

  <!-- Section 5: Generate -->
  <section id="section-generate">
    <button id="btn-generate" class="btn-primary" disabled>Generate Image</button>
    <div id="generate-status" class="status-message hidden"></div>
    <div id="progress-bar-container" class="hidden">
      <div id="progress-bar"></div>
    </div>
  </section>

  <!-- Section 6: Result -->
  <section id="section-result" class="hidden">
    <div id="image-container">
      <img id="generated-image" src="" alt="Generated infographic" />
    </div>
    <button id="btn-download" class="btn-primary">Download Image</button>
  </section>

</main>
```

---

## 5. Front-End: app.js

### Art Styles Data (STYLES array)

Define the following styles as a JavaScript array of objects. Each object has:
- `id`: unique slug string
- `name`: display name
- `description`: full style description string sent to the LLM
- `color`: representative hex color for the card thumbnail swatch (used as background until real thumbnails are added)

```javascript
const STYLES = [
  {
    id: "lofi-chic",
    name: "Lofi Chic",
    color: "#f5e6d3",
    description: "The artwork is rendered in a modern digital watercolor and soft-vector 'Lofi-Chic' style. It features a hand-painted feel with gentle textures, organic edges, and a warm, inviting atmosphere. The human figures are stylized, elegant, and gender-neutral with flowing, graceful silhouettes. The color palette consists of dreamy pastels: soft peach, lavender, warm turquoise, and champagne gold. The background is a clean, textured paper-white, giving it a high-end editorial journal aesthetic."
  },
  {
    id: "narrative-vector",
    name: "Narrative Vector",
    color: "#b2e0e8",
    description: "A high-end conceptual Narrative Vector illustration for a psychological infographic. Style: Soft digital painting style, volumetric lighting, high-contrast emotional storytelling, 8k resolution, professional editorial design. The color palette consists of dreamy pastels: soft aqua, light grey, warm turquoise, and sea green. The background is a clean, textured paper-white, giving it a high-end editorial journal aesthetic."
  },
  {
    id: "medical-science",
    name: "Medical Science",
    color: "#0a1628",
    description: "A high-end medical-science infographic illustration. Photorealistic 3D medical visualization combined with clean technical line art. High-end 3D medical visualization and photorealistic neuro-imaging. Professional scientific journal aesthetic with fMRI heat-mapping and bioluminescent neural firing. 8k resolution, clinical precision, and sharp macro-photography."
  },
  {
    id: "retro-y2k",
    name: "Retro Y2K",
    color: "#ff6ec7",
    description: "90s/Y2K video game retro style infographic. Pixel art icons, neon bubblegum colors, chunky rounded typography, vibrant saturated palette with hot pink, electric blue, and lime green. Nostalgic digital aesthetic with scanline textures and retro UI elements."
  },
  {
    id: "chalkboard",
    name: "Chalkboard",
    color: "#2d4a3e",
    description: "Hand-drawn chalkboard style infographic. Dusty green background with white chalk outlines and hand-lettered text. Authentic educational feel with imperfect strokes, chalk texture, and organic hand-drawn icons. Warm and approachable classroom aesthetic."
  },
  {
    id: "whiteboard",
    name: "Whiteboard",
    color: "#f8f8f8",
    description: "Clean whiteboard sketch style infographic. Thick dry-erase marker strokes on a glossy white surface with colorful highlights in blue, red, and green marker. Hand-drawn arrows, circled keywords, and casual business doodles. Professional brainstorming aesthetic."
  },
  {
    id: "sketchnote",
    name: "Sketchnote",
    color: "#fffde7",
    description: "Casual sketchnote style infographic. Messy hand-drawn arrows, circled keywords, casual doodles, and mixed typography on cream paper. Authentic note-taking aesthetic with ink pen strokes, small illustrations, and organic layout flow."
  },
  {
    id: "neumorphism-3d",
    name: "3D Neumorphism",
    color: "#e0e5ec",
    description: "Tactile 3D Neumorphism style infographic. Soft extruded shadows, glossy inflated shapes on subtle light grey backgrounds. Modern UI aesthetic with depth illusion, smooth gradients, and clean sans-serif typography. Elevated minimal design."
  },
  {
    id: "kawaii-doodle",
    name: "Kawaii Doodle",
    color: "#fce4ec",
    description: "Kawaii Doodle style infographic. Cute playful characters with soft pastels and whimsical elements. Round friendly shapes, big expressive eyes on illustrated characters, bubblegum pink and mint green palette. Charming and approachable Japanese-inspired aesthetic."
  },
  {
    id: "sumi-e",
    name: "Sumi-e Ink",
    color: "#f5f0e8",
    description: "Sumi-e ink wash style infographic. Black ink nodes on aged paper with red stamp highlights and vertical scroll flow. Traditional Japanese brush painting aesthetic with expressive ink strokes, negative space, and cultural authenticity."
  },
  {
    id: "watercolor",
    name: "Watercolor",
    color: "#e3f2fd",
    description: "Soft watercolor style infographic. Gentle color washes with fluid edges, blended dreamy gradients, and thematic framework presentation. Organic and artistic aesthetic with translucent layered colors, paper texture, and hand-painted feel."
  },
  {
    id: "collage-chaos",
    name: "Collage Chaos",
    color: "#ff3d00",
    description: "Maximalist collage chaos style infographic. Overlapping cutouts, vibrant color clashes, textured scraps like a digital scrapbook. High-energy layered composition with bold typography, mixed media textures, and explosive visual storytelling."
  },
  {
    id: "frutiger-aero",
    name: "Frutiger Aero",
    color: "#64b5f6",
    description: "Frutiger Aero revival style infographic. Glossy gradients, bubbly rounded icons, sky-blue utopian vibes. Early 2000s optimistic tech aesthetic with lens flares, transparent glass elements, lush nature motifs, and clean sans-serif typography."
  },
  {
    id: "micro-industrial",
    name: "Micro Industrial",
    color: "#212121",
    description: "Micro-industrial style infographic. Barcode motifs, stark mechanical icons, utilitarian grids with raw edges. Dark industrial aesthetic with technical line weights, monochrome palette with single accent color, engineering diagram precision."
  },
  {
    id: "watercolor-surreal",
    name: "Watercolor Surreal",
    color: "#ce93d8",
    description: "Watercolor surreal style infographic. Blended dreamy washes, absurd floating elements, soft gradients with impossible visual combinations. Dreamlike and imaginative aesthetic with soft color transitions, ethereal atmosphere, and poetic visual metaphors."
  }
];
```

### App State

Maintain the following state variables:

```javascript
let selectedStyle = null;       // style object from STYLES array
let selectedResolution = "1K";  // default
let selectedRatio = "1:1";      // default
let selectedFormat = "png";     // default
let currentTaskId = null;       // taskId from kie.ai
let pollingInterval = null;     // setInterval reference
let currentImageUrl = null;     // final image URL for download
```

### Style Card Grid

On page load, inject style cards into `#style-grid`. Each card:

```html
<div class="style-card" data-style-id="<id>">
  <div class="style-card-swatch" style="background-color: <color>"></div>
  <span class="style-card-name"><name></span>
</div>
```

On card click: remove `selected` class from all cards, add `selected` class to clicked card, set `selectedStyle` to the matching style object.

### Toggle Button Groups

For resolution, ratio, and format toggles: on click, remove `active` class from siblings, add `active` to clicked button, update the corresponding state variable.

### Refine Prompt Button (`#btn-refine`)

**Validation:** Alert if `#topic-input` is empty or `selectedStyle` is null.

**On click:**
1. Set button text to "Refining..." and disable it
2. Show `#refine-status` with text "Calling OpenRouter..."
3. POST to `/refine-prompt` with `{ topic, style: selectedStyle.description }`
4. On success: populate `#refined-prompt` textarea with returned prompt, show `#prompt-output-container`, enable `#btn-generate`
5. On error: show error message in `#refine-status`
6. Restore button state regardless of outcome

### Copy Prompt Button (`#btn-copy-prompt`)

Copy the value of `#refined-prompt` to clipboard using `navigator.clipboard.writeText()`. Show `#copy-confirm` for 2 seconds then hide it.

### Textarea Auto-Expand

Apply to both `#topic-input` and `#refined-prompt`. On `input` event, set `element.style.height = 'auto'` then `element.style.height = element.scrollHeight + 'px'`.

### Generate Image Button (`#btn-generate`)

**Validation:** Alert if `#refined-prompt` is empty.

**On click:**
1. Set button text to "Generating..." and disable it
2. Show `#generate-status` and `#progress-bar-container`
3. Hide `#section-result`
4. POST to `/generate-image` with `{ prompt, resolution: selectedResolution, aspectRatio: selectedRatio, outputFormat: selectedFormat }`
5. Store returned `taskId` in `currentTaskId`
6. Start polling (see Polling Logic below)

### Polling Logic

```javascript
const STATUS_MESSAGES = [
  "Task created, waiting for Nano Banana...",
  "Processing your infographic...",
  "Almost there...",
  "Still working, hang tight...",
  "Finalising your image..."
];

// Rotate status messages every 5 seconds
// Poll /task-status/:taskId every 4 seconds
// On success: call handleSuccess(imageUrl)
// On fail: call handleError(failMsg)
// Max timeout: 3 minutes (clear interval and show timeout error)
```

Set a `setTimeout` for 180000ms (3 minutes) to clear the interval and show a timeout message if no response.

### handleSuccess(imageUrl)

1. Clear polling interval and timeout
2. Set `currentImageUrl = imageUrl`
3. Set `#generated-image` src to imageUrl
4. Show `#section-result` with a fade-in CSS class
5. Hide `#progress-bar-container` and `#generate-status`
6. Restore Generate button

### handleError(message)

1. Clear polling interval and timeout
2. Show error message in `#generate-status`
3. Restore Generate button

### Download Button (`#btn-download`)

**Generate filename:** 
```javascript
const now = new Date();
const datePart = now.toISOString().slice(0,10).replace(/-/g, '');
const timePart = now.toTimeString().slice(0,5).replace(':','');
const stylePart = selectedStyle.id;
const ratioPart = selectedRatio.replace(':','x');
const filename = `${datePart}_${timePart}_${stylePart}_${ratioPart}.${selectedFormat}`;
```

Call `/download?url=${encodeURIComponent(currentImageUrl)}&filename=${filename}` via a temporary anchor element with the `download` attribute to trigger the file save dialog.

---

## 6. Front-End: style.css

### Design Tokens

```css
:root {
  --bg-page: #0f0f13;
  --bg-card: #1a1a24;
  --border-default: #2a2a38;
  --border-selected: #7c5cfc;
  --color-primary: #7c5cfc;
  --color-primary-hover: #6a4de0;
  --color-accent: #a78bfa;
  --color-text: #e2e2f0;
  --color-muted: #8888aa;
  --color-success: #4ade80;
  --color-error: #f87171;
  --radius: 12px;
  --radius-sm: 8px;
  --transition: 0.2s ease;
  --max-width: 900px;
}
```

### Global

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg-page);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
  padding: 40px 20px;
}
```

Load Inter and JetBrains Mono from Google Fonts in index.html.

### Layout

```css
header { text-align: center; margin-bottom: 48px; }
header h1 { font-size: 28px; font-weight: 700; color: var(--color-text); }
header .subtitle { color: var(--color-muted); font-size: 13px; margin-top: 4px; }

main { max-width: var(--max-width); margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }

section { display: flex; flex-direction: column; gap: 16px; }
section h2 { font-size: 16px; font-weight: 600; color: var(--color-text); }
label { font-size: 13px; color: var(--color-muted); font-weight: 500; display: block; margin-bottom: 6px; }
```

### Textareas

```css
textarea {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  padding: 14px 16px;
  resize: none;
  overflow: hidden;
  min-height: 80px;
  transition: border-color var(--transition);
}
textarea:focus { outline: none; border-color: var(--color-primary); }

#refined-prompt {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: #1f1f2e;
  min-height: 160px;
}
```

### Style Card Grid

```css
.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.style-card {
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius);
  cursor: pointer;
  overflow: hidden;
  transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
}
.style-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(124, 92, 252, 0.15);
}
.style-card.selected {
  border-color: var(--border-selected);
  box-shadow: 0 0 0 1px var(--border-selected), 0 8px 24px rgba(124, 92, 252, 0.25);
  position: relative;
}
.style-card.selected::after {
  content: "✓";
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--color-primary);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.style-card-swatch {
  width: 100%;
  height: 80px;
}
.style-card-name {
  display: block;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Settings Row

```css
.settings-row {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.setting-group { display: flex; flex-direction: column; gap: 8px; }
.toggle-group { display: flex; gap: 6px; }
.toggle-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all var(--transition);
}
.toggle-btn:hover { border-color: var(--color-accent); color: var(--color-text); }
.toggle-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
```

### Buttons

```css
.btn-primary {
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 28px;
  transition: background var(--transition), box-shadow var(--transition), opacity var(--transition);
  align-self: flex-start;
}
.btn-primary:hover { background: var(--color-primary-hover); box-shadow: 0 0 20px rgba(124, 92, 252, 0.4); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all var(--transition);
  align-self: flex-start;
}
.btn-secondary:hover { border-color: var(--color-accent); color: var(--color-text); }
```

### Status + Progress

```css
.status-message { font-size: 13px; color: var(--color-muted); padding: 10px 0; }
.status-message.error { color: var(--color-error); }
.status-message.success { color: var(--color-success); }

#progress-bar-container {
  width: 100%;
  height: 4px;
  background: var(--bg-card);
  border-radius: 2px;
  overflow: hidden;
}
#progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 2px;
  animation: progress-pulse 2s ease-in-out infinite;
  width: 60%;
}
@keyframes progress-pulse {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(200%); }
}

.copy-confirm { font-size: 12px; color: var(--color-success); margin-left: 12px; }
```

### Result Section

```css
#section-result { opacity: 0; transition: opacity 0.5s ease; }
#section-result.visible { opacity: 1; }

#image-container {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius);
  overflow: hidden;
  width: 100%;
}
#generated-image { width: 100%; height: auto; display: block; }
```

### Utility

```css
.hidden { display: none !important; }

@media (max-width: 600px) {
  .style-grid { grid-template-columns: repeat(2, 1fr); }
  .settings-row { flex-direction: column; gap: 20px; }
}
```

---

## 7. API Reference Summary

### OpenRouter

- **Endpoint:** `POST https://openrouter.ai/api/v1/chat/completions`
- **Auth:** `Authorization: Bearer <OPENROUTER_API_KEY>`
- **Key fields:** `model`, `messages` array with `system` and `user` roles

### kie.ai Nano Banana Pro

**Create Task:**
- **Endpoint:** `POST https://api.kie.ai/api/v1/jobs/createTask`
- **Auth:** `Authorization: Bearer <KIE_API_KEY>`
- **Required body fields:** `model: "nano-banana-pro"`, `input.prompt`, `input.aspect_ratio`, `input.resolution`, `input.output_format`
- **Valid resolutions:** `1K`, `2K`, `4K`
- **Valid aspect ratios:** `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `auto`
- **Valid output formats:** `png`, `jpg`
- **Response:** `{ code: 200, data: { taskId: string } }`

**Query Task:**
- **Endpoint:** `GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=<taskId>`
- **Auth:** `Authorization: Bearer <KIE_API_KEY>`
- **Response states:** `waiting`, `success`, `fail`
- **On success:** parse `data.resultJson` (JSON string) to get `resultUrls[0]`

---

## 8. Reference Prompt Examples (for LLM System Context)

Include these as examples in the OpenRouter system prompt or as few-shot examples to guide quality output:

**Example 1 (Lofi Chic style):**
> A beautiful, high-detail illustrative infographic titled "The Waterfall Metaphor." Art Style: The artwork is rendered in a modern digital watercolor and soft-vector "Lofi-Chic" style. It features a hand-painted feel with gentle textures, organic edges, and a warm, inviting atmosphere. The human figures are stylized, elegant, and gender-neutral with flowing, graceful silhouettes. The color palette consists of dreamy pastels: soft peach, lavender, warm turquoise, and champagne gold. The background is a clean, textured paper-white, giving it a high-end editorial journal aesthetic. Stage 1: The Entry. A graceful, translucent figure stands in a warm, sparkling pool of water with soft ripples. Stage 2: The Mirror Image. The figure stands before a soft, shimmering curtain of water. Inside the waterfall, a "Radiant Self" is visible, glowing with a soft golden inner light. Stage 3: The Integration. The figure and the reflection touch palms through the water. A gentle glow-transfer occurs; the figure's cool blue tones are replaced by warm, vibrant hues as the water cleanses the silhouette. Stage 4: The Full Body Merge. The figure steps forward into a sun-drenched space, looking vibrant and peaceful, emerging onto soft, golden sand. Bottom Section: A Transformation Snapshot table with elegant, thin-line icons and modern, friendly serif typography.

**Example 2 (Narrative Vector style):**
> A horizontal digital illustration titled "The Bridge to Growth: A Metaphor for Psychological Transformation" in a clean, modern infographic style. The composition features a central ornate bridge constructed of interwoven golden branches and dark, thorny vines spanning across a calm body of water. Left Side (The Current Side): A desaturated, monochromatic landscape of jagged rocks, leafless dead trees, and thorny thickets under a gloomy, overcast sky. A lonely male figure in a dark hoodie stands looking down at the ground. Floating circular icons above him contain dark, abstract silhouettes of struggle. Center (The Mid-Bridge): The bridge transitions from dark, sharp thorns on the left to glowing, smooth golden wood in the middle. At the apex of the bridge, a circular golden emblem with a sound-wave icon is present. Right Side (The Opposite Side): A vibrant, high-saturation landscape with lush green trees, colorful blooming flowers, and a bright yellow sun low on the horizon. A confident female figure stands tall, facing forward into the light. Technical Details: Sharp vector-like outlines, smooth color gradients, volumetric sun rays on the right, and atmospheric fog on the left. High-resolution digital art with a flat yet depth-aware perspective.

---

## 9. README.md Content

Include the following in `README.md`:

```markdown
# AI Infographic Designer (Internal Tool)

## Setup

1. Clone or copy this project folder
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run `npm start`
5. Open http://localhost:3000 in your browser

## API Keys Required

- `OPENROUTER_API_KEY` from https://openrouter.ai
- `OPENROUTER_MODEL` recommended: `anthropic/claude-3.5-sonnet`
- `KIE_API_KEY` from https://kie.ai/api-key

## Usage

1. Describe your infographic topic in the text field
2. Select an art style from the grid
3. Choose resolution and aspect ratio
4. Click "Refine Prompt" and wait for the LLM to generate an optimised prompt
5. Review and edit the prompt as needed
6. Click "Copy Prompt" to save it for your records
7. Click "Generate Image" to send to Nano Banana Pro
8. Download the result when it appears

## Notes

- Image generation typically takes 30 to 90 seconds
- Higher resolutions (4K) take longer to generate
- The refined prompt textarea is fully editable before generation
- Downloaded files are named automatically with date, time, style, and aspect ratio
```

---

## 10. Build Notes for Claude Code

- Do not add authentication or user management of any kind
- Do not add a database or persistent storage
- Keep the front-end as plain HTML/CSS/JS with no frameworks or bundlers
- All API keys must stay server-side in `.env` only
- The `.env` file must be in `.gitignore`
- Node 18 or higher is assumed (native fetch available)
- The polling interval must be cleared on both success and failure to prevent memory leaks
- The download route must stream the image from the CDN URL, not redirect to it
- Textareas must auto-expand on content input using the scrollHeight technique
- The Generate button must remain disabled until a refined prompt exists in the textarea

---

## 11. Feature Backlog

Items approved for future development, in no particular priority order.

### Generation & Workflow
- [ ] **Prompt iteration** — after a result is generated, surface "Regenerate with variation" and "Refine this further" buttons on each history card so users can iterate without starting from scratch
- [ ] **Direct prompt mode** — a "Skip refinement / use raw prompt" toggle for power users who want to paste their own prompt directly into the generator without going through the OpenRouter refinement step

### History & Persistence
- [ ] **Persistent history** — migrate task history from `localStorage` to a lightweight server-side store (SQLite via `better-sqlite3` or a flat JSON file) so history survives browser clears and tab resets
- [ ] **Prompt history** — store the original topic, selected style(s), density, aspect ratio, and settings alongside each generated image so users can revisit, tweak, and regenerate from any past entry

### Mockups Tab
- [ ] **Batch generate all 7 mockup types** — a single "Generate All" button that refines and queues all 7 mockup templates simultaneously from one content description

### Security & Infrastructure
- [ ] **Rate limiting** — add per-IP rate limits on `/generate-image` and `/refine-prompt` routes (e.g. via `express-rate-limit`) to prevent unintended API credit drain
