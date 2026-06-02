/* ============================================
   ANIMATIONS.JS — JavaScript Animation Fallback
   ============================================

   Mirrors css/animations.css using Web Animations API.
   Use when CSS animations fail or for programmatic control.

   Usage: AnimationsJS.init() or AnimationsJS.play('hero')

   ============================================ */

const AnimationsJS = (function () {
    'use strict';

    const EASINGS = {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    };

    const KEYFRAMES = {
        fadeInUp: [
            { opacity: 0, transform: 'translateY(40px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ],
        fadeIn: [
            { opacity: 0 },
            { opacity: 1 }
        ],
        slideDown: [
            { opacity: 0, transform: 'translateY(-100%)' },
            { opacity: 1, transform: 'translateY(0)' }
        ],
        scaleIn: [
            { opacity: 0, transform: 'scale(1.3)' },
            { opacity: 1, transform: 'scale(1)' }
        ],
        slideInRight: [
            { opacity: 0, transform: 'translateX(60px)' },
            { opacity: 1, transform: 'translateX(0)' }
        ],
        popIn: [
            { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
            { opacity: 1, transform: 'scale(1) translateY(0)' }
        ]
    };

    const TIMING = {
        header: { duration: 700, easing: EASINGS.smooth, delay: 0 },
        headline: { duration: 800, easing: EASINGS.smooth, stagger: 150 },
        subhead: { duration: 700, easing: EASINGS.smooth, delay: 600 },
        button: { duration: 600, easing: EASINGS.smooth, stagger: 100, delay: 800 },
        heroImage: { duration: 1600, easing: EASINGS.smooth, delay: 400 },
        social: { duration: 700, easing: EASINGS.smooth, delay: 1100 },
        badge: { duration: 800, easing: EASINGS.bounce, delay: 1300 },
        dot: { duration: 500, easing: EASINGS.bounce, delay: 1500 },
        bookingBar: { duration: 800, easing: EASINGS.smooth, delay: 1400 },
        bookingField: { duration: 500, easing: EASINGS.smooth, stagger: 100, delay: 1700 },
        bookingBtn: { duration: 600, easing: EASINGS.smooth, delay: 2100 }
    };

    /* ----------------------------------------
       Public API
       ---------------------------------------- */
    return {
        init,
        play,
        pause,
        reset,
        isCSSAnimationsWorking,
        initFAQ
    };

    /* ----------------------------------------
       Initialize — auto-detect and fallback
       ---------------------------------------- */
    function init() {
        // If CSS animations are working, don't interfere
        if (isCSSAnimationsWorking()) {
            console.log('AnimationsJS: CSS animations active, JS fallback standby');
            return;
        }

        console.log('AnimationsJS: CSS animations failed, using JS fallback');
        playAll();
    }

    /* ----------------------------------------
       Check if CSS animations are functional
       ---------------------------------------- */
    function isCSSAnimationsWorking() {
        const testEl = document.createElement('div');
        testEl.style.animation = 'none';
        const computed = window.getComputedStyle(testEl).animation;
        return computed !== undefined && computed !== '';
    }

    /* ----------------------------------------
       Play all animations
       ---------------------------------------- */
    function playAll() {
        // Reset all elements first
        reset();

        // Header
        animate('.site-header', KEYFRAMES.slideDown, TIMING.header);

        // Headline lines
        animateStagger('.headline-line', KEYFRAMES.fadeInUp, TIMING.headline);

        // Subhead
        animate('.hero-subhead', KEYFRAMES.fadeInUp, TIMING.subhead);

        // Buttons
        animateStagger('.hero-actions .btn', KEYFRAMES.fadeInUp, TIMING.button);

        // Hero image
        animate('.hero-image', KEYFRAMES.scaleIn, TIMING.heroImage);

        // Social proof
        animate('.hero-social', KEYFRAMES.fadeInUp, TIMING.social);

        // Badge
        animate('.hero-badge', KEYFRAMES.popIn, TIMING.badge);

        // Dot
        animate('.hero-dot', KEYFRAMES.popIn, TIMING.dot);

        // Booking bar
        animate('.booking-bar-inner', KEYFRAMES.fadeInUp, TIMING.bookingBar);

        // Booking fields
        animateStagger('.booking-field', KEYFRAMES.fadeIn, TIMING.bookingField);

        // Booking button
        animate('.booking-btn', KEYFRAMES.fadeInUp, TIMING.bookingBtn);
    }

    /* ----------------------------------------
       Play specific section
       ---------------------------------------- */
    function play(section) {
        const map = {
            hero: () => {
                animate('.site-header', KEYFRAMES.slideDown, TIMING.header);
                animateStagger('.headline-line', KEYFRAMES.fadeInUp, TIMING.headline);
                animate('.hero-subhead', KEYFRAMES.fadeInUp, TIMING.subhead);
                animateStagger('.hero-actions .btn', KEYFRAMES.fadeInUp, TIMING.button);
                animate('.hero-image', KEYFRAMES.scaleIn, TIMING.heroImage);
                animate('.hero-social', KEYFRAMES.fadeInUp, TIMING.social);
                animate('.hero-badge', KEYFRAMES.popIn, TIMING.badge);
                animate('.hero-dot', KEYFRAMES.popIn, TIMING.dot);
            },
            booking: () => {
                animate('.booking-bar-inner', KEYFRAMES.fadeInUp, TIMING.bookingBar);
                animateStagger('.booking-field', KEYFRAMES.fadeIn, TIMING.bookingField);
                animate('.booking-btn', KEYFRAMES.fadeInUp, TIMING.bookingBtn);
            }
        };

        if (map[section]) {
            map[section]();
        }
    }

    /* ----------------------------------------
       Pause all running animations
       ---------------------------------------- */
    function pause() {
        document.querySelectorAll('*').forEach(el => {
            if (el.getAnimations) {
                el.getAnimations().forEach(anim => anim.pause());
            }
        });
    }

    /* ----------------------------------------
       Reset all animated elements
       ---------------------------------------- */
    function reset() {
        const selectors = [
            '.headline-line',
            '.hero-subhead',
            '.hero-actions .btn',
            '.hero-image',
            '.site-header',
            '.hero-social',
            '.hero-badge',
            '.hero-dot',
            '.booking-bar-inner',
            '.booking-field',
            '.booking-divider',
            '.booking-btn'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.opacity = '0';
                el.style.transform = '';
            });
        });
    }

    /* ----------------------------------------
       Core animate function
       ---------------------------------------- */
    function animate(selector, keyframes, timing) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        const options = {
            duration: timing.duration,
            delay: timing.delay || 0,
            easing: timing.easing,
            fill: 'forwards'
        };

        elements.forEach(el => {
            // Cancel any existing animation
            if (el.getAnimations) {
                el.getAnimations().forEach(anim => anim.cancel());
            }
            el.animate(keyframes, options);
        });
    }

    /* ----------------------------------------
       Staggered animate function
       ---------------------------------------- */
    function animateStagger(selector, keyframes, timing) {
        const elements = Array.from(document.querySelectorAll(selector));
        if (!elements.length) return;

        elements.forEach((el, index) => {
            const options = {
                duration: timing.duration,
                delay: (timing.delay || 0) + (index * (timing.stagger || 0)),
                easing: timing.easing,
                fill: 'forwards'
            };

            if (el.getAnimations) {
                el.getAnimations().forEach(anim => anim.cancel());
            }
            el.animate(keyframes, options);
        });
    }

    /* ----------------------------------------
       FAQ Accordion Init
       ---------------------------------------- */
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (!question) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all other items (optional — remove this block for multi-open)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('is-open')) {
                        otherItem.classList.remove('is-open');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.classList.remove('is-open');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('is-open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

})();

/* Auto-init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
    // Delay to let CSS animations attempt first
    setTimeout(() => {
        AnimationsJS.init();
    }, 100);

    // Init FAQ accordion
    AnimationsJS.initFAQ();
});
