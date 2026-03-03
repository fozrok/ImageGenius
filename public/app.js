/* ─────────────────────────────────────────────
   Art Style Data — Theme × Treatment System
   Pick one Theme + one Treatment; combined description
   sent as a single style to the image generator.
───────────────────────────────────────────── */

const THEMES = [
    {
        id: "isometric",
        name: "Isometric",
        color: "#546e7a",
        description: "Clean isometric projection style. Precise 30-degree isometric grid, geometric forms, and systematic spatial organisation. Structures, objects, and diagrams rendered in isometric perspective with cool blue-grey palette, crisp ruled lines, and clear annotation labels."
    },
    {
        id: "flat-design",
        name: "Flat Design",
        color: "#1a3a5c",
        description: "Polished flat design aesthetic. Restrained modern palette — deep navy, slate grey, and a single accent colour. Sharp geometric section dividers, authoritative sans-serif typography, clean data visualisations, and confident whitespace. Professional, credible, board-room quality."
    },
    {
        id: "comic-book",
        name: "Comic Book",
        color: "#f4511e",
        description: "Bold dynamic comic book visual style. Expressive linework, dramatic panel compositions, halftone dot textures, vibrant flat colour fills, and kinetic energy. Speed lines, bold black outlines, action-packed narrative momentum in contemporary superhero comics aesthetic."
    },
    {
        id: "cinematic",
        name: "Cinematic / Epic",
        color: "#b71c1c",
        description: "Dramatic Hollywood cinematic epic style. High-contrast dramatic lighting, deep blacks, vivid colour grading, atmospheric depth, heroic scale composition, and blockbuster visual storytelling. Rich palette of deep crimson, burnished gold, and midnight blue."
    },
    {
        id: "fantasy",
        name: "Fantasy / Sci-Fi",
        color: "#7e57c2",
        description: "Vibrant high fantasy or science fiction illustration style. Lush richly detailed environments, jewel-tone colours of sapphire, emerald, and amethyst, magical or technological atmospheric effects, ornate illustrated borders, and epic compositional scale."
    },
    {
        id: "retro",
        name: "Retro / Vintage",
        color: "#ff6ec7",
        description: "Nostalgic retro or vintage aesthetic. Warm, time-worn colour palettes, period-accurate typography, aged textures, and the distinctive visual grammar of past eras — from 1950s Americana to 1990s digital nostalgia and Y2K bubblegum."
    },
    {
        id: "neon-synthwave",
        name: "Neon / Synthwave",
        color: "#e040fb",
        description: "Neon-drenched synthwave atmosphere. Deep near-black backgrounds, glowing neon tube lighting in electric magenta, cyan, and lime, chromatic grid planes, moody retro-futuristic aesthetic, and the perfectly calibrated nostalgia of a future that never was."
    },
    {
        id: "kawaii",
        name: "Kawaii / Cute",
        color: "#fce4ec",
        description: "Kawaii cute illustration style. Soft pastels, round friendly shapes, big expressive eyes on illustrated characters, bubblegum pink and mint green palette, whimsical playful elements, and warm Japanese-inspired approachability."
    },
    {
        id: "medical-scientific",
        name: "Medical / Scientific",
        color: "#e8f5e9",
        description: "Precise medical or scientific illustration style. Clinical labelling, clean off-white backgrounds, technical linework, anatomical colour conventions, fMRI-style visualisations, systematic annotation callouts, and the authoritative precision of peer-reviewed publication artwork."
    },
    {
        id: "urban-street",
        name: "Street / Urban",
        color: "#e53935",
        description: "Bold urban street art aesthetic. Dynamic wildstyle lettering, spray-paint texture overlays, raw kinetic energy, expressive character illustration, and authentic street culture palette — electric red, acid yellow, chrome silver on concrete or brick surface."
    },
    {
        id: "minimal-line",
        name: "Minimal / Line",
        color: "#f9f9f9",
        description: "Stripped-back minimal or line illustration style. Clean uncluttered composition, deliberate linework, generous negative space, and a restrained monochrome or two-tone palette. Elegant simplicity — every element earns its place."
    },
    {
        id: "game-cover",
        name: "Game Cover",
        color: "#1565c0",
        description: "Explosively dynamic computer game cover art style. High-octane action composition with extreme dramatic perspective, metallic embossed typography in electric tones, cinematic lens flare and god-ray lighting effects, highly detailed hero character or environment artwork, deep navy-to-electric gradient backgrounds, thunderous atmospheric shadows, and the premium collector\'s-edition energy of iconic AAA game box art. Maximum impact, zero restraint."
    },
    {
        id: "youtube-thumbnail",
        name: "YouTube Thumbnail",
        color: "#ff0000",
        description: "Ultra-clickable 16:9 YouTube thumbnail style illustration (1920×1080). Clean vector-cartoon look with thick smooth outlines, semi-flat cel shading with soft gradients, bright saturated colours, high contrast, crisp edges, strong glow and deep drop shadows, sticker-cutout typography, subtle lens flares and sparkles, polished commercial thumbnail aesthetic readable at small size. Maximum scroll-stopping visual punch."
    }
];

const TREATMENTS = [
    {
        id: "vector",
        name: "Vector",
        color: "#0288d1",
        description: "Rendered as clean crisp vector illustration — smooth digital linework, flat precise colour fills, and sharp scalable edges with no texture or grain."
    },
    {
        id: "3d-rendered",
        name: "3D Rendered",
        color: "#7ecba1",
        description: "Rendered with full 3D digital CGI — dimensional shapes, volumetric lighting, ambient occlusion shadows, soft depth of field, and photorealistic surface materials."
    },
    {
        id: "hand-drawn",
        name: "Hand Drawn",
        color: "#fffde7",
        description: "Rendered with organic hand-drawn marks — imperfect natural linework, visible pencil or marker strokes, gestural energy, and the warmth of analogue illustration."
    },
    {
        id: "watercolour",
        name: "Watercolour",
        color: "#e3f2fd",
        description: "Rendered in soft watercolour washes — fluid wet-on-wet bleeds, translucent layered colour, paper grain texture, and the dreamy organic edges of painterly illustration."
    },
    {
        id: "ink-linework",
        name: "Ink / Linework",
        color: "#f5f0e8",
        description: "Rendered with expressive ink or fine linework — decisive pen strokes, cross-hatching for tone, Sumi-e brush energy, and the authoritative precision of ink on paper."
    },
    {
        id: "pixel-art",
        name: "Pixel Art",
        color: "#00897b",
        description: "Rendered in classic pixel art — individual hand-placed pixels in a 16–32 colour palette, chunky sprite-like forms, dithered shading, and crisp retro 8-bit to 16-bit game aesthetic. No anti-aliasing anywhere."
    },
    {
        id: "poly-art",
        name: "Poly Art",
        color: "#1e88e5",
        description: "Rendered as low-polygon geometric poly art — triangulated mesh surfaces, flat-shaded polygon faces with bold colour variation between adjacent triangles, and angular crystalline fragmentation."
    },
    {
        id: "paper-cut",
        name: "Paper Cut",
        color: "#ef9a9a",
        description: "Rendered as layered paper cut craft — precisely cut shapes with subtle drop shadows between layers, beautiful dimensional depth, and richly coloured craft paper tones with visible texture."
    },
    {
        id: "pastel-chalk",
        name: "Pastel / Chalk",
        color: "#f8bbd0",
        description: "Rendered with soft pastel or chalk medium — chalky blended texture on toned paper, visible paper grain, layered colour blending with soft stumped edges, and the cultivated softness of fine-art pastel."
    },
    {
        id: "chalkboard",
        name: "Chalkboard",
        color: "#2d4a3e",
        description: "Rendered on a chalkboard surface — dusty green background with white chalk outline marks, authentic chalk texture with imperfect strokes, and the warm hand-lettered educational classroom aesthetic."
    },
    {
        id: "lego-bricks",
        name: "Lego Bricks",
        color: "#ffb300",
        description: "Rendered in Lego brick construction toy aesthetic — blocky studded brick forms in bright primary toy colours, visible Lego stud grid, modular building-block assembly logic, and the instantly recognisable plastic toy aesthetic."
    },
    {
        id: "miniature",
        name: "Miniature Diorama",
        color: "#aed581",
        description: "Rendered as a tilt-shift miniature diorama — tiny detailed scenes with soft ambient occlusion, bright cheerful pastel colours, the playful scale illusion of objects made to look miniature, and modular building-block elements."
    },
    {
        id: "airbrush",
        name: "Airbrush",
        color: "#d81b60",
        description: "Rendered with professional airbrush technique — seamless gradient colour transitions, metallic highlights, vibrant saturated spray-blended hues, photorealistic blending on hard-edged forms, and high-gloss 1970s–80s commercial airbrush finish."
    },
    {
        id: "cel-shading",
        name: "Cel Shading",
        color: "#ff6f00",
        description: "Rendered with semi-flat cel shading — thick smooth outlines, discrete toon-shaded colour bands with soft gradient transitions, high contrast, crisp edges, strong glow effects, and deep drop shadows in the style of modern animated productions."
    },
    {
        id: "sketchnote",
        name: "Sketchnote",
        color: "#fffde7",
        description: "Rendered in sketchnote visual note-taking style — casual hand-drawn arrows, circled keywords, mixed typography, small illustrative doodles, ink pen strokes on cream paper, and organic layout flow."
    }
];

// Compatibility shim: rest of codebase reads getSelectedStyles()[0]
// We expose a computed array from the Theme + Treatment selection
let selectedTheme = null;
let selectedTreatment = null;

function getSelectedStyle() {
    if (!selectedTheme) return null;
    const desc = selectedTreatment
        ? selectedTheme.description + " " + selectedTreatment.description
        : selectedTheme.description;
    const name = selectedTreatment
        ? selectedTheme.name + " — " + selectedTreatment.name
        : selectedTheme.name;
    const id = selectedTreatment
        ? selectedTheme.id + "--" + selectedTreatment.id
        : selectedTheme.id;
    return { id, name, color: selectedTheme.color, description: desc };
}


/* ─────────────────────────────────────────────
   Polling Status Messages
───────────────────────────────────────────── */
const STATUS_MESSAGES = [
    "Task created, waiting for Nano Banana...",
    "Processing your infographic...",
    "Almost there...",
    "Still working, hang tight...",
    "Finalising your image..."
];

/* ─────────────────────────────────────────────
   UI State (non-queue)
───────────────────────────────────────────── */
// selectedStyles is now computed from selectedTheme + selectedTreatment
// Use getSelectedStyles() everywhere instead of the old array
function getSelectedStyles() {
    const s = getSelectedStyle();
    return s ? [s] : [];
}
let selectedResolution = "1K";
let selectedRatio = "1:1";
let selectedFormat = "png";
let selectedDensity = "Concise";


/* ─────────────────────────────────────────────
   Density Directives
   Appended to every refined prompt before submission.
───────────────────────────────────────────── */
const DENSITY_DIRECTIVES = {
    Minimal: `\n\nDensity directive: MINIMAL — extremely sparse. Only the single most essential concept. Generous negative space. Maximum 3 labelled elements. Clean and uncluttered.`,
    Concise: `\n\nDensity directive: CONCISE — balanced content. 4–7 clearly labelled data points with visible hierarchy and comfortable whitespace.`,
    Detailed: `\n\nDensity directive: DETAILED — information-dense. 8+ data points, rich annotations, multiple callouts, layered visual elements, comprehensive coverage of all sub-topics.`
};

function applyDensity(prompt) {
    return prompt + (DENSITY_DIRECTIVES[selectedDensity] || '');
}

