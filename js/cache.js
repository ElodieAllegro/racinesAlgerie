/**
 * Système de cache pour optimiser les performances
 */
class CacheManager {
    constructor() {
        this.cacheName = 'racines-algerie-cache-v1';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
        this.init();
    }

    init() {
        // Vérifier le support du localStorage
        this.storageAvailable = this.isStorageAvailable('localStorage');
        
        // Nettoyer le cache expiré au démarrage
        if (this.storageAvailable) {
            this.cleanExpiredCache();
        }
    }

    /**
     * Vérifier si le stockage est disponible
     */
    isStorageAvailable(type) {
        try {
            const storage = window[type];
            const test = '__storage_test__';
            storage.setItem(test, test);
            storage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Générer une clé de cache
     */
    generateCacheKey(url, params = {}) {
        const paramString = Object.keys(params).length > 0 
            ? JSON.stringify(params) 
            : '';
        return `${this.cacheName}_${url}_${paramString}`;
    }

    /**
     * Sauvegarder en cache
     */
    set(key, data, customExpiry = null) {
        if (!this.storageAvailable) return false;

        try {
            const cacheData = {
                data: data,
                timestamp: Date.now(),
                expiry: customExpiry || this.cacheExpiry
            };
            
            localStorage.setItem(key, JSON.stringify(cacheData));
            return true;
        } catch (e) {
            console.warn('Erreur lors de la sauvegarde en cache:', e);
            return false;
        }
    }

    /**
     * Récupérer du cache
     */
    get(key) {
        if (!this.storageAvailable) return null;

        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const now = Date.now();

            // Vérifier si le cache a expiré
            if (now - cacheData.timestamp > cacheData.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return cacheData.data;
        } catch (e) {
            console.warn('Erreur lors de la lecture du cache:', e);
            return null;
        }
    }

    /**
     * Supprimer une entrée du cache
     */
    remove(key) {
        if (!this.storageAvailable) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Erreur lors de la suppression du cache:', e);
            return false;
        }
    }

    /**
     * Nettoyer le cache expiré
     */
    cleanExpiredCache() {
        if (!this.storageAvailable) return;

        const now = Date.now();
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.cacheName)) {
                try {
                    const cached = localStorage.getItem(key);
                    const cacheData = JSON.parse(cached);
                    
                    if (now - cacheData.timestamp > cacheData.expiry) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    // Supprimer les entrées corrompues
                    keysToRemove.push(key);
                }
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    /**
     * Vider tout le cache
     */
    clear() {
        if (!this.storageAvailable) return false;

        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.cacheName)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (e) {
            console.warn('Erreur lors du nettoyage du cache:', e);
            return false;
        }
    }

    /**
     * Obtenir la taille du cache
     */
    getSize() {
        if (!this.storageAvailable) return 0;

        let size = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.cacheName)) {
                size += localStorage.getItem(key).length;
            }
        }
        return size;
    }
}

// Instance globale du gestionnaire de cache
window.cacheManager = new CacheManager();