/* ═══════════════════════════════════════════════════════════════════════
   THUMBNAILS TAB — thumbnail-tab.js
   Implements the full AI Thumbnail Creator system from the spec
═══════════════════════════════════════════════════════════════════════ */

/* ─── Constants ───────────────────────────────────────────────────────── */

const TN_QUESTIONS = [
    {
        id: 'videoTitle',
        label: 'Q1 — What is your video title?',
        hint: 'The full title you plan to use on YouTube',
        type: 'textarea',
        placeholder: 'e.g. How I Made $10K With Bitcoin in 30 Days',
        required: true
    },
    {
        id: 'topicNiche',
        label: 'Q2 — What is the main topic or niche?',
        hint: 'e.g. Crypto education, Hypnotherapy, Aviation, Motivational',
        type: 'text',
        placeholder: 'e.g. Bitcoin wallets / Crypto education',
        required: true
    },
    {
        id: 'desiredEmotion',
        label: 'Q3 — What do you want the viewer to FEEL?',
        hint: 'Select the emotion that drives the click',
        type: 'chips',
        options: ['Curious', 'Shocked', 'Inspired', 'Concerned', 'Excited', 'Confident'],
        required: true
    },
    {
        id: 'subjectPreference',
        label: 'Q4 — Do you want a person in the image?',
        hint: 'Who or what appears as the hero subject',
        type: 'chips',
        options: ['Yes — Woman', 'Yes — Man', 'Yes — Couple', 'No — Symbolic only'],
        required: true
    },
    {
        id: 'headlineText',
        label: 'Q5 — What headline text goes on the thumbnail?',
        hint: 'Short, punchy text overlay (leave blank for AI to suggest)',
        type: 'text',
        placeholder: 'e.g. CRYPTO BASICS',
        required: false
    },
    {
        id: 'subtextText',
        label: 'Q6 — Subtext line? (optional)',
        hint: 'Secondary line below the headline',
        type: 'text',
        placeholder: 'e.g. Step 1 of 9',
        required: false
    },
    {
        id: 'brandColors',
        label: 'Q7 — Brand colours? (optional)',
        hint: 'Paste hex codes or choose a preset below',
        type: 'colorpicker',
        required: false
    }
];

const TN_CURIOSITY_GAPS = [
    { id: 'before_after', icon: '↔', label: 'Before & After', desc: 'Transformation story in one image' },
    { id: 'challenge', icon: '⚡', label: 'Challenge', desc: 'Subject facing a high-stakes situation' },
    { id: 'contradiction', icon: '🔀', label: 'Contradiction', desc: 'Breaks expectations — feels slightly wrong' },
    { id: 'novelty', icon: '🌀', label: 'Novelty', desc: 'Something bizarre that makes you stop' },
    { id: 'result', icon: '🏆', label: 'Result', desc: 'End state shown, the "how" hidden' }
];

const TN_STYLES = [
    { id: 'shocking', label: 'Shocking', desc: 'Pattern interrupt — stops the scroll' },
    { id: 'big_number', label: 'Big Number', desc: 'Scale triggers curiosity about how' },
    { id: 'minimalist', label: 'Minimalist', desc: 'Clean, premium, high-contrast' },
    { id: 'size_contrast', label: 'Big vs Small', desc: 'Size contrast tells a story instantly' },
    { id: 'before_after', label: 'Before vs After', desc: 'Transformation story split screen' },
    { id: 'blurred_bg', label: 'Blurred BG', desc: 'Foreground sharp, background intrigues' },
    { id: 'contradiction', label: 'Contradiction', desc: 'Makes viewers say "wait, what?"' }
];

const TN_EXPRESSIONS = [
    { id: 'curious', label: 'Curious', emoji: '🤔', intent: 'Educational / How-To' },
    { id: 'shocked', label: 'Shocked', emoji: '😲', intent: 'Shocking Reveal / Stat' },
    { id: 'inspired', label: 'Inspired', emoji: '✨', intent: 'Motivational' },
    { id: 'concerned', label: 'Concerned', emoji: '😟', intent: 'Problem / Warning' },
    { id: 'confident', label: 'Confident', emoji: '💪', intent: 'Authority / Expert' },
    { id: 'approachable', label: 'Approachable', emoji: '😊', intent: 'Relatable Beginner' },
    { id: 'transformed', label: 'Transformed', emoji: '🌟', intent: 'Transformation Result' },
    { id: 'determined', label: 'Determined', emoji: '😤', intent: 'Challenge / Tension' }
];