/* ─────────────────────────────────────────────
   Brand Colour Presets
───────────────────────────────────────────── */
const BRAND_PRESETS = [
    {
        name: 'Self Hypno',
        swatches: ['#0B1F3B', '#2E5E8C', '#18A7A7'],
        text:
            `Primary: Deep Navy #0B1F3B
Secondary: Steel Blue #2E5E8C
Accent: Teal #18A7A7
CTA/Button: Teal #18A7A7 (hover: #128C8C)
Background: Off-White #F6F8FB
Neutrals: Charcoal #1F2933, Grey #8A98A8`
    },
    {
        name: 'OSP',
        swatches: ['#03050B', '#924C79', '#86B5C0'],
        text:
            `Dark backgrounds
Near-black: #03050B
Deep navy: #131927
Charcoal blue: #1B2734

Neutrals
Slate: #545066
Cool grey: #949EA6

Accent colours
Magenta/plum: #924C79
Indigo/purple: #555295
Teal/cyan: #86B5C0 (also a deeper teal #628F9F)`
    },
    {
        name: 'Champagne Premium',
        swatches: ['#0B0B0F', '#D6B46A', '#F4F1EA'],
        text:
            `Primary: Black #0B0B0F
Secondary: Champagne Gold #D6B46A
Accent: Ivory #F4F1EA
CTA/Button: Gold #D6B46A (hover: #C3A158)
Background: Soft Ivory #FAF7F0
Neutrals: Graphite #2A2A32, Warm Grey #9B9489`
    },
    {
        name: 'Feminine Confidence',
        swatches: ['#2A1437', '#B87C8A', '#7FE7C4'],
        text:
            `Primary: Deep Plum #2A1437
Secondary: Dusty Rose #B87C8A
Accent: Mint #7FE7C4
CTA/Button: Mint #7FE7C4 (hover: #66D6B0)
Background: Soft Blush #FFF7F8
Neutrals: Cocoa #3A2A2E, Mist #D8D1D4`
    },
    {
        name: 'AI Summit',
        swatches: ['#050505', '#9D50BB', '#6391FF'],
        text:
            `Background: Deep Onyx #050505
Brand Colour 1: Amethyst Purple #9D50BB
Brand Colour 2: Electric Lavender #A259FF
Brand Colour 3: Cornflower Blue #6391FF
CTA/Button: Vivid Magenta Gradient #9D50BB to #D8327B
Highlight: Periwinkle Violet Gradient #6391FF to #A259FF`
    },
];


function applyBrandColors(prompt) {
    const el = document.getElementById('brand-colors-input');
    const colours = el ? el.value.trim() : '';
    if (!colours) return prompt;
    // Don't double-append if the directive is already in the prompt (baked in at refine time)
    if (prompt.includes('Brand colour directive:')) return prompt;
    return prompt +
        `\n\nBrand colour directive: Use ONLY the following brand colours throughout the entire infographic. Do not introduce any colours that are not listed here. Replicate this palette faithfully:\n${colours}`;
}

/* ─────────────────────────────────────────────
   Model Toggle (shared across all tabs)
   State persisted to localStorage so the
   chosen model survives page reloads.
───────────────────────────────────────────── */
const MODEL_V2 = 'nano-banana-2';
const MODEL_V1 = 'nano-banana-pro';

function getSelectedModel() {
    return localStorage.getItem('kieModel') || MODEL_V2;
}

function setSelectedModel(model) {
    localStorage.setItem('kieModel', model);
}

function updateModelToggles(model) {
    const isV1 = model === MODEL_V1;
    document.querySelectorAll('.model-toggle').forEach(btn => {
        btn.textContent = `⚡ ${model}`;
        btn.classList.toggle('model-v1', isV1);
    });
    // Also sync in thumbnail-tab if it exposes a setter
    if (typeof window.onModelChanged === 'function') window.onModelChanged(model);
}

function initModelToggles() {
    // Restore persisted model on load
    updateModelToggles(getSelectedModel());

    document.addEventListener('click', e => {
        if (!e.target.matches('.model-toggle')) return;
        const current = getSelectedModel();
        const next = current === MODEL_V2 ? MODEL_V1 : MODEL_V2;
        setSelectedModel(next);
        updateModelToggles(next);
    });
}

// Initialise after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initModelToggles();

    // Populate the Visual Strategy LLM badge from server config
    const llmBadge = document.getElementById('strategy-llm-badge');
    if (llmBadge) {
        fetch('/api/config')
            .then(r => r.json())
            .then(cfg => {
                const full = cfg.visualStrategyModel || cfg.llmModel || 'gemini-3.1-pro-preview';
                const name = full.split('/').pop();
                llmBadge.textContent = `🤖 ${name}`;
                llmBadge.title = `Visual Strategy LLM: ${full}`;
            })
            .catch(() => { llmBadge.textContent = '🤖 LLM'; });

    }
});


/* ─────────────────────────────────────────────
   Task Queue State
───────────────────────────────────────────── */
// All tasks: active (submitting/polling) + completed (success/fail)
// Newest first. History is last 10 completed.
const tasks = [];
const MAX_HISTORY = 10;

/* ─────────────────────────────────────────────
   DOM References
───────────────────────────────────────────── */
const topicInput = document.getElementById('topic-input');
const styleGrid = document.getElementById('style-grid');
const btnRefine = document.getElementById('btn-refine');
const refineStatus = document.getElementById('refine-status');
const promptOutputContainer = document.getElementById('prompt-output-container');
const refinedPrompt = document.getElementById('refined-prompt');
const btnCopyPrompt = document.getElementById('btn-copy-prompt');
const btnExpandPrompt = document.getElementById('btn-expand-prompt');
const copyConfirm = document.getElementById('copy-confirm');
const btnGenerate = document.getElementById('btn-generate');
const btnQuickGen = document.getElementById('btn-quick-gen');
const btnDirectPrompt = document.getElementById('btn-direct-prompt');
const quickGenStatus = document.getElementById('quick-gen-status');
const costEstimateEl = document.getElementById('cost-estimate');
const sectionQueue = document.getElementById('section-queue');
const queueList = document.getElementById('queue-list');
const sectionHistory = document.getElementById('section-history');
const historyGrid = document.getElementById('history-grid');

/* ─────────────────────────────────────────────
   Task Helpers
───────────────────────────────────────────── */
function getActiveTasks() {
    return tasks.filter(t => t.status === 'submitting' || t.status === 'polling');
}

function getHistoryTasks() {
    return tasks
        .filter(t => t.status === 'success' || t.status === 'fail')
        .slice(0, MAX_HISTORY);
}

function truncate(str, len = 90) {
    return str.length > len ? str.slice(0, len) + '…' : str;
}

/* ─────────────────────────────────────────────
   Download Helper (per task)
───────────────────────────────────────────── */
function downloadTask(task) {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = now.toTimeString().slice(0, 5).replace(':', '');
    const stylePart = task.style ? task.style.id : 'unknown';
    const ratioPart = task.ratio.replace(':', 'x');
    const filename = `${datePart}_${timePart}_${stylePart}_${ratioPart}.${task.format}`;

    const anchor = document.createElement('a');
    anchor.href = `/download?url=${encodeURIComponent(task.imageUrl)}&filename=${encodeURIComponent(filename)}`;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

/* ─────────────────────────────────────────────
   Render — Queue (active tasks)
───────────────────────────────────────────── */
function renderQueue() {
    const active = getActiveTasks();

    if (active.length === 0) {
        sectionQueue.classList.add('hidden');
        return;
    }

    sectionQueue.classList.remove('hidden');

    queueList.innerHTML = active.map(task => {
        const badgeLabel = task.status === 'submitting' ? '⏳ Submitting' : '⚙ Processing';
        return `
      <div class="task-card" id="task-card-${task.id}">
        <div class="task-progress">
          <div class="task-progress-bar"></div>
        </div>
        <div class="task-card-header">
          <span class="task-badge task-badge--${task.status}">${badgeLabel}</span>
          <span class="task-card-meta">${task.style ? task.style.name : '—'} · ${task.resolution} · ${task.ratio} · ${task.format.toUpperCase()}</span>
        </div>
        <p class="task-card-prompt">${truncate(task.prompt)}</p>
        <p class="task-card-msg" id="task-msg-${task.id}">${task.statusMsg}</p>
      </div>
    `;
    }).join('');
}

/* ─────────────────────────────────────────────
   Render — History (last 10 completed)
───────────────────────────────────────────── */
function renderHistory() {
    const history = getHistoryTasks();

    if (history.length === 0) {
        sectionHistory.classList.add('hidden');
        return;
    }

    sectionHistory.classList.remove('hidden');

    historyGrid.innerHTML = history.map(task => {
        if (task.status === 'success') {
            return `
        <div class="history-card">
          <img class="history-thumb" src="${task.imageUrl}" alt="Generated infographic" loading="lazy"
               style="cursor:zoom-in;"
               data-image-url="${task.imageUrl}"
               data-filename="${(() => { const d = new Date(); const dp = d.toISOString().slice(0, 10).replace(/-/g, ''); const tp = d.toTimeString().slice(0, 5).replace(':', ''); const sp = task.style ? task.style.id : 'unknown'; return `${dp}_${tp}_${sp}_${task.ratio.replace(':', 'x')}.${task.format}`; })()}" />
          <div class="history-card-body">
            <span class="task-badge task-badge--success">✓ Ready</span>
            <p class="history-card-prompt">${truncate(task.prompt, 120)}</p>
            <p class="history-card-meta">${task.style ? task.style.name : '—'} · ${task.resolution} · ${task.ratio}</p>
            <div class="history-card-actions">
              <button class="btn-secondary" style="font-size:12px; padding:6px 14px;" data-download-task-id="${task.id}">↓ Download</button>
              <button class="btn-secondary" style="font-size:12px; padding:6px 14px;" data-regen-task-id="${task.id}">↺ Regenerate</button>
              <button class="btn-secondary" style="font-size:12px; padding:6px 14px;" data-load-task-id="${task.id}">✏ Load into Editor</button>
            </div>
          </div>
        </div>
      `;
        } else {
            return `
        <div class="history-card">
          <div class="history-thumb-placeholder">✗</div>
          <div class="history-card-body">
            <span class="task-badge task-badge--fail">Failed</span>
            <p class="history-card-prompt">${truncate(task.prompt, 120)}</p>
            <p class="history-card-meta" style="color: var(--color-error); opacity:1;">${task.failMsg || 'Unknown error'}</p>
          </div>
        </div>
      `;
        }
    }).join('');

    // Event delegation for download buttons
    historyGrid.querySelectorAll('[data-download-task-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const task = tasks.find(t => t.id === btn.dataset.downloadTaskId);
            if (task && task.imageUrl) downloadTask(task);
        });
    });

    // Regenerate — re-submit same prompt + style directly
    historyGrid.querySelectorAll('[data-regen-task-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const task = tasks.find(t => t.id === btn.dataset.regenTaskId);
            if (!task) return;
            submitTask(task.prompt, task.style);
            sectionQueue.classList.remove('hidden');
            sectionQueue.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Load into Editor — populate prompt textarea for editing
    historyGrid.querySelectorAll('[data-load-task-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const task = tasks.find(t => t.id === btn.dataset.loadTaskId);
            if (!task) return;
            // Pre-fill topic if available
            if (task.rawTopic && topicInput) topicInput.value = task.rawTopic;
            // Re-select the style card if possible
            if (task.style) {
                document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
                const card = document.querySelector(`.style-card[data-style-id="${task.style.id}"]`);
                if (card) {
                    card.classList.add('selected');
                    selectedTheme = task.style; selectedTreatment = null;
                }
            }
            // Load prompt into editor
            refinedPrompt.value = task.prompt;
            refinedPrompt.style.height = 'auto';
            refinedPrompt.style.height = refinedPrompt.scrollHeight + 'px';
            promptOutputContainer.classList.remove('hidden');
            updateButtonStates();
            // Scroll to refine section
            document.getElementById('section-refine').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Click any history thumb to open fullscreen modal
    historyGrid.querySelectorAll('.history-thumb[data-image-url]').forEach(img => {
        img.addEventListener('click', () => {
            openImageModal(img.dataset.imageUrl, img.dataset.filename || 'infographic.png');
        });
    });
}

/* ─────────────────────────────────────────────
   Render All
───────────────────────────────────────────── */
function renderAll() {
    renderQueue();
    renderHistory();
}

/* ─────────────────────────────────────────────
   Update single task's status message in-place
   (avoids full re-render flicker during polling)
───────────────────────────────────────────── */
function updateTaskMsg(taskId, msg) {
    const el = document.getElementById(`task-msg-${taskId}`);
    if (el) el.textContent = msg;
}

/* ─────────────────────────────────────────────
   Per-Task Polling
───────────────────────────────────────────── */
function startTaskPolling(task) {
    let msgIndex = 0;

    // Rotate status messages every 5s (in-place, no re-render)
    task.statusRotation = setInterval(() => {
        msgIndex = (msgIndex + 1) % STATUS_MESSAGES.length;
        task.statusMsg = STATUS_MESSAGES[msgIndex];
        updateTaskMsg(task.id, task.statusMsg);
    }, 5000);

    // Poll every 4s
    task.pollingInterval = setInterval(async () => {
        try {
            const res = await fetch(`/task-status/${task.taskId}`);
            const data = await res.json();

            if (data.state === 'success') {
                clearTaskPolling(task);
                task.status = 'success';
                task.imageUrl = data.imageUrl;
                renderAll();
            } else if (data.state === 'fail') {
                clearTaskPolling(task);
                task.status = 'fail';
                task.failMsg = data.failMsg || 'Generation failed.';
                renderAll();
            }
            // 'waiting' — continue polling
        } catch (err) {
            clearTaskPolling(task);
            task.status = 'fail';
            task.failMsg = 'Polling error: ' + err.message;
            renderAll();
        }
    }, 4000);

    // 3-minute safety timeout
    task.pollingTimeout = setTimeout(() => {
        clearTaskPolling(task);
        task.status = 'fail';
        task.failMsg = 'Timed out after 3 minutes.';
        renderAll();
    }, 180000);
}

function clearTaskPolling(task) {
    if (task.statusRotation) { clearInterval(task.statusRotation); task.statusRotation = null; }
    if (task.pollingInterval) { clearInterval(task.pollingInterval); task.pollingInterval = null; }
    if (task.pollingTimeout) { clearTimeout(task.pollingTimeout); task.pollingTimeout = null; }
}

/* ─────────────────────────────────────────────
   Submit Task (explicit style param)
───────────────────────────────────────────── */
async function submitTask(prompt, taskStyle) {
    const task = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        prompt,
        rawTopic: topicInput ? topicInput.value.trim() : '',
        style: taskStyle,
        resolution: selectedResolution,
        ratio: selectedRatio,
        format: selectedFormat,
        status: 'submitting',
        statusMsg: 'Submitting to Nano Banana...',
        imageUrl: null,
        failMsg: null,
        taskId: null,
        statusRotation: null,
        pollingInterval: null,
        pollingTimeout: null,
        submittedAt: new Date()
    };

    // Prepend so newest appears at top
    tasks.unshift(task);
    renderAll();

    try {
        const res = await fetch('/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: task.prompt,
                resolution: task.resolution,
                aspectRatio: task.ratio,
                outputFormat: task.format,
                model: getSelectedModel()
            })
        });


        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Failed to start task');

        task.taskId = data.taskId;
        task.status = 'polling';
        task.statusMsg = STATUS_MESSAGES[0];
        renderAll();
        startTaskPolling(task);

    } catch (err) {
        task.status = 'fail';
        task.failMsg = err.message;
        renderAll();
    }
}

