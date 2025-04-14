document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true
    });

    createBackgroundElements();
    initTabNavigation();
    initScrollAnimations();
    addInteractiveEffects();
    initParticlesBackground();
    addTypingEffect();
    enhanceHoverEffects();
});

function createBackgroundElements() {
    const bgElements = document.createElement('div');
    bgElements.classList.add('bg-elements');
    document.body.appendChild(bgElements);

    for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.classList.add('bg-element');

        const size = Math.random() * 300 + 150;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 15;

        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${posY}%`;
        element.style.left = `${posX}%`;
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;
        element.style.opacity = Math.random() * 0.5 + 0.1;
        element.style.filter = `blur(${Math.random() * 20 + 10}px)`;

        bgElements.appendChild(element);
    }
}

function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId, animate = true) {
        tabs.forEach(tab => tab.classList.remove('active'));

        const activeTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        activeTab.classList.add('active');

        const currentContent = document.querySelector('.tab-content.active');

        if (currentContent && animate) {
            currentContent.style.opacity = '0';
            currentContent.style.transform = 'translateY(30px)';

            setTimeout(() => {
                tabContents.forEach(content => content.classList.remove('active'));
                const newContent = document.querySelector(`#${tabId}`);
                newContent.classList.add('active');

                void newContent.offsetWidth;

                newContent.style.opacity = '1';
                newContent.style.transform = 'translateY(0)';

                addPageTransitionEffect(tabId);

            }, 300);
        } else {
            tabContents.forEach(content => content.classList.remove('active'));
            document.querySelector(`#${tabId}`).classList.add('active');
            addPageTransitionEffect(tabId);
        }

        localStorage.setItem('activeTab', tabId);
    }

    function addPageTransitionEffect(tabId) {
        const content = document.querySelector(`#${tabId} .container`);
        if (content) {
            content.classList.add('page-transition');
            setTimeout(() => {
                content.classList.remove('page-transition');
            }, 1000);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            const ripple = document.createElement('span');
            ripple.classList.add('tab-ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);

            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    const storedTab = localStorage.getItem('activeTab');
    if (storedTab && document.querySelector(`#${storedTab}`)) {
        switchTab(storedTab, false);
    } else {
        switchTab('about', false);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (document.getElementById(targetId)) {
                e.preventDefault();
                document.getElementById(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                const delay = index * 0.15;

                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('circular-image')) {
                    entry.target.classList.add('animate-bounce-in');
                } else if (entry.target.classList.contains('social-card')) {
                    entry.target.classList.add('animate-slide-up');
                } else if (entry.target.classList.contains('content')) {
                    entry.target.classList.add('animate-fade-in');
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.circular-image, .social-card, .content, .container, h2, p').forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

function addInteractiveEffects() {
    const socialCards = document.querySelectorAll('.social-card');

    socialCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            const rotateX = mouseY / (cardRect.height / 2) * -5;
            const rotateY = mouseX / (cardRect.width / 2) * 5;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;

            this.style.boxShadow = `
                ${-rotateY/2}px ${-rotateX/2}px 20px rgba(139, 69, 19, 0.3),
                ${rotateY}px ${rotateX}px 30px rgba(0, 0, 0, 0.15)
            `;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            setTimeout(() => {
                this.style.transition = 'all 0.5s ease';
            }, 100);
        });

        card.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
        });
    });

    const circularImages = document.querySelectorAll('.circular-image');

    circularImages.forEach(img => {
        img.addEventListener('mousemove', function(e) {
            const imgRect = this.getBoundingClientRect();
            const imgCenterX = imgRect.left + imgRect.width / 2;
            const imgCenterY = imgRect.top + imgRect.height / 2;
            const mouseX = (e.clientX - imgCenterX) / 20;
            const mouseY = (e.clientY - imgCenterY) / 20;

            if (this.querySelector('img')) {
                this.querySelector('img').style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.05)`;
            }
        });

        img.addEventListener('mouseleave', function() {
            if (this.querySelector('img')) {
                this.querySelector('img').style.transform = 'translate(0, 0) scale(1)';
            }
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mousemove', function(e) {
            const logoRect = this.getBoundingClientRect();
            const logoX = e.clientX - logoRect.left;
            const logoY = e.clientY - logoRect.top;

            const lightX = (logoX / logoRect.width) * 100;
            const lightY = (logoY / logoRect.height) * 100;

            this.style.background = `
                radial-gradient(circle at ${lightX}% ${lightY}%, 
                rgba(222, 184, 135, 0.9) 0%, 
                rgba(160, 82, 45, 0.8) 50%, 
                rgba(139, 69, 19, 0.6) 100%)
            `;
        });

        logo.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    }

    const heart = document.querySelector('.heart');
    if (heart) {
        heart.addEventListener('click', function() {
            for (let i = 0; i < 15; i++) {
                createSparkle(this);
            }
        });
    }
}

function createSparkle(parent) {
    const sparkle = document.createElement('span');
    sparkle.classList.add('sparkle');

    const size = Math.random() * 5 + 3;
    const originX = Math.random() * 40 - 20;
    const originY = Math.random() * 40 - 20; 
    const duration = Math.random() * 1 + 0.5;
    const delay = Math.random() * 0.2;

    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    sparkle.style.setProperty('--originX', `${originX}px`);
    sparkle.style.setProperty('--originY', `${originY}px`);
    sparkle.style.animationDuration = `${duration}s`;
    sparkle.style.animationDelay = `${delay}s`;

    parent.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, (duration + delay) * 1000);
}

function initParticlesBackground() {
    if (!document.createElement('canvas').getContext) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.7';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 50);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: getBrownShade(),
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function getBrownShade() {
        const browns = [
            'rgba(182, 125, 74, 0.6)',
            'rgba(200, 154, 115, 0.6)',
            'rgba(224, 182, 132, 0.6)',
            'rgba(235, 210, 180, 0.6)',
            'rgba(247, 235, 218, 0.6)',
            'rgba(255, 252, 245, 0.6)'
        ];
        return browns[Math.floor(Math.random() * browns.length)];
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });

        drawConnectionLines();

        requestAnimationFrame(animateParticles);
    }

    function drawConnectionLines() {
        const maxDistance = 150;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(224, 182, 132, ${opacity * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    animateParticles();
}

function addTypingEffect() {
    const firstParagraphs = document.querySelectorAll('.tab-content.active .content p:first-of-type');

    firstParagraphs.forEach(paragraph => {
        if (!paragraph.dataset.typing) {
            const originalText = paragraph.textContent;
            paragraph.dataset.typing = 'true';
            paragraph.dataset.originalText = originalText;

            paragraph.innerHTML = '<span class="typing-cursor">|</span>';

            let charIndex = 0;
            const typingInterval = setInterval(() => {
                if (charIndex < originalText.length) {
                    paragraph.innerHTML = originalText.substring(0, charIndex + 1) + 
                                        '<span class="typing-cursor">|</span>';
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    paragraph.innerHTML = originalText;
                }
            }, 30);
        }
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            setTimeout(() => {
                const activeTabFirstParagraph = document.querySelector('.tab-content.active .content p:first-of-type');

                if (activeTabFirstParagraph && !activeTabFirstParagraph.dataset.typingActive) {
                    activeTabFirstParagraph.dataset.typingActive = 'true';

                    const originalText = activeTabFirstParagraph.dataset.originalText || 
                                        activeTabFirstParagraph.textContent;

                    activeTabFirstParagraph.dataset.originalText = originalText;

                    activeTabFirstParagraph.innerHTML = '<span class="typing-cursor">|</span>';

                    let charIndex = 0;
                    const typingInterval = setInterval(() => {
                        if (charIndex < originalText.length) {
                            activeTabFirstParagraph.innerHTML = originalText.substring(0, charIndex + 1) + 
                                                              '<span class="typing-cursor">|</span>';
                            charIndex++;
                        } else {
                            clearInterval(typingInterval);
                            activeTabFirstParagraph.innerHTML = originalText;
                            activeTabFirstParagraph.dataset.typingActive = 'false';
                        }
                    }, 30);
                }
            }, 300);
        });
    });
}

function enhanceHoverEffects() {
    document.querySelectorAll('.content p').forEach(p => {
        p.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = getRandomBrownShade();
        });

        p.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = 'transparent';
        });
    });

    function getRandomBrownShade() {
        const browns = [
            '#b67d4a',
            '#c89a73',
            '#e0b684',
            '#ebd2b4',
            '#f7ebda'
        ];
        return browns[Math.floor(Math.random() * browns.length)];
    }

    document.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const shadowX = (x / rect.width - 0.5) * 10;
            const shadowY = (y / rect.height - 0.5) * 10;

            this.style.boxShadow = `
                ${shadowX}px ${shadowY}px 15px rgba(182, 125, 74, 0.4),
                0 5px 10px rgba(200, 154, 115, 0.25)
            `;
        });

        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

function addAnimationStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes bounce-in {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slide-up {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .animate-bounce-in.visible {
            animation: bounce-in 0.8s ease forwards;
        }

        .animate-slide-up.visible {
            animation: slide-up 0.6s ease forwards;
        }

        .animate-fade-in.visible {
            animation: fade-in 0.8s ease forwards;
        }

        .animate-on-scroll {
            opacity: 0;
            transition: all 0.8s ease;
        }

        .animate-on-scroll.visible {
            opacity: 1;
        }

        .tab-ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .typing-cursor {
            animation: cursor-blink 1s infinite;
            font-weight: bold;
        }

        @keyframes cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        .sparkle {
            position: absolute;
            background-color: #FFCC00;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: sparkle-out 1s forwards;
        }

        @keyframes sparkle-out {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { opacity: 1; }
            100% { transform: translate(calc(-50% + var(--originX)), calc(-50% + var(--originY))) scale(1); opacity: 0; }
        }

        .page-transition {
            animation: page-transition 0.8s ease;
        }

        @keyframes page-transition {
            0% { transform: scale(0.98); opacity: 0.5; }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;

    document.head.appendChild(styleEl);
}

addAnimationStyles();