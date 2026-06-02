/* ============================================
   SLIDER.JS — Scroll Reveal
   ============================================

   Slides content into view on scroll.

   Usage:
   - Add data-reveal attribute to elements: data-reveal="up|down|left|right|scale|fade"
   - Optional: data-reveal-delay="200" (ms)
   - Optional: data-reveal-duration="800" (ms)
   - Optional: data-reveal-distance="60" (px)

   Example:
   <div data-reveal="up">Slides up from below</div>
   <div data-reveal="left" data-reveal-delay="300">Slides from left</div>

   ============================================ */

const ScrollReveal = (function () {
    'use strict';

    const defaults = {
        up: { y: 60, x: 0, scale: 1 },
        down: { y: -60, x: 0, scale: 1 },
        left: { y: 0, x: -60, scale: 1 },
        right: { y: 0, x: 60, scale: 1 },
        scale: { y: 0, x: 0, scale: 0.9 },
        fade: { y: 0, x: 0, scale: 1 }
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    let observer;

    /* ----------------------------------------
       Public API
       ---------------------------------------- */
    return {
        init,
        reveal,
        reset,
        destroy
    };

    /* ----------------------------------------
       Initialize
       ---------------------------------------- */
    function init(options = {}) {
        const selector = options.selector || '[data-reveal]';
        const elements = document.querySelectorAll(selector);

        if (!elements.length) return;

        // Set initial hidden state
        elements.forEach(el => {
            if (!el.dataset.revealInitialized) {
                setInitialState(el);
                el.dataset.revealInitialized = 'true';
            }
        });

        // Create observer
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    // Unobserve after reveal (one-time animation)
                    if (entry.target.dataset.revealOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        elements.forEach(el => observer.observe(el));
    }

    /* ----------------------------------------
       Set Initial Hidden State
       ---------------------------------------- */
    function setInitialState(el) {
        const direction = el.dataset.reveal || 'up';
        const config = defaults[direction] || defaults.up;
        const distance = parseInt(el.dataset.revealDistance, 10) || 60;

        const x = config.x !== 0 ? (config.x > 0 ? distance : -distance) : 0;
        const y = config.y !== 0 ? (config.y > 0 ? distance : -distance) : 0;
        const scale = config.scale;

        el.style.opacity = '0';
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        el.style.transition = 'none';
        el.style.willChange = 'transform, opacity';
    }

    /* ----------------------------------------
       Reveal Element
       ---------------------------------------- */
    function revealElement(el) {
        const delay = parseInt(el.dataset.revealDelay, 10) || 0;
        const duration = parseInt(el.dataset.revealDuration, 10) || 800;
        const easing = el.dataset.revealEasing || 'cubic-bezier(0.16, 1, 0.3, 1)';

        // Force reflow
        el.offsetHeight;

        el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
        el.style.transitionDelay = `${delay}ms`;
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';

        // Clean up will-change after animation
        setTimeout(() => {
            el.style.willChange = 'auto';
        }, duration + delay + 100);
    }

    /* ----------------------------------------
       Manual Reveal
       ---------------------------------------- */
    function reveal(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.dataset.revealInitialized = 'false';
            setInitialState(el);
            revealElement(el);
        });
    }

    /* ----------------------------------------
       Reset Elements
       ---------------------------------------- */
    function reset(selector) {
        const elements = document.querySelectorAll(selector || '[data-reveal]');
        elements.forEach(el => {
            el.dataset.revealInitialized = 'false';
            setInitialState(el);
        });
    }

    /* ----------------------------------------
       Destroy Observer
       ---------------------------------------- */
    function destroy() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

})();

/* ============================================
   AUTO-INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Small delay to let layout settle
    setTimeout(() => {
        ScrollReveal.init();
    }, 100);
});

/* Re-init on dynamic content (optional hook) */
window.ScrollReveal = ScrollReveal;


/* ============================================
   SLIDER.JS — Scroll Reveal + Before/After Comparison
   ============================================ */

