/* ============================================
   REVIEWS.JS — Filter, Sort & Load More
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       DOM References
       ---------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('.sort-select');
    const reviewsGrid = document.querySelector('.reviews-grid');
    const loadMoreBtn = document.querySelector('.btn-load-more');

    /* ----------------------------------------
       State
       ---------------------------------------- */
    let currentFilter = 'all';
    let currentSort = 'newest';
    let visibleCount = 9;
    const increment = 6;

    /* All review cards (static in DOM, we just show/hide) */
    let allCards = Array.from(document.querySelectorAll('.review-card'));

    /* ----------------------------------------
       Parse date from card text
       ---------------------------------------- */
    function parseDate(text) {
        const map = {
            'day': 1,
            'week': 7,
            'month': 30,
            'year': 365
        };
        const match = text.match(/(\d+)\s+(day|week|month|year)s?\s+ago/);
        if (!match) return 0;
        const num = parseInt(match[1], 10);
        const unit = map[match[2]] || 1;
        return num * unit;
    }

    /* ----------------------------------------
       Filter Logic
       ---------------------------------------- */
    function getFilteredCards() {
        if (currentFilter === 'all') return [...allCards];

        return allCards.filter(card => {
            const service = card.dataset.service;
            return service === currentFilter;
        });
    }

    /* ----------------------------------------
       Sort Logic
       ---------------------------------------- */
    function sortCards(cards) {
        const sorted = [...cards];

        if (currentSort === 'newest') {
            sorted.sort((a, b) => {
                const dateA = parseDate(a.querySelector('.review-date').textContent.trim());
                const dateB = parseDate(b.querySelector('.review-date').textContent.trim());
                return dateA - dateB; // smaller number = more recent
            });
        } else if (currentSort === 'highest') {
            sorted.sort((a, b) => {
                const starsA = a.querySelectorAll('.review-stars span').length;
                const starsB = b.querySelectorAll('.review-stars span').length;
                return starsB - starsA;
            });
        } else if (currentSort === 'lowest') {
            sorted.sort((a, b) => {
                const starsA = a.querySelectorAll('.review-stars span').length;
                const starsB = b.querySelectorAll('.review-stars span').length;
                return starsA - starsB;
            });
        }

        return sorted;
    }

    /* ----------------------------------------
       Render
       ---------------------------------------- */
    function render() {
        const filtered = getFilteredCards();
        const sorted = sortCards(filtered);

        /* Hide all first */
        allCards.forEach(card => {
            card.style.display = 'none';
        });

        /* Show sorted subset */
        const toShow = sorted.slice(0, visibleCount);
        toShow.forEach((card, index) => {
            card.style.display = '';
            /* Staggered simple fade for newly revealed cards */
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            card.style.transition = 'opacity 200ms ease, transform 200ms ease';

            requestAnimationFrame(() => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 40);
            });
        });

        /* Toggle load more button */
        if (loadMoreBtn) {
            if (sorted.length <= visibleCount) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = '';
            }
        }

        /* Update empty state if needed */
        if (toShow.length === 0 && reviewsGrid) {
            let emptyMsg = reviewsGrid.querySelector('.reviews-empty');
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.className = 'reviews-empty';
                emptyMsg.innerHTML = `
                    <p>No reviews found for this service yet.</p>
                    <a href="booking.html" class="btn btn-primary">Be the First to Review</a>
                `;
                emptyMsg.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: var(--space-3xl) 0;
                    color: var(--color-text-muted);
                `;
                reviewsGrid.appendChild(emptyMsg);
            }
            emptyMsg.style.display = '';
        } else {
            const emptyMsg = reviewsGrid?.querySelector('.reviews-empty');
            if (emptyMsg) emptyMsg.style.display = 'none';
        }
    }

    /* ----------------------------------------
       Event: Filter Buttons
       ---------------------------------------- */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            /* Toggle active state */
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            currentFilter = btn.dataset.filter;
            visibleCount = 9; /* Reset pagination on filter change */
            render();
        });
    });

    /* ----------------------------------------
       Event: Sort Dropdown
       ---------------------------------------- */
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            render();
        });
    }

    /* ----------------------------------------
       Event: Load More
       ---------------------------------------- */
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += increment;
            render();
        });
    }

    /* ----------------------------------------
       Init
       ---------------------------------------- */
    render();

})();
