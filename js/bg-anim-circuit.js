document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) {
        console.error("Canvas element with id 'bg-lines' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    const NODE_COLOR = 'rgba(205, 56, 56, 0.2)';
    const PARTICLE_COLOR = 'rgba(205, 56, 56, 1)';
    const GRID_GAP = 40; // Расстояние между узлами
    const PARTICLE_COUNT = 50; // Количество "сигналов"
    const PARTICLE_SPEED = 1; // Скорость "сигналов"

    let nodes = [];
    let particles = [];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            const startNode = nodes[Math.floor(Math.random() * nodes.length)];
            this.x = startNode.x;
            this.y = startNode.y;
            this.targetNode = this.findNewTarget(startNode);
        }

        findNewTarget(currentNode) {
            // Находим соседей (включая диагонали)
            const neighbors = nodes.filter(node => 
                node !== currentNode &&
                Math.abs(node.x - currentNode.x) <= GRID_GAP &&
                Math.abs(node.y - currentNode.y) <= GRID_GAP
            );
            return neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : nodes[0];
        }

        update() {
            const dx = this.targetNode.x - this.x;
            const dy = this.targetNode.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < PARTICLE_SPEED) {
                // Достигли цели, ищем новую
                const oldTarget = this.targetNode;
                this.x = oldTarget.x;
                this.y = oldTarget.y;
                this.targetNode = this.findNewTarget(oldTarget);
            } else {
                // Двигаемся к цели
                this.x += (dx / dist) * PARTICLE_SPEED;
                this.y += (dy / dist) * PARTICLE_SPEED;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.fill();
        }
    }

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Создаем сетку узлов
        nodes = [];
        for (let x = 0; x < width + GRID_GAP; x += GRID_GAP) {
            for (let y = 0; y < height + GRID_GAP; y += GRID_GAP) {
                nodes.push({ x: x, y: y });
            }
        }

        // Создаем частицы
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawGrid() {
        ctx.fillStyle = NODE_COLOR;
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate() {
        // Эффект затухания
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        ctx.fillRect(0, 0, width, height);

        drawGrid();

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