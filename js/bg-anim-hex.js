document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    const HEX_RADIUS = 25; // Размер гексагонов
    const HEX_COLOR = 'rgba(205, 56, 56, 1)'; // Основной цвет
    const MOUSE_RADIUS = 150; // Радиус влияния мыши

    let hexagons = [];
    let mouse = { x: undefined, y: undefined };
    let time = 0;

    // Класс для отдельного гексагона
    class Hexagon {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseAlpha = 0.05; // Базовая прозрачность
            this.pulseOffset = Math.random() * 100; // Смещение для асинхронного пульса
        }

        draw() {
            // Рассчитываем прозрачность в зависимости от расстояния до мыши
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseEffect = Math.max(0, 1 - dist / MOUSE_RADIUS) * 0.5;

            // Добавляем эффект пульсации
            const pulseEffect = (Math.sin(time * 0.002 + this.pulseOffset) + 1) / 2 * 0.05;
            
            const finalAlpha = this.baseAlpha + mouseEffect + pulseEffect;

            ctx.strokeStyle = `rgba(205, 56, 56, ${finalAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x_i = this.x + HEX_RADIUS * Math.cos(angle);
                const y_i = this.y + HEX_RADIUS * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(x_i, y_i);
                } else {
                    ctx.lineTo(x_i, y_i);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        hexagons = [];

        // Рассчитываем геометрию сетки
        const hexHeight = HEX_RADIUS * 2;
        const hexWidth = Math.sqrt(3) * HEX_RADIUS;
        const vertDist = hexHeight * 3/4;

        for (let y = -HEX_RADIUS, row = 0; y < height + HEX_RADIUS; y += vertDist, row++) {
            for (let x = -HEX_RADIUS, col = 0; x < width + HEX_RADIUS; x += hexWidth, col++) {
                // Смещаем каждую вторую строку для создания "сотовой" структуры
                const xOffset = (row % 2 === 0) ? 0 : hexWidth / 2;
                hexagons.push(new Hexagon(x + xOffset, y));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        // Заливаем фон темным цветом
        ctx.fillStyle = 'rgb(10, 10, 10)';
        ctx.fillRect(0, 0, width, height);

        hexagons.forEach(hex => hex.draw());
        
        time++;
        requestAnimationFrame(animate);
    }

    // Отслеживание мыши
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    window.addEventListener('resize', setup);

    setup();
    animate();
});