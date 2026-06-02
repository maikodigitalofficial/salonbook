/* ============================================
   HERO-SCENE.JS — Subtle Three.js Particles
   ============================================ */

(function() {
    'use strict';

    // Exit early if no Three.js or mobile/reduced motion
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (window.innerWidth < 768) {
        return;
    }

    const container = document.querySelector('.hero');
    if (!container) return;

    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;';
    container.insertBefore(canvasContainer, container.firstChild);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    canvasContainer.appendChild(renderer.domElement);

    // Particles — small count for performance
    const particleCount = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x2DD4A8,
        size: 0.6,
        transparent: true,
        opacity: 0.35,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    // Animation loop
    let isActive = true;
    let rafId;

    function animate() {
        if (!isActive) return;
        rafId = requestAnimationFrame(animate);

        const time = Date.now() * 0.0003;

        // Smooth mouse follow
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;

        // Gentle floating
        particles.rotation.y = time * 0.05;
        particles.rotation.x = targetY * 0.05;

        // Particle drift
        const posArray = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            posArray[i3 + 1] += Math.sin(time + posArray[i3] * 0.05) * 0.015;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', function() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }, { passive: true });

    // Visibility pause
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            isActive = false;
            if (rafId) cancelAnimationFrame(rafId);
        } else {
            isActive = true;
            animate();
        }
    });

    // Cleanup on page hide
    window.addEventListener('pagehide', function() {
        isActive = false;
        if (rafId) cancelAnimationFrame(rafId);
    });
})();