/* ─────────────────────────────────────────────
   Button State + Cost Estimate
───────────────────────────────────────────── */
const CREDITS = { '1K': 18, '2K': 18, '4K': 24 };
const COST_PER_CREDIT = 0.09 / 18; // $0.005 per credit

function updateCostEstimate() {
    const count = getSelectedStyles().length;
    if (count === 0) {
        costEstimateEl.classList.add('hidden');
        return;
    }
    const creditsEach = CREDITS[selectedResolution] || 18;
    const totalCredits = creditsEach * count;
    const totalCost = (COST_PER_CREDIT * totalCredits).toFixed(2);
    const styleWord = count === 1 ? 'style' : 'styles';
    costEstimateEl.innerHTML = `
        <span>${count} ${styleWord}</span>
        <span class="cost-estimate-sep">·</span>
        <span>${totalCredits} credits</span>
        <span class="cost-estimate-sep">·</span>
        <span>$${totalCost}</span>
        <span class="cost-estimate-note">${creditsEach} credits / image</span>
    `;
    costEstimateEl.classList.remove('hidden');
}

function updateButtonStates() {
    const count = getSelectedStyles().length;
    const hasPrompt = refinedPrompt && refinedPrompt.value.trim().length > 0;
    const multi = count > 1;

    // Refine: only when exactly 1 style selected
    btnRefine.disabled = count !== 1;

    // Quick Gen: needs ≥1 style
    btnQuickGen.disabled = count === 0;

    // Generate: only when exactly 1 style selected AND prompt ready
    if (btnGenerate) {
        btnGenerate.disabled = multi || !hasPrompt;
    }

    // Visual cue on Refine if multi-select active
    if (multi) {
        btnRefine.title = 'Disabled — select a single style to use Refine Prompt';
    } else {
        btnRefine.title = '';
    }
}

/* ─────────────────────────────────────────────
   Style Picker (Theme × Treatment chips)
───────────────────────────────────────────── */
function renderStyleCards() {
    // ── Theme row ──────────────────────────────────────────────────────────
    const themeSection = document.createElement('div');
    themeSection.className = 'style-picker-section';
    themeSection.innerHTML = '<p class="style-picker-label">🎨 Visual Theme <span class="style-picker-hint">— pick the world / aesthetic</span></p>';
    const themeRow = document.createElement('div');
    themeRow.className = 'style-picker-row';

    THEMES.forEach(theme => {
        const chip = document.createElement('button');
        chip.className = 'style-chip';
        chip.dataset.id = theme.id;
        chip.textContent = theme.name;
        chip.style.setProperty('--chip-color', theme.color);
        chip.addEventListener('click', () => {
            if (selectedTheme?.id === theme.id) {
                // deselect
                selectedTheme = null;
                chip.classList.remove('selected');
            } else {
                selectedTheme = theme;
                themeRow.querySelectorAll('.style-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            }
            updateButtonStates();
            updateCostEstimate();
        });
        themeRow.appendChild(chip);
    });

    themeSection.appendChild(themeRow);
    styleGrid.appendChild(themeSection);

    // ── Treatment row ──────────────────────────────────────────────────────
    const treatSection = document.createElement('div');
    treatSection.className = 'style-picker-section';
    treatSection.innerHTML = '<p class="style-picker-label">🖌 Rendering Treatment <span class="style-picker-hint">— how it\'s drawn (optional)</span></p>';
    const treatRow = document.createElement('div');
    treatRow.className = 'style-picker-row';

    TREATMENTS.forEach(treatment => {
        const chip = document.createElement('button');
        chip.className = 'style-chip';
        chip.dataset.id = treatment.id;
        chip.textContent = treatment.name;
        chip.style.setProperty('--chip-color', treatment.color);
        chip.addEventListener('click', () => {
            if (selectedTreatment?.id === treatment.id) {
                // deselect (treatment is optional)
                selectedTreatment = null;
                chip.classList.remove('selected');
            } else {
                selectedTreatment = treatment;
                treatRow.querySelectorAll('.style-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            }
            updateButtonStates();
            updateCostEstimate();
        });
        treatRow.appendChild(chip);
    });

    treatSection.appendChild(treatRow);
    styleGrid.appendChild(treatSection);

    // ── Preview label (updates dynamically) ───────────────────────────────
    const previewEl = document.createElement('p');
    previewEl.id = 'style-combo-preview';
    previewEl.className = 'style-combo-preview hidden';
    styleGrid.appendChild(previewEl);

    // Watch for changes via MutationObserver on chips
    function refreshPreview() {
        const s = getSelectedStyle();
        if (s) {
            previewEl.textContent = `✨ Combined style: ${s.name}`;
            previewEl.classList.remove('hidden');
        } else {
            previewEl.classList.add('hidden');
        }
    }
    styleGrid.addEventListener('click', () => setTimeout(refreshPreview, 0));
}


/* ─────────────────────────────────────────────
   Toggle Button Groups
───────────────────────────────────────────── */
function initToggleGroups() {
    document.getElementById('resolution-toggle').addEventListener('click', e => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#resolution-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedResolution = btn.dataset.value;
        updateCostEstimate();
    });

    document.getElementById('density-toggle').addEventListener('click', e => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#density-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDensity = btn.dataset.value;
    });

    document.getElementById('ratio-toggle').addEventListener('click', e => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#ratio-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedRatio = btn.dataset.value;
    });

    document.getElementById('format-toggle').addEventListener('click', e => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#format-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFormat = btn.dataset.value;
    });

    const iterToggle = document.getElementById('creation-iterations-toggle');
    if (iterToggle) {
        iterToggle.addEventListener('click', e => {
            const btn = e.target.closest('.toggle-btn');
            if (!btn) return;
            iterToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    }
}

/* ─────────────────────────────────────────────
   Textarea Auto-Expand
───────────────────────────────────────────── */
function setupAutoExpand(el) {
    el.addEventListener('input', () => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    });
}

/* ─────────────────────────────────────────────
   Refine Prompt Button
───────────────────────────────────────────── */
btnRefine.addEventListener('click', async () => {
    const topic = topicInput.value.trim();

    if (!topic) {
        alert('Please describe your infographic topic first.');
        return;
    }
    if (getSelectedStyles().length === 0) {
        alert('Please select an art style.');
        return;
    }
    if (getSelectedStyles().length > 1) {
        alert('Refine Prompt works with a single style. Use ⚡ Quick Gen to batch-generate across multiple styles.');
        return;
    }

    btnRefine.textContent = 'Refining...';
    btnRefine.disabled = true;
    refineStatus.textContent = 'Calling OpenRouter...';
    refineStatus.classList.remove('hidden', 'error');

    try {
        const body = { topic, style: getSelectedStyles()[0].description, density: selectedDensity };
        if (creationImageBase64) { body.referenceImageBase64 = creationImageBase64; body.mimeType = creationImageMime; }
        const brandColors = document.getElementById('brand-colors-input')?.value.trim();
        if (brandColors) body.brandColors = brandColors;
        const res = await fetch('/refine-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Failed to refine prompt');

        // Bake the brand hex directive into the visible prompt so user can see exactly
        // what will be sent to the image generator. applyBrandColors() at generate-time
        // will skip re-appending since the section is already present.
        refinedPrompt.value = applyBrandColors(data.prompt);
        refinedPrompt.style.height = 'auto';
        refinedPrompt.style.height = refinedPrompt.scrollHeight + 'px';


        promptOutputContainer.classList.remove('hidden');
        refineStatus.classList.add('hidden');
        updateButtonStates();

    } catch (err) {
        refineStatus.textContent = `Error: ${err.message}`;
        refineStatus.classList.add('error');
    } finally {
        btnRefine.textContent = 'Refine Prompt';
        updateButtonStates();
    }
});

/* ─────────────────────────────────────────────
   Copy Prompt Button
───────────────────────────────────────────── */
btnCopyPrompt.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(refinedPrompt.value);
        copyConfirm.classList.remove('hidden');
        setTimeout(() => copyConfirm.classList.add('hidden'), 2000);
    } catch {
        alert('Could not copy to clipboard.');
    }
});

