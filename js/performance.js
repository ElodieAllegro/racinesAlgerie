/**
 * Optimisations de performance avec cache et lazy loading
 */
class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.contentObserver = null;
        this.prefetchQueue = [];
        this.init();
    }

    init() {
        // Initialiser le lazy loading des images
        this.initLazyLoading();
        
        // Précharger les ressources critiques
        this.preloadCriticalResources();
        
        // Optimiser les polices
        this.optimizeFonts();
        
        // Mettre en cache les données fréquemment utilisées
        this.cacheFrequentData();
        
        // Précharger les pages au survol
        this.initPrefetching();
    }

    /**
     * Initialiser le lazy loading des images
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observer toutes les images avec data-src
            this.observeImages();
        } else {
            // Fallback pour les navigateurs sans IntersectionObserver
            this.loadAllImages();
        }
    }

    /**
     * Observer les images pour le lazy loading
     */
    observeImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                this.imageObserver.observe(img);
            }
        });
    }

    /**
     * Charger une image
     */
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // Remplacer la source
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Ajouter une classe pour l'animation
                img.classList.add('loaded');
                resolve(img);
            };
            
            imageLoader.onerror = () => {
                img.classList.add('error');
                reject(new Error(`Erreur de chargement: ${img.dataset.src}`));
            };
            
            // Commencer le chargement
            imageLoader.src = img.dataset.src || img.src;
        });
    }

    /**
     * Charger toutes les images (fallback)
     */
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }

    /**
     * Précharger les ressources critiques
     */
    preloadCriticalResources() {
        // Précharger les images de la galerie de manière intelligente
        const galleryImages = document.querySelectorAll('.gallery-img[data-src]');
        const imageQueue = Array.from(galleryImages).slice(0, 3); // Précharger seulement les 3 premières
        
        imageQueue.forEach((img, index) => {
            setTimeout(() => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = img.dataset.src;
                document.head.appendChild(link);
            }, index * 100);
        });
    }

    /**
     * Optimiser le chargement des polices
     */
    optimizeFonts() {
        // Utiliser font-display: swap pour éviter le FOIT
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
                font-weight: 400 700;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Mettre en cache les données fréquemment utilisées
     */
    cacheFrequentData() {
        // Mettre en cache les informations de contact
        const contactInfo = {
            phone_fr: '+33 7 82 30 17 86',
            phone_dz: '+213 76 72 86 91',
            email: 'racinesdalgerie@gmail.com',
            social: {
                facebook: 'https://www.facebook.com/people/Racines-dAlg%C3%A9rie/61567031167077/',
                instagram: 'https://www.instagram.com/racinesdalgerie/',
                linkedin: 'https://www.linkedin.com/in/karim-hanni-abbb24336/'
            }
        };

        if (window.cacheManager) {
            window.cacheManager.set('contact_info', contactInfo, 7 * 24 * 60 * 60 * 1000); // 7 jours
        }

        // Mettre en cache les prix des services
        const servicePrices = {
            consulting_simple: 50,
            consulting_complete: 100,
            consulting_premium: 150,
            consulat_visa: 50,
            consulat_nationalite: 50,
            consulat_accompagnement: 50,
            aeroport_standard: 50,
            aeroport_transfert: 80,
            aeroport_vip: 120,
            accompagnement_journalier: 200
        };

        if (window.cacheManager) {
            window.cacheManager.set('service_prices', servicePrices, 24 * 60 * 60 * 1000); // 24h
        }
    }

    /**
     * Initialiser le prefetching des pages
     */
    initPrefetching() {
        // Précharger les pages au survol des liens
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A' && e.target.href) {
                this.prefetchPage(e.target.href);
            }
        });

        // Précharger les pages importantes après le chargement
        setTimeout(() => {
            this.prefetchImportantPages();
        }, 2000);
    }

    /**
     * Précharger une page
     */
    prefetchPage(url) {
        // Éviter de précharger la même page plusieurs fois
        if (this.prefetchQueue.includes(url)) return;
        
        // Éviter de précharger les liens externes
        if (!url.startsWith(window.location.origin) && !url.startsWith('/')) return;

        this.prefetchQueue.push(url);

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    /**
     * Précharger les pages importantes
     */
    prefetchImportantPages() {
        // Précharger seulement après interaction utilisateur
        let hasInteracted = false;
        
        const startPrefetch = () => {
            if (hasInteracted) return;
            hasInteracted = true;
            
            const importantPages = [
                'contact/contact.html',
                'accompagnement/consulting-voyage.html',
                'blog/blog.html'
            ];

            importantPages.forEach((page, index) => {
                setTimeout(() => this.prefetchPage(page), index * 200);
            });
        };
        
        // Déclencher après la première interaction
        ['mousedown', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, startPrefetch, { once: true, passive: true });
        });
    }

    /**
     * Optimiser les animations
     */
    optimizeAnimations() {
        // Réduire les animations si l'utilisateur préfère
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }

        // Utiliser requestAnimationFrame pour les animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('animated');
                        });
                        animationObserver.unobserve(entry.target);
                    }
                });
            });

            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }

    /**
     * Optimiser les formulaires
     */
    optimizeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Validation en temps réel avec debounce
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                let timeout;
                input.addEventListener('input', () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        this.validateField(input);
                    }, 300);
                });
            });

            // Sauvegarder les données du formulaire
            form.addEventListener('input', () => {
                this.saveFormData(form);
            });

            // Restaurer les données du formulaire
            this.restoreFormData(form);
        });
    }

    /**
     * Valider un champ de formulaire
     */
    validateField(field) {
        const isValid = field.checkValidity();
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
        }
    }

    /**
     * Sauvegarder les données du formulaire
     */
    saveFormData(form) {
        if (!window.cacheManager) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const formId = form.id || form.action || 'default_form';
        
        window.cacheManager.set(`form_data_${formId}`, data, 60 * 60 * 1000); // 1 heure
    }

    /**
     * Restaurer les données du formulaire
     */
    restoreFormData(form) {
        if (!window.cacheManager) return;

        const formId = form.id || form.action || 'default_form';
        const savedData = window.cacheManager.get(`form_data_${formId}`);
        
        if (savedData) {
            Object.entries(savedData).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field && field.type !== 'password') {
                    field.value = value;
                }
            });
        }
    }

    /**
     * Nettoyer les ressources
     */
    cleanup() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        
        if (this.contentObserver) {
            this.contentObserver.disconnect();
        }
    }
}

// Initialiser l'optimiseur de performance
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Nettoyer lors du déchargement de la page
window.addEventListener('beforeunload', () => {
    if (window.performanceOptimizer) {
        window.performanceOptimizer.cleanup();
    }
});