document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    const PARTICLE_COUNT = 100; // Количество "звезд"
    const MAX_LINE_DISTANCE = 120; // Максимальное расстояние для соединения
    const PARTICLE_SPEED = 0.2; // Скорость движения "звезд"
    const PARTICLE_COLOR = 'rgba(205, 56, 56, 1)';

    let particles = [];
    let mouse = {
        x: null,
        y: null,
        radius: 150 // Радиус влияния мыши
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.radius = Math.random() * 1.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Возвращаем частицу на экран, если она вышла за пределы
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.fill();
        }
    }

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MAX_LINE_DISTANCE) {
                    // Прозрачность линии зависит от расстояния
                    const opacity = 1 - (distance / MAX_LINE_DISTANCE);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(205, 56, 56, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(10, 10, 10)';
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connect();

        requestAnimationFrame(animate);
    }
    
    // Отслеживание мыши для интерактивности
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        // Можно добавить логику для влияния на частицы рядом с мышью
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', setup);

    setup();
    animate();
});