import styles from '../styles/FavoritesPage.module.css';

const FavoritesPage = ({ favorites, onRemoveFavorite, onKOLClick, onBrowseKOLs }) => {
    const totalFavorites = favorites.length;
    const verifiedCount = favorites.filter(kol => kol.verified).length;
    const avgRating = totalFavorites
        ? favorites.reduce((sum, kol) => sum + (kol.rating || 0), 0) / totalFavorites
        : 0;
    const nicheCounts = favorites.reduce((acc, kol) => {
        (kol.niche || []).forEach(niche => {
            acc[niche] = (acc[niche] || 0) + 1;
        });
        return acc;
    }, {});
    const topNiche = Object.entries(nicheCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    if (favorites.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>❤️</div>
                <h2>No Favorites Yet</h2>
                <p>Click the heart icon on KOL cards to save them here for later.</p>
                {onBrowseKOLs && (
                    <button className="btn btn-primary btn-sm" onClick={onBrowseKOLs}>
                        Browse KOLs
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Favorites</h1>
                    <p className={styles.subtitle}>
                        You have {favorites.length} KOL{favorites.length !== 1 ? 's' : ''} saved
                    </p>
                </div>
                {onBrowseKOLs && (
                    <div className={styles.actions}>
                        <button className="btn btn-secondary btn-sm" onClick={onBrowseKOLs}>
                            Browse more KOLs
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Saved Creators</span>
                    <span className={styles.summaryValue}>{totalFavorites}</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Average Rating</span>
                    <span className={styles.summaryValue}>{avgRating.toFixed(1)}</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Verified Profiles</span>
                    <span className={styles.summaryValue}>{verifiedCount}</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Top Niche</span>
                    <span className={styles.summaryValue}>{topNiche}</span>
                </div>
            </div>

            <div className={styles.grid}>
                {favorites.map(kol => (
                    <div key={kol.id} className={styles.card}>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={(e) => { e.stopPropagation(); onRemoveFavorite(kol.id); }}
                            aria-label="Remove from favorites"
                        >
                            ×
                        </button>

                        <button
                            type="button"
                            className={styles.cardContent}
                            onClick={() => onKOLClick(kol)}
                            aria-label={`View profile for ${kol.name}`}
                        >
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
                        </button>

                        <div className={styles.cardFooter}>
                            <span className={styles.pricing}>{kol.pricingRange}</span>
                            <button
                                type="button"
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
