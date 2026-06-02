/* ============================================
   BACKGROUND-EFFECTS.JS — Subtle Scroll Shift
   ============================================ */

(function() {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Very subtle hue shift on scroll — CSS only, no WebGL
    let ticking = false;

    function updateBackground() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (docHeight <= 0) return;

        const progress = Math.min(scrollY / docHeight, 1);

        // Shift from #0B3D2E to slightly deeper teal
        const r = Math.round(11 - progress * 3);
        const g = Math.round(61 - progress * 5);
        const b = Math.round(46 - progress * 4);

        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateBackground);
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateBackground();
})();