const TN_COLOR_PRESETS = [
    { id: 'zionix', label: 'Zionix Global', bg: '#001213', accent: '#219da0', swatches: ['#001213', '#219da0', '#ffffff'] },
    { id: 'hypno_magenta', label: 'Hypno Magenta', bg: '#0a0010', accent: '#d63384', swatches: ['#0a0010', '#d63384', '#ffffff'] },
    { id: 'gold_authority', label: 'Gold Authority', bg: '#0d0d0d', accent: '#c9a84c', swatches: ['#0d0d0d', '#c9a84c', '#ffffff'] },
    { id: 'power_red', label: 'Power Red', bg: '#0a0000', accent: '#e63946', swatches: ['#0a0000', '#e63946', '#ffffff'] },
    { id: 'calm_purple', label: 'Calm Purple', bg: '#0f0020', accent: '#7b2fbe', swatches: ['#0f0020', '#7b2fbe', '#ffffff'] },
    { id: 'clean_white', label: 'Clean White', bg: '#ffffff', accent: '#1a1a2e', swatches: ['#ffffff', '#1a1a2e', '#333333'] },
    { id: 'warm_amber', label: 'Warm Amber', bg: '#1a0f00', accent: '#f4a261', swatches: ['#1a0f00', '#f4a261', '#ffffff'] }
];

const LOOP_COLORS = {
    desire: { label: 'Desire Loop', color: '#4A9EF5', desc: 'Pain point + Solution — show the end state' },
    interest: { label: 'Interest Loop', color: '#9D50BB', desc: 'Entertainment / Curiosity — show the tension' },
    aspiration: { label: 'Aspiration Loop', color: '#F4A261', desc: 'Motivation / Coaching — show the after state' },
    fear: { label: 'Fear Loop', color: '#E63946', desc: 'Warning / Risk — show the before state' }
};

/* ─── State ───────────────────────────────────────────────────────────── */

let tnCurrentStep = 0;
let tnAnswers = {};
let tnAnalysis = null;
let tnSelectedGap = null;
let tnSelectedStyle = null;
let tnSelectedExpression = null;
let tnSelectedColorPreset = null;
let tnCustomAccent = '';
let tnGenTasks = { offset: null, centered: null, splitScreen: null };
let tnGenResults = { offset: null, centered: null, splitScreen: null };
let tnPollingIntervals = {};
let tnPollingTimeouts = {};
let tnSavedTemplates = [];

/* ─── Initialise ──────────────────────────────────────────────────────── */

function initThumbnailsTab() {
    tnSavedTemplates = JSON.parse(localStorage.getItem('tn_templates') || '[]');
    renderTnStep();
    document.getElementById('btn-tn-back').addEventListener('click', tnBack);
    document.getElementById('btn-tn-next').addEventListener('click', tnNext);
    document.getElementById('btn-tn-analyse').addEventListener('click', tnAnalyse);
    document.getElementById('btn-tn-generate').addEventListener('click', tnGenerate);
    document.getElementById('btn-tn-reset-analyse').addEventListener('click', tnReset);
    document.getElementById('btn-tn-reset-results').addEventListener('click', tnReset);
    document.getElementById('btn-tn-save-template').addEventListener('click', tnSaveTemplate);
    renderTnTemplateList();
}

/* ─── Intake Wizard ───────────────────────────────────────────────────── */

