/* ============================================
   GALLERY.JS — Lightbox Preview & Load More
   ============================================ */

(function() {
  'use strict';

  /* ============================================
     CONFIGURATION
     ============================================ */
  const CONFIG = {
    itemsPerLoad: 4,
    animationDelay: 100,
    lightboxTransition: 300,
  };

  /* ============================================
     LIGHTBOX / PREVIEW MODAL
     ============================================ */

  class GalleryLightbox {
    constructor() {
      this.currentIndex = 0;
      this.items = [];
      this.isOpen = false;

      this.buildDOM();
      this.bindEvents();
      this.collectItems();
    }

    // Build the lightbox DOM structure — CLOSE BUTTON ABOVE IMAGE
    buildDOM() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'gallery-lightbox';
      this.overlay.setAttribute('role', 'dialog');
      this.overlay.setAttribute('aria-modal', 'true');
      this.overlay.setAttribute('aria-label', 'Image preview');

      this.overlay.innerHTML = `
        <!-- Top bar: counter + close (above image) -->
        <div class="lightbox-top-bar">
          <span class="lightbox-counter"><span class="lightbox-current">1</span> / <span class="lightbox-total">1</span></span>
          <button class="lightbox-close" aria-label="Close preview">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Navigation: left arrow -->
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Image container -->
        <div class="lightbox-image-wrapper">
          <img class="lightbox-image" src="" alt="" />
        </div>

        <!-- Navigation: right arrow -->
        <button class="lightbox-nav lightbox-next" aria-label="Next image">
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Caption bar: below image -->
        <div class="lightbox-caption-bar">
          <strong class="lightbox-title"></strong>
          <div class="lightbox-meta"></div>
        </div>
      `;

      document.body.appendChild(this.overlay);

      // Cache references
      this.imageEl = this.overlay.querySelector('.lightbox-image');
      this.titleEl = this.overlay.querySelector('.lightbox-title');
      this.metaEl = this.overlay.querySelector('.lightbox-meta');
      this.currentCounter = this.overlay.querySelector('.lightbox-current');
      this.totalCounter = this.overlay.querySelector('.lightbox-total');
      this.closeBtn = this.overlay.querySelector('.lightbox-close');
      this.prevBtn = this.overlay.querySelector('.lightbox-prev');
      this.nextBtn = this.overlay.querySelector('.lightbox-next');
    }

    // Collect all visible gallery items
    collectItems() {
      this.refreshItems();
    }

    refreshItems() {
      this.items = Array.from(document.querySelectorAll('.gallery-item:not(.is-hidden):not(.is-hidden-load)'));
    }

    // Bind click events
    bindEvents() {
      // Gallery item clicks (image + zoom button)
      document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        // Click on image, zoom button, or anywhere inside the card triggers preview
        if (e.target.closest('.gallery-item-image') || e.target.closest('.gallery-item-zoom')) {
          e.preventDefault();
          this.refreshItems();
          this.open(item);
        }
      });

      // Lightbox controls
      this.closeBtn.addEventListener('click', () => this.close());
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      // Click outside image to close
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay || e.target.classList.contains('lightbox-image-wrapper')) {
          this.close();
        }
      });
    }

    // Open lightbox for a specific item
    open(item) {
      this.refreshItems();
      this.currentIndex = this.items.indexOf(item);
      if (this.currentIndex === -1) this.currentIndex = 0;

      this.isOpen = true;
      this.updateContent();
      this.overlay.classList.add('is-open');
      document.body.classList.add('lightbox-open');
    }

    // Close lightbox
    close() {
      this.isOpen = false;
      this.overlay.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
    }

    // Navigate to previous item
    prev() {
      if (this.items.length <= 1) return;
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
      this.updateContent();
    }

    // Navigate to next item
    next() {
      if (this.items.length <= 1) return;
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.updateContent();
    }

    // Update lightbox content based on current item
    updateContent() {
      const item = this.items[this.currentIndex];
      if (!item) return;

      const img = item.querySelector('.gallery-item-image img');
      const title = item.querySelector('.gallery-item-title')?.textContent || '';
      const category = item.querySelector('.gallery-item-category')?.textContent || '';
      const stylist = item.querySelector('.gallery-item-stylist')?.textContent || '';

      // Update counter
      this.currentCounter.textContent = this.currentIndex + 1;
      this.totalCounter.textContent = this.items.length;

      // Fade out image briefly
      this.imageEl.style.opacity = '0';
      this.imageEl.style.transform = 'scale(0.92)';

      setTimeout(() => {
        this.imageEl.src = img?.src || '';
        this.imageEl.alt = img?.alt || '';
        this.titleEl.textContent = title;
        this.metaEl.textContent = `${category} • ${stylist}`;
        this.imageEl.style.opacity = '1';
        this.imageEl.style.transform = 'scale(1)';
      }, 150);

      // Update nav button visibility
      this.prevBtn.style.display = this.items.length > 1 ? 'inline-flex' : 'none';
      this.nextBtn.style.display = this.items.length > 1 ? 'inline-flex' : 'none';
    }
  }

  /* ============================================
     LOAD MORE
     ============================================ */

  class GalleryLoadMore {
    constructor() {
      this.grid = document.querySelector('.gallery-grid');
      this.btn = document.querySelector('.btn-load-more');
      this.items = [];
      this.hiddenItems = [];
      this.isLoading = false;

      if (!this.grid || !this.btn) return;

      this.init();
    }

    init() {
      // Collect all items
      this.items = Array.from(this.grid.querySelectorAll('.gallery-item'));

      // Hide items beyond initial count
      const initialCount = this.items.length > CONFIG.itemsPerLoad ? CONFIG.itemsPerLoad * 3 : this.items.length;
      this.items.forEach((item, index) => {
        if (index >= initialCount) {
          item.classList.add('is-hidden-load');
          item.style.display = 'none';
          this.hiddenItems.push(item);
        }
      });

      // Hide button if nothing to load
      if (this.hiddenItems.length === 0) {
        this.btn.style.display = 'none';
        return;
      }

      this.btn.addEventListener('click', () => this.loadMore());
    }

    loadMore() {
      if (this.isLoading || this.hiddenItems.length === 0) return;
      this.isLoading = true;

      // Show loading state
      const originalText = this.btn.innerHTML;
      this.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      this.btn.disabled = true;

      // Simulate brief delay for UX
      setTimeout(() => {
        const toShow = this.hiddenItems.splice(0, CONFIG.itemsPerLoad);

        toShow.forEach((item, index) => {
          item.style.display = '';
          item.classList.remove('is-hidden-load');

          // Reset animation state for scroll reveal
          item.style.opacity = '0';
          item.style.transform = 'translateY(30px)';
          item.style.transition = 'none';

          // Staggered reveal
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * CONFIG.animationDelay);
        });

        // Re-collect visible items for lightbox
        if (window.galleryLightbox) {
          window.galleryLightbox.refreshItems();
        }

        // Reset button
        this.isLoading = false;
        this.btn.innerHTML = originalText;
        this.btn.disabled = false;

        // Hide button if no more items
        if (this.hiddenItems.length === 0) {
          this.btn.style.display = 'none';
        }
      }, 400);
    }
  }

  /* ============================================
     FILTER FUNCTIONALITY
     ============================================ */

  class GalleryFilter {
    constructor() {
      this.filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
      this.items = document.querySelectorAll('.gallery-item');
      this.grid = document.querySelector('.gallery-grid');
      this.loadMoreBtn = document.querySelector('.btn-load-more');

      if (!this.grid) return;

      this.bindEvents();
    }

    bindEvents() {
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => this.filter(btn.dataset.filter, btn));
      });
    }

    filter(category, activeBtn) {
      // Update active button state
      this.filterBtns.forEach(b => b.classList.remove('is-active'));
      activeBtn.classList.add('is-active');

      this.items.forEach((item) => {
        const itemCategory = item.dataset.category;
        const shouldShow = category === 'all' || itemCategory === category;

        if (shouldShow) {
          item.classList.remove('is-hidden');
          // Only show if not hidden by load-more
          if (!item.classList.contains('is-hidden-load')) {
            item.style.display = '';
          }
        } else {
          item.classList.add('is-hidden');
          item.style.display = 'none';
        }
      });

      // Reset load more when filtering
      this.resetLoadMore(category);

      // Refresh lightbox items
      if (window.galleryLightbox) {
        window.galleryLightbox.refreshItems();
      }
    }

    resetLoadMore(activeCategory) {
      if (!this.loadMoreBtn) return;

      // Get currently visible items (matching filter)
      const visibleItems = Array.from(this.items).filter(item => !item.classList.contains('is-hidden'));

      if (activeCategory === 'all') {
        // Re-initialize load more for "all" view
        if (window.galleryLoadMore) {
          window.galleryLoadMore.hiddenItems = [];
          visibleItems.forEach((item, index) => {
            if (index >= CONFIG.itemsPerLoad * 3) {
              item.classList.add('is-hidden-load');
              item.style.display = 'none';
              window.galleryLoadMore.hiddenItems.push(item);
            } else {
              item.classList.remove('is-hidden-load');
              item.style.display = '';
            }
          });
          this.loadMoreBtn.style.display = window.galleryLoadMore.hiddenItems.length > 0 ? 'inline-flex' : 'none';
        }
      } else {
        // For filtered views, show all matching items (no load more)
        visibleItems.forEach(item => {
          item.classList.remove('is-hidden-load');
          item.style.display = '';
        });
        this.loadMoreBtn.style.display = 'none';
      }
    }
  }

  /* ============================================
     INITIALIZE
     ============================================ */

  document.addEventListener('DOMContentLoaded', () => {
    // Initialize lightbox (make globally accessible for load-more refresh)
    window.galleryLightbox = new GalleryLightbox();

    // Initialize load more
    window.galleryLoadMore = new GalleryLoadMore();

    // Initialize filter
    new GalleryFilter();
  });

})();
