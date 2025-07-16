// Navigation mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les systèmes de cache et cookies
    console.log('🚀 Initialisation des systèmes de performance...');
    
    // Vérifier si les gestionnaires sont disponibles
    if (window.cacheManager) {
        console.log('✅ Gestionnaire de cache initialisé');
    }
    
    if (window.cookieManager) {
        console.log('✅ Gestionnaire de cookies initialisé');
    }
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animation des barres du hamburger
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
    
    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });
    
    // Smooth scroll pour les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Effet parallax léger sur le hero
    // const hero = document.querySelector('.hero');
    // if (hero) {
    //     window.addEventListener('scroll', () => {
    //         const scrolled = window.pageYOffset;
    //         const rate = scrolled * -0.5;
    //         hero.style.transform = `translateY(${rate}px)`;
    //     });
    // }
    
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les cartes de service et autres éléments
    const animatedElements = document.querySelectorAll('.service-card, .value-item, .gallery-item, .blog-post');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Gestion des dropdowns au clavier
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = link.getAttribute('aria-expanded') === 'true';
                link.setAttribute('aria-expanded', !isExpanded);
                
                if (!isExpanded) {
                    const firstMenuItem = menu.querySelector('a');
                    if (firstMenuItem) firstMenuItem.focus();
                }
            }
        });
        
        // Fermer le dropdown avec Escape
        menu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                link.setAttribute('aria-expanded', 'false');
                link.focus();
            }
        });
    });
    
    // Validation des formulaires
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--error-color)';
                    
                    // Retirer la couleur d'erreur après correction
                    field.addEventListener('input', () => {
                        if (field.value.trim()) {
                            field.style.borderColor = '';
                        }
                    });
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                const firstInvalidField = form.querySelector('[required]:invalid, [required][style*="border-color"]');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
    
    // Amélioration de l'accessibilité des éléments interactifs
    const interactiveElements = document.querySelectorAll('.gallery-item, .service-card, .blog-post');
    interactiveElements.forEach(element => {
        // Ajouter la navigation au clavier
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = element.querySelector('a');
                if (link) link.click();
            }
        });
        
        // Améliorer les états de focus
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
    
    // Gestion des messages de feedback
    function showMessage(message, type = 'success') {
        // Sauvegarder le message dans le cache pour persistance
        if (window.cacheManager) {
            window.cacheManager.set('last_message', { message, type, timestamp: Date.now() }, 5 * 60 * 1000);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Animation d'entrée
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression automatique
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
    
    // Exposer la fonction showMessage globalement
    window.showMessage = showMessage;
    
    // Fonction pour sauvegarder les préférences utilisateur
    function saveUserPreferences(preferences) {
        if (window.cacheManager) {
            window.cacheManager.set('user_preferences', preferences, 30 * 24 * 60 * 60 * 1000); // 30 jours
        }
    }
    
    // Fonction pour charger les préférences utilisateur
    function loadUserPreferences() {
        if (window.cacheManager) {
            return window.cacheManager.get('user_preferences') || {};
        }
        return {};
    }
    
    // Appliquer les préférences utilisateur
    const userPrefs = loadUserPreferences();
    if (userPrefs.theme) {
        document.documentElement.setAttribute('data-theme', userPrefs.theme);
    }
    
    // Exposer les fonctions de préférences
    window.saveUserPreferences = saveUserPreferences;
    window.loadUserPreferences = loadUserPreferences;
    
// Gestion du scroll pour le header sticky
// Force le header à toujours rester visible
const header = document.querySelector('.header');
header.style.transform = 'translateY(0)';


    // Préchargement des images au survol
    // Cette fonctionnalité est maintenant gérée par PerformanceOptimizer
    
    // Gestion des erreurs JavaScript
    window.addEventListener('error', (e) => {
        console.error('Erreur JavaScript:', e.error);
        // En production, vous pourriez envoyer ces erreurs à un service de monitoring
    });
    
    // Performance: lazy loading pour les éléments non critiques
    // Cette fonctionnalité est maintenant gérée par PerformanceOptimizer
    
    // Écouter les événements de consentement des cookies
    window.addEventListener('cookieConsentUpdated', (event) => {
        const consent = event.detail;
        console.log('Consentement cookies mis à jour:', consent);
        
        // Activer/désactiver les fonctionnalités selon le consentement
        if (consent.preferences.analytics) {
            // Activer Google Analytics ou autres outils d'analyse
            console.log('Analytics activé');
        }
        
        if (consent.preferences.marketing) {
            // Activer les pixels de tracking, etc.
            console.log('Marketing activé');
        }
    });
    
    // Fonction pour gérer les erreurs de cache
    window.addEventListener('error', (e) => {
        if (e.filename && e.filename.includes('cache')) {
            console.warn('Erreur de cache détectée, nettoyage...', e);
            if (window.cacheManager) {
                window.cacheManager.clear();
            }
        }
    });
});

// Utilitaires globaux
window.utils = {
    // Formater un prix
    formatPrice: (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    },
    
    // Valider un email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Formater un numéro de téléphone
    formatPhone: (phone) => {
        return phone.replace(/(\d{2})(?=\d)/g, '$1 ');
    },
    
    // Débounce pour optimiser les performances
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Fonction pour tracker les événements avec consentement
    trackEvent: (eventName, properties = {}) => {
        // Vérifier le consentement avant de tracker
        if (window.cookieManager && window.cookieManager.hasConsent('analytics')) {
            console.log('Event tracked:', eventName, properties);
            // Ici vous pourriez intégrer Google Analytics, Mixpanel, etc.
        }
    },
    
    // Fonction pour optimiser les images
    optimizeImage: (img, quality = 0.8) => {
        if (img.complete && img.naturalHeight !== 0) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL('image/jpeg', quality);
        }
        return null;
    }
};

// Analytics et tracking (placeholder)
window.trackEvent = window.utils.trackEvent;

// Gestion des cookies (placeholder pour conformité RGPD)
// Cette fonctionnalité est maintenant gérée par CookieManager