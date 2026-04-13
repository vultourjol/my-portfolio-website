document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const accent = {
        main: '205,56,56',
        soft: '255,120,120'
    };

    const tokens = ['MRX', 'ping', 'npm', 'git', 'API', 'CSS', 'JS', 'DOM', 'UI', '404', 'sudo', 'NULL', 'CTRL+S', 'NEXT', 'glhf', 'gg', 'AFK', 'IRL', 'URL', 'WIP', 'QAQ', 'TBD', 'ETA', 'JSON', 'XML', 'SQL', 'DB', 'AI', 'VR', 'AR', 'SDK', 'IDE', 'CLI', 'GUI', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'RELEASE ME!', 'whoami', 'Flynn lives!'];
    const nodes = [];
    const links = [];
    const pulses = [];

    const pointer = {
        x: null,
        y: null,
        tx: null,
        ty: null,
        active: false,
        strength: 0,
        targetStrength: 0
    };

    let streamPhase = 0;
    let pulseTimer = 0;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        buildNetwork();
    }

    function buildNetwork() {
        nodes.length = 0;
        links.length = 0;

        const baseSpacing = width < 768 ? 110 : 130;
        const jitter = baseSpacing * 0.24;

        for (let y = -baseSpacing; y <= height + baseSpacing; y += baseSpacing) {
            for (let x = -baseSpacing; x <= width + baseSpacing; x += baseSpacing) {
                const offsetX = ((Math.floor(y / baseSpacing) % 2) * baseSpacing) / 2;
                const baseX = x + offsetX + rand(-jitter, jitter);
                const baseY = y + rand(-jitter, jitter);
                nodes.push({
                    x: baseX,
                    y: baseY,
                    homeX: baseX,
                    homeY: baseY,
                    vx: 0,
                    vy: 0,
                    seed: Math.random() * Math.PI * 2,
                    size: rand(1.2, 2.3),
                    driftAmp: rand(5, 14),
                    driftSpeedX: rand(0.00045, 0.0011),
                    driftSpeedY: rand(0.0005, 0.00125)
                });
            }
        }

        const maxDist = baseSpacing * 1.15;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < maxDist) {
                    links.push({
                        a: i,
                        b: j,
                        length: dist,
                        phase: Math.random()
                    });
                }
            }
        }
    }

    function spawnPulse() {
        if (links.length === 0) {
            return;
        }

        const pathLength = width < 768 ? 2 : 3;
        const chain = [];
        let currentLink = links[Math.floor(Math.random() * links.length)];
        chain.push(currentLink);
        let currentNode = currentLink.b;

        for (let i = 1; i < pathLength; i++) {
            const candidates = links.filter(function (link) {
                return link.a === currentNode || link.b === currentNode;
            });
            if (candidates.length === 0) {
                break;
            }
            currentLink = candidates[Math.floor(Math.random() * candidates.length)];
            chain.push(currentLink);
            currentNode = currentLink.a === currentNode ? currentLink.b : currentLink.a;
        }

        pulses.push({
            chain: chain,
            step: 0,
            progress: 0,
            speed: prefersReducedMotion ? 0.007 : rand(0.011, 0.018),
            glow: rand(0.55, 1),
            token: tokens[Math.floor(Math.random() * tokens.length)],
            ttl: 1
        });
    }

    function drawBackdrop() {
        const gradient = ctx.createRadialGradient(
            width * 0.5,
            height * 0.45,
            60,
            width * 0.5,
            height * 0.45,
            Math.max(width, height) * 0.75
        );
        gradient.addColorStop(0, 'rgba(16, 10, 10, 0.5)');
        gradient.addColorStop(1, 'rgba(4, 4, 4, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const vignette = ctx.createLinearGradient(0, 0, width, height);
        vignette.addColorStop(0, 'rgba(205,56,56,0.06)');
        vignette.addColorStop(0.5, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(205,56,56,0.08)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
    }

    function drawLinks(time) {
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const a = nodes[link.a];
            const b = nodes[link.b];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1;

            const normalX = dx / dist;
            const normalY = dy / dist;

            const px = -normalY;
            const py = normalX;

            const warp = Math.sin(time * 0.0012 + link.phase * 9 + a.seed) * 3.2;

            const mx = (a.x + b.x) * 0.5 + px * warp;
            const my = (a.y + b.y) * 0.5 + py * warp;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(mx, my, b.x, b.y);

            const pulseSpeed = prefersReducedMotion ? 0.001 : 0.0024;
            const pulseWave = 0.5 + 0.5 * Math.sin(time * pulseSpeed + link.phase * 15 + streamPhase * 1.5);
            const flow = 0.2 + 0.14 * Math.sin(streamPhase + link.phase * 12);
            const alpha = flow + pulseWave * (prefersReducedMotion ? 0.06 : 0.18);

            ctx.strokeStyle = 'rgba(' + accent.main + ',' + Math.min(alpha, 0.62).toFixed(3) + ')';
            ctx.lineWidth = (prefersReducedMotion ? 0.7 : 0.65) + pulseWave * (prefersReducedMotion ? 0.2 : 0.75);
            ctx.stroke();
        }
    }

    function drawNodes(time) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const beat = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.0016 + node.seed * 2));

            let influence = 0;
            if (pointer.strength > 0.001 && pointer.x !== null && pointer.y !== null) {
                const dist = Math.hypot(node.x - pointer.x, node.y - pointer.y);
                influence = Math.max(0, 1 - dist / 260) * pointer.strength;
            }

            const radius = node.size + beat * 0.55 + influence * 0.9;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + accent.soft + ',' + (0.12 + beat * 0.35 + influence * 0.25).toFixed(3) + ')';
            ctx.fill();
        }
    }

    function updateNodes(time) {
        const driftBoost = prefersReducedMotion ? 0.35 : 1;
        const pointerRadius = width < 768 ? 190 : 240;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const driftX = Math.sin(time * node.driftSpeedX + node.seed * 1.2) * node.driftAmp * driftBoost;
            const driftY = Math.cos(time * node.driftSpeedY + node.seed * 0.8) * node.driftAmp * driftBoost;

            let targetX = node.homeX + driftX;
            let targetY = node.homeY + driftY;

            if (pointer.strength > 0.001 && pointer.x !== null && pointer.y !== null) {
                const dx = node.x - pointer.x;
                const dy = node.y - pointer.y;
                const dist = Math.hypot(dx, dy) || 1;
                const falloff = Math.max(0, 1 - dist / pointerRadius) * pointer.strength;
                if (falloff > 0) {
                    const force = (prefersReducedMotion ? 0.35 : 1) * 5.5 * falloff;
                    targetX += (dx / dist) * force * 10;
                    targetY += (dy / dist) * force * 10;

                    const swirl = Math.sin(time * 0.003 + node.seed * 3) * force;
                    targetX += (-dy / dist) * swirl * 5;
                    targetY += (dx / dist) * swirl * 5;
                }
            }

            const spring = prefersReducedMotion ? 0.035 : 0.075;
            const damping = prefersReducedMotion ? 0.84 : 0.8;

            node.vx += (targetX - node.x) * spring;
            node.vy += (targetY - node.y) * spring;
            node.vx *= damping;
            node.vy *= damping;

            node.x += node.vx;
            node.y += node.vy;
        }
    }

    function updatePointer() {
        if (pointer.tx !== null && pointer.ty !== null) {
            if (pointer.x === null || pointer.y === null) {
                pointer.x = pointer.tx;
                pointer.y = pointer.ty;
            }

            const easing = prefersReducedMotion ? 0.08 : 0.18;
            pointer.x += (pointer.tx - pointer.x) * easing;
            pointer.y += (pointer.ty - pointer.y) * easing;
        }

        const strengthEasing = prefersReducedMotion ? 0.07 : 0.14;
        pointer.strength += (pointer.targetStrength - pointer.strength) * strengthEasing;
        if (pointer.strength < 0.001 && !pointer.active) {
            pointer.strength = 0;
        }
    }

    function drawPulses() {
        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];

            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) {
                pulse.progress = 0;
                pulse.step += 1;
                if (pulse.step >= pulse.chain.length) {
                    pulses.splice(i, 1);
                    continue;
                }
            }

            const link = pulse.chain[pulse.step];
            const a = nodes[link.a];
            const b = nodes[link.b];
            const t = pulse.progress;

            const x = a.x + (b.x - a.x) * t;
            const y = a.y + (b.y - a.y) * t;

            ctx.beginPath();
            ctx.arc(x, y, 3.2 + pulse.glow * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + accent.main + ',' + (0.65 * pulse.ttl).toFixed(3) + ')';
            ctx.fill();

            ctx.font = width < 768 ? '500 10px Montserrat, monospace' : '500 11px Montserrat, monospace';
            ctx.fillStyle = 'rgba(' + accent.soft + ',' + (0.6 * pulse.ttl).toFixed(3) + ')';
            ctx.fillText(pulse.token, x + 8, y - 8);

            pulse.ttl *= 0.998;
        }
    }

    function animate(time) {
        updatePointer();
        updateNodes(time);
        drawBackdrop();
        drawLinks(time);
        drawNodes(time);
        drawPulses();

        streamPhase += prefersReducedMotion ? 0.002 : 0.009;
        pulseTimer += 1;

        const pulseInterval = width < 768 ? 28 : 18;
        if (pulseTimer >= pulseInterval) {
            spawnPulse();
            pulseTimer = 0;
        }

        requestAnimationFrame(animate);
    }

    function updatePointer(clientX, clientY) {
        pointer.tx = clientX;
        pointer.ty = clientY;
        pointer.active = true;
        pointer.targetStrength = 1;
    }

    window.addEventListener('mousemove', function (event) {
        updatePointer(event.clientX, event.clientY);
    });

    window.addEventListener('touchmove', function (event) {
        if (event.touches && event.touches.length > 0) {
            updatePointer(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener('mouseout', function () {
        pointer.active = false;
        pointer.targetStrength = 0;
    });

    window.addEventListener('touchend', function () {
        pointer.active = false;
        pointer.targetStrength = 0;
    }, { passive: true });

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    for (let i = 0; i < 6; i++) {
        spawnPulse();
    }
    requestAnimationFrame(animate);
});