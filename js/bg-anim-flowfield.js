document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    const PARTICLE_COUNT = 500; // Количество частиц
    const PARTICLE_SPEED = 0.5; // Скорость частиц
    const NOISE_SCALE = 0.005; // Масштаб "шума", влияет на плавность потоков
    const PARTICLE_COLOR = 'rgba(205, 56, 56, 0.8)';

    let particles = [];
    let noise = new PerlinNoise(); // Создаем экземпляр генератора шума

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.px = this.x; // Предыдущая позиция X
            this.py = this.y; // Предыдущая позиция Y
        }

        update() {
            // Получаем угол из шума Перлина в текущей точке
            const angle = noise.get(this.x * NOISE_SCALE, this.y * NOISE_SCALE) * Math.PI * 2;
            
            // Вычисляем смещение
            const vx = Math.cos(angle) * PARTICLE_SPEED;
            const vy = Math.sin(angle) * PARTICLE_SPEED;

            // Сохраняем предыдущую позицию
            this.px = this.x;
            this.py = this.y;

            // Обновляем текущую позицию
            this.x += vx;
            this.y += vy;

            // Если частица выходит за пределы экрана, возвращаем ее с другой стороны
            if (this.x > width) { this.x = 0; this.px = this.x; }
            if (this.x < 0) { this.x = width; this.px = this.x; }
            if (this.y > height) { this.y = 0; this.py = this.y; }
            if (this.y < 0) { this.y = height; this.py = this.y; }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.px, this.py);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = PARTICLE_COLOR;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
        // Устанавливаем фон при ресайзе
        ctx.fillStyle = 'rgb(10, 10, 10)';
        ctx.fillRect(0, 0, width, height);
    }

    function animate() {
        // Эффект затухания
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, width, height);

        for (const particle of particles) {
            particle.update();
            particle.draw();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', setup);

    setup();
    animate();
});


// --- Встроенная реализация шума Перлина ---
function PerlinNoise() {
    // Код основан на классическом алгоритме Кена Перлина
    const p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 256; i++) p[i + 256] = p[i];

    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t, a, b) => a + t * (b - a);
    const grad = (hash, x, y) => {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    this.get = (x, y) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = fade(x);
        const v = fade(y);
        const p00 = p[X + p[Y]];
        const p01 = p[X + p[Y + 1]];
        const p10 = p[X + 1 + p[Y]];
        const p11 = p[X + 1 + p[Y + 1]];
        return lerp(v, lerp(u, grad(p00, x, y), grad(p10, x - 1, y)),
                       lerp(u, grad(p01, x, y - 1), grad(p11, x - 1, y - 1)));
    };
}