/* ─────────────────────────────────────────────
   Export Prompt as .md
───────────────────────────────────────────── */
const btnExportPrompt = document.getElementById('btn-export-prompt');
btnExportPrompt.addEventListener('click', () => {
    const text = refinedPrompt.value.trim();
    if (!text) return;

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = now.toTimeString().slice(0, 5).replace(':', '');

    // Build a slug from style name (falls back to 'prompt')
    const stylePart = getSelectedStyles().length > 0
        ? getSelectedStyles()[0].id.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
        : 'prompt';

    // Build a short slug from the topic (first 4 words, max 40 chars)
    const topicSlug = (topicInput.value.trim() || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .slice(0, 4)
        .join('-')
        .slice(0, 40) || 'infographic';

    const filename = `${datePart}_${timePart}_${stylePart}_${topicSlug}.md`;

    // Format as a tidy .md file with a title and the prompt body
    const styleTitle = getSelectedStyles().length > 0 ? getSelectedStyles()[0].name : 'Infographic';
    const topicTitle = topicInput.value.trim() || 'Infographic';
    const mdContent = `# ${styleTitle} — ${topicTitle}\n\n> Generated: ${now.toLocaleString()}\n\n---\n\n${text}\n`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
});

/* ─────────────────────────────────────────────
   Expand / Collapse Prompt Button
───────────────────────────────────────────── */
btnExpandPrompt.addEventListener('click', () => {
    const isExpanded = refinedPrompt.classList.toggle('expanded');
    if (isExpanded) {
        btnExpandPrompt.textContent = '⤡ Collapse';
        refinedPrompt.style.height = 'auto';
    } else {
        btnExpandPrompt.textContent = '⤢ Expand';
        refinedPrompt.style.height = '';
    }
});

/* ─────────────────────────────────────────────
   Generate Image Button
   Re-enables immediately after submit so more
   tasks can be queued without waiting.
───────────────────────────────────────────── */
btnGenerate.addEventListener('click', () => {
    const prompt = refinedPrompt.value.trim();

    if (!prompt) {
        alert('Please refine a prompt first.');
        return;
    }
    if (getSelectedStyles().length !== 1) {
        alert('Select exactly one style to use Generate Image.');
        return;
    }

    // Read selected iterations (default 1)
    const iterBtn = document.querySelector('#creation-iterations-toggle .toggle-btn.active');
    const iterations = iterBtn ? parseInt(iterBtn.dataset.value, 10) : 1;

    // Brief confirmation in the button text
    const originalText = btnGenerate.textContent;
    btnGenerate.textContent = `+ Added ${iterations > 1 ? iterations + 'x ' : ''}to queue`;
    btnGenerate.disabled = true;

    setTimeout(() => {
        btnGenerate.textContent = originalText;
        updateButtonStates();
    }, 1200);

    const finalPrompt = applyBrandColors(applyDensity(prompt));
    for (let i = 0; i < iterations; i++) {
        setTimeout(() => submitTask(finalPrompt, getSelectedStyles()[0]), i * 200);
    }
});


/* ─────────────────────────────────────────────
   Quick Gen Button
   Refines the prompt silently, then immediately
   submits to the queue — no editing step.
───────────────────────────────────────────── */
btnQuickGen.addEventListener('click', async () => {
    const topic = topicInput.value.trim();

    if (!topic) {
        alert('Please describe your infographic topic first.');
        return;
    }
    if (getSelectedStyles().length === 0) {
        alert('Please select at least one art style.');
        return;
    }

    const count = getSelectedStyles().length;
    const stylePlural = count === 1 ? 'style' : 'styles';

    // Lock buttons
    btnQuickGen.textContent = `⚡ Refining ${count} ${stylePlural}...`;
    btnQuickGen.disabled = true;
    btnRefine.disabled = true;
    quickGenStatus.textContent = `Refining ${count} ${stylePlural} with OpenRouter...`;
    quickGenStatus.classList.remove('hidden', 'error');

    try {
        // Fire all refine calls in parallel — one per selected style
        const results = await Promise.allSettled(
            getSelectedStyles().map(style =>
                fetch('/refine-prompt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify((() => {
                        const b = { topic, style: style.description, density: selectedDensity };
                        if (creationImageBase64) { b.referenceImageBase64 = creationImageBase64; b.mimeType = creationImageMime; }
                        const bc = document.getElementById('brand-colors-input')?.value.trim();
                        if (bc) b.brandColors = bc;
                        return b;
                    })()),
                }).then(async res => {
                    const data = await res.json();
                    if (!res.ok || data.error) throw new Error(data.error || 'Failed');
                    return { style, prompt: data.prompt };
                })
            )
        );

        let queued = 0;
        let failed = 0;
        results.forEach(r => {
            if (r.status === 'fulfilled') {
                submitTask(applyBrandColors(r.value.prompt), r.value.style);
                queued++;
            } else {
                failed++;
                console.error('Quick Gen refine failed:', r.reason);
            }
        });

        const msg = failed > 0
            ? `${queued} queued, ${failed} failed to refine`
            : `${queued} generation${queued > 1 ? 's' : ''} queued — check Active Generations below`;
        quickGenStatus.textContent = msg;
        if (failed > 0) quickGenStatus.classList.add('error');

        setTimeout(() => quickGenStatus.classList.add('hidden'), 3000);

    } catch (err) {
        quickGenStatus.textContent = `Error: ${err.message}`;
        quickGenStatus.classList.add('error');
    } finally {
        btnQuickGen.textContent = '⚡ Quick Gen';
        updateButtonStates();
    }
});

/* ─────────────────────────────────────────────
   Direct Prompt Button
───────────────────────────────────────────── */
btnDirectPrompt.addEventListener('click', () => {
    const topic = topicInput.value.trim();
    if (getSelectedStyles().length === 0) {
        alert('Please select at least one art style before using Direct Prompt.');
        return;
    }
    // Clear and reveal the prompt textarea immediately — no AI call
    refinedPrompt.value = '';
    refinedPrompt.style.height = '';
    promptOutputContainer.classList.remove('hidden');
    refineStatus.classList.add('hidden');
    quickGenStatus.classList.add('hidden');
    updateButtonStates();
    // Focus so the user can start typing straight away
    setTimeout(() => {
        refinedPrompt.focus();
        refinedPrompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
});

/* ─────────────────────────────────────────────
   Brand Colours Panel — Toggle, Presets, Clear
───────────────────────────────────────────── */
function setupBrandColors() {
    const toggleBtn = document.getElementById('btn-brand-toggle');
    const clearBtn = document.getElementById('btn-brand-clear');
    const panel = document.getElementById('brand-panel');
    const textarea = document.getElementById('brand-colors-input');
    const presetsEl = document.getElementById('brand-presets');

    if (!toggleBtn || !panel || !textarea) return;

    // ── Render preset chips ───────────────────────────
    function markActive(activeBtn) {
        presetsEl.querySelectorAll('.brand-preset-btn').forEach(b =>
            b.classList.toggle('active', b === activeBtn)
        );
    }

    function syncIndicators() {
        const hasText = textarea.value.trim().length > 0;
        clearBtn.classList.toggle('hidden', !hasText);
        toggleBtn.classList.toggle('has-content', hasText);
    }

    BRAND_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'brand-preset-btn';
        btn.title = preset.name;

        // Colour dot swatch
        const swatchEl = document.createElement('span');
        swatchEl.className = 'brand-preset-swatch';
        preset.swatches.forEach(hex => {
            const dot = document.createElement('span');
            dot.className = 'brand-preset-dot';
            dot.style.backgroundColor = hex;
            swatchEl.appendChild(dot);
        });

        const label = document.createElement('span');
        label.textContent = preset.name;

        btn.appendChild(swatchEl);
        btn.appendChild(label);
        presetsEl.appendChild(btn);

        btn.addEventListener('click', () => {
            // If already active, deselect and clear
            if (btn.classList.contains('active')) {
                textarea.value = '';
                markActive(null);
            } else {
                textarea.value = preset.text;
                markActive(btn);
                // Auto-open panel if collapsed
                if (toggleBtn.getAttribute('aria-expanded') !== 'true') {
                    toggleBtn.setAttribute('aria-expanded', 'true');
                    panel.classList.remove('hidden');
                }
            }
            syncIndicators();
        });
    });

    // ── Main toggle ───────────────────────────────
    toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        panel.classList.toggle('hidden', expanded);
    });

    // ── Clear button ───────────────────────────
    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        markActive(null);
        syncIndicators();
    });

    // ── Free-text typing ───────────────────────
    textarea.addEventListener('input', () => {
        // Deselect preset chips if user edits manually
        markActive(null);
        syncIndicators();
    });
}

/* ─────────────────────────────────────────────
   Reference Image Upload (Creation Tab)
───────────────────────────────────────────── */
let creationImageBase64 = null;
let creationImageMime = null;

function setupCreationReferenceImage() {
    const toggleBtn = document.getElementById('btn-ref-toggle');
    const clearBtn = document.getElementById('btn-ref-clear');
    const panel = document.getElementById('ref-panel');
    const dropZone = document.getElementById('creation-drop-zone');
    const fileInput = document.getElementById('creation-file-input');
    const preview = document.getElementById('creation-preview');
    const previewImg = document.getElementById('creation-preview-img');
    const removeBtn = document.getElementById('creation-change-img');
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        const isHidden = panel.classList.toggle('hidden');
        toggleBtn.setAttribute('aria-expanded', String(!isHidden));
        toggleBtn.querySelector('.brand-toggle-chevron').textContent = isHidden ? '▾' : '▴';
    });

    function loadFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10 MB.'); return; }
        const reader = new FileReader();
        reader.onload = e => {
            const dataUrl = e.target.result;
            creationImageBase64 = dataUrl.split(',')[1];
            creationImageMime = file.type;
            previewImg.src = dataUrl;
            dropZone.classList.add('hidden');
            preview.classList.remove('hidden');
            clearBtn.classList.remove('hidden');
            toggleBtn.classList.add('has-content');
        };
        reader.readAsDataURL(file);
    }

    function clearImage() {
        creationImageBase64 = null;
        creationImageMime = null;
        fileInput.value = '';
        previewImg.src = '';
        preview.classList.add('hidden');
        dropZone.classList.remove('hidden');
        clearBtn.classList.add('hidden');
        toggleBtn.classList.remove('has-content');
    }

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => loadFile(fileInput.files[0]));
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        loadFile(e.dataTransfer.files[0]);
    });
    removeBtn.addEventListener('click', clearImage);
    clearBtn.addEventListener('click', () => {
        clearImage();
        panel.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.querySelector('.brand-toggle-chevron').textContent = '▾';
    });
}

/* ─────────────────────────────────────────────
   Tab Switching
───────────────────────────────────────────── */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', String(b === btn));
            });
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `tab-${target}`);
            });
        });
    });
}

