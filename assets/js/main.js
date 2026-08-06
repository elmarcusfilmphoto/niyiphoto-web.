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

  /* Hero editorial (Home): categorías por círculo, foto principal + 3 tarjetas */
  var heroRoot = document.querySelector(".hero-editorial");
  if (heroRoot) {
    /* Cada set = { main, thumbs:[5 fotos] }. Edita las rutas aquí para cambiar las fotos. */
    var HERO_SETS = [
      {
        main: "assets/img/gallery/hero/circulo-1-principal.jpg",
        thumbs: [
          "assets/img/gallery/hero/circulo-1-thumb-1.jpg",
          "assets/img/gallery/hero/circulo-1-thumb-2.jpg",
          "assets/img/gallery/hero/circulo-1-thumb-3.jpg",
          "assets/img/gallery/hero/circulo-1-thumb-4.jpg",
          "assets/img/gallery/hero/circulo-1-thumb-5.jpg"
        ]
      },
      {
        main: "assets/img/gallery/hero/circulo-2-principal.jpg",
        thumbs: [
          "assets/img/gallery/hero/circulo-2-thumb-1.jpg",
          "assets/img/gallery/hero/circulo-2-thumb-2.jpg",
          "assets/img/gallery/hero/circulo-2-thumb-3.jpg",
          "assets/img/gallery/hero/circulo-2-thumb-4.jpg",
          "assets/img/gallery/hero/circulo-2-thumb-5.jpg"
        ]
      },
      {
        main: "assets/img/gallery/hero/circulo-3-principal.jpg",
        thumbs: [
          "assets/img/gallery/hero/circulo-3-thumb-1.jpg",
          "assets/img/gallery/hero/circulo-3-thumb-2.jpg",
          "assets/img/gallery/hero/circulo-3-thumb-3.jpg",
          "assets/img/gallery/hero/circulo-3-thumb-4.jpg",
          "assets/img/gallery/hero/circulo-3-thumb-5.jpg"
        ]
      },
      {
        /* Bodas — 6 fotos: 3 pisos de 1-2-3. */
        main: "assets/img/gallery/hero/circulo-4-principal.jpg",
        thumbs: [
          "assets/img/gallery/hero/circulo-4-thumb-1.jpg",
          "assets/img/gallery/hero/circulo-4-thumb-2.jpg",
          "assets/img/gallery/hero/circulo-4-thumb-3.jpg",
          "assets/img/gallery/hero/circulo-4-thumb-4.jpg",
          "assets/img/gallery/hero/circulo-4-thumb-5.jpg",
          "assets/img/gallery/hero/circulo-4-thumb-6.jpg"
        ]
      },
      {
        main: "assets/img/gallery/bodas/01_16-49-12.jpg",
        thumbs: [
          "assets/img/gallery/bodas/15_16-07-34.jpg",
          "assets/img/gallery/bodas/14-14-48.jpg",
          "assets/img/gallery/bodas/16-09-35.jpg",
          "assets/img/gallery/bodas/15-38-45.jpg",
          "assets/img/gallery/bodas/15-42-06.jpg"
        ]
      },
      {
        main: "assets/img/gallery/bodas/16-25-13.jpg",
        thumbs: [
          "assets/img/gallery/bodas/16-34-18.jpg",
          "assets/img/gallery/bodas/16-34-26-2.jpg",
          "assets/img/gallery/bodas/16-57-31.jpg",
          "assets/img/gallery/bodas/17-13-03.jpg",
          "assets/img/gallery/bodas/18-38-57.jpg"
        ]
      },
      {
        main: "assets/img/gallery/bodas/18-45-07.jpg",
        thumbs: [
          "assets/img/gallery/bodas/18-51-14.jpg",
          "assets/img/gallery/bodas/18-52-59.jpg",
          "assets/img/gallery/bodas/20-44-51.jpg",
          "assets/img/gallery/bodas/20-49-35.jpg",
          "assets/img/gallery/bodas/20-54-13.jpg"
        ]
      },
      {
        /* Perfil profesional — placeholder con fotos de boda hasta que subas retratos corporativos reales. */
        main: "assets/img/gallery/bodas/17-42-05.jpg",
        thumbs: [
          "assets/img/gallery/bodas/17-17-51.jpg",
          "assets/img/gallery/bodas/14-09-27.jpg",
          "assets/img/gallery/bodas/14-09-12.jpg",
          "assets/img/gallery/bodas/14-12-16-2.jpg",
          "assets/img/gallery/bodas/15-20-04.jpg"
        ]
      }
    ];

    /* Texto por categoría (círculo). Editar aquí cuando decidas cada categoría. */
    var HERO_COPY = [
      {
        eyebrow: "Retratos con carácter propio",
        title: "Tu esencia,<br>en cada retrato.",
        lede: "Sesiones de retrato personal con una dirección natural y cercana — para que la foto se sienta tan tuya como te sientes tú."
      },
      {
        eyebrow: "Momentos en familia, para siempre",
        title: "El tiempo pasa.<br>Los recuerdos permanecen.",
        lede: "Fotografía de familia con recuerdos impresos que se pueden tocar, no solo mirar en una pantalla."
      },
      {
        eyebrow: "Su historia de dos, contada con detalle",
        title: "Dos historias,<br>una sola foto.",
        lede: "Sesiones de pareja y coberturas de boda que cuentan su historia de amor con emoción real."
      },
      {
        eyebrow: "Su gran día, contado con detalle",
        title: "Un 'sí, quiero'<br>que dura para siempre.",
        lede: "Coberturas de boda completas — civiles, eclesiásticas y recepción — con la emoción real del día capturada en cada foto."
      },
      {
        eyebrow: "Recuerdos para toda la vida",
        title: "El tiempo pasa.<br>Los recuerdos permanecen.",
        lede: "Fotografía de familia, bodas, embarazo, bebés y eventos — con recuerdos impresos que se pueden tocar."
      },
      {
        eyebrow: "Recuerdos para toda la vida",
        title: "El tiempo pasa.<br>Los recuerdos permanecen.",
        lede: "Fotografía de familia, bodas, embarazo, bebés y eventos — con recuerdos impresos que se pueden tocar."
      },
      {
        eyebrow: "Recuerdos para toda la vida",
        title: "El tiempo pasa.<br>Los recuerdos permanecen.",
        lede: "Fotografía de familia, bodas, embarazo, bebés y eventos — con recuerdos impresos que se pueden tocar."
      },
      {
        eyebrow: "Tu mejor perfil profesional",
        title: "Tu marca,<br>con la mejor cara.",
        lede: "Retratos corporativos y de marca personal para presentarte con seguridad ante el mundo."
      }
    ];

    var railItems = [].slice.call(heroRoot.querySelectorAll(".hero-editorial-rail-item"));
    var portraitFrame = heroRoot.querySelector(".hero-editorial-portrait-frame");
    var thumbBtns = [].slice.call(heroRoot.querySelectorAll(".hero-editorial-thumb"));
    var thumbsWrap = heroRoot.querySelector(".hero-editorial-thumbs");
    var railWrap = heroRoot.querySelector(".hero-editorial-rail");
    var heroTagline = heroRoot.querySelector(".hero-editorial-tagline");
    var heroTitle = heroRoot.querySelector(".hero-editorial-title");
    var heroLede = heroRoot.querySelector(".hero-editorial-copy .lede");
    var activeSet = 0;

    /* Extrae el color promedio de la foto principal, lo mezcla con el navy de
       marca (para mantener buen contraste) y lo aplica como fondo dinámico.
       También decide si el logo debe verse claro u oscuro segun ese color. */
    var applyAccentFromSrc = function (src) {
      var probe = new Image();
      probe.onload = function () {
        try {
          var w = 16, h = 16;
          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(probe, 0, 0, w, h);
          var data = ctx.getImageData(0, 0, w, h).data;
          var r = 0, g = 0, b = 0, n = 0;
          for (var i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            n++;
          }
          r /= n;
          g /= n;
          b /= n;
          var navy = { r: 13, g: 49, b: 75 };
          r = r * 0.45 + navy.r * 0.55;
          g = g * 0.45 + navy.g * 0.55;
          b = b * 0.45 + navy.b * 0.55;
          var lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          var maxLum = 95;
          if (lum > maxLum) {
            var scale = maxLum / lum;
            r *= scale;
            g *= scale;
            b *= scale;
          }
          r = Math.round(r);
          g = Math.round(g);
          b = Math.round(b);
          heroRoot.style.setProperty("--hero-accent", "rgb(" + r + "," + g + "," + b + ")");
          var finalLum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          heroRoot.classList.toggle("is-on-light", finalLum > 150);
        } catch (e) {
          /* si el canvas falla por algun motivo, se mantiene el navy por defecto */
        }
      };
      probe.src = src;
    };

    /* Crea una segunda capa de imagen para poder cruzar (crossfade) sin nunca
       mostrar el fondo del contenedor entre una foto y otra. */
    var makeCrossfader = function (container, className) {
      var first = container.querySelector("." + className);
      first.classList.add("cf-active");
      var second = first.cloneNode(true);
      second.classList.remove("cf-active");
      container.appendChild(second);
      var active = first;
      var inactive = second;
      return {
        get: function () {
          return active.getAttribute("src") || "";
        },
        set: function (src, animate) {
          if (this.get() === src) return;
          inactive.src = src;
          var doSwap = function () {
            active.classList.remove("cf-active");
            inactive.classList.add("cf-active");
            var tmp = active;
            active = inactive;
            inactive = tmp;
          };
          if (!animate || reducedMotion) {
            doSwap();
          } else {
            requestAnimationFrame(doSwap);
          }
        }
      };
    };

    var mainCf = makeCrossfader(portraitFrame, "hero-editorial-main-img");
    var thumbCfs = thumbBtns.map(function (btn) {
      return makeCrossfader(btn, "hero-editorial-thumb-img");
    });
    var blurLayer = portraitFrame.querySelector(".hero-editorial-blur-layer");
    var setBlurLayer = function (src) {
      if (blurLayer) blurLayer.src = src;
    };

    var renderRailThumbs = function () {
      railItems.forEach(function (item, i) {
        var img = item.querySelector(".hero-editorial-rail-img");
        img.src = HERO_SETS[i].main;
      });
    };

    var applySet = function (index, animate) {
      activeSet = index;
      var set = HERO_SETS[index];
      mainCf.set(set.main, animate);
      setBlurLayer(set.main);
      thumbCfs.forEach(function (cf, i) {
        if (set.thumbs[i]) cf.set(set.thumbs[i], animate);
      });
      thumbBtns.forEach(function (btn, i) {
        btn.classList.toggle("is-hidden", i >= set.thumbs.length);
      });
      if (thumbsWrap) thumbsWrap.classList.toggle("has-six", set.thumbs.length === 6);
      railItems.forEach(function (item, i) {
        item.classList.toggle("active", i === index);
      });
      var copy = HERO_COPY[index];
      if (copy) {
        if (heroTagline) heroTagline.textContent = copy.eyebrow;
        if (heroTitle) heroTitle.innerHTML = copy.title;
        if (heroLede) heroLede.textContent = copy.lede;
      }
      applyAccentFromSrc(set.main);
    };

    /* Click en un círculo: cambia la categoría activa */
    railItems.forEach(function (item, i) {
      item.addEventListener("click", function () {
        if (i !== activeSet) applySet(i, true);
      });
    });

    /* Click en una tarjeta: se intercambia con la foto principal */
    thumbBtns.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        var prevMain = mainCf.get();
        var prevThumb = thumbCfs[i].get();
        mainCf.set(prevThumb, true);
        setBlurLayer(prevThumb);
        thumbCfs[i].set(prevMain, true);
        HERO_SETS[activeSet].main = prevThumb;
        HERO_SETS[activeSet].thumbs[i] = prevMain;
        railItems[activeSet].querySelector(".hero-editorial-rail-img").src = prevThumb;
        applyAccentFromSrc(prevThumb);
      });
    });

    /* Rueda del mouse sobre el riel: avanza de categoría poco a poco */
    if (railWrap) {
      var wheelAccum = 0;
      var WHEEL_THRESHOLD = 140;
      railWrap.addEventListener(
        "wheel",
        function (e) {
          e.preventDefault();
          wheelAccum += e.deltaY;
          if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
            var dir = wheelAccum > 0 ? 1 : -1;
            var next = Math.min(HERO_SETS.length - 1, Math.max(0, activeSet + dir));
            if (next !== activeSet) applySet(next, true);
            wheelAccum = 0;
          }
        },
        { passive: false }
      );
    }

    renderRailThumbs();
    /* Circulo inicial al azar en cada carga/refresh, para que quien entre varias veces vea fotos distintas. */
    applySet(Math.floor(Math.random() * HERO_SETS.length), false);
  }

  /* Buscador del menú: encuentra la pagina/servicio por palabra clave */
  var SEARCH_INDEX = [
    { label: "Parejas", url: "parejas.html", keywords: "parejas pareja novios compromiso resumen" },
    { label: "Sesión de Pareja", url: "sesion-pareja.html", keywords: "sesion de pareja sesion pareja novios retrato romantico estudio" },
    { label: "Bodas — Arma tu cobertura", url: "bodas.html", keywords: "bodas boda paquetes cobertura arma tu cobertura getting ready recepcion" },
    { label: "Bodas Civiles", url: "civiles.html", keywords: "boda civil civil registro civil firma" },
    { label: "Bodas Eclesiásticas", url: "ceremoniales.html", keywords: "boda eclesiastica iglesia ceremonia religiosa coleccion" },
    { label: "Familias", url: "familias.html", keywords: "familia familias sesion familiar mascota" },
    { label: "Maternidad", url: "maternidad.html", keywords: "maternidad embarazo recien nacido baby shower panza" },
    { label: "Bebés", url: "bebes.html", keywords: "bebes bebe recien nacido primer año membresia" },
    { label: "Retratos", url: "retratos.html", keywords: "retratos retrato personal estudio profesional" },
    { label: "Eventos", url: "eventos.html", keywords: "eventos bautizo comunion confirmacion religioso" },
    { label: "Marca & Empresas", url: "marca.html", keywords: "marca empresa corporativo retrato profesional negocio" },
    { label: "Galería", url: "galeria.html", keywords: "galeria fotos portafolio collage" }
  ];
  var normalize = function (s) {
    return s
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n");
  };
  document.querySelectorAll(".nav-search").forEach(function (wrap) {
    var input = wrap.querySelector(".nav-search-input");
    var results = wrap.querySelector(".nav-search-results");
    if (!input || !results) return;
    var render = function () {
      var q = normalize(input.value.trim());
      results.innerHTML = "";
      if (!q) {
        results.hidden = true;
        return;
      }
      var matches = SEARCH_INDEX.filter(function (item) {
        return normalize(item.keywords).indexOf(q) !== -1 || normalize(item.label).indexOf(q) !== -1;
      }).slice(0, 6);
      if (!matches.length) {
        var empty = document.createElement("div");
        empty.className = "nav-search-empty";
        empty.textContent = "Sin resultados — escríbenos por WhatsApp";
        results.appendChild(empty);
        results.hidden = false;
        return;
      }
      matches.forEach(function (item) {
        var a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.label;
        results.appendChild(a);
      });
      results.hidden = false;
    };
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = results.querySelector("a");
        if (first) window.location.href = first.getAttribute("href");
      }
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) results.hidden = true;
    });
  });

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
    var GAP = 7;

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
