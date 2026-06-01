/**
 * PORTAFOLIO PROFESIONAL - BECERRO VISUALS
 * Script principal de interacciones, animaciones y galería interactiva.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CARGA INICIAL Y REVEAL ON SCROLL DINÁMICO (BIDIRECCIONAL)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
  
  if ('IntersectionObserver' in window && !isMobileViewport) {
    const observerOptions = {
      root: null,
      rootMargin: '-8% 0px -8% 0px', // Activa la entrada/salida ligeramente dentro del viewport
      threshold: 0.1 // Se activa cuando al menos el 10% del elemento es visible
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('activo');
        } else {
          // REMUEVE la clase al salir de la pantalla para reactivar la animación al hacer scroll en dirección opuesta (arriba o abajo)
          entry.target.classList.remove('activo');
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // En móvil el contenido queda visible sin animación para evitar parpadeos por viewport dinámico.
    revealElements.forEach(element => {
      element.classList.add('activo');
    });
  }

  // Activar de inmediato los elementos del Hero (carga inicial rápida)
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('activo');
    }, 100);
  }


  // ==========================================================================
  // 2. NAV BAR DINÁMICO (STILL & SCROLLED STYLES)
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ==========================================================================
  // 3. MENÚ MÓVIL RESPONSIVE
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
    });

    // Cerrar menú móvil al hacer clic en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ==========================================================================
  // 4. FILTROS DINÁMICOS DEL PORTAFOLIO
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.tarjeta-proyecto');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover clase activa de todos los botones y agregar al seleccionado
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          // Animación suave de aparición
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          // Ocultar suavemente
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400); // Mismo tiempo que las transiciones CSS
        }
      });

      // Actualizar índices del Lightbox después de filtrar
      updateActiveImagesList(filterValue);
    });
  });





  // ==========================================================================
  // 6. LIGHTBOX NATIVO PREMIUM CON NAVEGACIÓN COMPLETA
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxOpenBtn = document.getElementById('lightbox-open-btn');
  const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');

  let activeImages = []; // Almacenará las imágenes actualmente visibles según el filtro
  let currentImageIndex = 0;

  // Inicializar la lista de imágenes activas en la carga inicial
  const initImagesList = () => {
    activeImages = Array.from(projectCards);
  };
  
  // Actualiza la lista de tarjetas basándose en el filtro activo
  const updateActiveImagesList = (filter) => {
    if (filter === 'all') {
      activeImages = Array.from(projectCards);
    } else {
      activeImages = Array.from(projectCards).filter(card => card.getAttribute('data-category') === filter);
    }
  };

  initImagesList();

  // Función para abrir Lightbox en una imagen específica
  const openLightbox = (cardElement) => {
    // Encontrar el índice de la tarjeta clickeada dentro del grupo filtrado
    currentImageIndex = activeImages.indexOf(cardElement);
    if (currentImageIndex === -1) return;

    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
  };

  // Función para actualizar los contenidos (imagen, título, etc.) del Lightbox
  const updateLightboxContent = () => {
    const card = activeImages[currentImageIndex];
    if (!card) return;

    const img = card.querySelector('img');
    const imageSrc = img.currentSrc || img.src;
    const tag = card.querySelector('.tarjeta-tag').textContent;
    const title = card.querySelector('.tarjeta-title').textContent;
    const desc = card.querySelector('.tarjeta-desc').textContent;

    // Transición de opacidad interna para suavizar el cambio de imagen
    lightboxImg.style.opacity = '0';
    lightboxImg.src = imageSrc;
    lightboxImg.alt = img.alt;
    
    lightboxTag.textContent = tag;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    // Actualizar botones de descarga y vista completa
    if (lightboxOpenBtn) {
      lightboxOpenBtn.href = imageSrc;
    }
    if (lightboxDownloadBtn) {
      lightboxDownloadBtn.href = imageSrc;
      // Nombre del archivo para descargar (extraemos el basename del path)
      const filename = imageSrc.split('/').pop() || 'becerro-visuals.webp';
      lightboxDownloadBtn.setAttribute('download', filename);
    }

    // Fade-in una vez cargada
    lightboxImg.onload = () => {
      lightboxImg.style.opacity = '1';
    };
    
    // Si la imagen ya estaba en caché y no dispara onload inmediatamente
    if (lightboxImg.complete) {
      lightboxImg.style.opacity = '1';
    }
  };

  // Navegación: Siguiente Imagen
  const nextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % activeImages.length;
    updateLightboxContent();
  };

  // Navegación: Imagen Anterior
  const prevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + activeImages.length) % activeImages.length;
    updateLightboxContent();
  };

  // Cerrar Lightbox
  const closeLightboxView = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
  };

  // Asignar eventos de click a cada tarjeta del portafolio
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card);
    });
  });

  // Eventos de control de Lightbox
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxView);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightboxView);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // Soporte de Teclado (Esc, Flechas Izquierda y Derecha)
  document.addEventListener('keydown', (event) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (event.key === 'Escape') {
        closeLightboxView();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      }
    }
  });

});
