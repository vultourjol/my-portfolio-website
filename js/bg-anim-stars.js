document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width, height, stars, starCount = 800, speed = 2;

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            this.z = Math.random() * width;
            this.pz = this.z; // Предыдущая позиция Z для создания хвоста
        }

        update() {
            this.z -= speed;
            if (this.z < 1) {
                this.reset();
            }
        }

        draw() {
            const sx = (this.x / this.z) * (width / 2);
            const sy = (this.y / this.z) * (height / 2);
            const radius = Math.max(0, (1 - this.z / width) * 2.5);

            const px = (this.x / this.pz) * (width / 2);
            const py = (this.y / this.pz) * (height / 2);

            this.pz = this.z;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            // Используем тот же цвет, что и в вашей текущей анимации
            ctx.strokeStyle = `rgba(205, 56, 56, 0.8)`;
            ctx.lineWidth = radius;
            ctx.stroke();
        }
    }

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
        // Перемещаем начало координат в центр для 3D эффекта
        ctx.translate(width / 2, height / 2);
    }

    function animate() {
        // Создаем эффект затухания, чтобы звезды оставляли след
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        ctx.fillRect(-width / 2, -height / 2, width, height);

        for (const star of stars) {
            star.update();
            star.draw();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        // При ресайзе сбрасываем и перерисовываем все
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Сброс трансформации
        setup();
    });

    setup();
    animate();
});