/* ─────────────────────────────────────────────
   Visual Strategy Feature
───────────────────────────────────────────── */
(function setupVisualStrategy() {
    const btnAnalyse = document.getElementById('btn-analyse-content');
    const copyInput = document.getElementById('strategy-copy-input');
    const statusEl = document.getElementById('strategy-status');
    const resultsEl = document.getElementById('strategy-results');
    const cardsGrid = document.getElementById('strategy-cards');
    const vstyleButtons = document.querySelectorAll('.vstyle-btn');

    if (!btnAnalyse) return;

    // ── Visual style selection ────────────────────────────────────────────
    let selectedVStyle = 'infographic'; // matches the default active button

    vstyleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            vstyleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedVStyle = btn.dataset.vstyle;
        });
    });

    // ── Brand screenshot upload zone ─────────────────────────────────
    const brandUploadZone = document.getElementById('brand-upload-zone');
    const brandImageInput = document.getElementById('brand-image-input');
    const brandUploadPlaceholder = document.getElementById('brand-upload-placeholder');
    const brandUploadPreview = document.getElementById('brand-upload-preview');
    const brandPreviewImg = document.getElementById('brand-preview-img');
    const brandPreviewName = document.getElementById('brand-preview-name');
    const brandClearBtn = document.getElementById('brand-clear-btn');

    let brandImageBase64 = null;
    let brandImageMime = null;

    function showBrandPreview(file) {
        if (!file || !file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) {
            setStatus('Brand image too large — max 5 MB', true);
            return;
        }
        brandImageMime = file.type;
        const reader = new FileReader();
        reader.onload = (e) => {
            brandImageBase64 = e.target.result.split(',')[1];
            brandPreviewImg.src = e.target.result;
            brandPreviewName.textContent = file.name;
            brandUploadPlaceholder.classList.add('hidden');
            brandUploadPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    function clearBrandImage() {
        brandImageBase64 = null;
        brandImageMime = null;
        brandImageInput.value = '';
        brandPreviewImg.src = '';
        brandPreviewName.textContent = '';
        brandUploadPreview.classList.add('hidden');
        brandUploadPlaceholder.classList.remove('hidden');
    }

    if (brandUploadZone) {
        brandUploadZone.addEventListener('click', (e) => {
            if (!e.target.closest('.brand-clear-btn')) brandImageInput.click();
        });
        brandImageInput?.addEventListener('change', () => showBrandPreview(brandImageInput.files[0]));
        brandClearBtn?.addEventListener('click', (e) => { e.stopPropagation(); clearBrandImage(); });

        brandUploadZone.addEventListener('dragover', (e) => { e.preventDefault(); brandUploadZone.classList.add('drag-over'); });
        brandUploadZone.addEventListener('dragleave', () => brandUploadZone.classList.remove('drag-over'));
        brandUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            brandUploadZone.classList.remove('drag-over');
            showBrandPreview(e.dataTransfer.files[0]);
        });
    }

    // Visual type → badge colour (CSS variable-friendly palette)
    const TYPE_META = {
        process_steps: { bg: '#4c1d95', color: '#c4b5fd', icon: '🔢' },
        comparison: { bg: '#1e3a5f', color: '#93c5fd', icon: '⚖️' },
        statistics: { bg: '#14532d', color: '#86efac', icon: '📊' },
        timeline: { bg: '#7c2d12', color: '#fca5a1', icon: '📅' },
        benefit_list: { bg: '#1c4532', color: '#6ee7b7', icon: '✅' },
        hierarchy: { bg: '#312e81', color: '#a5b4fc', icon: '🏔' },
        cycle: { bg: '#064e3b', color: '#6ee7b7', icon: '🔄' },
        quote_graphic: { bg: '#4a1d96', color: '#ddd6fe', icon: '💬' },
    };

    function setStatus(msg, isError = false) {
        statusEl.textContent = msg;
        statusEl.classList.toggle('error', isError);
        statusEl.classList.toggle('hidden', !msg);
    }

    // Intelligence summary panel — injected before the cards grid
    let intelligencePanel = null;

    function renderIntelligence(ci, brandColors = null) {
        // Remove previous panel if re-running
        if (intelligencePanel) intelligencePanel.remove();

        const fwHtml = (ci.frameworks || []).map(f => `
            <div class="ci-framework">
                <strong>${escapeHtml(f.name)}</strong> — ${escapeHtml(f.description || '')}
                ${(f.steps && f.steps.length) ? `<ol class="ci-steps">${f.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>` : ''}
            </div>`).join('');

        const listHtml = (arr, cls) => (arr || []).map(i => `<li class="${cls}">${escapeHtml(i)}</li>`).join('');

        // Brand colour swatches row
        const swatchHtml = brandColors ? `
            <div class="ci-brand-palette">
                <span class="ci-palette-label">🎨 Brand Palette</span>
                ${['primary', 'secondary', 'accent', 'background', 'text'].map(k =>
            `<span class="ci-swatch" style="background:${escapeHtml(brandColors[k])}" title="${k}: ${escapeHtml(brandColors[k])}"></span>
                     <span class="ci-swatch-hex">${escapeHtml(brandColors[k])}</span>`
        ).join('')}
                <span class="ci-palette-desc">${escapeHtml(brandColors.description || '')}</span>
            </div>` : '';

        intelligencePanel = document.createElement('div');
        intelligencePanel.className = 'ci-panel';
        intelligencePanel.innerHTML = `
            <div class="ci-panel-header">
                <span class="ci-panel-title">📋 Content Intelligence</span>
                <span class="ci-panel-meta">${escapeHtml(ci.tone || '')} · ${escapeHtml(ci.target_audience || '')}</span>
            </div>
            ${(ci.brand_name || ci.offer_name) ? `<div class="ci-identity">
                ${ci.brand_name ? `<span class="ci-identity-tag">🏷 Brand: <strong>${escapeHtml(ci.brand_name)}</strong></span>` : ''}
                ${ci.offer_name ? `<span class="ci-identity-tag">📦 Offer: <strong>${escapeHtml(ci.offer_name)}</strong></span>` : ''}
            </div>` : ''}
            ${swatchHtml}
            <p class="ci-core-message">"${escapeHtml(ci.core_message || '')}"</p>
            <div class="ci-grid">
                ${fwHtml ? `<div class="ci-col"><h4 class="ci-col-label">Frameworks</h4>${fwHtml}</div>` : ''}
                ${(ci.key_messages || []).length ? `<div class="ci-col"><h4 class="ci-col-label">Key Messages</h4><ul class="ci-list">${listHtml(ci.key_messages, 'ci-msg')}</ul></div>` : ''}
                ${(ci.standout_insights || []).length ? `<div class="ci-col"><h4 class="ci-col-label">Standout Insights</h4><ul class="ci-list">${listHtml(ci.standout_insights, 'ci-insight')}</ul></div>` : ''}
            </div>`;

        // Insert before the cards grid inside resultsEl
        resultsEl.insertBefore(intelligencePanel, cardsGrid);
    }

    function renderCards(recommendations, ci = {}) {
        cardsGrid.innerHTML = '';

        // ── Toolbar: Export All + Quick Gen (inserted before cards) ──────────
        let toolbar = resultsEl.querySelector('#qg-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = 'qg-toolbar';
            toolbar.className = 'qg-toolbar';
            resultsEl.insertBefore(toolbar, cardsGrid);
        }
        toolbar.innerHTML = ''; // reset on re-run

        const exportAllBtn = document.createElement('button');
        exportAllBtn.id = 'btn-export-all-prompts';
        exportAllBtn.className = 'btn-secondary';
        exportAllBtn.textContent = '⬇ Export All Prompts';
        toolbar.appendChild(exportAllBtn);

        const quickGenBtn = document.createElement('button');
        quickGenBtn.id = 'btn-quick-gen';
        quickGenBtn.className = 'btn-quick-gen';
        quickGenBtn.textContent = '⚡ Quick Gen';
        quickGenBtn.disabled = true;
        toolbar.appendChild(quickGenBtn);

        // Each card stores its live prompt so refinements accumulate
        const livePrompts = recommendations.map(r => r.infographicPrompt || '');

        // Approved set
        const approvedSet = new Set();
        const updateQuickGenBtn = () => {
            const n = approvedSet.size;
            quickGenBtn.textContent = n > 0 ? `⚡ Quick Gen (${n} Approved)` : '⚡ Quick Gen';
            quickGenBtn.disabled = n === 0;
            quickGenBtn.classList.toggle('has-approved', n > 0);
        };

        recommendations.forEach((rec, idx) => {
            const meta = TYPE_META[rec.visualType] || { bg: '#1f2937', color: '#e5e7eb', icon: '🖼' };
            const card = document.createElement('div');
            card.className = 'strategy-card';
            card.dataset.idx = idx;
            card.innerHTML = `
                <div class="strategy-card-top">
                    <span class="strategy-type-badge" style="background:${meta.bg};color:${meta.color}">
                        ${meta.icon} ${rec.visualTypeLabel || rec.visualType}
                    </span>
                    <span class="strategy-section-label">${escapeHtml(rec.section || '')}</span>
                </div>
                <h3 class="strategy-headline">${escapeHtml(rec.headline || '')}</h3>
                <p class="strategy-rationale">${escapeHtml(rec.rationale || '')}</p>
                ${rec.sourceExcerpt ? `<blockquote class="strategy-excerpt">"${escapeHtml(rec.sourceExcerpt)}"</blockquote>` : ''}

                <!-- Expandable prompt panel -->
                <div class="card-prompt-panel hidden">
                    <label class="card-prompt-label">Image Prompt</label>
                    <textarea class="card-prompt-textarea" rows="5">${escapeHtml(livePrompts[idx])}</textarea>

                    <!-- Inline brand name input (shown only when 🏷 button clicked) -->
                    <div class="card-brand-row hidden">
                        <input type="text" class="card-brand-input" placeholder="Brand or offer name…" />
                        <button class="refine-btn card-brand-apply" data-prompt-action="brand-apply">Apply ✓</button>
                        <button class="card-brand-cancel" data-prompt-action="brand-cancel">✕</button>
                    </div>

                    <div class="card-refine-row">
                        <button class="refine-btn" data-prompt-action="brand-toggle">🏷 Include Brand Name</button>
                        <button class="refine-btn" data-instruction="Add more visually specific and contextually relevant detail to make this image prompt richer and more descriptive" data-prompt-action="refine">＋ More Detail</button>
                        <button class="refine-btn" data-instruction="Make this prompt more concise — cut redundancy, keep all key visual and compositional elements" data-prompt-action="refine">✂ More Concise</button>
                        <button class="refine-btn refine-regen" data-instruction="Completely regenerate this image prompt for the same topic and visual type, with a fresh approach" data-prompt-action="refine">🔄 Re-generate</button>
                        <button class="card-copy-btn" data-prompt-action="copy" title="Copy prompt to clipboard">📋 Copy</button>
                    </div>
                    <div class="card-refine-status"></div>

                    <!-- Generation settings: shown in prompt panel -->
                    <div class="card-gen-settings">
                        <label class="cgs-label">Dimension</label>
                        <select class="cgs-select card-ar-select">
                            <option value="9:16" ${['process_steps', 'benefit_list', 'hierarchy', 'quote_graphic'].includes(rec.visualType) ? 'selected' : ''}>9:16 — Portrait</option>
                            <option value="16:9" ${['comparison', 'timeline'].includes(rec.visualType) ? 'selected' : ''}>16:9 — Landscape</option>
                            <option value="1:1"  ${['statistics', 'cycle'].includes(rec.visualType) ? 'selected' : ''}>1:1 — Square</option>
                            <option value="4:5">4:5 — Social</option>
                        </select>
                        <label class="cgs-label">Resolution</label>
                        <select class="cgs-select card-res-select">
                            <option value="1K">1K</option>
                            <option value="2K" selected>2K</option>
                            <option value="4K">4K</option>
                        </select>
                        <label class="cgs-label">Format</label>
                        <select class="cgs-select card-fmt-select">
                            <option value="jpg" selected>JPG</option>
                            <option value="png">PNG</option>
                        </select>
                    </div>
                </div>

                <div class="strategy-card-actions">
                    <button class="btn-outline card-toggle-prompt" data-idx="${idx}">
                        👁 View Prompt
                    </button>
                    <button class="btn-approve" data-prompt-action="approve" data-idx="${idx}" title="Approve this prompt for Quick Gen">
                        ✓ Approve
                    </button>
                    <button class="btn-primary strategy-action-btn" data-idx="${idx}" data-action="creation">
                        ✏️ Open in Creation
                    </button>
                    <button class="btn-secondary strategy-action-btn" data-idx="${idx}" data-action="mockups">
                        🖼 Open in Mockups
                    </button>
                </div>`;
            cardsGrid.appendChild(card);
        });

        // ── Event delegation for all card interactions ─────────────────────
        cardsGrid.addEventListener('click', async e => {
            // Open in Creation / Mockups
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const rec = recommendations[parseInt(actionBtn.dataset.idx, 10)];
                // Use the live (possibly refined) prompt
                const textarea = actionBtn.closest('.strategy-card')?.querySelector('.card-prompt-textarea');
                const liveRec = { ...rec, infographicPrompt: textarea?.value || rec.infographicPrompt };
                if (actionBtn.dataset.action === 'creation') sendToCreation(liveRec);
                if (actionBtn.dataset.action === 'mockups') sendToMockups(liveRec);
                return;
            }

            // Toggle prompt panel
            const toggleBtn = e.target.closest('.card-toggle-prompt');
            if (toggleBtn) {
                const card = toggleBtn.closest('.strategy-card');
                const panel = card.querySelector('.card-prompt-panel');
                const isOpen = !panel.classList.contains('hidden');
                panel.classList.toggle('hidden', isOpen);
                toggleBtn.textContent = isOpen ? '👁 View Prompt' : '▲ Hide Prompt';
                return;
            }
            // Brand name toggle — show inline input
            const brandToggle = e.target.closest('[data-prompt-action="brand-toggle"]');
            if (brandToggle) {
                const panel = brandToggle.closest('.card-prompt-panel');
                const brandRow = panel.querySelector('.card-brand-row');
                const brandInput = brandRow.querySelector('.card-brand-input');
                // Pre-fill with detected brand from Step 1
                const detected = [ci.brand_name, ci.offer_name].filter(Boolean).join(' / ');
                if (detected && !brandInput.value) brandInput.value = detected;
                brandRow.classList.toggle('hidden');
                if (!brandRow.classList.contains('hidden')) brandInput.focus();
                return;
            }

            // Brand name cancel
            const brandCancel = e.target.closest('[data-prompt-action="brand-cancel"]');
            if (brandCancel) {
                brandCancel.closest('.card-brand-row').classList.add('hidden');
                return;
            }

            // Brand name apply — trigger refinement with the typed/pre-filled name
            const brandApply = e.target.closest('[data-prompt-action="brand-apply"]');
            if (brandApply) {
                const panel = brandApply.closest('.card-prompt-panel');
                const brandRow = panel.querySelector('.card-brand-row');
                const name = brandRow.querySelector('.card-brand-input').value.trim();
                if (!name) return;
                brandRow.classList.add('hidden');
                const ta = panel.querySelector('.card-prompt-textarea');
                const statusEl = panel.querySelector('.card-refine-status');
                const instruction = `Include the brand name "${name}" prominently in the visual design and typography. Weave it naturally into the title, headline, or a visual element without forcing it.`;
                // Reuse the refine flow
                panel.querySelectorAll('.refine-btn').forEach(b => b.disabled = true);
                statusEl.textContent = '✦ Adding brand name…';
                statusEl.className = 'card-refine-status active';
                try {
                    const res = await fetch('/refine-strategy-prompt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentPrompt: ta.value, instruction })
                    });
                    const data = await res.json();
                    if (!res.ok || data.error) throw new Error(data.error);
                    ta.value = data.refinedPrompt;
                    const cardIdx = parseInt(brandApply.closest('.strategy-card').dataset.idx, 10);
                    livePrompts[cardIdx] = data.refinedPrompt;
                    statusEl.textContent = '✓ Brand name added';
                    statusEl.className = 'card-refine-status done';
                    setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'card-refine-status'; }, 3000);
                } catch (err) {
                    statusEl.textContent = `Error: ${err.message}`;
                    statusEl.className = 'card-refine-status error';
                } finally {
                    panel.querySelectorAll('.refine-btn').forEach(b => b.disabled = false);
                }
                return;
            }

            const copyBtn = e.target.closest('[data-prompt-action="copy"]');
            if (copyBtn) {
                const ta = copyBtn.closest('.card-prompt-panel').querySelector('.card-prompt-textarea');
                await navigator.clipboard.writeText(ta.value).catch(() => { });
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
                return;
            }

            // Refinement buttons
            const refineBtn = e.target.closest('[data-prompt-action="refine"]');
            if (refineBtn) {
                const panel = refineBtn.closest('.card-prompt-panel');
                const ta = panel.querySelector('.card-prompt-textarea');
                const statusEl = panel.querySelector('.card-refine-status');
                let instruction = refineBtn.dataset.instruction;

                // For brand name, use extracted ci.brand_name first; fall back to prompt
                if (instruction.includes('brand name')) {
                    const detected = [ci.brand_name, ci.offer_name].filter(Boolean).join(' / ');
                    const name = detected || window.prompt('Enter your brand or offer name:');
                    if (!name) return;
                    instruction = `Include the brand name "${name.trim()}" prominently in the visual design and typography`;
                }

                refineBtn.disabled = true;
                statusEl.textContent = '✦ Refining…';
                statusEl.className = 'card-refine-status active';

                try {
                    const res = await fetch('/refine-strategy-prompt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentPrompt: ta.value, instruction })
                    });
                    const data = await res.json();
                    if (!res.ok || data.error) throw new Error(data.error);
                    ta.value = data.refinedPrompt;
                    // Update livePrompts so Export All uses the latest
                    const cardIdx = parseInt(refineBtn.closest('.strategy-card').dataset.idx, 10);
                    livePrompts[cardIdx] = data.refinedPrompt;
                    statusEl.textContent = '✓ Updated';
                    statusEl.className = 'card-refine-status done';
                    setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'card-refine-status'; }, 3000);
                } catch (err) {
                    statusEl.textContent = `Error: ${err.message}`;
                    statusEl.className = 'card-refine-status error';
                } finally {
                    refineBtn.disabled = false;
                }
            }

            // Approve toggle
            const approveBtn = e.target.closest('[data-prompt-action="approve"]');
            if (approveBtn) {
                const idx = parseInt(approveBtn.dataset.idx, 10);
                const card = approveBtn.closest('.strategy-card');
                if (approvedSet.has(idx)) {
                    approvedSet.delete(idx);
                    card.classList.remove('approved');
                    approveBtn.textContent = '✓ Approve';
                    approveBtn.classList.remove('approved');
                } else {
                    approvedSet.add(idx);
                    card.classList.add('approved');
                    approveBtn.textContent = '✅ Approved';
                    approveBtn.classList.add('approved');
                }
                updateQuickGenBtn();
                return;
            }
        });

        // ── Export All ─────────────────────────────────────────────────────
        exportAllBtn.onclick = () => {
            const lines = recommendations.map((rec, i) => {
                // Always export the live (refined) textarea value if panel exists
                const ta = cardsGrid.querySelector(`.strategy-card[data-idx="${i}"] .card-prompt-textarea`);
                const prompt = ta ? ta.value : livePrompts[i];
                return `## ${i + 1}. ${rec.headline || rec.section}\n**Type:** ${rec.visualTypeLabel || rec.visualType}\n**Rationale:** ${rec.rationale || ''}\n\n**Image Prompt:**\n${prompt}`;
            }).join('\n\n---\n\n');

            const md = `# Visual Strategy — Prompt Recommendations\n\n${lines}\n`;
            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'visual-strategy-prompts.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // ── Quick Gen ──────────────────────────────────────────────────────
        // Maps visualType → aspect ratio for kie.ai
        const VTYPE_RATIO = {
            process_steps: '9:16', comparison: '16:9', statistics: '1:1',
            timeline: '16:9', benefit_list: '9:16', hierarchy: '9:16',
            cycle: '1:1', quote_graphic: '9:16'
        };

        quickGenBtn.onclick = () => runQuickGen();

        async function runQuickGen() {
            if (approvedSet.size === 0) return;

            // Gallery setup
            let gallery = resultsEl.querySelector('#quick-gen-gallery');
            if (!gallery) {
                gallery = document.createElement('div');
                gallery.id = 'quick-gen-gallery';
                gallery.innerHTML = '<h3 class="qg-gallery-title">⚡ Quick Gen Results</h3><div class="qg-grid"></div>';
                resultsEl.appendChild(gallery);
            }
            const qgGrid = gallery.querySelector('.qg-grid');
            qgGrid.innerHTML = '';

            // Create a placeholder card per approved prompt and kick off generation
            const jobs = [];
            for (const idx of approvedSet) {
                const rec = recommendations[idx];
                const cardEl = cardsGrid.querySelector(`.strategy-card[data-idx="${idx}"]`);
                const ta = cardEl?.querySelector('.card-prompt-textarea');
                const prompt = ta?.value || livePrompts[idx];
                // Read per-card settings (with smart defaults)
                const aspectRatio = cardEl?.querySelector('.card-ar-select')?.value || VTYPE_RATIO[rec.visualType] || '9:16';
                const resolution = cardEl?.querySelector('.card-res-select')?.value || '2K';
                const outputFormat = cardEl?.querySelector('.card-fmt-select')?.value || 'jpg';

                // Placeholder card
                const slot = document.createElement('div');
                slot.className = 'qg-card loading';
                slot.dataset.idx = idx;
                slot.innerHTML = `
                    <div class="qg-shimmer"></div>
                    <div class="qg-card-meta">
                        <span class="qg-label">${escapeHtml(rec.headline || rec.section)}</span>
                        <span class="qg-status">Generating…</span>
                    </div>`;
                qgGrid.appendChild(slot);

                jobs.push({ idx, rec, prompt, aspectRatio, resolution, outputFormat, slot });
            }

            gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Fire all generations in parallel
            await Promise.allSettled(jobs.map(job => generateOne(job)));
        }

        async function generateOne({ rec, prompt, aspectRatio, resolution, outputFormat, slot }) {
            const setStatus = (msg, err) => {
                const s = slot.querySelector('.qg-status');
                if (s) { s.textContent = msg; s.style.color = err ? '#f87171' : ''; }
            };
            try {
                const res = await fetch('/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, aspectRatio, resolution, outputFormat, model: 'nano-banana-2' })
                });
                const data = await res.json();
                if (!res.ok || data.error) throw new Error(data.error || 'Generation failed');
                await pollAndRender(data.taskId, rec, slot);
            } catch (err) {
                slot.classList.replace('loading', 'failed');
                setStatus(`Error: ${err.message}`, true);
            }
        }

        function pollAndRender(taskId, rec, slot) {
            const MSGS = [
                'Generating…', 'Composing layout…', 'Rendering details…',
                'Applying colours…', 'Adding typography…', 'Almost there…'
            ];
            let msgIdx = 0;
            const setStatus = (msg) => { const s = slot.querySelector('.qg-status'); if (s) s.textContent = msg; };

            return new Promise((resolve, reject) => {
                // Rotate status messages every 5s so user sees progress
                const msgTimer = setInterval(() => {
                    msgIdx = (msgIdx + 1) % MSGS.length;
                    setStatus(MSGS[msgIdx]);
                }, 5000);

                // 3-minute hard timeout (same as Creation tab)
                const hardTimeout = setTimeout(() => {
                    clearInterval(msgTimer);
                    clearInterval(iv);
                    slot.classList.replace('loading', 'failed');
                    setStatus('Timed out after 3 min — try Quick Gen again');
                    reject(new Error('timeout'));
                }, 180_000);

                // Poll every 4s — matches Creation tab cadence
                const iv = setInterval(async () => {
                    try {
                        const r = await fetch(`/task-status/${taskId}`);
                        const data = await r.json();
                        // /task-status normalises the KIE response to { state, imageUrl, failMsg }
                        if (data.state === 'success') {
                            clearInterval(iv); clearInterval(msgTimer); clearTimeout(hardTimeout);
                            renderQgResult(slot, rec, data.imageUrl);
                            resolve();
                        } else if (data.state === 'fail') {
                            clearInterval(iv); clearInterval(msgTimer); clearTimeout(hardTimeout);
                            slot.classList.replace('loading', 'failed');
                            setStatus(`Failed: ${data.failMsg || 'Unknown error'}`);
                            reject(new Error(data.failMsg || 'failed'));
                        }
                        // 'waiting' → keep polling, message rotation handles UX
                    } catch { /* network hiccup — keep polling */ }
                }, 4000);
            });
        }


        function renderQgResult(slot, rec, imgUrl, taskId) {
            slot.className = 'qg-card ready';
            slot.innerHTML = `
                <img src="${imgUrl}" alt="${escapeHtml(rec.headline || '')}" class="qg-image" loading="lazy" />
                <div class="qg-card-meta">
                    <span class="qg-label">${escapeHtml(rec.headline || rec.section)}</span>
                    <div class="qg-actions">
                        <a href="/download?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent((rec.headline || 'image').replace(/\s+/g, '-'))}.png"
                           download class="qg-action-btn">⬇ Download</a>
                        <button class="qg-action-btn" onclick="window.open('${imgUrl}','_blank')">🔍 Full Size</button>
                    </div>
                </div>`;
        }
    }


    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function sendToCreation(rec) {
        // Pre-fill the topic textarea on the Creation tab
        const topicEl = document.getElementById('topic-input');
        if (topicEl) {
            topicEl.value = rec.infographicPrompt || rec.headline || '';
            topicEl.dispatchEvent(new Event('input'));
        }
        // Switch to Creation tab
        const creationBtn = document.querySelector('.tab-btn[data-tab="creation"]');
        if (creationBtn) creationBtn.click();

        // Short delay then scroll to topic input
        setTimeout(() => topicEl?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }

    function sendToMockups(rec) {
        // Pre-fill mockup context textarea
        const mockupCtx = document.getElementById('mockup-context');
        if (mockupCtx) {
            mockupCtx.value = rec.infographicPrompt || rec.headline || '';
            mockupCtx.dispatchEvent(new Event('input'));
        }
        // Switch to Mockups tab
        const mockupBtn = document.querySelector('.tab-btn[data-tab="mockups"]');
        if (mockupBtn) mockupBtn.click();
    }

    btnAnalyse.addEventListener('click', async () => {
        const copy = copyInput.value.trim();
        if (copy.length < 80) {
            setStatus('Please paste at least a few sentences of website copy first.', true);
            return;
        }

        btnAnalyse.textContent = 'Analysing…';
        btnAnalyse.disabled = true;
        resultsEl.classList.add('hidden');
        setStatus(brandImageBase64 ? 'Extracting brand colours and auditing content…' : 'Auditing your content for visual opportunities…');

        try {
            const body = { websiteCopy: copy, visualStyle: selectedVStyle };
            if (brandImageBase64 && brandImageMime) {
                body.brandImageBase64 = brandImageBase64;
                body.brandImageMime = brandImageMime;
            }
            const res = await fetch('/analyse-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || 'Failed to analyse content');

            setStatus('');
            if (data.contentIntelligence) renderIntelligence(data.contentIntelligence, data.brandColors || null);
            renderCards(data.recommendations || [], data.contentIntelligence || {});

            resultsEl.classList.remove('hidden');
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });


        } catch (err) {
            setStatus(`Error: ${err.message}`, true);
        } finally {
            btnAnalyse.textContent = '🧠 Analyse My Content';
            btnAnalyse.disabled = false;
        }
    });
})();

