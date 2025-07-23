document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let points = [];
    let pointCount = 0; // Будет вычислено в init()
    const maxDist = 150; // Максимальное расстояние для соединения точек

    const mouse = {
        x: null,
        y: null,
        radius: 200 // Радиус взаимодействия мыши
    };

    window.addEventListener('mousemove', event => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });


    // Цвета
    const pointColor = 'rgba(205, 56, 56, 0.8)'; // #CD3838 с прозрачностью
    const lineColor = 'rgba(205, 56, 56, 0.3)';

    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 1;
            // "Хвост" для эффекта движения
            this.trail = [];
        }

        update() {
            // Взаимодействие с мышью (отталкивание)
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            // Возвращение в пределы экрана
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Обновление хвоста
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 5) {
                this.trail.shift();
            }
        }

        draw() {
            // Рисуем хвост
            if (this.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                for (let i = 1; i < this.trail.length; i++) {
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                }
                ctx.strokeStyle = `rgba(205, 56, 56, 0.2)`;
                ctx.lineWidth = this.radius * 0.5;
                ctx.stroke();
            }

            // Рисуем саму точку
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = pointColor;
            ctx.fill();
        }
    }

    function init() {
        // Пересчитываем количество точек при изменении размера
        pointCount = Math.floor((width * height) / 18000);
        points = [];
        for (let i = 0; i < pointCount; i++) {
            points.push(new Point());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < points.length; i++) {
            points[i].update();
            points[i].draw();

            // Соединение с курсором мыши
            if (mouse.x !== null) {
                const distToMouse = Math.hypot(points[i].x - mouse.x, points[i].y - mouse.y);
                if (distToMouse < maxDist * 1.5) { // Увеличим радиус для линий к мыши
                    const opacity = 1 - (distToMouse / (maxDist * 1.5));
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(205, 56, 56, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            for (let j = i + 1; j < points.length; j++) {
                const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);

                if (dist < maxDist) {
                    const opacity = 1 - (dist / maxDist);
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = `rgba(205, 56, 56, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init(); // Пересоздаем точки при изменении размера окна
    });

    init();
    animate();
});