function renderTnStep() {
    const q = TN_QUESTIONS[tnCurrentStep];
    const container = document.getElementById('tn-question-container');
    const progress = document.getElementById('tn-progress');
    const backBtn = document.getElementById('btn-tn-back');
    const nextBtn = document.getElementById('btn-tn-next');

    // Progress bar
    progress.style.width = `${((tnCurrentStep + 1) / TN_QUESTIONS.length) * 100}%`;
    document.getElementById('tn-step-count').textContent = `Question ${tnCurrentStep + 1} of ${TN_QUESTIONS.length}`;

    backBtn.classList.toggle('hidden', tnCurrentStep === 0);
    nextBtn.textContent = tnCurrentStep === TN_QUESTIONS.length - 1 ? 'Analyse ✦' : 'Continue →';

    const saved = tnAnswers[q.id] || '';

    let inputHtml = '';

    if (q.type === 'textarea') {
        inputHtml = `<textarea id="tn-input" class="tn-intake-input tn-intake-textarea" placeholder="${q.placeholder}" rows="3">${saved}</textarea>`;
    } else if (q.type === 'text') {
        inputHtml = `<input id="tn-input" class="tn-intake-input" type="text" placeholder="${q.placeholder}" value="${saved}" />`;
    } else if (q.type === 'chips') {
        inputHtml = `<div class="tn-chip-group" id="tn-chip-group">
            ${q.options.map(opt => `<button class="tn-chip ${saved === opt ? 'selected' : ''}" data-value="${opt}">${opt}</button>`).join('')}
        </div>`;
    } else if (q.type === 'colorpicker') {
        const colorChips = TN_COLOR_PRESETS.map(p => `
            <button class="tn-color-chip ${saved === p.id ? 'selected' : ''}" data-preset="${p.id}" title="${p.label}">
                <span class="tn-color-swatch" style="background:${p.swatches[0]}"></span>
                <span class="tn-color-swatch" style="background:${p.swatches[1]}"></span>
                <span class="tn-color-chip-label">${p.label}</span>
            </button>`).join('');
        inputHtml = `
            <div class="tn-color-presets" id="tn-color-preset-group">${colorChips}</div>
            <div class="tn-custom-hex-row">
                <span style="font-size:12px;color:var(--text-muted,#8888aa)">Custom accent hex:</span>
                <input id="tn-custom-hex" class="tn-hex-input" type="text" maxlength="7" placeholder="#FF0000" value="${tnCustomAccent}" />
                <span id="tn-hex-preview" class="tn-hex-preview" style="background:${tnCustomAccent || 'transparent'}"></span>
            </div>
            <p class="tn-skip-hint">Skip to let AI choose the best colour for your topic.</p>`;
    }

    container.innerHTML = `
        <div class="tn-question-card">
            <label class="tn-question-label">${q.label}</label>
            <p class="tn-question-hint">${q.hint}</p>
            ${inputHtml}
        </div>`;

    // Wire chip selection
    if (q.type === 'chips') {
        container.querySelectorAll('.tn-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                container.querySelectorAll('.tn-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            });
        });
    }

    // Wire color preset selection
    if (q.type === 'colorpicker') {
        container.querySelectorAll('.tn-color-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                container.querySelectorAll('.tn-color-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                tnSelectedColorPreset = chip.dataset.preset;
            });
        });
        const hexInput = document.getElementById('tn-custom-hex');
        const hexPreview = document.getElementById('tn-hex-preview');
        hexInput.addEventListener('input', () => {
            const val = hexInput.value;
            tnCustomAccent = val;
            hexPreview.style.background = /^#[0-9a-f]{6}$/i.test(val) ? val : 'transparent';
        });
    }
}

function tnGetCurrentAnswer() {
    const q = TN_QUESTIONS[tnCurrentStep];
    if (q.type === 'chips') {
        const selected = document.querySelector('#tn-chip-group .tn-chip.selected');
        return selected ? selected.dataset.value : '';
    }
    if (q.type === 'colorpicker') {
        const selectedPreset = document.querySelector('#tn-color-preset-group .tn-color-chip.selected');
        return selectedPreset ? selectedPreset.dataset.preset : '';
    }
    const input = document.getElementById('tn-input');
    return input ? input.value.trim() : '';
}

function tnNext() {
    const q = TN_QUESTIONS[tnCurrentStep];
    const answer = tnGetCurrentAnswer();
    if (q.required && !answer) {
        document.getElementById('tn-question-container').querySelector('.tn-question-card').classList.add('tn-shake');
        setTimeout(() => document.querySelector('.tn-question-card')?.classList.remove('tn-shake'), 500);
        return;
    }
    tnAnswers[q.id] = answer;
    if (tnCurrentStep < TN_QUESTIONS.length - 1) {
        tnCurrentStep++;
        renderTnStep();
    } else {
        // Last question done — move to analysis
        tnShowAnalysePanel();
    }
}

function tnBack() {
    if (tnCurrentStep > 0) {
        tnAnswers[TN_QUESTIONS[tnCurrentStep].id] = tnGetCurrentAnswer();
        tnCurrentStep--;
        renderTnStep();
    }
}

