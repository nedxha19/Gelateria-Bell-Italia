/* =========================================================================
   Gelateria Bell'Italia — header & mobile drawer
   -------------------------------------------------------------------------
   Replaces jQuery meanMenu. No dependencies.

   Why meanMenu was removed:
     - It clones markup using unscoped global selectors (`.mean-nav`,
       `.mean-bar`, `.mean-container`), so any second matching container
       silently corrupts the result.
     - Its only open/close trigger is the `.meanmenu-reveal` link, which the
       theme hides with `display: none !important` — so the generated list
       had no working toggle.
     - It re-runs on every window `resize`, and mobile browsers fire `resize`
       whenever the URL bar collapses.

   What this does instead: mirrors the header nav into the drawer once, then
   drives a single open/close state with focus management and a scroll lock.
   ========================================================================= */

(function () {
  "use strict";

  var DESKTOP_MIN = 992;
  var SCROLL_THRESHOLD = 24;
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  var header = document.getElementById("gm-header");
  var toggle = document.querySelector(".gm-nav-toggle");
  var drawer = document.getElementById("gm-drawer");
  var scrim = document.getElementById("gm-scrim");

  if (!header) return;

  /* ---------------------------------------------------------------------
     1. Mirror the primary nav into the drawer.
     The header list stays the single source of truth, so the two can never
     drift apart when a link is added or renamed.
     ------------------------------------------------------------------ */
  function buildDrawerNav() {
    var source = document.querySelector("#gm-primary-nav .gm-nav__list");
    var mount = drawer && drawer.querySelector(".gm-drawer__nav");
    if (!source || !mount || mount.childElementCount) return;

    var list = source.cloneNode(true);
    list.removeAttribute("id");
    list.className = "gm-drawer__list";

    Array.prototype.forEach.call(list.children, function (li) {
      var active = li.classList.contains("is-active");
      li.className = active ? "gm-drawer__item is-active" : "gm-drawer__item";
      var link = li.querySelector("a");
      if (link) link.className = "gm-drawer__link";
    });

    mount.appendChild(list);
  }

  /* ---------------------------------------------------------------------
     2. Open / close
     ------------------------------------------------------------------ */
  var isOpen = false;
  var lastFocused = null;

  // GSAP ScrollSmoother keeps scrolling the page behind an overlay unless it
  // is explicitly paused. Guarded so the file works without GSAP too.
  function pauseSmoother(paused) {
    try {
      if (window.ScrollSmoother && window.ScrollSmoother.get()) {
        window.ScrollSmoother.get().paused(paused);
      }
    } catch (err) {
      /* ScrollSmoother not active on this breakpoint — nothing to pause. */
    }
  }

  function openDrawer() {
    if (isOpen || !drawer || !toggle) return;
    isOpen = true;
    lastFocused = document.activeElement;

    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (scrim) scrim.classList.add("is-open");

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");

    document.documentElement.classList.add("gm-locked");
    pauseSmoother(true);

    var target =
      drawer.querySelector(".gm-drawer__close") || drawer.querySelector(FOCUSABLE);
    if (target) target.focus();
  }

  function closeDrawer(returnFocus) {
    if (!isOpen || !drawer || !toggle) return;
    isOpen = false;

    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (scrim) scrim.classList.remove("is-open");

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");

    document.documentElement.classList.remove("gm-locked");
    pauseSmoother(false);

    if (returnFocus !== false) {
      (lastFocused && lastFocused.focus ? lastFocused : toggle).focus();
    }
    lastFocused = null;
  }

  /* ---------------------------------------------------------------------
     3. Wiring
     ------------------------------------------------------------------ */
  function bind() {
    if (!drawer || !toggle) return;

    toggle.addEventListener("click", function () {
      isOpen ? closeDrawer() : openDrawer();
    });

    if (scrim) {
      scrim.addEventListener("click", function () {
        closeDrawer();
      });
    }

    var closeBtn = drawer.querySelector(".gm-drawer__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeDrawer();
      });
    }

    // Any link inside the drawer navigates away, so close first.
    drawer.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a[href]") : null;
      if (link) closeDrawer(false);
    });

    // Escape closes; Tab is trapped inside the panel while it is open.
    document.addEventListener("keydown", function (event) {
      if (!isOpen) return;

      if (event.key === "Escape" || event.key === "Esc") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") return;

      var nodes = drawer.querySelectorAll(FOCUSABLE);
      if (!nodes.length) return;

      var first = nodes[0];
      var last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Rotating to landscape can cross the desktop breakpoint while the panel
    // is open, which would leave the page scroll-locked with no visible way
    // out. matchMedia fires once on the crossing rather than on every resize.
    var desktop = window.matchMedia("(min-width: " + DESKTOP_MIN + "px)");
    var onBreakpoint = function (event) {
      if (event.matches && isOpen) closeDrawer(false);
    };
    if (desktop.addEventListener) {
      desktop.addEventListener("change", onBreakpoint);
    } else if (desktop.addListener) {
      desktop.addListener(onBreakpoint);
    }
  }

  /* ---------------------------------------------------------------------
     4. Compact header on scroll
     ------------------------------------------------------------------ */
  function bindScrollState() {
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      header.classList.toggle("is-scrolled", y > SCROLL_THRESHOLD);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  /* ---------------------------------------------------------------------
     5. Mark the current page in the nav.
     Saves hand-editing `is-active` on every template copy.
     ------------------------------------------------------------------ */
  function markCurrentPage() {
    var here = window.location.pathname.split("/").pop() || "index.html";
    var items = document.querySelectorAll("#gm-primary-nav .gm-nav__item");

    Array.prototype.forEach.call(items, function (item) {
      var link = item.querySelector("a");
      if (!link) return;
      var target = link.getAttribute("href");
      if (!target || target.charAt(0) === "#" || /^https?:/i.test(target)) return;

      if (target.split("/").pop() === here) {
        item.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        item.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });
  }

  function init() {
    markCurrentPage();
    buildDrawerNav();
    bind();
    bindScrollState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