/* ─────────────────────────────────────────────
   Reverse Engineer Feature

───────────────────────────────────────────── */
function setupReverseEngineer() {
    const dropZone = document.getElementById('re-drop-zone');
    const fileInput = document.getElementById('re-file-input');
    const preview = document.getElementById('re-preview');
    const previewImg = document.getElementById('re-preview-img');
    const changeBtn = document.getElementById('re-change-img');
    const btnAnalyse = document.getElementById('btn-analyse');
    const reStatus = document.getElementById('re-status');
    const outputExact = document.getElementById('re-output-exact');
    const outputTemplate = document.getElementById('re-output-template');
    const exactTextarea = document.getElementById('re-exact-textarea');
    const tplTextarea = document.getElementById('re-template-textarea');

    if (!dropZone) return;

    let storedBase64 = null;
    let storedMime = null;

    // ── Status helpers ──────────────────────────
    function showReStatus(msg, type = 'info') {
        reStatus.textContent = msg;
        reStatus.className = `status-message${type === 'error' ? ' error' : ''}`;
        reStatus.classList.remove('hidden');
    }
    function hideReStatus() {
        reStatus.classList.add('hidden');
        reStatus.textContent = '';
    }

    // ── File handling ───────────────────────────
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showReStatus('Please upload a valid image file (PNG, JPG, or WEBP).', 'error');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showReStatus('Image exceeds 10 MB limit. Please choose a smaller file.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            storedBase64 = dataUrl.split(',')[1];
            storedMime = file.type;
            previewImg.src = dataUrl;
            dropZone.classList.add('hidden');
            preview.classList.remove('hidden');
            btnAnalyse.disabled = false;
            hideReStatus();
            outputExact.classList.add('hidden');
            outputTemplate.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    // Drag-and-drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    // Change image
    changeBtn.addEventListener('click', () => {
        storedBase64 = null; storedMime = null;
        fileInput.value = ''; previewImg.src = '';
        preview.classList.add('hidden');
        dropZone.classList.remove('hidden');
        btnAnalyse.disabled = true;
        hideReStatus();
        outputExact.classList.add('hidden');
        outputTemplate.classList.add('hidden');
    });

    // ── Analyse ─────────────────────────────────
    btnAnalyse.addEventListener('click', async () => {
        if (!storedBase64) return;

        btnAnalyse.disabled = true;
        btnAnalyse.textContent = '⏳ Analysing…';
        showReStatus('Sending image to vision model — this usually takes 10–30 seconds…');
        outputExact.classList.add('hidden');
        outputTemplate.classList.add('hidden');

        try {
            const resp = await fetch('/reverse-engineer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: storedBase64, mimeType: storedMime }),
            });
            const data = await resp.json();
            if (!resp.ok || data.error) throw new Error(data.error || 'Server error');

            exactTextarea.value = data.exactPrompt || '';
            tplTextarea.value = data.templatePrompt || '';
            outputExact.classList.remove('hidden');
            outputTemplate.classList.remove('hidden');
            hideReStatus();
        } catch (err) {
            showReStatus(`Analysis failed: ${err.message}`, 'error');
        } finally {
            btnAnalyse.disabled = false;
            btnAnalyse.textContent = '🔍 Analyse Image';
        }
    });

    // ── Export .md ───────────────────────────────
    document.querySelectorAll('.btn-export-md').forEach(btn => {
        btn.addEventListener('click', () => {
            const textarea = document.getElementById(btn.dataset.target);
            const name = btn.dataset.name || 'prompt';
            if (!textarea || !textarea.value.trim()) return;

            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
            const timePart = now.toTimeString().slice(0, 5).replace(':', '');
            const filename = `${datePart}_${timePart}_${name}.md`;
            const content = `# ${name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}\n\n${textarea.value.trim()}\n`;

            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url; anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        });
    });
}