function tnShowAnalysePanel() {
    document.getElementById('tn-section-intake').classList.add('hidden');
    document.getElementById('tn-section-analyse').classList.remove('hidden');
    // Pre-populate summary
    const summary = document.getElementById('tn-answers-summary');
    summary.innerHTML = Object.entries(tnAnswers).filter(([, v]) => v).map(([k, v]) => {
        const q = TN_QUESTIONS.find(q => q.id === k);
        return `<div class="tn-summary-row"><span class="tn-summary-key">${q ? q.label.split('—')[0].trim() : k}</span><span class="tn-summary-val">${v}</span></div>`;
    }).join('');
}

/* ─── AI Analysis ─────────────────────────────────────────────────────── */

async function tnAnalyse() {
    const btn = document.getElementById('btn-tn-analyse');
    const statusEl = document.getElementById('tn-analyse-status');
    btn.disabled = true;
    btn.textContent = 'Analysing…';
    statusEl.textContent = 'Calling AI — assembling psychology framework…';
    statusEl.classList.remove('hidden', 'error');

    const colourPresetName = tnSelectedColorPreset
        ? TN_COLOR_PRESETS.find(p => p.id === tnSelectedColorPreset)?.label
        : tnAnswers.brandColors
            ? TN_COLOR_PRESETS.find(p => p.id === tnAnswers.brandColors)?.label
            : null;

    const payload = {
        videoTitle: tnAnswers.videoTitle || '',
        topic: tnAnswers.topicNiche || '',
        desiredEmotion: tnAnswers.desiredEmotion || 'Curious',
        subjectPreference: tnAnswers.subjectPreference || '',
        headlineText: tnAnswers.headlineText || '',
        subtextText: tnAnswers.subtextText || '',
        colorPreset: colourPresetName,
        customAccentHex: tnCustomAccent || null
    };

    try {
        const res = await fetch('/thumbnail-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Server error');

        tnAnalysis = data;
        tnSelectedGap = data.curiosityGap;
        tnSelectedExpression = data.expressionUsed;

        statusEl.classList.add('hidden');
        renderTnAnalysisPanel();
    } catch (err) {
        statusEl.textContent = '✗ ' + err.message;
        statusEl.classList.add('error');
    } finally {
        btn.disabled = false;
        btn.textContent = '✦ Analyse';
    }
}

function renderTnAnalysisPanel() {
    document.getElementById('tn-section-analyse').classList.add('hidden');
    const panel = document.getElementById('tn-section-results');
    panel.classList.remove('hidden');

    const a = tnAnalysis;
    const loop = LOOP_COLORS[a.loopType] || { label: a.loopType, color: '#7c5cfc', desc: '' };

    // Loop badge
    document.getElementById('tn-loop-badge').innerHTML = `
        <div class="tn-loop-badge" style="--loop-color:${loop.color}">
            <span class="tn-loop-type">${loop.label}</span>
            <span class="tn-loop-desc">${loop.desc}</span>
        </div>
        <div class="tn-triggers">
            ${a.attentionTriggers.map(t => `<span class="tn-trigger-chip">${t}</span>`).join('')}
        </div>`;

    // 2-second test + contrast warning
    const tests = document.getElementById('tn-quality-checks');
    tests.innerHTML = `
        <div class="tn-quality-badge ${a.twoSecondTestPass ? 'pass' : 'fail'}">
            ${a.twoSecondTestPass ? '✓ 2-Second Test Passed' : '⚠ 2-Second Test: ' + a.twoSecondTestNote}
        </div>
        ${a.contrastWarning ? `<div class="tn-contrast-warning">⚠ ${a.contrastWarning}</div>` : ''}`;

    // Override selectors
    renderTnGapPicker();
    renderTnStylePicker();
    renderTnExpressionPicker();
    renderTnColorPicker();

    // Prompt previews
    renderTnPromptPreviews();

    // Wire generate button
    document.getElementById('tn-gen-section').classList.remove('hidden');
}

/* ─── Override Selectors ──────────────────────────────────────────────── */

