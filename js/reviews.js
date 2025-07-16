/**
 * Gestionnaire des avis Google
 */
class GoogleReviewsManager {
    constructor() {
        this.reviews = [];
        this.init();
    }

    init() {
        // Vrais avis Google de Racines d'Algérie
        this.reviews = [
            {
                id: 1,
                name: "Fatima NOUREDDINE",
                avatar: "F",
                rating: 5,
                date: "Il y a un jour",
                text: "J'ai découvert Racines D'Algérie en mars et ça m'a tout de suite parlé. Je ne pas hésité à prendre contact avec Karim. À l'écoute, avec beaucoup de respect et de bienveillance, il m'a accompagnée dans mes démarches.",
                service: "Consulting Voyage",
                verified: true
            },
            {
                id: 2,
                name: "Tido",
                avatar: "T",
                rating: 5,
                date: "Il y a 1 mois",
                text: "J'ai eu une bonne expérience avec Racines d'Algérie. Je recommande",
                service: "Consulting Voyage",
                verified: true
            },
            {
                id: 3,
                name: "Hurst Lioba",
                avatar: "H",
                rating: 5,
                date: "Il y a 1 mois",
                text: "Karim nous a accompagné dans la vérification des documents pour une demande de visa touristique. Il est de bons conseils, à l'écoute et très disponible pour le client, il est aussi professionnel qu'humain. Je le recommande vivement",
                service: "Accompagnement Consulat",
                verified: true
            },
            {
                id: 4,
                name: "Samir Ouriachi",
                avatar: "S",
                rating: 5,
                date: "Il y a 2 mois",
                text: "Je tiens à remercier Karim qui par l'intermédiaire de Racine d'Algerie m'a permis de passer le pas, et retrouver mon pays d'origine et de cœur. Après des années d'hésitation, j'ai enfin franchi le pas grâce à ses conseils.",
                service: "Consulting Voyage",
                verified: true
            },
            {
                id: 5,
                name: "Djilali Feghouli",
                avatar: "D",
                rating: 5,
                date: "Il y a 3 mois",
                text: "J'ai contacté Karim début 2025, pour me conseiller sur les formalités administratives pour un renouvellement de passeport Algérien, tout a été facilité grâce à ses conseils précieux et son accompagnement professionnel.",
                service: "Accompagnement Consulat",
                verified: true
            }
        ];

        this.renderReviews();
        this.setupEventListeners();
    }

    renderReviews() {
        const reviewsContainer = document.getElementById('reviews-container');
        if (!reviewsContainer) return;

        // Calculer la moyenne des notes
        const averageRating = this.calculateAverageRating();
        const totalReviews = this.reviews.length;

        // Générer le HTML
        reviewsContainer.innerHTML = `
            <div class="reviews-header">
                <h2>Avis de nos clients</h2>
                <div class="google-rating-summary">
                    <div class="rating-score">${averageRating.toFixed(1)}</div>
                    <div class="rating-stars">
                        ${this.generateStars(averageRating)}
                    </div>
                    <div class="rating-info">
                        <div class="rating-count">Basé sur ${totalReviews} avis</div>
                        <div class="google-logo">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="reviews-grid">
                ${this.reviews.map(review => this.generateReviewCard(review)).join('')}
            </div>
            
            <div class="reviews-cta">
                <h3>Partagez votre expérience</h3>
                <p>Vous avez utilisé nos services ? Laissez-nous un avis pour aider d'autres voyageurs !</p>
                <a href="https://www.google.com/search?q=Racines+d%27Alg%C3%A9rie+Avis" target="_blank" class="google-review-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                    </svg>
                    Laisser un avis Google
                </a>
            </div>
        `;
    }

    generateReviewCard(review) {
        return `
            <div class="review-card">
                <div class="google-badge">Google</div>
                <div class="review-header">
                    <div class="reviewer-avatar">${review.avatar}</div>
                    <div class="reviewer-info">
                        <h4>${review.name}</h4>
                        <div class="review-date">${review.date}</div>
                        ${review.verified ? '<div class="verified-badge">Avis vérifié</div>' : ''}
                    </div>
                </div>
                <div class="review-rating">
                    ${this.generateStars(review.rating)}
                </div>
                <p class="review-text">${review.text}</p>
                <span class="review-service">${review.service}</span>
            </div>
        `;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star">★</span>';
            } else {
                stars += '<span class="star empty">★</span>';
            }
        }
        return stars;
    }

    calculateAverageRating() {
        const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / this.reviews.length;
    }

    setupEventListeners() {
        // Animation au scroll
        const reviewCards = document.querySelectorAll('.review-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        reviewCards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });

        // Tracking des clics sur les avis
        document.addEventListener('click', (e) => {
            if (e.target.closest('.google-review-btn')) {
                if (window.trackEvent) {
                    window.trackEvent('review_button_clicked', {
                        source: 'reviews_section'
                    });
                }
            }
        });
    }

    // Méthode pour ajouter de nouveaux avis (pour future intégration API)
    addReview(reviewData) {
        this.reviews.unshift(reviewData);
        this.renderReviews();
    }

    // Méthode pour filtrer les avis par service
    filterByService(service) {
        const filteredReviews = service ? 
            this.reviews.filter(review => review.service === service) : 
            this.reviews;
        
        // Re-render avec les avis filtrés
        // Implementation à compléter selon les besoins
    }
}

// Initialiser le gestionnaire d'avis
document.addEventListener('DOMContentLoaded', () => {
    window.googleReviewsManager = new GoogleReviewsManager();
});