/* ─────────────────────────────────────────────
   Mockups Feature
───────────────────────────────────────────── */
function setupMockups() {
    // ── DOM refs ──────────────────────────────────
    const contextEl = document.getElementById('mockup-context');
    const chipsContainer = document.getElementById('mockup-chips');
    const dropZone = document.getElementById('mockup-drop-zone');
    const fileInput = document.getElementById('mockup-file-input');
    const preview = document.getElementById('mockup-preview');
    const previewImg = document.getElementById('mockup-preview-img');
    const changeImgBtn = document.getElementById('mockup-change-img');
    const btnRefine = document.getElementById('btn-mockup-refine');
    const btnQuickGen = document.getElementById('btn-mockup-quick-gen');
    const refineStatus = document.getElementById('mockup-refine-status');
    const promptOutput = document.getElementById('mockup-prompt-output');
    const refinedPromptEl = document.getElementById('mockup-refined-prompt');
    const btnCopy = document.getElementById('btn-mockup-copy');
    const copyConfirmEl = document.getElementById('mockup-copy-confirm');
    const ratioToggle = document.getElementById('mockup-ratio-toggle');
    const resToggle = document.getElementById('mockup-resolution-toggle');
    const iterToggle = document.getElementById('mockup-iterations-toggle');
    const formatToggle = document.getElementById('mockup-format-toggle');
    const costRow = document.getElementById('mockup-cost-row');
    const btnGenerate = document.getElementById('btn-mockup-generate');
    const genStatus = document.getElementById('mockup-gen-status');

    if (!contextEl) return; // tab not in DOM

    setupAutoExpand(contextEl); // grow as user types

    // ── Mockup state (multi-select) ───────────────────
    let selectedMockupTypes = ['Laptop']; // array, at least one always selected
    let mockupImageBase64 = null;
    let mockupImageMime = null;
    let mockupResolution = '1K';
    let mockupRatio = '1:1';
    let mockupIterations = 1;
    let mockupFormat = 'png';

    // ── Chip multi-select (style-card pattern) ────────────
    chipsContainer.addEventListener('click', e => {
        const chip = e.target.closest('.style-card');
        if (!chip) return;
        const type = chip.dataset.type;
        const isSelected = chip.classList.contains('selected') || chip.classList.contains('active');
        if (isSelected) {
            if (selectedMockupTypes.length > 1) { // keep at least one
                chip.classList.remove('selected', 'active');
                selectedMockupTypes = selectedMockupTypes.filter(t => t !== type);
            }
        } else {
            chip.classList.remove('active'); // clear default state
            chip.classList.add('selected');
            selectedMockupTypes.push(type);
        }
        // Show Quick Gen when 2+ selected
        btnQuickGen.classList.toggle('hidden', selectedMockupTypes.length < 2);
        updateMockupCost();
    });

    // ── Toggle groups ──────────────────────────
    function setupToggle(el, onChange) {
        el.addEventListener('click', e => {
            const btn = e.target.closest('.toggle-btn');
            if (!btn) return;
            el.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onChange(btn.dataset.value);
            updateMockupCost();
        });
    }
    setupToggle(ratioToggle, v => { mockupRatio = v; });
    setupToggle(resToggle, v => { mockupResolution = v; });
    setupToggle(formatToggle, v => { mockupFormat = v; });
    setupToggle(iterToggle, v => { mockupIterations = parseInt(v, 10); });

    // ── Cost estimate ──────────────────────────
    function updateMockupCost() {
        const creditsEach = CREDITS[mockupResolution] || 18;
        const numTypes = selectedMockupTypes.length;
        const total = creditsEach * mockupIterations * numTypes;
        const cost = (COST_PER_CREDIT * total).toFixed(2);
        const images = mockupIterations * numTypes;
        costRow.innerHTML = `<span>${images} image${images > 1 ? 's' : ''}</span>
            <span class="cost-estimate-sep">·</span>
            <span>${total} credits</span>
            <span class="cost-estimate-sep">·</span>
            <span>$${cost}</span>
            <span class="cost-estimate-note">${creditsEach} credits / image</span>`;
        costRow.classList.remove('hidden');
    }
    updateMockupCost();

    // ── Reference image upload ──────────────────
    function handleMockupFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        if (file.size > 10 * 1024 * 1024) {
            refineStatus.textContent = 'Image exceeds 10 MB limit.';
            refineStatus.classList.remove('hidden');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const dataUrl = e.target.result;
            mockupImageBase64 = dataUrl.split(',')[1];
            mockupImageMime = file.type;
            previewImg.src = dataUrl;
            dropZone.classList.add('hidden');
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleMockupFile(fileInput.files[0]); });

    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleMockupFile(e.dataTransfer.files[0]);
    });

    // Click on drop zone inner (not the hidden input directly)
    dropZone.querySelector('.drop-zone-inner').addEventListener('click', () => fileInput.click());

    changeImgBtn.addEventListener('click', () => {
        mockupImageBase64 = null; mockupImageMime = null;
        fileInput.value = ''; previewImg.src = '';
        preview.classList.add('hidden');
        dropZone.classList.remove('hidden');
    });

    // ── Refine Prompt ──────────────────────────
    btnRefine.addEventListener('click', async () => {
        const context = contextEl.value.trim();
        if (!context) {
            alert('Please describe your product or content first (Step 1).');
            return;
        }

        btnRefine.textContent = 'Refining...';
        btnRefine.disabled = true;
        refineStatus.textContent = 'Calling AI — this usually takes 10–20 seconds…';
        refineStatus.className = 'status-message';
        promptOutput.classList.add('hidden');
        btnGenerate.disabled = true;

        // Read brand colours from the Creation tab's shared textarea (if populated)
        const brandEl = document.getElementById('brand-colors-input');
        const brandColors = brandEl ? brandEl.value.trim() : '';

        try {
            const body = {
                context,
                mockupType: selectedMockupTypes[0],
                brandColors: brandColors || undefined
            };
            if (mockupImageBase64) {
                body.referenceImageBase64 = mockupImageBase64;
                body.mimeType = mockupImageMime;
            }

            const res = await fetch('/refine-mockup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || 'Failed to refine mockup prompt');

            refinedPromptEl.value = data.prompt;
            refinedPromptEl.style.height = 'auto';
            refinedPromptEl.style.height = refinedPromptEl.scrollHeight + 'px';
            promptOutput.classList.remove('hidden');
            refineStatus.classList.add('hidden');
            btnGenerate.disabled = false;

        } catch (err) {
            refineStatus.textContent = `Error: ${err.message}`;
            refineStatus.classList.add('error');
        } finally {
            btnRefine.textContent = '✨ Refine Prompt';
            btnRefine.disabled = false;
        }
    });

    // ── Quick Gen — refine all selected types in parallel, then generate each ─
    btnQuickGen.addEventListener('click', async () => {
        const context = contextEl.value.trim();
        if (!context) { alert('Please describe your product or content first (Step 1).'); return; }
        if (selectedMockupTypes.length < 2) { alert('Select at least 2 mockup types first.'); return; }

        btnQuickGen.textContent = `Generating ${selectedMockupTypes.length} mockups…`;
        btnQuickGen.disabled = true;
        btnRefine.disabled = true;
        refineStatus.textContent = `Quick Gen: refining prompts for ${selectedMockupTypes.length} types…`;
        refineStatus.classList.remove('hidden', 'error');
        promptOutput.classList.add('hidden');
        btnGenerate.disabled = true;

        const brandEl = document.getElementById('brand-colors-input');
        const brandColors = brandEl ? brandEl.value.trim() : '';

        // Refine all selected types in parallel
        const results = await Promise.allSettled(
            selectedMockupTypes.map(type => {
                const body = { context, mockupType: type, brandColors: brandColors || undefined };
                if (mockupImageBase64) { body.referenceImageBase64 = mockupImageBase64; body.mimeType = mockupImageMime; }
                return fetch('/refine-mockup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }).then(r => r.json()).then(data => {
                    if (data.error) throw new Error(data.error);
                    return { type, prompt: data.prompt };
                });
            })
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').map(r => r.value);
        const failed = results.filter(r => r.status === 'rejected').length;

        if (succeeded.length === 0) {
            refineStatus.textContent = 'All refinements failed. Please try again.';
            refineStatus.classList.add('error');
        } else {
            refineStatus.classList.add('hidden');
            for (let i = 0; i < mockupIterations; i++) {
                succeeded.forEach(({ prompt }) => submitMockupTask(prompt));
            }
        }

        if (failed > 0) {
            const note = document.createElement('div');
            note.className = 'status-message error';
            note.textContent = `${failed} type(s) failed to refine and were skipped.`;
            genStatus.replaceWith(note);
        }

        btnQuickGen.textContent = '⚡ Quick Gen';
        btnQuickGen.disabled = false;
        btnRefine.disabled = false;
    });

    // ── Copy prompt ────────────────────────────
    btnCopy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(refinedPromptEl.value);
            copyConfirmEl.classList.remove('hidden');
            setTimeout(() => copyConfirmEl.classList.add('hidden'), 2000);
        } catch { alert('Could not copy to clipboard.'); }
    });

    // ── Generate (N iterations) — renders in Mockups tab ──
    function submitMockupTask(prompt) {
        const queueSection = document.getElementById('mockup-section-queue');
        const resultsSection = document.getElementById('mockup-section-results');
        const queueList = document.getElementById('mockup-queue-list');
        const resultsGrid = document.getElementById('mockup-results-grid');

        queueSection.classList.remove('hidden');

        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
          <div class="task-card-header">
            <span class="task-badge task-badge--submitting">Submitting</span>
            <span class="task-card-meta">${mockupRatio} · ${mockupResolution} · ${mockupFormat.toUpperCase()}</span>
          </div>
          <div class="task-card-prompt">${prompt.slice(0, 120)}${prompt.length > 120 ? '…' : ''}</div>
          <div class="task-progress"><div class="task-progress-bar"></div></div>
          <div class="task-card-msg">Submitting to generator…</div>`;
        queueList.prepend(card);

        const setStatus = (badge, msg) => {
            const b = card.querySelector('.task-badge');
            if (b) { b.className = `task-badge task-badge--${badge}`; b.textContent = badge.charAt(0).toUpperCase() + badge.slice(1); }
            const m = card.querySelector('.task-card-msg');
            if (m) m.textContent = msg;
        };
        const removeProgress = () => { const p = card.querySelector('.task-progress'); if (p) p.remove(); };

        const date = new Date();
        const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        const timePart = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
        const ext = mockupFormat === 'jpg' ? 'jpg' : 'png';
        const fname = `mockup_${datePart}_${timePart}_${mockupRatio.replace(':', 'x')}_${mockupResolution}.${ext}`;

        fetch('/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                aspectRatio: mockupRatio,
                resolution: mockupResolution,
                outputFormat: mockupFormat,
                model: getSelectedModel(),
                referenceImageBase64: mockupImageBase64 || null,
                referenceImageMime: mockupImageMime || null
            })
        })


            .then(r => r.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                const taskId = data.taskId;
                setStatus('polling', 'Generating — this usually takes 30–90 seconds…');

                const poll = setInterval(async () => {
                    try {
                        const pr = await fetch(`/task-status/${taskId}`);
                        const info = await pr.json();

                        if (info.state === 'success') {
                            clearInterval(poll);
                            removeProgress();
                            setStatus('success', 'Done!');
                            card.remove();
                            if (queueList.children.length === 0) queueSection.classList.add('hidden');

                            resultsSection.classList.remove('hidden');
                            const thumb = document.createElement('div');
                            thumb.className = 'history-card';
                            const img = document.createElement('img');
                            img.src = info.imageUrl;
                            img.className = 'history-thumb';
                            img.alt = 'Generated mockup';
                            img.loading = 'lazy';
                            img.style.cursor = 'zoom-in';
                            img.addEventListener('click', () => openImageModal(info.imageUrl, fname));
                            const body = document.createElement('div');
                            body.className = 'history-card-body';
                            body.innerHTML = `
                          <div class="history-card-prompt">${prompt.slice(0, 80)}…</div>
                          <div class="history-card-actions">
                            <a href="/download?url=${encodeURIComponent(info.imageUrl)}&filename=${encodeURIComponent(fname)}"
                               class="btn-secondary" style="font-size:12px;padding:5px 12px;" download="${fname}">↓ Download</a>
                          </div>`;
                            thumb.appendChild(img);
                            thumb.appendChild(body);
                            resultsGrid.prepend(thumb);

                        } else if (info.state === 'fail') {
                            clearInterval(poll);
                            removeProgress();
                            setStatus('fail', `Failed: ${info.failMsg || 'unknown error'}`);
                            setTimeout(() => card.remove(), 6000);
                        }
                    } catch (e) { console.error('Poll error', e); }
                }, 5000);
            })
            .catch(err => {
                removeProgress();
                setStatus('fail', `Error: ${err.message}`);
                setTimeout(() => card.remove(), 6000);
            });
    }

    btnGenerate.addEventListener('click', () => {
        const prompt = refinedPromptEl.value.trim();
        if (!prompt) { alert('Please refine a prompt first.'); return; }
        btnGenerate.textContent = `Queued ${mockupIterations} job${mockupIterations > 1 ? 's' : ''}`;
        btnGenerate.disabled = true;
        genStatus.classList.add('hidden');
        for (let i = 0; i < mockupIterations; i++) submitMockupTask(prompt);
        setTimeout(() => { btnGenerate.textContent = '🚀 Generate Mockup'; btnGenerate.disabled = false; }, 1500);
    });
}


/* ─────────────────────────────────────────────
   Fullscreen Image Modal
───────────────────────────────────────────── */
function openImageModal(imageUrl, filename) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('image-modal-img');
    const dlBtn = document.getElementById('image-modal-download');
    if (!modal || !img) return;
    img.src = imageUrl;
    dlBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = `/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.getElementById('image-modal-img').src = '';
    document.body.style.overflow = '';
}

