/**
 * circuit.js — Animated circuit-board background
 *
 * Grid-snapped pulses travel in cardinal directions,
 * leave fading trails, glow at endpoints, and branch
 * when they finish to grow an organic circuit trace.
 *
 * Layers beneath all body content via z-index: -1.
 */
(function () {
    /* ── Canvas setup ──────────────────────────────── */
    const canvas = document.createElement('canvas');
    canvas.id = 'circuit-canvas';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        pointerEvents: 'none',
    });
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── Config ────────────────────────────────────── */
    const GRID = 50;    // grid cell size (px)
    const PULSE_SPEED = 2.0;   // px per frame
    const MAX_PULSES = 9;     // concurrent growing pulses
    const SEG_LIFE = 180;   // frames a finished segment stays visible
    const DOT_LIFE = SEG_LIFE * 1.4;
    const SPAWN_RATE = 40;    // spawn a new root pulse every N frames

    const DIRS = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ];

    // Theme palette — pink / purple / teal accent
    const PALETTE = [
        { r: 233, g: 30, b: 140 },   // hot pink
        { r: 233, g: 30, b: 140 },   // hot pink (weighted higher)
        { r: 171, g: 71, b: 188 },   // purple
        { r: 134, g: 181, b: 192 },   // teal accent
    ];

    /* ── Helpers ───────────────────────────────────── */
    function snap(v) { return Math.round(v / GRID) * GRID; }
    function randDir() { return DIRS[Math.floor(Math.random() * DIRS.length)]; }
    function randColor() { return PALETTE[Math.floor(Math.random() * PALETTE.length)]; }
    function rgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }

    /* ── Data stores ───────────────────────────────── */
    const pulses = [];   // active growing pulses
    const segments = [];   // completed (fading) segments

    /* ── Pulse class ───────────────────────────────── */
    class Pulse {
        constructor(x, y, dir, color, depth = 0) {
            this.sx = snap(x);
            this.sy = snap(y);
            this.dir = dir || randDir();
            this.color = color || randColor();
            this.depth = depth;          // branching depth (limits infinite growth)
            this.progress = 0;
            // Length: 3-12 grid cells
            const cells = 3 + Math.floor(Math.random() * (depth > 1 ? 6 : 10));
            this.maxLen = cells * GRID;
            this.done = false;
        }

        get ex() { return this.sx + this.dir.x * this.progress; }
        get ey() { return this.sy + this.dir.y * this.progress; }

        update() {
            if (this.done) return;

            this.progress = Math.min(this.progress + PULSE_SPEED, this.maxLen);

            // Off-screen? kill immediately
            if (this.ex < -GRID * 2 || this.ex > W + GRID * 2 ||
                this.ey < -GRID * 2 || this.ey > H + GRID * 2) {
                this.done = true;
                return;
            }

            if (this.progress >= this.maxLen) {
                // Commit finished segment
                segments.push({
                    x1: this.sx, y1: this.sy,
                    x2: this.ex, y2: this.ey,
                    color: this.color,
                    life: SEG_LIFE,
                    dotLife: DOT_LIFE,
                });

                // Branch — spawn 0-2 children perpendicular / straight
                if (this.depth < 5 && pulses.length < MAX_PULSES * 3) {
                    const ex = this.ex, ey = this.ey;
                    const reverseX = -this.dir.x, reverseY = -this.dir.y;
                    const forward = DIRS.filter(d => !(d.x === reverseX && d.y === reverseY));
                    const count = Math.random() > 0.45 ? 2 : 1;

                    // Pick distinct dirs
                    const chosen = [];
                    const pool = [...forward].sort(() => Math.random() - 0.5);
                    for (let i = 0; i < Math.min(count, pool.length); i++) {
                        chosen.push(pool[i]);
                    }

                    chosen.forEach(d => {
                        const childColor = Math.random() > 0.65 ? randColor() : this.color;
                        pulses.push(new Pulse(ex, ey, d, childColor, this.depth + 1));
                    });
                }

                this.done = true;
            }
        }

        draw() {
            if (this.done) return;
            const { sx, sy, ex, ey, color: c, progress, maxLen } = this;
            const t = progress / maxLen;    // 0 → 1 as line grows

            /* Fading tail — gradient from transparent at start → bright at tip */
            const grad = ctx.createLinearGradient(sx, sy, ex, ey);
            grad.addColorStop(0, rgba(c, 0));
            grad.addColorStop(Math.max(0, t - 0.5), rgba(c, 0));
            grad.addColorStop(1, rgba(c, 0.28));

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            /* Glowing endpoint dot */
            // Inner dot
            ctx.beginPath();
            ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = rgba(c, 0.25);
            ctx.fill();

            // Outer halo
            const halo = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10);
            halo.addColorStop(0, rgba(c, 0.12));
            halo.addColorStop(1, rgba(c, 0));
            ctx.beginPath();
            ctx.arc(ex, ey, 10, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();
        }
    }

    /* ── Spawn helpers ─────────────────────────────── */
    function spawnRoot() {
        // Spawn from a random grid point anywhere on screen
        const x = snap(Math.random() * W);
        const y = snap(Math.random() * H);
        pulses.push(new Pulse(x, y));
    }

    // Seed initial pulses spread across the viewport
    for (let i = 0; i < MAX_PULSES; i++) spawnRoot();

    /* ── Main loop ─────────────────────────────────── */
    let frame = 0;

    function tick() {
        ctx.clearRect(0, 0, W, H);

        /* Draw completed segments (fading) */
        for (let i = segments.length - 1; i >= 0; i--) {
            const s = segments[i];
            s.life--;
            s.dotLife--;

            if (s.life <= 0) { segments.splice(i, 1); continue; }

            const lineAlpha = (s.life / SEG_LIFE) * 0.09;
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
            ctx.strokeStyle = rgba(s.color, lineAlpha);
            ctx.lineWidth = 1;
            ctx.stroke();

            // Keep endpoint dot visible a bit longer than the line
            if (s.dotLife > 0) {
                const dotAlpha = (s.dotLife / DOT_LIFE) * 0.22;
                ctx.beginPath();
                ctx.arc(s.x2, s.y2, 2, 0, Math.PI * 2);
                ctx.fillStyle = rgba(s.color, dotAlpha);
                ctx.fill();
            }
        }

        /* Update and draw growing pulses */
        for (let i = pulses.length - 1; i >= 0; i--) {
            pulses[i].update();
            pulses[i].draw();
            if (pulses[i].done) pulses.splice(i, 1);
        }

        /* Top up root pulses to keep screen alive */
        if (frame % SPAWN_RATE === 0 && pulses.length < MAX_PULSES) {
            spawnRoot();
        }

        frame++;
        requestAnimationFrame(tick);
    }

    tick();
})();
