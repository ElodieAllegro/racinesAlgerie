import './js/cache.js';
import './js/performance.js';
import './js/reviews.js';
// Chargement asynchrone des ressources non‑critiques
function loadNonCriticalResources() {
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  fontAwesome.media = 'print';
  fontAwesome.onload = function() { this.media = 'all'; };
  document.head.appendChild(fontAwesome);
}

// Optimisation du chargement initial
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('🚀 Initialisation des systèmes de performance...');

  // Charger les ressources non‑critiques un peu après le load
  setTimeout(loadNonCriticalResources, 100);

  // Cache manager
  if (window.cacheManager) {
    console.log('✅ Gestionnaire de cache initialisé');
  }

  // Menu mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');

      navToggle.querySelectorAll('span').forEach((span, i) => {
        if (navMenu.classList.contains('active')) {
          if (i === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (i === 1) span.style.opacity = '0';
          if (i === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          span.style.transform = 'none';
          span.style.opacity = '1';
        }
      });
    });
  }

  // Fermeture du menu au clic sur un lien
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelectorAll('span').forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      }
    });
  });

  // Smooth scroll pour ancres
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const pos = target.offsetTop - headerHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // Animation on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.service-card, .value-item, .gallery-item, .blog-post')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

  // Dropdown clavier
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          const first = menu.querySelector('a');
          if (first) first.focus();
        }
      }
    });
    
    // Gestion clavier dans le menu dropdown
    menu.addEventListener('keydown', e => {
      const menuLinks = menu.querySelectorAll('a');
      const currentIndex = Array.from(menuLinks).indexOf(document.activeElement);
      
      if (e.key === 'Escape') {
        link.setAttribute('aria-expanded', 'false');
        link.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < menuLinks.length - 1 ? currentIndex + 1 : 0;
        menuLinks[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuLinks.length - 1;
        menuLinks[prevIndex].focus();
      }
    });

    // Permettre la navigation normale sur les liens du dropdown
    menu.querySelectorAll('a').forEach(dropdownLink => {
      dropdownLink.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          // Laisser le comportement par défaut (navigation)
          // Ne pas empêcher la navigation avec preventDefault()
        }
      });
    });
  });

  // Fermer les dropdowns au clic extérieur
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      if (!dropdown.contains(e.target)) {
        link.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Gestion du formulaire (validation + envoi)
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (field.type !== 'checkbox') {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--error-color)';
            field.addEventListener('input', () => {
              if (field.value.trim()) field.style.borderColor = '';
            });
          }
        } else {
          if (!field.checked) {
            isValid = false;
            field.style.outline = '2px solid var(--error-color)';
            field.addEventListener('change', () => {
              if (field.checked) field.style.outline = '';
            });
          }
        }
      });

      if (!isValid) {
        const firstInvalid = form.querySelector(
          '[required]:invalid, [required][style*="border-color"], [required][style*="outline"]'
        );
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Envoi via Basin
      const data = new FormData(form);
      fetch(form.action, {
        method: form.method,
        headers: { 'Accept': 'application/json' },
        body: data
      })
      .then(res => {
        if (res.status === 200) {
          form.reset();
          showPopup('✅ Merci ! Votre demande a bien été envoyée.', true);
        } else if (res.status === 404) {
          showPopup('❌ Ressource non trouvée (404).', false);
        } else {
          showPopup(`❌ Erreur serveur (${res.status}).`, false);
        }
      })
      .catch(err => {
        console.error('Erreur réseau :', err);
        showPopup('❌ Problème de connexion. Vérifiez votre réseau.', false);
      });
    });
  }

  // Popup feedback
  function showPopup(message, isSuccess = true) {
    const popup        = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose   = document.getElementById('popup-close');

    popupMessage.innerHTML = message;
    popupMessage.style.color = isSuccess ? 'green' : 'red';
    popup.style.display = 'flex';

    popupClose.onclick = () => popup.style.display = 'none';
    setTimeout(() => { popup.style.display = 'none'; }, 6000);
  }

  // Erreurs JS globales
  window.addEventListener('error', e => {
    console.error('Erreur JavaScript :', e.error);
  });
  window.addEventListener('error', e => {
    if (e.filename && e.filename.includes('cache')) {
      console.warn('Erreur de cache détectée, nettoyage...', e);
      if (window.cacheManager) window.cacheManager.clear();
    }
  });
}

// Utilitaires globaux
window.utils = {
  formatPrice: price => new Intl.NumberFormat('fr-FR',{
    style: 'currency', currency: 'EUR'
  }).format(price),

  validateEmail: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  formatPhone: phone => phone.replace(/(\d{2})(?=\d)/g, '$1 '),

  debounce: (fn, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  optimizeImage: (img, quality = 0.8) => {
    if (img.complete && img.naturalHeight) {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      return canvas.toDataURL('image/jpeg', quality);
    }
    return null;
  }
};

// Tracking placeholder
window.trackEvent = window.utils.trackEvent || (()=>{});