function renderTnGapPicker() {
    const el = document.getElementById('tn-gap-picker');
    el.innerHTML = TN_CURIOSITY_GAPS.map(g => `
        <button class="tn-selector-chip ${tnSelectedGap === g.id ? 'selected' : ''}" data-gap="${g.id}" title="${g.desc}">
            <span class="tn-sel-icon">${g.icon}</span>
            <span class="tn-sel-label">${g.label}</span>
        </button>`).join('');
    el.querySelectorAll('[data-gap]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.querySelectorAll('[data-gap]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tnSelectedGap = btn.dataset.gap;
        });
    });
}

function renderTnStylePicker() {
    const el = document.getElementById('tn-style-picker');
    el.innerHTML = TN_STYLES.map(s => `
        <button class="tn-selector-chip ${tnSelectedStyle === s.id ? 'selected' : ''}" data-style="${s.id}" title="${s.desc}">
            <span class="tn-sel-label">${s.label}</span>
        </button>`).join('');
    el.querySelectorAll('[data-style]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.querySelectorAll('[data-style]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tnSelectedStyle = btn.dataset.style;
        });
    });
}

function renderTnExpressionPicker() {
    const el = document.getElementById('tn-expression-picker');
    el.innerHTML = TN_EXPRESSIONS.map(e => `
        <button class="tn-expr-chip ${tnSelectedExpression && tnSelectedExpression.includes(e.id) ? 'selected' : ''}" data-expr="${e.id}" title="${e.intent}">
            <span class="tn-expr-emoji">${e.emoji}</span>
            <span class="tn-expr-label">${e.label}</span>
        </button>`).join('');
    el.querySelectorAll('[data-expr]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.querySelectorAll('[data-expr]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tnSelectedExpression = btn.dataset.expr;
        });
    });
}

function renderTnColorPicker() {
    const el = document.getElementById('tn-result-color-picker');
    el.innerHTML = TN_COLOR_PRESETS.map(p => `
        <button class="tn-color-result-chip ${tnSelectedColorPreset === p.id ? 'selected' : ''}" data-preset="${p.id}" title="${p.label}">
            <span class="tn-color-swatch" style="background:${p.swatches[0]}"></span>
            <span class="tn-color-swatch" style="background:${p.swatches[1]}"></span>
            <span class="tn-color-chip-label">${p.label}</span>
        </button>`).join('');
    el.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tnSelectedColorPreset = btn.dataset.preset;
        });
    });
}

/* ─── Prompt Previews ─────────────────────────────────────────────────── */

function renderTnPromptPreviews() {
    const a = tnAnalysis;
    document.getElementById('tn-prompt-offset').value = a.prompts.offset || '';
    document.getElementById('tn-prompt-centered').value = a.prompts.centered || '';
    document.getElementById('tn-prompt-split').value = a.prompts.splitScreen || '';

    // Tab switching
    document.querySelectorAll('.tn-prompt-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tn-prompt-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            ['tn-prompt-offset', 'tn-prompt-centered', 'tn-prompt-split'].forEach(id =>
                document.getElementById(id).classList.add('hidden'));
            document.getElementById('tn-prompt-' + tab.dataset.layout).classList.remove('hidden');
        });
    });

    // Export .md buttons
    document.querySelectorAll('[data-export-layout]').forEach(btn => {
        btn.addEventListener('click', () => {
            const layout = btn.dataset.exportLayout;
            const promptEl = document.getElementById('tn-prompt-' + layout);
            if (!promptEl?.value.trim()) return;
            const now = new Date();
            const dp = now.toISOString().slice(0, 10).replace(/-/g, '');
            const tp = now.toTimeString().slice(0, 5).replace(':', '');
            const slug = (tnAnswers.videoTitle || 'thumbnail').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join('-');
            const filename = `${dp}_${tp}_thumbnail_${layout}_${slug}.md`;
            const content = `# Thumbnail Prompt — ${layout.charAt(0).toUpperCase() + layout.slice(1)}\n\n> Video: ${tnAnswers.videoTitle || ''}\n> Generated: ${now.toLocaleString()}\n\n---\n\n${promptEl.value.trim()}\n`;
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
        });
    });
}

/* ─── Generation ──────────────────────────────────────────────────────── */

