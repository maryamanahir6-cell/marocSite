/**
 * Maroc Tourism Site - Main JavaScript
 * Pure JS implementation matching the React/TanStack design
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE DETECTION
  // ============================================
  const isMobile = () => window.innerWidth < 768;

  // ============================================
  // HEADER
  // ============================================
  function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    // Mobile menu toggle
    const menuBtn = header.querySelector('.mobile-menu-btn');
    const mobileNav = header.querySelector('.mobile-nav');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen);
        const icon = menuBtn.querySelector('svg, i');
        if (icon) {
          icon.innerHTML = isOpen 
            ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
            : '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        }
      });

      // Close mobile menu on link click
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Active link highlighting
    const currentPath = window.location.pathname;
    header.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath.endsWith('index.html') && href === './')) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // SCROLL EFFECTS
  // ============================================
  function initScrollEffects() {
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (header) {
        if (currentScroll > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // CAROUSEL
  // ============================================
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const items = carousel.querySelectorAll('.carousel-item');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');
      const dots = carousel.querySelectorAll('.carousel-dot');

      if (!track || items.length === 0) return;

      let currentIndex = 0;
      const totalItems = items.length;

      function goToSlide(index) {
        if (index < 0) index = totalItems - 1;
        if (index >= totalItems) index = 0;

        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });

        // Update items
        items.forEach((item, i) => {
          item.classList.toggle('active', i === currentIndex);
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
      }

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
      });

      // Auto-play
      let autoplayInterval;
      const autoplay = carousel.dataset.autoplay === 'true';

      if (autoplay) {
        autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);

        carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carousel.addEventListener('mouseleave', () => {
          autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });
      }

      // Touch support
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) goToSlide(currentIndex + 1);
        if (touchEndX - touchStartX > 50) goToSlide(currentIndex - 1);
      }, { passive: true });

      // Keyboard support
      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
      });
    });
  }

  // ============================================
  // TABS
  // ============================================
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabsContainer => {
      const triggers = tabsContainer.querySelectorAll('.tabs-trigger');
      const contents = tabsContainer.querySelectorAll('.tabs-content');

      triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          const target = trigger.dataset.target;

          triggers.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));

          trigger.classList.add('active');
          const content = tabsContainer.querySelector(`[data-tab="${target}"]`);
          if (content) content.classList.add('active');
        });
      });
    });
  }

  // ============================================
  // ACCORDION
  // ============================================
  function initAccordions() {
    document.querySelectorAll('.accordion').forEach(accordion => {
      const items = accordion.querySelectorAll('.accordion-item');

      items.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const content = item.querySelector('.accordion-content');

        if (trigger && content) {
          trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others if not multiple
            if (!accordion.classList.contains('accordion-multiple')) {
              items.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.accordion-content').style.maxHeight = '0';
              });
            }

            if (!isOpen) {
              item.classList.add('open');
              content.style.maxHeight = content.scrollHeight + 'px';
            }
          });
        }
      });
    });
  }

  // ============================================
  // DIALOG / MODAL
  // ============================================
  function initDialogs() {
    document.querySelectorAll('[data-dialog-trigger]').forEach(trigger => {
      const dialogId = trigger.dataset.dialogTrigger;
      const dialog = document.getElementById(dialogId);

      if (dialog) {
        trigger.addEventListener('click', () => {
          dialog.classList.add('open');
          document.body.style.overflow = 'hidden';
        });

        dialog.querySelectorAll('[data-dialog-close]').forEach(closeBtn => {
          closeBtn.addEventListener('click', () => {
            dialog.classList.remove('open');
            document.body.style.overflow = '';
          });
        });

        dialog.addEventListener('click', (e) => {
          if (e.target === dialog) {
            dialog.classList.remove('open');
            document.body.style.overflow = '';
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && dialog.classList.contains('open')) {
            dialog.classList.remove('open');
            document.body.style.overflow = '';
          }
        });
      }
    });
  }

  // ============================================
  // DARK MODE TOGGLE
  // ============================================
  function initDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('dark-mode');

    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    }

    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('dark-mode', document.documentElement.classList.contains('dark'));
    });
  }

  // ============================================
  // TOOLTIPS
  // ============================================
  function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      const tooltipText = el.dataset.tooltip;

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      document.body.appendChild(tooltip);

      el.addEventListener('mouseenter', () => {
        const rect = el.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        tooltip.classList.add('visible');
      });

      el.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ============================================
  // FORM VALIDATION
  // ============================================
  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        let isValid = true;

        form.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  function initLazyImages() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // COUNTERS / ANIMATED NUMBERS
  // ============================================
  function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const duration = parseInt(el.dataset.duration) || 2000;
          const step = target / (duration / 16);
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, 16);

          counterObserver.unobserve(el);
        }
      });
    });

    document.querySelectorAll('[data-count]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  // ============================================
  // BACK TO TOP
  // ============================================
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  function init() {
    initHeader();
    initScrollEffects();
    initCarousels();
    initTabs();
    initAccordions();
    initDialogs();
    initDarkMode();
    initTooltips();
    initSmoothScroll();
    initForms();
    initLazyImages();
    initCounters();
    initBackToTop();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize after dynamic content loads
  window.MarocSite = {
    reinit: init
  };

})();
