document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    let columns;
    let drops = [];
    const fontSize = 16;
    // Набор символов для "дождя"
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
    const charArray = characters.split('');
    const primaryColor = '#CD3838'; // Основной цвет вашего сайта

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        columns = Math.floor(width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            // Начальная позиция для каждой колонки
            drops[i] = Math.floor(Math.random() * (height / fontSize));
        }
    }

    function draw() {
        // Рисуем полупрозрачный черный прямоугольник для создания эффекта затухания
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = primaryColor;
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Сбрасываем "каплю" наверх, если она ушла за пределы экрана
            // Добавляем случайность, чтобы дождь был неравномерным
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', setup);

    setup();
    animate();
});