async function tnGenerate() {
    const btn = document.getElementById('btn-tn-generate');
    btn.disabled = true;
    btn.textContent = '⏳ Generating 3 variants…';

    // Clear previous results
    tnGenResults = { offset: null, centered: null, splitScreen: null };
    Object.values(tnPollingIntervals).forEach(clearInterval);
    Object.values(tnPollingTimeouts).forEach(clearTimeout);
    tnPollingIntervals = {}; tnPollingTimeouts = {};

    const grid = document.getElementById('tn-gen-grid');
    grid.classList.remove('hidden');
    ['offset', 'centered', 'split'].forEach(key => {
        const slot = document.getElementById(`tn-slot-${key}`);
        if (slot) {
            slot.innerHTML = `<div class="tn-slot-loading"><div class="tn-slot-spinner"></div><p>${key === 'split' ? 'Split Screen' : key.charAt(0).toUpperCase() + key.slice(1)}</p></div>`;
        }
    });

    const layouts = [
        { key: 'offset', promptId: 'tn-prompt-offset', slotId: 'tn-slot-offset' },
        { key: 'centered', promptId: 'tn-prompt-centered', slotId: 'tn-slot-centered' },
        { key: 'split', promptId: 'tn-prompt-split', slotId: 'tn-slot-split' }
    ];

    for (const layout of layouts) {
        const prompt = document.getElementById(layout.promptId)?.value.trim();
        if (!prompt) continue;
        try {
            const res = await fetch('/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, resolution: '2K', aspectRatio: '16:9', outputFormat: 'png' })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            tnPollSlot(layout.key, data.taskId, layout.slotId);
        } catch (err) {
            const slot = document.getElementById(layout.slotId);
            if (slot) slot.innerHTML = `<div class="tn-slot-error">✗ ${err.message}</div>`;
        }
    }

    btn.disabled = false;
    btn.textContent = '⚡ Regenerate';
}

function tnPollSlot(key, taskId, slotId) {
    const MESSAGES = ['Sending to Nano Banana…', 'Processing…', 'Almost there…', 'Finalising…'];
    let msgIdx = 0;
    let elapsed = 0;

    tnPollingIntervals[key] = setInterval(async () => {
        elapsed++;
        const slot = document.getElementById(slotId);
        if (!slot) return;
        const msgEl = slot.querySelector('p');
        if (msgEl && elapsed % 5 === 0) { msgEl.textContent = MESSAGES[Math.min(msgIdx++, MESSAGES.length - 1)]; }

        try {
            const res = await fetch(`/task-status/${taskId}`);
            const data = await res.json();
            if (data.state === 'success') {
                clearInterval(tnPollingIntervals[key]);
                clearTimeout(tnPollingTimeouts[key]);
                tnGenResults[key] = data.imageUrl;
                tnRenderSlotSuccess(slotId, key, data.imageUrl);
            } else if (data.state === 'fail') {
                clearInterval(tnPollingIntervals[key]);
                clearTimeout(tnPollingTimeouts[key]);
                if (slot) slot.innerHTML = `<div class="tn-slot-error">✗ ${data.failMsg || 'Generation failed'}</div>`;
            }
        } catch {/* retry next tick */ }
    }, 4000);

    tnPollingTimeouts[key] = setTimeout(() => {
        clearInterval(tnPollingIntervals[key]);
        const slot = document.getElementById(slotId);
        if (slot) slot.innerHTML = `<div class="tn-slot-error">⏱ Timed out — try regenerating</div>`;
    }, 180000);
}

function tnRenderSlotSuccess(slotId, key, imageUrl) {
    const layoutLabel = key === 'split' ? 'Split Screen' : key.charAt(0).toUpperCase() + key.slice(1);
    const slot = document.getElementById(slotId);
    if (!slot) return;
    slot.innerHTML = `
        <img class="tn-slot-img" src="${imageUrl}" alt="${layoutLabel} thumbnail" style="cursor:zoom-in;" />
        <div class="tn-slot-footer">
            <span class="tn-slot-label">${layoutLabel}</span>
            <div class="tn-slot-actions">
                <button class="btn-secondary" style="font-size:12px;padding:6px 12px;" data-tn-download="${key}">↓ Download</button>
            </div>
        </div>`;

    slot.querySelector(`[data-tn-download]`).addEventListener('click', () => {
        const now = new Date();
        const dp = now.toISOString().slice(0, 10).replace(/-/g, '');
        const tp = now.toTimeString().slice(0, 5).replace(':', '');
        const slug = (tnAnswers.videoTitle || 'thumbnail').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 3).join('-');
        const filename = `${dp}_${tp}_thumbnail_${key}_${slug}.png`;
        window.location.href = `/download?url=${encodeURIComponent(imageUrl)}&filename=${filename}`;
    });

    slot.querySelector('.tn-slot-img').addEventListener('click', () => {
        if (typeof openImageModal === 'function') {
            const now = new Date();
            const dp = now.toISOString().slice(0, 10).replace(/-/g, '');
            const tp = now.toTimeString().slice(0, 5).replace(':', '');
            const slug = (tnAnswers.videoTitle || 'thumbnail').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 3).join('-');
            openImageModal(imageUrl, `${dp}_${tp}_thumbnail_${key}_${slug}.png`);
        }
    });
}

