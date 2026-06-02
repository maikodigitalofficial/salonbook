/* ============================================
   MAIN.JS — Core Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initSmoothScroll();
    initCurrentYear();
});

/* --------------------------------------------
Page Loader
-------------------------------------------- */
function initLoader() {
    // Trigger animations after fonts and critical assets load
    if (document.fonts) {
        document.fonts.ready.then(() => {
            document.body.classList.add('loaded');
        });
    } else {
        // Fallback for older browsers
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // Safety fallback — always show content after 3s max
    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) {
            document.body.classList.add('loaded');
        }
    }, 3000);
}

/* --------------------------------------------
   Navigation
   -------------------------------------------- */
function initNavigation() {
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled state for header styling
        if (currentScroll > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* --------------------------------------------
   Smooth Scroll
   -------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --------------------------------------------
   Current Year
   -------------------------------------------- */
function initCurrentYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

/* --------------------------------------------
   Utility: Debounce
   -------------------------------------------- */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* --------------------------------------------
   Utility: Throttle
   -------------------------------------------- */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