const SliderJS = (function () {
    'use strict';

    /* ============================================
       PART 1: SCROLL REVEAL
       ============================================ */

    const revealDefaults = {
        up: { y: 60, x: 0, scale: 1 },
        down: { y: -60, x: 0, scale: 1 },
        left: { y: 0, x: -60, scale: 1 },
        right: { y: 0, x: 60, scale: 1 },
        scale: { y: 0, x: 0, scale: 0.9 },
        fade: { y: 0, x: 0, scale: 1 }
    };

    let revealObserver;

    function initScrollReveal() {
        const elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        elements.forEach(el => {
            if (!el.dataset.revealInitialized) {
                setRevealInitialState(el);
                el.dataset.revealInitialized = 'true';
            }
        });

        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    if (entry.target.dataset.revealOnce !== 'false') {
                        revealObserver.unobserve(entry.target);
                    }
                }
            });
        }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

        elements.forEach(el => revealObserver.observe(el));
    }

    function setRevealInitialState(el) {
        const direction = el.dataset.reveal || 'up';
        const config = revealDefaults[direction] || revealDefaults.up;
        const distance = parseInt(el.dataset.revealDistance, 10) || 60;

        const x = config.x !== 0 ? (config.x > 0 ? distance : -distance) : 0;
        const y = config.y !== 0 ? (config.y > 0 ? distance : -distance) : 0;
        const scale = config.scale;

        el.style.opacity = '0';
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        el.style.transition = 'none';
        el.style.willChange = 'transform, opacity';
    }

    function revealElement(el) {
        const delay = parseInt(el.dataset.revealDelay, 10) || 0;
        const duration = parseInt(el.dataset.revealDuration, 10) || 800;
        const easing = el.dataset.revealEasing || 'cubic-bezier(0.16, 1, 0.3, 1)';

        el.offsetHeight;

        el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
        el.style.transitionDelay = `${delay}ms`;
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';

        setTimeout(() => {
            el.style.willChange = 'auto';
        }, duration + delay + 100);
    }

    /* ============================================
       PART 2: BEFORE/AFTER COMPARISON SLIDER
       ============================================ */

    function initComparisonSliders() {
        const sliders = document.querySelectorAll('[data-slider]');

        sliders.forEach(slider => {
            const handle = slider.querySelector('[data-slider-handle]');
            const afterImage = slider.querySelector('.comparison-after');
            if (!handle || !afterImage) return;

            let isDragging = false;

            function updateSliderPosition(clientX) {
                const rect = slider.getBoundingClientRect();
                let position = ((clientX - rect.left) / rect.width) * 100;
                position = Math.max(0, Math.min(100, position));

                // Update both width and handle position immediately
                afterImage.style.width = `${position}%`;
                handle.style.left = `${position}%`;
            }

            // Mouse events on handle
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
                e.stopPropagation();
                handle.style.cursor = 'grabbing';
                document.body.style.cursor = 'grabbing';
                document.body.style.userSelect = 'none';
            });

            // Mouse events on slider container too
            slider.addEventListener('mousedown', (e) => {
                if (e.target === handle || handle.contains(e.target)) return;
                isDragging = true;
                updateSliderPosition(e.clientX);
                document.body.style.cursor = 'grabbing';
                document.body.style.userSelect = 'none';
            });

            // Global mouse move - this is the key fix
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                updateSliderPosition(e.clientX);
            });

            // Global mouse up
            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    handle.style.cursor = 'col-resize';
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });

            // Touch events
            handle.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault();
            }, { passive: false });

            slider.addEventListener('touchstart', (e) => {
                if (e.target === handle || handle.contains(e.target)) return;
                isDragging = true;
                updateSliderPosition(e.touches[0].clientX);
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                updateSliderPosition(e.touches[0].clientX);
            }, { passive: false });

            window.addEventListener('touchend', () => {
                isDragging = false;
            });

            // Set initial position
            afterImage.style.width = '50%';
            handle.style.left = '50%';
        });
    }

    /* ============================================
       PUBLIC API
       ============================================ */

    return {
        init: function() {
            initScrollReveal();
            initComparisonSliders();
        },
        reveal: function(selector) {
            document.querySelectorAll(selector).forEach(el => {
                el.dataset.revealInitialized = 'false';
                setRevealInitialState(el);
                revealElement(el);
            });
        },
        reset: function(selector) {
            document.querySelectorAll(selector || '[data-reveal]').forEach(el => {
                el.dataset.revealInitialized = 'false';
                setRevealInitialState(el);
            });
        }
    };

})();

/* ============================================
   AUTO-INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SliderJS.init();
    }, 100);
});

window.SliderJS = SliderJS;