/* ─── Template Memory ─────────────────────────────────────────────────── */

function tnSaveTemplate() {
    if (!tnAnalysis) return;
    const name = prompt('Name this template (e.g. "Zionix Beginner Woman"):');
    if (!name?.trim()) return;
    const tpl = {
        id: `tpl-${Date.now()}`,
        name: name.trim(),
        answers: { ...tnAnswers },
        analysis: { ...tnAnalysis },
        colorPreset: tnSelectedColorPreset,
        customAccent: tnCustomAccent,
        savedAt: new Date().toISOString()
    };
    tnSavedTemplates.unshift(tpl);
    localStorage.setItem('tn_templates', JSON.stringify(tnSavedTemplates));
    renderTnTemplateList();
}

function renderTnTemplateList() {
    const el = document.getElementById('tn-template-list');
    if (!el) return;
    if (tnSavedTemplates.length === 0) {
        el.innerHTML = '<p class="tn-no-templates">No saved templates yet. Analyse + generate a thumbnail, then save it.</p>';
        return;
    }
    el.innerHTML = tnSavedTemplates.map((t, i) => `
        <div class="tn-template-chip">
            <span class="tn-template-name">${t.name}</span>
            <span class="tn-template-date">${new Date(t.savedAt).toLocaleDateString()}</span>
            <button class="btn-secondary" style="font-size:11px;padding:4px 10px;" data-load-tpl="${i}">Load</button>
            <button class="btn-secondary" style="font-size:11px;padding:4px 10px;color:var(--color-error);" data-del-tpl="${i}">✕</button>
        </div>`).join('');

    el.querySelectorAll('[data-load-tpl]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tpl = tnSavedTemplates[parseInt(btn.dataset.loadTpl)];
            tnAnswers = { ...tpl.answers };
            tnAnalysis = { ...tpl.analysis };
            tnSelectedColorPreset = tpl.colorPreset;
            tnCustomAccent = tpl.customAccent || '';
            tnCurrentStep = TN_QUESTIONS.length - 1;
            document.getElementById('tn-section-intake').classList.add('hidden');
            document.getElementById('tn-section-analyse').classList.add('hidden');
            document.getElementById('tn-section-results').classList.remove('hidden');
            renderTnAnalysisPanel();
        });
    });

    el.querySelectorAll('[data-del-tpl]').forEach(btn => {
        btn.addEventListener('click', () => {
            tnSavedTemplates.splice(parseInt(btn.dataset.delTpl), 1);
            localStorage.setItem('tn_templates', JSON.stringify(tnSavedTemplates));
            renderTnTemplateList();
        });
    });
}

/* ─── Utilities ───────────────────────────────────────────────────────── */

function tnReset() {
    tnCurrentStep = 0;
    tnAnswers = {};
    tnAnalysis = null;
    tnSelectedGap = null;
    tnSelectedStyle = null;
    tnSelectedExpression = null;
    tnSelectedColorPreset = null;
    tnCustomAccent = '';
    tnGenResults = { offset: null, centered: null, splitScreen: null };
    Object.values(tnPollingIntervals).forEach(clearInterval);
    Object.values(tnPollingTimeouts).forEach(clearTimeout);
    tnPollingIntervals = {}; tnPollingTimeouts = {};

    document.getElementById('tn-section-intake').classList.remove('hidden');
    document.getElementById('tn-section-analyse').classList.add('hidden');
    document.getElementById('tn-section-results').classList.add('hidden');
    document.getElementById('tn-gen-grid').classList.add('hidden');
    renderTnStep();
}

// Self-initialise — this script loads after app.js so init() has already run
initThumbnailsTab();

