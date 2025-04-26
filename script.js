const progressBar = document.getElementById('progress-bar');
const preloader = document.getElementById('preloader');
const content = document.getElementById('content');
const hasVisitedSession = sessionStorage.getItem('hasVisitedSession');
const header = document.querySelector('header');
const nav = document.querySelector('nav');

function init() {
    content.style.display = 'block';
    initBackgroundAnimation();
    document.body.style.overflow = 'auto';
}

if (!hasVisitedSession) {
    let progress = 0;

    function updateProgress() {
        progress += Math.random() * 10;
        progressBar.style.width = Math.min(progress, 100) + '%';

        if (progress >= 100) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    init();
                    sessionStorage.setItem('hasVisitedSession', 'true');
                }, 500);
            }, 500);
        } else {
            setTimeout(updateProgress, 100);
        }
    }

    window.onload = updateProgress;
} else {
    preloader.style.display = 'none';
    init();
}

function initBackgroundAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    document.body.style.backgroundColor = 'black';

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const points = [];
    const numPoints = 50;
    const connectDistance = 120;

    canvas.width = width;
    canvas.height = height;

    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = 2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(207, 115, 254, 0.8)';
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.draw();
        }
    }

    for (let i = 0; i < numPoints; i++) {
        points.push(new Point());
    }

    function connectPoints() {
        for (let i = 0; i < numPoints; i++) {
            for (let j = i + 1; j < numPoints; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectDistance) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = 'rgba(207, 115, 254, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        points.forEach(point => point.update());
        connectPoints();
    }

    animate();

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        points.forEach(point => {
            point.x = point.x * (width / canvas.width);
            point.y = point.y * (height / canvas.height);
        });
    });
}

// Menu Hambúrguer
header.addEventListener('click', () => {
    nav.classList.toggle('active');
});