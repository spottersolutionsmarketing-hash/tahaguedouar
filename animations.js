(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (!reduced) root.classList.add('tg-anim-init');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // 1. Preloader & Staggered Hero Entrance
    var preloader = document.getElementById('tg-preloader');
    var heroTargets = [
      { sel: '.small-label', delay: 40 },
      { sel: '.portrait-wrap', delay: 120 },
      { sel: 'h1', delay: 160 },
      { sel: '.hero-description', delay: 240 },
      { sel: '.hero-cta .hero-btn', delay: 320, step: 80 },
      { sel: '.stats-section .stat', delay: 380, step: 70 }
    ];

    heroTargets.forEach(function (cfg) {
      var els = document.querySelectorAll(cfg.sel);
      els.forEach(function (el, i) {
        el.classList.add('tg-hero-item');
        el.style.setProperty('--tg-delay', (cfg.delay + (cfg.step || 0) * i) + 'ms');
      });
    });

    function finishPreloader() {
      if (preloader && !preloader.classList.contains('tg-done')) {
        preloader.classList.add('tg-done');
      }
      root.classList.add('tg-hero-in');
      checkVisibleStats();
    }

    if (reduced) {
      finishPreloader();
    } else {
      var minTimer = setTimeout(finishPreloader, 550);
      window.addEventListener('load', function () {
        clearTimeout(minTimer);
        setTimeout(finishPreloader, 250);
      });
      setTimeout(finishPreloader, 1200);
    }

    // 2. Top Scroll Progress Bar & Hero Parallax
    var progressBar = document.getElementById('tg-scroll-progress');
    var portraitWrap = document.querySelector('.portrait-wrap');
    var floatIcons = document.querySelectorAll('.float-ic');
    var ticking = false;

    function updateScrollFX() {
      ticking = false;
      var scrollY = window.pageYOffset || root.scrollTop || 0;
      var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

      if (progressBar) {
        var ratio = Math.min(1, Math.max(0, scrollY / maxScroll));
        progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      }

      if (!reduced && scrollY < 900) {
        if (portraitWrap) {
          portraitWrap.style.transform = 'translate3d(0,' + (scrollY * 0.08).toFixed(1) + 'px,0)';
        }
        floatIcons.forEach(function (ic, idx) {
          var dir = idx % 2 === 0 ? -0.05 : 0.06;
          ic.style.marginTop = (scrollY * dir).toFixed(1) + 'px';
        });
      }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollFX);
      }
    }, { passive: true });
    updateScrollFX();

    // 3. Smooth Momentum-Style Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var headerOffset = 80;
       var startY = window.pageYOffset || root.scrollTop || 0;
        var targetY = Math.max(0, target.getBoundingClientRect().top + startY - headerOffset);
        if (reduced) {
          window.scrollTo(0, targetY);
          return;
        }
        var diff = targetY - startY;
        var duration = Math.min(950, Math.max(450, Math.abs(diff) * 0.45));
        var startTime = null;
        function easeInOutQuart(t) {
          return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
        }
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min(1, (ts - startTime) / duration);
          window.scrollTo(0, startY + diff * easeInOutQuart(p));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        if (history.pushState) history.pushState(null, '', href);
      });
    });

    // 4. Scroll-Triggered Reveals (IntersectionObserver)
    var revealGroups = [
      '.section-header', '.xp-row', '.service-card', '.tool-card',
      '.about-title', '.about-content p', '.skills li',
      '.contact-head', '.contact-wrap', '.contact-item'
    ];
    var revealEls = [];
    revealGroups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, idx) {
        el.classList.add('tg-reveal');
        el.style.setProperty('--tg-delay', ((idx % 6) * 65) + 'ms');
        revealEls.push(el);
      });
    });

    if (!reduced && 'IntersectionObserver' in window) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('tg-in');
            revObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { revObs.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('tg-in'); });
    }

    // 5. Reliable Animated KPI Count-Ups
    var statEls = Array.prototype.slice.call(document.querySelectorAll('.stat-num[data-target]'));
    function animateStat(el) {
      if (el.dataset.tgCounted === '1') return;
      el.dataset.tgCounted = '1';
      var raw = el.getAttribute('data-target') || '0';
      var target = parseFloat(raw) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var isFloat = raw.indexOf('.') !== -1;
      if (reduced) {
        el.textContent = raw + suffix;
        return;
      }
      var dur = 1350;
      var start = null;
      function frame(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        var val = target * eased;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = raw + suffix;
      }
      requestAnimationFrame(frame);
    }

    function checkVisibleStats() {
      statEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          animateStat(el);
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var statObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            statObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      statEls.forEach(function (el) { statObs.observe(el); });
    } else {
      statEls.forEach(animateStat);
    }

    // 6. Interactive Work Filter Tabs
    var workSection = document.getElementById('work');
    var xpList = workSection ? workSection.querySelector('.xp-list') : null;
    if (xpList) {
      var rows = Array.prototype.slice.call(xpList.querySelectorAll('.xp-row'));
      rows.forEach(function (row) {
        var txt = (row.textContent || '').toLowerCase();
        var cats = [];
        if (/marketing|operations|ops|manager|agency|spotter|strategy|growth|lead|coordinator/.test(txt)) cats.push('marketing-ops');
        if (/social|community|instagram|tiktok|facebook|engagement|account/.test(txt)) cats.push('social-media');
        if (/content|video|reel|shoot|production|edit|creator|creative|copy|media/.test(txt)) cats.push('content-video');
        if (/event|festival|exhibition|conference|summit|activation|coverage|live/.test(txt)) cats.push('events');
        if (!cats.length) cats.push('marketing-ops');
        row.dataset.cats = cats.join(' ');
      });

      var tabs = [
        { id: 'all', en: 'All', ar: 'الكل' },
        { id: 'marketing-ops', en: 'Marketing & Ops', ar: 'التسويق والعمليات' },
        { id: 'social-media', en: 'Social Media', ar: 'التواصل الاجتماعي' },
        { id: 'content-video', en: 'Content & Video', ar: 'المحتوى والفيديو' },
        { id: 'events', en: 'Events', ar: 'الفعاليات' }
      ];

      var bar = document.createElement('div');
      bar.className = 'tg-work-filters';
      bar.setAttribute('role', 'tablist');
      var isAr = root.lang === 'ar' || root.dir === 'rtl';

      tabs.forEach(function (tab, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tg-filter-btn' + (i === 0 ? ' active' : '');
        btn.setAttribute('data-filter', tab.id);
        btn.setAttribute('data-en', tab.en);
        btn.setAttribute('data-ar', tab.ar);
        btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        btn.textContent = isAr ? tab.ar : tab.en;

        btn.addEventListener('click', function () {
          bar.querySelectorAll('.tg-filter-btn').forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');

          var filter = tab.id;
          rows.forEach(function (row) {
            var match = filter === 'all' || (row.dataset.cats || '').indexOf(filter) !== -1;
            row.classList.remove('tg-filter-enter');
            if (match) {
              row.classList.remove('tg-hidden');
              row.classList.add('tg-in');
              void row.offsetWidth;
              row.classList.add('tg-filter-enter');
            } else {
              row.classList.add('tg-hidden');
            }
          });
        });
        bar.appendChild(btn);
      });

      xpList.parentNode.insertBefore(bar, xpList);
    }
  });
})();(function () { 'use strict'; function initRoleSwitcher() { var cards = document.querySelectorAll('.tg-role-card[data-role]'); var marketingEl = document.getElementById('marketing-section'); var graphicEl = document.getElementById('graphic-designer-section'); if (!cards.length || !marketingEl || !graphicEl) return; marketingEl.classList.remove('is-active'); marketingEl.hidden = true; graphicEl.classList.remove('is-active'); graphicEl.hidden = true; cards.forEach(function (btn) { btn.classList.remove('is-active'); btn.setAttribute('aria-selected', 'false'); }); var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; cards.forEach(function (card) { card.addEventListener('click', function () { var role = card.getAttribute('data-role'); var showMarketing = role === 'marketing'; var activePanel = showMarketing ? marketingEl : graphicEl; var inactivePanel = showMarketing ? graphicEl : marketingEl; cards.forEach(function (btn) { var isSel = btn === card; btn.classList.toggle('is-active', isSel); btn.setAttribute('aria-selected', isSel ? 'true' : 'false'); }); inactivePanel.classList.remove('is-active'); inactivePanel.hidden = true; activePanel.hidden = false; activePanel.classList.remove('is-active'); void activePanel.offsetWidth; activePanel.classList.add('is-active'); if (showMarketing) { window.dispatchEvent(new Event('scroll')); setTimeout(function () { window.dispatchEvent(new Event('scroll')); }, 120); } activePanel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }); }); } if (document.readyState !== 'loading') initRoleSwitcher(); else document.addEventListener('DOMContentLoaded', initRoleSwitcher); })();
