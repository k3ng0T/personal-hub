// ===== THREE.JS SPACE BACKGROUND =====
(function initSpace() {
    const canvas = document.getElementById('space-bg');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030014, 1);

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);
    const colorArray = new Float32Array(starsCount * 3);
    const sizeArray = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 2000;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        const colorChoice = Math.random();
        if (colorChoice < 0.3) {
            colorArray[i * 3] = 0; colorArray[i * 3 + 1] = 0.94; colorArray[i * 3 + 2] = 1;
        } else if (colorChoice < 0.5) {
            colorArray[i * 3] = 0.7; colorArray[i * 3 + 1] = 0; colorArray[i * 3 + 2] = 1;
        } else {
            colorArray[i * 3] = 1; colorArray[i * 3 + 1] = 1; colorArray[i * 3 + 2] = 1;
        }
        sizeArray[i] = Math.random() * 2 + 0.5;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const starsMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
    });

    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    // Nebula clouds
    function createNebula(x, y, z, color, scale) {
        const geo = new THREE.BufferGeometry();
        const count = 800;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = Math.random() * 150 * scale;
            pos[i * 3] = x + r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = y + r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = z + r * Math.cos(phi);
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            size: 3 * scale,
            color: color,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });
        return new THREE.Points(geo, mat);
    }

    const nebula1 = createNebula(-200, 100, -300, 0x00f0ff, 1.5);
    const nebula2 = createNebula(200, -50, -400, 0xb400ff, 1.2);
    const nebula3 = createNebula(0, -150, -500, 0xff006e, 0.8);
    scene.add(nebula1, nebula2, nebula3);

    // Floating particles
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = [];

    for (let i = 0; i < particleCount; i++) {
        particlePos[i * 3] = (Math.random() - 0.5) * 1200;
        particlePos[i * 3 + 1] = (Math.random() - 0.5) * 1200;
        particlePos[i * 3 + 2] = (Math.random() - 0.5) * 800;
        particleVel.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.3,
        });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 2,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 100;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 100;
    });

    // Scroll tracking
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const scrollFactor = scrollY * 0.1;

        starsMesh.rotation.x = mouseY * 0.0003 + scrollFactor * 0.0005;
        starsMesh.rotation.y = mouseX * 0.0003;
        starsMesh.rotation.z += 0.00005;

        camera.position.x = mouseX * 0.3;
        camera.position.y = -mouseY * 0.3 - scrollFactor * 0.05;
        camera.lookAt(0, -scrollFactor * 0.1, 0);

        nebula1.rotation.y += 0.0002;
        nebula2.rotation.y -= 0.00015;
        nebula3.rotation.x += 0.0001;

        const pPos = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            pPos[i * 3] += particleVel[i].x;
            pPos[i * 3 + 1] += particleVel[i].y;
            pPos[i * 3 + 2] += particleVel[i].z;

            if (Math.abs(pPos[i * 3]) > 600) particleVel[i].x *= -1;
            if (Math.abs(pPos[i * 3 + 1]) > 600) particleVel[i].y *= -1;
            if (Math.abs(pPos[i * 3 + 2]) > 400) particleVel[i].z *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ===== TYPEWRITER EFFECT =====
(function initTypewriter() {
    const typedText = document.querySelector('.typed-text');
    if (!typedText) return;

    const texts = ['DEVELOPER', 'CREATOR', 'EXPLORER', 'DESIGNER', 'TINKERER', 'SELF-TAUGHT'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentText = texts[textIndex];

        if (isPaused) {
            setTimeout(type, 1500);
            isPaused = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 50);
        } else {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isPaused = true;
                setTimeout(type, 0);
                return;
            }
            setTimeout(type, 100);
        }
    }
    setTimeout(type, 1000);
})();

// ===== GSAP SCROLL ANIMATIONS =====
(function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Header scroll effect
    ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => document.getElementById('header')?.classList.add('scrolled'),
        onLeaveBack: () => document.getElementById('header')?.classList.remove('scrolled'),
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
        });
    });

    // Reveal text
    gsap.utils.toArray('.reveal-text').forEach((el, i) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => {
                setTimeout(() => el.classList.add('visible'), i * 150);
            },
        });
    });

    // Reveal items (stats)
    gsap.utils.toArray('.reveal-item').forEach((el, i) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => {
                setTimeout(() => {
                    el.classList.add('visible');
                    // Animate stat number
                    const numEl = el.querySelector('.stat-number');
                    if (numEl && numEl.dataset.target) {
                        const target = parseInt(numEl.dataset.target);
                        const duration = 600;
                        const start = performance.now();
                        function updateNum(now) {
                            const progress = Math.min((now - start) / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            numEl.textContent = Math.floor(target * eased);
                            if (progress < 1) requestAnimationFrame(updateNum);
                        }
                        requestAnimationFrame(updateNum);
                    }
                }, i * 200);
            },
        });
    });

    // Reveal cards with stagger
    const cards = gsap.utils.toArray('.reveal-card');
    cards.forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 90%',
            onEnter: () => {
                setTimeout(() => card.classList.add('visible'), i * 150);
            },
        });
    });

    // Reveal links
    gsap.utils.toArray('.reveal-link').forEach((el, i) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            onEnter: () => {
                setTimeout(() => el.classList.add('visible'), i * 100);
            },
        });
    });

    // Orbit parallax
    gsap.to('.tech-orbit', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        },
        rotation: 15,
        ease: 'none',
    });

    // Hero parallax
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        },
        y: -120,
        opacity: 0.3,
        scale: 0.95,
        ease: 'none',
    });
})();

// ===== 3D CARD TILT =====
(function initTilt() {
    document.querySelectorAll('.project-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;

            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();

// ===== SMOOTH NAV SCROLL =====
document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile nav
            document.querySelector('.nav-links')?.classList.remove('active');
            document.getElementById('hamburger')?.classList.remove('active');
        }
    });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.nav-links a, .link-card').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
});

// ===== CURSOR GLOW (desktop only) =====
(function initCursorGlow() {
    if (window.innerWidth < 768) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        background: radial-gradient(circle, rgba(0,240,255,0.04), transparent 70%);
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();

// ===== LANG BUTTONS =====
document.getElementById('lang1')?.addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('lang2')?.classList.remove('active');
});
document.getElementById('lang2')?.addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('lang1')?.classList.remove('active');
});
