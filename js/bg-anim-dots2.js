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
    let pointCount = 0;
    const maxDist = 120; // Максимальное расстояние для соединения

    const mouse = {
        x: null,
        y: null,
        radius: 150,
        isDown: false
    };

    // --- Event Listeners ---
    window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('mousedown', () => { mouse.isDown = true; });
    window.addEventListener('mouseup', () => { mouse.isDown = false; });
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    });

    // --- Quadtree Implementation ---
    // Для оптимизации поиска ближайших точек
    class Rectangle {
        constructor(x, y, w, h) {
            this.x = x; this.y = y; this.w = w; this.h = h;
        }
        contains(point) {
            return (point.x >= this.x - this.w &&
                    point.x <= this.x + this.w &&
                    point.y >= this.y - this.h &&
                    point.y <= this.y + this.h);
        }
        intersects(range) {
            return !(range.x - range.w > this.x + this.w ||
                     range.x + range.w < this.x - this.w ||
                     range.y - range.h > this.y + this.h ||
                     range.y + range.h < this.y - this.h);
        }
    }

    class QuadTree {
        constructor(boundary, capacity) {
            this.boundary = boundary;
            this.capacity = capacity;
            this.points = [];
            this.divided = false;
        }

        subdivide() {
            let x = this.boundary.x;
            let y = this.boundary.y;
            let w = this.boundary.w / 2;
            let h = this.boundary.h / 2;
            let ne = new Rectangle(x + w, y - h, w, h);
            this.northeast = new QuadTree(ne, this.capacity);
            let nw = new Rectangle(x - w, y - h, w, h);
            this.northwest = new QuadTree(nw, this.capacity);
            let se = new Rectangle(x + w, y + h, w, h);
            this.southeast = new QuadTree(se, this.capacity);
            let sw = new Rectangle(x - w, y + h, w, h);
            this.southwest = new QuadTree(sw, this.capacity);
            this.divided = true;
        }

        insert(point) {
            if (!this.boundary.contains(point)) {
                return false;
            }
            if (this.points.length < this.capacity) {
                this.points.push(point);
                return true;
            }
            if (!this.divided) {
                this.subdivide();
            }
            this.northeast.insert(point) || this.northwest.insert(point) ||
            this.southeast.insert(point) || this.southwest.insert(point);
        }

        query(range, found) {
            if (!found) {
                found = [];
            }
            if (!this.boundary.intersects(range)) {
                return found;
            }
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
            return found;
        }
    }

    // --- Point Class ---
    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.baseRadius = Math.random() * 1.8 + 1.2;
            this.radius = this.baseRadius;
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            // Взаимодействие с мышью
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const forceDirection = mouse.isDown ? -1 : 1;
                    this.vx += (dx / dist) * force * 0.2 * forceDirection;
                    this.vy += (dy / dist) * force * 0.2 * forceDirection;
                }
            }

            // Затухание скорости (трение)
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            // Возвращение в пределы экрана
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;

            // Эффект "дыхания"
            this.angle += 0.05;
            this.radius = this.baseRadius + Math.sin(this.angle) * 0.4;
        }

        draw() {
            ctx.beginPath();
            // Цвет зависит от скорости
            const speed = Math.hypot(this.vx, this.vy);
            const colorValue = Math.min(speed * 50, 200);
            ctx.fillStyle = `rgb(205, ${56 + colorValue}, ${56 + colorValue})`;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- Main Functions ---
    function init() {
        pointCount = Math.floor((width * height) / 10000); // Увеличиваем плотность
        points = [];
        for (let i = 0; i < pointCount; i++) {
            points.push(new Point());
        }
    }

    function animate() {
        // Эффект затухания
        ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
        ctx.fillRect(0, 0, width, height);

        // Создаем Quadtree на каждом кадре
        let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
        let qtree = new QuadTree(boundary, 4);

        for (const p of points) {
            p.update();
            p.draw();
            qtree.insert(p);
        }

        for (const p of points) {
            // Ищем точки поблизости для соединения
            let range = new Rectangle(p.x, p.y, maxDist, maxDist);
            let nearby = qtree.query(range);

            for (const other of nearby) {
                if (p === other) continue;

                const dist = Math.hypot(p.x - other.x, p.y - other.y);
                if (dist < maxDist) {
                    const opacity = 1 - (dist / maxDist);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(205, 56, 56, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
             // Соединение с курсором мыши
            if (mouse.x !== null) {
                const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (distToMouse < maxDist * 1.2) {
                    const opacity = 1 - (distToMouse / (maxDist * 1.2));
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(205, 150, 150, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();
});