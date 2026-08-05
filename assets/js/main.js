// NIYI Photo Studio — interacciones compartidas
(function () {
  "use strict";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header: transparente + logo claro sobre fondos oscuros (navy), sólido + logo azul sobre fondos claros */
  var header = document.querySelector(".site-header");
  if (header) {
    var darkContainers = [].slice.call(document.querySelectorAll("section.navy, .site-footer"));
    var updateHeaderBg = function () {
      var probeY = header.getBoundingClientRect().bottom + 2;
      var isDark = darkContainers.some(function (el) {
        var r = el.getBoundingClientRect();
        return probeY >= r.top && probeY < r.bottom;
      });
      header.classList.toggle("scrolled", !isDark);
    };
    updateHeaderBg();
    window.addEventListener("scroll", updateHeaderBg, { passive: true });
    window.addEventListener("resize", updateHeaderBg);
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

  /* Galería interactiva de servicios (Home): carrusel de varias filas, sin recorte */
  var galleryWrap = document.querySelector(".gallery-wrap");
  if (galleryWrap) {
    var rows = [].slice.call(galleryWrap.querySelectorAll(".gallery-track"));
    var pills = document.querySelectorAll(".filter-pill");
    var baseTiles = rows.map(function (row) {
      return [].slice.call(row.querySelectorAll(".gallery-tile"));
    });
    var paused = false;
    var dragging = false;
    var dragMoved = false;
    var startX = 0;
    var startOffset = 0;
    var offset = 0;
    var speed = 0.35;
    var nudgeTimer = null;

    var applyOffset = function () {
      rows.forEach(function (row) { row.style.transform = "translateX(" + offset + "px)"; });
    };

    var wrapOffset = function () {
      var halfWidth = rows[0] ? rows[0].scrollWidth / 2 : 0;
      if (!halfWidth) return;
      offset = offset % halfWidth;
      if (offset > 0) offset -= halfWidth;
    };

    var buildRows = function (filter) {
      rows.forEach(function (row, i) {
        row.innerHTML = "";
        var matched = baseTiles[i].filter(function (tile) {
          return filter === "all" || tile.getAttribute("data-cat") === filter;
        });
        matched.concat(matched).forEach(function (tile) {
          row.appendChild(tile.cloneNode(true));
        });
      });
      offset = 0;
      applyOffset();
    };

    buildRows("all");

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        buildRows(pill.getAttribute("data-filter"));
      });
    });

    galleryWrap.addEventListener("mouseenter", function () { paused = true; });
    galleryWrap.addEventListener("mouseleave", function () { if (!dragging) paused = false; });

    var nudge = function (dir) {
      rows.forEach(function (row) { row.style.transition = "transform .5s cubic-bezier(.22,.61,.36,1)"; });
      offset += dir * 320;
      wrapOffset();
      applyOffset();
      clearTimeout(nudgeTimer);
      nudgeTimer = setTimeout(function () {
        rows.forEach(function (row) { row.style.transition = ""; });
      }, 520);
    };

    var prevBtn = galleryWrap.querySelector(".gallery-arrow.prev");
    var nextBtn = galleryWrap.querySelector(".gallery-arrow.next");
    if (prevBtn) prevBtn.addEventListener("click", function () { nudge(1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { nudge(-1); });

    /* Arrastre con mouse o táctil */
    galleryWrap.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".gallery-arrow")) return;
      dragging = true;
      dragMoved = false;
      paused = true;
      startX = e.clientX;
      startOffset = offset;
      rows.forEach(function (row) { row.style.transition = ""; });
      galleryWrap.classList.add("dragging");
      galleryWrap.setPointerCapture(e.pointerId);
    });
    galleryWrap.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved = true;
      offset = startOffset + dx;
      wrapOffset();
      applyOffset();
    });
    var endDrag = function () {
      if (!dragging) return;
      dragging = false;
      galleryWrap.classList.remove("dragging");
      paused = false;
    };
    galleryWrap.addEventListener("pointerup", endDrag);
    galleryWrap.addEventListener("pointercancel", endDrag);
    /* Evita que un arrastre dispare el click del tile (navegación) */
    galleryWrap.addEventListener(
      "click",
      function (e) {
        if (dragMoved) {
          e.preventDefault();
          e.stopPropagation();
          dragMoved = false;
        }
      },
      true
    );

    if (!reducedMotion) {
      var tick = function () {
        if (!paused && !dragging) {
          offset -= speed;
          wrapOffset();
          applyOffset();
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    var moreBtn = document.querySelector(".gallery-more");
    var fullBtn = document.querySelector(".gallery-full");
    if (moreBtn && fullBtn) {
      var rowsExpanded = false;
      moreBtn.addEventListener("click", function () {
        rowsExpanded = !rowsExpanded;
        galleryWrap.classList.toggle("expanded", rowsExpanded);
        moreBtn.textContent = rowsExpanded ? "Ver menos" : "Ver más";
        if (rowsExpanded) {
          fullBtn.hidden = false;
          requestAnimationFrame(function () { fullBtn.classList.add("is-visible"); });
        } else {
          fullBtn.classList.remove("is-visible");
          fullBtn.hidden = true;
        }
      });
    }
  }

  /* Galería completa (galeria.html): collage tipo masonry con foto ampliable */
  var collageGrids = document.querySelectorAll(".collage-grid");
  if (collageGrids.length) {
    var ROW_UNIT = 2;
    var GAP = 18;

    var debounce = function (fn, wait) {
      var t;
      return function () {
        clearTimeout(t);
        t = setTimeout(fn, wait);
      };
    };

    collageGrids.forEach(function (grid) {
      /* Envuelve cada <img> en un .collage-item con botón de cierre */
      [].slice.call(grid.children).forEach(function (img) {
        var item = document.createElement("div");
        item.className = "collage-item";
        img.parentNode.insertBefore(item, img);
        item.appendChild(img);
        var closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "close-x";
        closeBtn.setAttribute("aria-label", "Cerrar");
        closeBtn.textContent = "×";
        item.appendChild(closeBtn);
      });

      var items = [].slice.call(grid.querySelectorAll(".collage-item"));

      var spanFor = function (item) {
        var img = item.querySelector("img");
        var height = img.getBoundingClientRect().height;
        return Math.max(1, Math.ceil((height + GAP) / (ROW_UNIT + GAP)));
      };

      var layout = function (item) {
        item.style.gridRowEnd = "span " + spanFor(item);
      };

      var layoutAll = function () {
        items.forEach(layout);
      };

      /* ResizeObserver recalcula el span apenas la imagen tiene su tamaño real
         (evita cuadros con espacio en blanco por mediciones prematuras) */
      if ("ResizeObserver" in window) {
        var ro = new ResizeObserver(function (entries) {
          entries.forEach(function (entry) {
            var it = entry.target.closest(".collage-item");
            if (it && !it.classList.contains("expanded")) layout(it);
          });
        });
        items.forEach(function (item) { ro.observe(item.querySelector("img")); });
      } else {
        items.forEach(function (item) {
          var img = item.querySelector("img");
          if (img.complete) {
            layout(item);
          } else {
            img.addEventListener("load", function () { layout(item); });
          }
        });
        window.addEventListener("resize", debounce(layoutAll, 150));
      }

      /* Anima el reacomodo del collage (FLIP) */
      var flip = function (mutate) {
        if (reducedMotion) {
          mutate();
          return;
        }
        var first = items.map(function (it) { return it.getBoundingClientRect(); });
        mutate();
        var last = items.map(function (it) { return it.getBoundingClientRect(); });
        items.forEach(function (it, i) {
          var dx = first[i].left - last[i].left;
          var dy = first[i].top - last[i].top;
          var sx = last[i].width ? first[i].width / last[i].width : 1;
          var sy = last[i].height ? first[i].height / last[i].height : 1;
          if (dx || dy || sx !== 1 || sy !== 1) {
            it.style.transformOrigin = "top left";
            it.style.transition = "none";
            it.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")";
            requestAnimationFrame(function () {
              it.style.transition = "transform .45s cubic-bezier(.22,.61,.36,1)";
              it.style.transform = "";
            });
          }
        });
      };

      var collapseItem = function (item) {
        flip(function () {
          item.classList.remove("expanded");
          layout(item);
        });
      };

      var expandItem = function (item) {
        flip(function () {
          var current = grid.querySelector(".collage-item.expanded");
          if (current && current !== item) {
            current.classList.remove("expanded");
            layout(current);
          }
          item.classList.add("expanded");
          layout(item);
        });
      };

      items.forEach(function (item) {
        item.addEventListener("click", function () {
          if (item.classList.contains("expanded")) return;
          expandItem(item);
        });
        item.querySelector(".close-x").addEventListener("click", function (e) {
          e.stopPropagation();
          collapseItem(item);
        });
      });

      grid.addEventListener("click", function (e) {
        if (e.target === grid) {
          var current = grid.querySelector(".collage-item.expanded");
          if (current) collapseItem(current);
        }
      });
    });
  }
})();
