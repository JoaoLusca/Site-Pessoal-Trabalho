const progressBar = document.getElementById('progress-bar');
const preloader = document.getElementById('preloader');
const content = document.getElementById('content');
const hasVisitedSession = sessionStorage.getItem('hasVisitedSession');

// MENU HAMBURGUER
const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.querySelector('.nav-container');

menuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
});
// FIM MENU HAMBURGUER

function init() {
    content.style.display = 'block';
    initBackgroundAnimation(); // Chamando a animação de fundo aqui
    document.body.style.overflow = 'auto';
}

if (!hasVisitedSession) {
    let progress = 0;

    function updateProgress() {
        progress += Math.random() * 10;
        progressBar.style.width = Math.min(progress, 100) + '%';

        if (progress >= 100) {
            setTimeout(() => {
                preloader.style.opacity = '0'; // Inicia a transição de desaparecimento
                setTimeout(() => {
                    preloader.style.display = 'none'; // Remove do fluxo após a transição
                    init(); // Chama a função init para exibir o conteúdo e iniciar a animação
                    sessionStorage.setItem('hasVisitedSession', 'true');
                }, 500); // Espera o tempo da transição (0.5s)
            }, 500);
        } else {
            setTimeout(updateProgress, 100);
        }
    }

    window.onload = updateProgress;
} else {
    preloader.style.display = 'none';
    init(); // Chama a função init para exibir o conteúdo e iniciar a animação
}

function initBackgroundAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    document.body.style.backgroundColor = 'black'; // Define o fundo preto

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const points = [];
    const numPoints = 50; // Ajuste a quantidade de pontos
    const connectDistance = 120; // Distância para conectar os pontos

    canvas.width = width;
    canvas.height = height;

    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8; // Velocidade horizontal
            this.vy = (Math.random() - 0.5) * 0.8; // Velocidade vertical
            this.radius = 2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(207, 115, 254, 0.8)'; // Cor #CF73FE para os pontos
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Reaparecer do lado oposto quando sair da tela
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
                    ctx.strokeStyle = 'rgba(207, 115, 254, 0.3)'; // Cor #CF73FE para as linhas
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
    });
}