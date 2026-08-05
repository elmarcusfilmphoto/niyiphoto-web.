// NIYI Photo Studio — interacciones compartidas
(function () {
  "use strict";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header: transparente sobre el hero, sólido al hacer scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menú desplegable móvil: abrir un nivel a la vez con la flecha */
  var dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.closest(".nav-item, .dropdown-item");
      if (!parent) return;
      var isOpen = parent.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
  var navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("change", function () {
      if (!navToggle.checked) {
        document.querySelectorAll(".nav-item.open, .dropdown-item.open").forEach(function (el) {
          el.classList.remove("open");
        });
        dropdownToggles.forEach(function (btn) {
          btn.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  /* Animaciones de aparición al hacer scroll */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* Galería interactiva de servicios (Home) */
  var galleryWrap = document.querySelector(".gallery-wrap");
  if (galleryWrap) {
    var pills = document.querySelectorAll(".filter-pill");
    var tiles = galleryWrap.querySelectorAll(".gallery-tile");
    var grid = galleryWrap.querySelector(".gallery-grid");

    var updateOverflow = function () {
      var overflows = grid.scrollHeight > grid.clientHeight + 4;
      galleryWrap.classList.toggle("no-overflow", !overflows);
    };

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var filter = pill.getAttribute("data-filter");
        tiles.forEach(function (tile) {
          var match = filter === "all" || tile.getAttribute("data-cat") === filter;
          tile.classList.toggle("hidden", !match);
        });
        galleryWrap.classList.remove("expanded");
        requestAnimationFrame(updateOverflow);
      });
    });

    var moreBtn = galleryWrap.querySelector(".gallery-more");
    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        galleryWrap.classList.add("expanded");
      });
    }

    window.addEventListener("load", updateOverflow);
    window.addEventListener("resize", updateOverflow);
    requestAnimationFrame(updateOverflow);
  }
})();
