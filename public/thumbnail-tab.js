/* ═══════════════════════════════════════════════════════════════════════
   THUMBNAILS TAB — thumbnail-tab.js
   2-Step flow: raw idea input → AI hook analysis → selection panel → generate
═══════════════════════════════════════════════════════════════════════ */

/* ─── Constants ───────────────────────────────────────────────────────── */

const TN_FEELINGS = ['Curious', 'Shocked', 'Inspired', 'Concerned', 'Excited', 'Confident'];

const TN_PEOPLE_OPTIONS = ['Yes — Woman', 'Yes — Man', 'Yes — Couple', 'No — Symbolic only'];

const TN_COLOR_PRESETS = [
    { id: 'teal_authority', label: 'Teal Authority', bg: '#001213', accent: '#219da0', swatches: ['#001213', '#219da0', '#ffffff'] },
    { id: 'hypno_magenta', label: 'Hypno Magenta', bg: '#0a0010', accent: '#d63384', swatches: ['#0a0010', '#d63384', '#ffffff'] },
    { id: 'gold_authority', label: 'Gold Authority', bg: '#0d0d0d', accent: '#c9a84c', swatches: ['#0d0d0d', '#c9a84c', '#ffffff'] },
    { id: 'power_red', label: 'Power Red', bg: '#0a0000', accent: '#e63946', swatches: ['#0a0000', '#e63946', '#ffffff'] },
    { id: 'calm_purple', label: 'Calm Purple', bg: '#0f0020', accent: '#7b2fbe', swatches: ['#0f0020', '#7b2fbe', '#ffffff'] },
    { id: 'clean_white', label: 'Clean White', bg: '#ffffff', accent: '#1a1a2e', swatches: ['#ffffff', '#1a1a2e', '#333333'] },
    { id: 'warm_amber', label: 'Warm Amber', bg: '#1a0f00', accent: '#f4a261', swatches: ['#1a0f00', '#f4a261', '#ffffff'] }
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

const LOOP_COLORS = {
    desire: { label: 'Desire Loop', color: '#4A9EF5', desc: 'Pain point + Solution — show the end state' },
    interest: { label: 'Interest Loop', color: '#9D50BB', desc: 'Entertainment / Curiosity — show the tension' },
    aspiration: { label: 'Aspiration Loop', color: '#F4A261', desc: 'Motivation / Coaching — show the after state' },
    fear: { label: 'Fear Loop', color: '#E63946', desc: 'Warning / Risk — show the before state' }
};

/* ─── State ───────────────────────────────────────────────────────────── */

let tnRawIdea = '';
let tnIdeaResult = null;           // response from /thumbnail-idea
let tnAnalysis = null;             // response from /thumbnail-prompt

// User selections
let tnSelectedHook = null;         // { category, text }
let tnSelectedFeeling = null;
let tnSelectedPerson = null;
let tnSelectedColorPreset = null;
let tnCustomAccent = '';
let tnHeadline = '';
let tnSubtext = '';

// Results overrides (post-analysis)
let tnSelectedGap = null;
let tnSelectedStyle = null;
let tnSelectedExpression = null;

// Reference image
let tnReferenceImageBase64 = null;
let tnReferenceImageMime = null;

// Generation
let tnGenResults = { offset: null, centered: null, splitScreen: null };
let tnPollingIntervals = {};
let tnPollingTimeouts = {};
let tnSavedTemplates = [];

/* ─── Initialise ──────────────────────────────────────────────────────── */

function initThumbnailsTab() {
    tnSavedTemplates = JSON.parse(localStorage.getItem('tn_templates') || '[]');
    renderTnIdea();
    document.getElementById('btn-tn-analyse-idea').addEventListener('click', tnAnalyseIdea);
    document.getElementById('btn-tn-build').addEventListener('click', tnBuildAndGenerate);
    document.getElementById('btn-tn-reset-idea').addEventListener('click', tnReset);
    document.getElementById('btn-tn-reset-results').addEventListener('click', tnReset);
    document.getElementById('btn-tn-generate').addEventListener('click', tnGenerate);
    document.getElementById('btn-tn-save-template').addEventListener('click', tnSaveTemplate);
    renderTnTemplateList();
}

/* ─── STEP 1 — Raw Idea Input ─────────────────────────────────────────── */

function renderTnIdea() {
    const el = document.getElementById('tn-idea-input');
    if (el) el.value = tnRawIdea;
}

async function tnAnalyseIdea() {
    const textarea = document.getElementById('tn-idea-input');
    const rawIdea = textarea?.value.trim();
    if (!rawIdea) {
        textarea?.classList.add('tn-shake');
        setTimeout(() => textarea?.classList.remove('tn-shake'), 500);
        return;
    }
    tnRawIdea = rawIdea;

    const btn = document.getElementById('btn-tn-analyse-idea');
    const statusEl = document.getElementById('tn-idea-status');
    btn.disabled = true;
    btn.textContent = 'Analysing your idea…';
    statusEl.textContent = 'Reading your idea and matching hooks from the library…';
    statusEl.classList.remove('hidden', 'error');

    try {
        const res = await fetch('/thumbnail-idea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawIdea })
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Server error');

        tnIdeaResult = data;
        // Pre-fill selections from AI suggestions
        tnSelectedHook = data.hooks[0];         // first hook pre-selected
        tnSelectedFeeling = data.recommendedFeeling;
        tnHeadline = data.headlineSuggestion || '';
        tnSubtext = data.subtextSuggestion || '';

        statusEl.classList.add('hidden');
        renderTnSelectionPanel();
    } catch (err) {
        statusEl.textContent = '✗ ' + err.message;
        statusEl.classList.add('error');
    } finally {
        btn.disabled = false;
        btn.textContent = '✦ Analyse My Idea';
    }
}

/* ─── STEP 2 — Selection Panel ────────────────────────────────────────── */

function renderTnSelectionPanel() {
    document.getElementById('tn-section-idea').classList.add('hidden');
    const panel = document.getElementById('tn-section-selection');
    panel.classList.remove('hidden');

    renderHookPicker();
    renderFeelingPicker();
    renderPersonPicker();
    renderTnColorPicker();
    renderHeadlineFields();
}

function renderHookPicker() {
    const el = document.getElementById('tn-hook-picker');
    if (!el || !tnIdeaResult?.hooks) return;

    el.innerHTML = tnIdeaResult.hooks.map((hook, i) => `
        <div class="tn-hook-card ${i === 0 ? 'selected' : ''}" data-hook-idx="${i}" tabindex="0" role="radio" aria-checked="${i === 0}">
            <span class="tn-hook-category">${hook.category}</span>
            <p class="tn-hook-text" id="tn-hook-text-${i}">${escHtml(hook.text)}</p>
            <textarea class="tn-hook-edit tn-intake-input tn-intake-textarea" rows="2"
                id="tn-hook-edit-${i}" placeholder="Edit hook text…">${escHtml(hook.text)}</textarea>
        </div>`).join('');

    // Wire card clicks
    el.querySelectorAll('.tn-hook-card').forEach(card => {
        card.addEventListener('click', () => {
            el.querySelectorAll('.tn-hook-card').forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('selected');
            card.setAttribute('aria-checked', 'true');
            const idx = parseInt(card.dataset.hookIdx);
            const editEl = document.getElementById(`tn-hook-edit-${idx}`);
            tnSelectedHook = {
                category: tnIdeaResult.hooks[idx].category,
                text: editEl?.value || tnIdeaResult.hooks[idx].text
            };
        });
        // Keep edit textarea in sync with selection state
        const idx = parseInt(card.dataset.hookIdx);
        const editEl = document.getElementById(`tn-hook-edit-${idx}`);
        editEl?.addEventListener('input', () => {
            if (card.classList.contains('selected')) {
                tnSelectedHook = { category: tnIdeaResult.hooks[idx].category, text: editEl.value };
            }
        });
        // Prevent card click when clicking textarea
        editEl?.addEventListener('click', e => e.stopPropagation());
    });

    // Sync initial selected hook text (first card)
    const firstEdit = document.getElementById('tn-hook-edit-0');
    firstEdit?.addEventListener('input', () => {
        if (tnSelectedHook && tnIdeaResult.hooks[0]) {
            tnSelectedHook = { category: tnIdeaResult.hooks[0].category, text: firstEdit.value };
        }
    });
}

function renderFeelingPicker() {
    const el = document.getElementById('tn-feeling-picker');
    if (!el) return;
    el.innerHTML = TN_FEELINGS.map(f => `
        <button class="tn-chip ${tnSelectedFeeling === f ? 'selected' : ''}" data-feeling="${f}">${f}</button>`).join('');
    el.querySelectorAll('[data-feeling]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.querySelectorAll('[data-feeling]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tnSelectedFeeling = btn.dataset.feeling;
        });
    });
}

