/* ============================================
   TESTIMONIALS PARTICLES — Three.js Background
   ============================================ */

(function() {
    'use strict';

    // Exit early if no Three.js
    if (typeof THREE === 'undefined') {
        console.warn('TestimonialsParticles: Three.js not loaded');
        return;
    }

    // Exit if reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    var container = document.querySelector('.membership-testimonials');
    if (!container) {
        console.warn('TestimonialsParticles: Container not found');
        return;
    }

    // Get canvas container
    var canvasContainer = container.querySelector('.testimonials-canvas-container');
    if (!canvasContainer) {
        console.warn('TestimonialsParticles: Canvas container not found');
        return;
    }

    // Get or create canvas
    var canvas = document.getElementById('testimonialsCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'testimonialsCanvas';
        canvasContainer.appendChild(canvas);
    }

    // Scene setup
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);
    camera.position.z = 50;

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false
    });
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // Particles — same pattern as hero
    var particleCount = 35;
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var material = new THREE.PointsMaterial({
        color: 0x2DD4A8,
        size: 0.5,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true
    });

    var particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation variables
    var isActive = true;
    var rafId = null;
    var time = 0;

    function animate() {
        if (!isActive) return;
        rafId = requestAnimationFrame(animate);

        time += 0.001;

        // Gentle floating motion
        particles.rotation.y = time * 0.3;
        particles.rotation.x = Math.sin(time * 0.5) * 0.02;

        // Particle drift
        var posArray = particles.geometry.attributes.position.array;
        for (var i = 0; i < particleCount; i++) {
            var i3 = i * 3;
            posArray[i3 + 1] += Math.sin(time + posArray[i3] * 0.05) * 0.01;

            // Reset if too high
            if (posArray[i3 + 1] > 30) {
                posArray[i3 + 1] = -25;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    function onResize() {
        if (!canvasContainer) return;
        var w = canvasContainer.offsetWidth || 800;
        var h = canvasContainer.offsetHeight || 600;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize, { passive: true });

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

    // Intersection observer — only animate when visible
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                if (!isActive) {
                    isActive = true;
                    animate();
                }
            } else {
                isActive = false;
                if (rafId) cancelAnimationFrame(rafId);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(container);

    console.log('TestimonialsParticles: Initialized with ' + particleCount + ' particles');

})();
