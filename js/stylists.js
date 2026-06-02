/* ============================================
   STYLISTS.JS — Filter, Sort & Load More
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       DOM References
       ---------------------------------------- */
    const filterBtns = document.querySelectorAll('.stylists-filter .filter-btn');
    const sortSelect = document.querySelector('.stylists-filter .sort-select');
    const stylistsGrid = document.querySelector('.stylists-grid');
    const loadMoreBtn = document.querySelector('.stylists-load-more .btn-load-more');

    /* ----------------------------------------
       State
       ---------------------------------------- */
    let currentFilter = 'all';
    let currentSort = 'featured';
    let visibleCount = 8;
    const increment = 4;

    /* All stylist cards (static in DOM, we show/hide) */
    let allCards = Array.from(document.querySelectorAll('.stylist-card'));

    /* ----------------------------------------
       Parse experience from card text
       ---------------------------------------- */
    function parseExperience(text) {
        const match = text.match(/(\d+)\s+yrs?\s+exp/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function parseRating(text) {
        const match = text.match(/(\d\.\d)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /* ----------------------------------------
       Filter Logic
       ---------------------------------------- */
    function getFilteredCards() {
        if (currentFilter === 'all') return [...allCards];

        return allCards.filter(card => {
            const specialties = card.dataset.specialty || '';
            return specialties.includes(currentFilter);
        });
    }

    /* ----------------------------------------
       Sort Logic
       ---------------------------------------- */
    function sortCards(cards) {
        const sorted = [...cards];

        if (currentSort === 'featured') {
            return sorted;
        } else if (currentSort === 'rating') {
            sorted.sort((a, b) => {
                const ratingA = parseRating(a.querySelector('.rating-score').textContent);
                const ratingB = parseRating(b.querySelector('.rating-score').textContent);
                return ratingB - ratingA;
            });
        } else if (currentSort === 'experience') {
            sorted.sort((a, b) => {
                const expA = parseExperience(a.querySelector('.meta-item').textContent);
                const expB = parseExperience(b.querySelector('.meta-item').textContent);
                return expB - expA;
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

        allCards.forEach(card => {
            card.style.display = 'none';
        });

        const toShow = sorted.slice(0, visibleCount);
        toShow.forEach((card, index) => {
            card.style.display = '';
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

        if (loadMoreBtn) {
            if (sorted.length <= visibleCount) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = '';
            }
        }

        if (toShow.length === 0 && stylistsGrid) {
            let emptyMsg = stylistsGrid.querySelector('.stylists-empty');
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.className = 'stylists-empty';
                emptyMsg.innerHTML = `
                    <p>No stylists found for this specialty yet.</p>
                    <a href="booking.html" class="btn btn-primary">Book with Any Stylist</a>
                `;
                emptyMsg.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: var(--space-3xl) 0;
                    color: var(--color-text-muted);
                `;
                stylistsGrid.appendChild(emptyMsg);
            }
            emptyMsg.style.display = '';
        } else {
            const emptyMsg = stylistsGrid?.querySelector('.stylists-empty');
            if (emptyMsg) emptyMsg.style.display = 'none';
        }
    }

    /* ----------------------------------------
       Event: Filter Buttons
       ---------------------------------------- */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            currentFilter = btn.dataset.filter;
            visibleCount = 8;
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