function renderPersonPicker() {
    const el = document.getElementById('tn-person-picker');
    if (!el) return;
    el.innerHTML = TN_PEOPLE_OPTIONS.map(opt => `
        <button class="tn-chip ${tnSelectedPerson === opt ? 'selected' : ''}" data-person="${escHtml(opt)}">${opt}</button>`).join('');
    el.querySelectorAll('[data-person]').forEach(btn => {
        btn.addEventListener('click', () => {
            el.querySelectorAll('[data-person]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tnSelectedPerson = btn.dataset.person;
            const isPersonSelected = !tnSelectedPerson.startsWith('No');
            tnToggleReferenceUpload(isPersonSelected);
        });
    });
}

function renderTnColorPicker() {
    const el = document.getElementById('tn-color-picker');
    if (!el) return;
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

    // Custom hex
    const hexInput = document.getElementById('tn-custom-hex');
    const hexPreview = document.getElementById('tn-hex-preview');
    if (hexInput) {
        hexInput.addEventListener('input', () => {
            tnCustomAccent = hexInput.value;
            if (hexPreview) hexPreview.style.background = /^#[0-9a-f]{6}$/i.test(tnCustomAccent) ? tnCustomAccent : 'transparent';
        });
    }
}

function renderHeadlineFields() {
    const headlineEl = document.getElementById('tn-headline-input');
    const subtextEl = document.getElementById('tn-subtext-input');
    if (headlineEl) {
        headlineEl.value = tnHeadline;
        headlineEl.addEventListener('input', () => { tnHeadline = headlineEl.value; });
    }
    if (subtextEl) {
        subtextEl.value = tnSubtext;
        subtextEl.addEventListener('input', () => { tnSubtext = subtextEl.value; });
    }
}

/* ─── Build & Analyse → then Generate ────────────────────────────────── */

async function tnBuildAndGenerate() {
    const btn = document.getElementById('btn-tn-build');
    const statusEl = document.getElementById('tn-selection-status');
    btn.disabled = true;
    btn.textContent = 'Building prompts…';
    statusEl.textContent = 'AI assembling 3 prompt variations…';
    statusEl.classList.remove('hidden', 'error');

    // Sync editable fields
    const headlineEl = document.getElementById('tn-headline-input');
    const subtextEl = document.getElementById('tn-subtext-input');
    tnHeadline = headlineEl?.value.trim() || '';
    tnSubtext = subtextEl?.value.trim() || '';

    // Sync selected hook text
    const selectedCard = document.querySelector('.tn-hook-card.selected');
    if (selectedCard) {
        const idx = parseInt(selectedCard.dataset.hookIdx);
        const editEl = document.getElementById(`tn-hook-edit-${idx}`);
        tnSelectedHook = {
            category: tnIdeaResult?.hooks[idx]?.category || '',
            text: editEl?.value || tnIdeaResult?.hooks[idx]?.text || ''
        };
    }

    const colourPresetName = tnSelectedColorPreset
        ? TN_COLOR_PRESETS.find(p => p.id === tnSelectedColorPreset)?.label
        : null;

    const payload = {
        videoTitle: tnSelectedHook?.text || tnRawIdea,
        topic: tnIdeaResult?.topic || tnRawIdea,
        desiredEmotion: tnSelectedFeeling || 'Curious',
        subjectPreference: tnSelectedPerson || 'No — Symbolic only',
        headlineText: tnHeadline,
        subtextText: tnSubtext,
        colorPreset: colourPresetName,
        customAccentHex: tnCustomAccent || null,
        referenceImageBase64: tnReferenceImageBase64 || null,
        referenceImageMime: tnReferenceImageMime || null
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
        btn.textContent = '✦ Build Prompts & Generate';
    }
}

/* ─── Results Panel (Analysis, Overrides, Prompts) ───────────────────── */

function renderTnAnalysisPanel() {
    document.getElementById('tn-section-selection').classList.add('hidden');
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

    // Quality checks
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
    renderTnResultColorPicker();

    // Prompt previews
    renderTnPromptPreviews();

    // Show generate button
    document.getElementById('tn-gen-section').classList.remove('hidden');
}

/* ─── Override Selectors (Results panel) ─────────────────────────────── */

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

function renderTnResultColorPicker() {
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

    document.querySelectorAll('.tn-prompt-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tn-prompt-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            ['tn-prompt-offset', 'tn-prompt-centered', 'tn-prompt-split'].forEach(id =>
                document.getElementById(id).classList.add('hidden'));
            document.getElementById('tn-prompt-' + tab.dataset.layout).classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-export-layout]').forEach(btn => {
        btn.addEventListener('click', () => {
            const layout = btn.dataset.exportLayout;
            const promptEl = document.getElementById('tn-prompt-' + layout);
            if (!promptEl?.value.trim()) return;
            const now = new Date();
            const dp = now.toISOString().slice(0, 10).replace(/-/g, '');
            const tp = now.toTimeString().slice(0, 5).replace(':', '');
            const slug = (tnSelectedHook?.text || tnRawIdea).toLowerCase()
                .replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join('-');
            const filename = `${dp}_${tp}_thumbnail_${layout}_${slug}.md`;
            const content = `# Thumbnail Prompt — ${layout.charAt(0).toUpperCase() + layout.slice(1)}\n\n> Hook: ${tnSelectedHook?.text || ''}\n> Generated: ${now.toLocaleString()}\n\n---\n\n${promptEl.value.trim()}\n`;
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

    tnGenResults = { offset: null, centered: null, splitScreen: null };
    Object.values(tnPollingIntervals).forEach(clearInterval);
    Object.values(tnPollingTimeouts).forEach(clearTimeout);
    tnPollingIntervals = {}; tnPollingTimeouts = {};

    const grid = document.getElementById('tn-gen-grid');
    grid.classList.remove('hidden');
    ['offset', 'centered', 'split'].forEach(key => {
        const slot = document.getElementById(`tn-slot-${key}`);
        if (slot) slot.innerHTML = `<div class="tn-slot-loading"><div class="tn-slot-spinner"></div><p>${key === 'split' ? 'Split Screen' : key.charAt(0).toUpperCase() + key.slice(1)}</p></div>`;
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
                body: JSON.stringify({
                    prompt, resolution: '2K', aspectRatio: '16:9', outputFormat: 'png',
                    referenceImageBase64: tnReferenceImageBase64 || null,
                    referenceImageMime: tnReferenceImageMime || null
                })
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
    let msgIdx = 0; let elapsed = 0;

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

    slot.querySelector('[data-tn-download]').addEventListener('click', () => {
        const now = new Date();
        const dp = now.toISOString().slice(0, 10).replace(/-/g, '');
        const tp = now.toTimeString().slice(0, 5).replace(':', '');
        const slug = (tnSelectedHook?.text || tnRawIdea).toLowerCase()
            .replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 3).join('-');
        window.location.href = `/download?url=${encodeURIComponent(imageUrl)}&filename=${dp}_${tp}_thumbnail_${key}_${slug}.png`;
    });

    slot.querySelector('.tn-slot-img').addEventListener('click', () => {
        if (typeof openImageModal === 'function') {
            const now = new Date();
            const dp = now.toISOString().slice(0, 10).replace(/-/g, '');
            const tp = now.toTimeString().slice(0, 5).replace(':', '');
            const slug = (tnSelectedHook?.text || tnRawIdea).toLowerCase()
                .replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 3).join('-');
            openImageModal(imageUrl, `${dp}_${tp}_thumbnail_${key}_${slug}.png`);
        }
    });
}

/* ─── Reference Image Upload ──────────────────────────────────────────── */

function tnToggleReferenceUpload(show) {
    const existing = document.getElementById('tn-ref-upload-zone');
    if (!show) {
        if (existing) existing.remove();
        tnReferenceImageBase64 = null;
        tnReferenceImageMime = null;
        return;
    }
    if (existing) return;

    const zone = document.createElement('div');
    zone.id = 'tn-ref-upload-zone';
    zone.className = 'tn-ref-upload-zone';
    zone.innerHTML = `
        <input type="file" id="tn-ref-file-input" accept="image/png,image/jpeg,image/webp" style="display:none" />
        <div id="tn-ref-drop" class="tn-ref-drop">
            <span class="tn-ref-icon">🖼</span>
            <p class="tn-ref-label">Upload a reference photo <span class="tn-ref-optional">(optional)</span></p>
            <p class="tn-ref-hint">AI will describe their likeness and bake it into all 3 prompts</p>
            <button class="btn-secondary" id="btn-tn-ref-browse" style="font-size:12px;padding:6px 14px;">Browse…</button>
        </div>
        <div id="tn-ref-preview" class="tn-ref-preview hidden">
            <img id="tn-ref-preview-img" alt="Reference photo" />
            <div class="tn-ref-preview-info">
                <span id="tn-ref-preview-name" class="tn-ref-name"></span>
                <button class="btn-secondary" id="btn-tn-ref-remove" style="font-size:11px;padding:4px 10px;">✕ Remove</button>
            </div>
        </div>`;

    const personSection = document.getElementById('tn-person-picker');
    if (personSection?.parentElement) personSection.parentElement.appendChild(zone);

    document.getElementById('btn-tn-ref-browse').addEventListener('click', () =>
        document.getElementById('tn-ref-file-input').click());
    document.getElementById('tn-ref-file-input').addEventListener('change', e => {
        const file = e.target.files?.[0];
        if (file) tnLoadReferenceFile(file);
    });

    const dropTarget = document.getElementById('tn-ref-drop');
    dropTarget.addEventListener('dragover', e => { e.preventDefault(); dropTarget.classList.add('drag-over'); });
    dropTarget.addEventListener('dragleave', () => dropTarget.classList.remove('drag-over'));
    dropTarget.addEventListener('drop', e => {
        e.preventDefault();
        dropTarget.classList.remove('drag-over');
        const file = e.dataTransfer.files?.[0];
        if (file) tnLoadReferenceFile(file);
    });

    document.getElementById('btn-tn-ref-remove')?.addEventListener('click', () => {
        tnReferenceImageBase64 = null;
        tnReferenceImageMime = null;
        document.getElementById('tn-ref-drop').classList.remove('hidden');
        document.getElementById('tn-ref-preview').classList.add('hidden');
        document.getElementById('tn-ref-file-input').value = '';
    });
}

function tnLoadReferenceFile(file) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10 MB'); return; }
    const reader = new FileReader();
    reader.onload = e => {
        const dataUrl = e.target.result;
        tnReferenceImageBase64 = dataUrl.split(',')[1];
        tnReferenceImageMime = file.type;
        document.getElementById('tn-ref-drop').classList.add('hidden');
        const preview = document.getElementById('tn-ref-preview');
        preview.classList.remove('hidden');
        document.getElementById('tn-ref-preview-img').src = dataUrl;
        document.getElementById('tn-ref-preview-name').textContent = file.name;
    };
    reader.readAsDataURL(file);
}

/* ─── Template Memory ─────────────────────────────────────────────────── */

function tnSaveTemplate() {
    if (!tnAnalysis) return;
    const name = prompt('Name this template (e.g. "Bold Woman Offset" or "Minimalist Dark"):');
    if (!name?.trim()) return;
    const tpl = {
        id: `tpl-${Date.now()}`,
        name: name.trim(),
        rawIdea: tnRawIdea,
        ideaResult: tnIdeaResult,
        selectedHook: tnSelectedHook,
        selectedFeeling: tnSelectedFeeling,
        selectedPerson: tnSelectedPerson,
        colorPreset: tnSelectedColorPreset,
        customAccent: tnCustomAccent,
        headline: tnHeadline,
        subtext: tnSubtext,
        analysis: { ...tnAnalysis },
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
        el.innerHTML = '<p class="tn-no-templates">No saved templates yet. Build & generate a thumbnail, then save it.</p>';
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
            tnRawIdea = tpl.rawIdea || '';
            tnIdeaResult = tpl.ideaResult || null;
            tnSelectedHook = tpl.selectedHook || null;
            tnSelectedFeeling = tpl.selectedFeeling || null;
            tnSelectedPerson = tpl.selectedPerson || null;
            tnSelectedColorPreset = tpl.colorPreset || null;
            tnCustomAccent = tpl.customAccent || '';
            tnHeadline = tpl.headline || '';
            tnSubtext = tpl.subtext || '';
            tnAnalysis = { ...tpl.analysis };
            document.getElementById('tn-section-idea').classList.add('hidden');
            document.getElementById('tn-section-selection').classList.add('hidden');
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

/* ─── Reset ───────────────────────────────────────────────────────────── */

function tnReset() {
    tnRawIdea = '';
    tnIdeaResult = null;
    tnAnalysis = null;
    tnSelectedHook = null;
    tnSelectedFeeling = null;
    tnSelectedPerson = null;
    tnSelectedColorPreset = null;
    tnCustomAccent = '';
    tnHeadline = '';
    tnSubtext = '';
    tnSelectedGap = null;
    tnSelectedStyle = null;
    tnSelectedExpression = null;
    tnReferenceImageBase64 = null;
    tnReferenceImageMime = null;
    tnGenResults = { offset: null, centered: null, splitScreen: null };
    Object.values(tnPollingIntervals).forEach(clearInterval);
    Object.values(tnPollingTimeouts).forEach(clearTimeout);
    tnPollingIntervals = {}; tnPollingTimeouts = {};

    document.getElementById('tn-section-idea').classList.remove('hidden');
    document.getElementById('tn-section-selection').classList.add('hidden');
    document.getElementById('tn-section-results').classList.add('hidden');
    document.getElementById('tn-gen-grid').classList.add('hidden');
    renderTnIdea();
}

/* ─── Utilities ───────────────────────────────────────────────────────── */

function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Self-initialise — this script loads after app.js so init() has already run
initThumbnailsTab();
