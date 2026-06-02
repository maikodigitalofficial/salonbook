/* ============================================
   NAVIGATION.JS — Mobile Menu Toggle & Header Scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
});

/* --------------------------------------------
   Mobile Menu Toggle
   -------------------------------------------- */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-links');
    const body = document.body;

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');

        if (isOpen) {
            closeMenu(toggle, menu, body);
        } else {
            openMenu(toggle, menu, body);
        }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('is-open')) {
                closeMenu(toggle, menu, body);
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu(toggle, menu, body);
        }
    });

    // Close menu when clicking outside (on the backdrop)
    menu.addEventListener('click', (e) => {
        if (e.target === menu) {
            closeMenu(toggle, menu, body);
        }
    });
}

function openMenu(toggle, menu, body) {
    menu.classList.add('is-open');
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
}

function closeMenu(toggle, menu, body) {
    menu.classList.remove('is-open');
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
}

/* --------------------------------------------
   Header Scroll State
   -------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('is-scrolled');
                } else {
                    header.classList.remove('is-scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}
