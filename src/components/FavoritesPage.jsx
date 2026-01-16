import styles from '../styles/FavoritesPage.module.css';

const FavoritesPage = ({ favorites, onRemoveFavorite, onKOLClick }) => {
    if (favorites.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>❤️</div>
                <h2>No Favorites Yet</h2>
                <p>Click the heart icon on KOL cards to save them here for later.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Favorites</h1>
            <p className={styles.subtitle}>
                You have {favorites.length} KOL{favorites.length !== 1 ? 's' : ''} saved
            </p>

            <div className={styles.grid}>
                {favorites.map(kol => (
                    <div key={kol.id} className={styles.card}>
                        <button
                            className={styles.removeBtn}
                            onClick={(e) => { e.stopPropagation(); onRemoveFavorite(kol.id); }}
                            aria-label="Remove from favorites"
                        >
                            ×
                        </button>

                        <div className={styles.cardContent} onClick={() => onKOLClick(kol)}>
                            <img src={kol.profilePhoto} alt={kol.name} className={styles.photo} />
                            <div className={styles.info}>
                                <h3 className={styles.name}>
                                    {kol.name}
                                    {kol.verified && <span className={styles.verified}>✓</span>}
                                </h3>
                                <p className={styles.tagline}>{kol.tagline}</p>
                                <div className={styles.stats}>
                                    <span>⭐ {kol.rating}</span>
                                    <span>📊 {kol.campaignsCompleted} campaigns</span>
                                    <span>✅ {kol.successRate}% success</span>
                                </div>
                                <div className={styles.niches}>
                                    {kol.niche.slice(0, 3).map((n, i) => (
                                        <span key={i} className={styles.niche}>{n}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <span className={styles.pricing}>{kol.pricingRange}</span>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onKOLClick(kol)}
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