function setupImageModal() {
    const modal = document.getElementById('image-modal');
    const backdrop = document.getElementById('image-modal-backdrop');
    const closeBtn = document.getElementById('image-modal-close');
    if (!modal) return;
    closeBtn.addEventListener('click', closeImageModal);
    backdrop.addEventListener('click', closeImageModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });
}

/* ─────────────────────────────────────────────
   Initialise
───────────────────────────────────────────── */
function init() {
    initTabs();   // Always first — tab switching must work regardless of other setup
    try { renderStyleCards(); } catch (e) { console.error('[init] renderStyleCards:', e); }
    try { initToggleGroups(); } catch (e) { console.error('[init] initToggleGroups:', e); }
    try { setupAutoExpand(topicInput); } catch (e) { console.error('[init] autoExpand topic:', e); }
    try { setupAutoExpand(refinedPrompt); } catch (e) { console.error('[init] autoExpand prompt:', e); }
    try { setupBrandColors(); } catch (e) { console.error('[init] setupBrandColors:', e); }
    try { setupCreationReferenceImage(); } catch (e) { console.error('[init] setupRefImage:', e); }
    try { setupReverseEngineer(); } catch (e) { console.error('[init] setupRE:', e); }
    try { setupMockups(); } catch (e) { console.error('[init] setupMockups:', e); }
    try { setupImageModal(); } catch (e) { console.error('[init] setupImageModal:', e); }
    try { updateButtonStates(); } catch (e) { console.error('[init] updateButtonStates:', e); }
    if (typeof initThumbnailsTab === 'function') initThumbnailsTab();
}

init();
