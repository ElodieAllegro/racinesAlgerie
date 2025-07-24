/**
 * Gestionnaire de cookies conforme RGPD
 */
class CookieManager {
    constructor() {
        this.cookiePrefix = 'racines_algerie_';
        this.consentKey = this.cookiePrefix + 'consent';
        this.preferencesKey = this.cookiePrefix + 'preferences';
        this.bannerShown = false;
        
        this.cookieTypes = {
            essential: {
                name: 'Cookies essentiels',
                description: 'Nécessaires au fonctionnement du site',
                required: true
            },
            analytics: {
                name: 'Cookies analytiques',
                description: 'Nous aident à améliorer le site',
                required: false
            },
            marketing: {
                name: 'Cookies marketing',
                description: 'Personnalisent votre expérience',
                required: false
            }
        };

        this.init();
    }

    init() {
        // Vérifier le consentement existant
        const consent = this.getConsent();
        
        if (!consent) {
            // Afficher la bannière si pas de consentement
            this.showConsentBanner();
        } else {
            // Activer les cookies selon les préférences
            this.applyCookiePreferences(consent);
        }

        // Écouter les événements de consentement
        this.setupEventListeners();
    }

    /**
     * Créer un cookie
     */
    setCookie(name, value, days = 365, essential = false) {
        // Vérifier le consentement sauf pour les cookies essentiels
        if (!essential && !this.hasConsent()) {
            return false;
        }

        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            
            const cookieString = `${this.cookiePrefix}${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
            document.cookie = cookieString;
            
            return true;
        } catch (e) {
            console.warn('Erreur lors de la création du cookie:', e);
            return false;
        }
    }

    /**
     * Lire un cookie
     */
    getCookie(name) {
        const fullName = this.cookiePrefix + name;
        const nameEQ = fullName + "=";
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }
        return null;
    }

    /**
     * Supprimer un cookie
     */
    deleteCookie(name) {
        const fullName = this.cookiePrefix + name;
        document.cookie = `${fullName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    /**
     * Obtenir le consentement actuel
     */
    getConsent() {
        const consent = this.getCookie('consent');
        return consent ? JSON.parse(consent) : null;
    }

    /**
     * Sauvegarder le consentement
     */
    saveConsent(preferences) {
        const consentData = {
            timestamp: Date.now(),
            preferences: preferences,
            version: '1.0'
        };
        
        this.setCookie('consent', JSON.stringify(consentData), 365, true);
        this.applyCookiePreferences(consentData);
        this.hideConsentBanner();
        
        // Déclencher un événement personnalisé
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: consentData
        }));
    }

    /**
     * Vérifier si on a le consentement
     */
    hasConsent(type = null) {
        const consent = this.getConsent();
        if (!consent) return false;
        
        if (type) {
            return consent.preferences[type] === true;
        }
        
        return true;
    }

    /**
     * Appliquer les préférences de cookies
     */
    applyCookiePreferences(consent) {
        const preferences = consent.preferences;
        
        // Cookies analytiques
        if (preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Cookies marketing
        if (preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
    }

    /**
     * Activer les cookies analytiques
     */
    enableAnalytics() {
        // Ici vous pourriez intégrer Google Analytics, etc.
        console.log('Cookies analytiques activés');
        
        // Exemple d'intégration Google Analytics
        /*
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        */
    }

    /**
     * Désactiver les cookies analytiques
     */
    disableAnalytics() {
        console.log('Cookies analytiques désactivés');
        
        // Supprimer les cookies analytiques existants
        this.deleteCookie('analytics_session');
        this.deleteCookie('analytics_user');
    }

    /**
     * Activer les cookies marketing
     */
    enableMarketing() {
        console.log('Cookies marketing activés');
        
        // Exemple d'intégration
        /*
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
        */
    }

    /**
     * Désactiver les cookies marketing
     */
    disableMarketing() {
        console.log('Cookies marketing désactivés');
        
        // Supprimer les cookies marketing existants
        this.deleteCookie('marketing_preferences');
        this.deleteCookie('ad_tracking');
    }

    /**
     * Afficher la bannière de consentement
     */
    showConsentBanner() {
        if (this.bannerShown) return;
        
        const banner = this.createConsentBanner();
        document.body.appendChild(banner);
        this.bannerShown = true;
        
        // Animation d'entrée
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    /**
     * Créer la bannière de consentement
     */
    createConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>🍪 Gestion des cookies</h3>
                    <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez accepter tous les cookies ou personnaliser vos préférences.</p>
                </div>
                <div class="cookie-banner-actions">
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">
                        Accepter tout
                    </button>
                    <button id="cookie-customize" class="cookie-btn cookie-btn-secondary">
                        Personnaliser
                    </button>
                    <button id="cookie-reject" class="cookie-btn cookie-btn-outline">
                        Refuser
                    </button>
                </div>
            </div>
            <div id="cookie-preferences" class="cookie-preferences" style="display: none;">
                <h4>Préférences des cookies</h4>
                <div class="cookie-types">
                    ${Object.entries(this.cookieTypes).map(([key, type]) => `
                        <div class="cookie-type">
                            <label class="cookie-type-label">
                                <input type="checkbox" 
                                       id="cookie-${key}" 
                                       ${type.required ? 'checked disabled' : ''}>
                                <span class="cookie-type-info">
                                    <strong>${type.name}</strong>
                                    <small>${type.description}</small>
                                </span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="cookie-preferences-actions">
                    <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary">
                        Sauvegarder
                    </button>
                    <button id="cookie-back" class="cookie-btn cookie-btn-outline">
                        Retour
                    </button>
                </div>
            </div>
        `;
        
        return banner;
    }

    /**
     * Masquer la bannière de consentement
     */
    hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => {
                banner.remove();
                this.bannerShown = false;
            }, 300);
        }
    }

    /**
     * Configurer les écouteurs d'événements
     */
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cookie-accept-all') {
                this.acceptAll();
            } else if (e.target.id === 'cookie-reject') {
                this.rejectAll();
            } else if (e.target.id === 'cookie-customize') {
                this.showPreferences();
            } else if (e.target.id === 'cookie-save-preferences') {
                this.savePreferences();
            } else if (e.target.id === 'cookie-back') {
                this.hidePreferences();
            }
        });
    }

    /**
     * Accepter tous les cookies
     */
    acceptAll() {
        const preferences = {};
        Object.keys(this.cookieTypes).forEach(key => {
            preferences[key] = true;
        });
        this.saveConsent(preferences);
    }

    /**
     * Refuser les cookies non essentiels
     */
    rejectAll() {
        const preferences = {};
        Object.keys(this.cookieTypes).forEach(key => {
            preferences[key] = this.cookieTypes[key].required;
        });
        this.saveConsent(preferences);
    }

    /**
     * Afficher les préférences
     */
    showPreferences() {
        const banner = document.querySelector('.cookie-banner-content');
        const preferences = document.getElementById('cookie-preferences');
        
        if (banner && preferences) {
            banner.style.display = 'none';
            preferences.style.display = 'block';
        }
    }

    /**
     * Masquer les préférences
     */
    hidePreferences() {
        const banner = document.querySelector('.cookie-banner-content');
        const preferences = document.getElementById('cookie-preferences');
        
        if (banner && preferences) {
            banner.style.display = 'block';
            preferences.style.display = 'none';
        }
    }

    /**
     * Sauvegarder les préférences personnalisées
     */
    savePreferences() {
        const preferences = {};
        
        Object.keys(this.cookieTypes).forEach(key => {
            const checkbox = document.getElementById(`cookie-${key}`);
            preferences[key] = checkbox ? checkbox.checked : false;
        });
        
        this.saveConsent(preferences);
    }

    /**
     * Réinitialiser le consentement (pour les paramètres)
     */
    resetConsent() {
        this.deleteCookie('consent');
        this.deleteCookie('preferences');
        
        // Supprimer tous les cookies non essentiels
        this.disableAnalytics();
        this.disableMarketing();
        
        // Réafficher la bannière
        this.showConsentBanner();
    }
}

// Instance globale du gestionnaire de cookies
window.cookieManager = new CookieManager();