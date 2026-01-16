import styles from '../styles/KOLCard.module.css';

const KOLCard = ({ kol, viewMode, onClick }) => {
    // Get primary platform (highest followers)
    const getPrimaryPlatform = () => {
        const platforms = Object.entries(kol.platforms);
        if (platforms.length === 0) return null;

        return platforms.reduce((max, [name, data]) => {
            return data.followers > (max?.data?.followers || 0)
                ? { name, data }
                : max;
        }, null);
    };

    const formatFollowers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const primaryPlatform = getPrimaryPlatform();
    const totalFollowers = Object.values(kol.platforms).reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement = (
        Object.values(kol.platforms).reduce((sum, p) => sum + p.engagementRate, 0) /
        Object.values(kol.platforms).length
    ).toFixed(1);

    const platformIcons = {
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        twitch: '🎮',
        linkedin: '💼',
        twitter: '🐦',
        pinterest: '📌'
    };

    if (viewMode === 'list') {
        return (
            <div className={`${styles.card} ${styles.listView}`} onClick={onClick}>
                <div className={styles.listContent}>
                    <div className={styles.listLeft}>
                        <div className={styles.profilePhotoWrapper}>
                            <img src={kol.profilePhoto} alt={kol.name} className={styles.profilePhoto} />
                            {kol.verified && (
                                <div className={styles.verifiedBadge} title="Verified">✓</div>
                            )}
                        </div>

                        <div className={styles.listInfo}>
                            <h3 className={styles.name}>{kol.name}</h3>
                            <p className={styles.tagline}>{kol.tagline}</p>
                            <div className={styles.location}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                {kol.location}
                            </div>
                        </div>
                    </div>

                    <div className={styles.listMiddle}>
                        <div className={styles.platforms}>
                            {Object.entries(kol.platforms).map(([name, data]) => (
                                <div key={name} className={styles.platformTag}>
                                    <span className={styles.platformIcon}>{platformIcons[name]}</span>
                                    <span>{formatFollowers(data.followers)}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.niches}>
                            {kol.niche.map((n, i) => (
                                <span key={i} className="badge badge-primary">{n}</span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.listRight}>
                        <div className={styles.stat}>
                            <div className={styles.statValue}>{formatFollowers(totalFollowers)}</div>
                            <div className={styles.statLabel}>Total Reach</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statValue}>{avgEngagement}%</div>
                            <div className={styles.statLabel}>Avg. Engagement</div>
                        </div>
                        <button className="btn btn-primary btn-sm">View Profile</button>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardHeader}>
                <img src={kol.coverPhoto} alt="" className={styles.coverPhoto} />
                <div className={styles.profilePhotoWrapper}>
                    <img src={kol.profilePhoto} alt={kol.name} className={styles.profilePhoto} />
                    {kol.verified && (
                        <div className={styles.verifiedBadge} title="Verified">✓</div>
                    )}
                </div>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.name}>{kol.name}</h3>
                <p className={styles.tagline}>{kol.tagline}</p>

                <div className={styles.location}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {kol.location}
                </div>

                <div className={styles.niches}>
                    {kol.niche.map((n, i) => (
                        <span key={i} className="badge badge-primary">{n}</span>
                    ))}
                </div>

                <div className={styles.platforms}>
                    {Object.entries(kol.platforms).map(([name, data]) => (
                        <div key={name} className={styles.platformItem}>
                            <span className={styles.platformIcon}>{platformIcons[name]}</span>
                            <div>
                                <div className={styles.platformFollowers}>{formatFollowers(data.followers)}</div>
                                <div className={styles.platformName}>{name}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>{avgEngagement}%</div>
                        <div className={styles.statLabel}>Engagement</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>{kol.collaborations.length}</div>
                        <div className={styles.statLabel}>Campaigns</div>
                    </div>
                </div>
            </div>

            <div className={styles.cardOverlay}>
                <button className="btn btn-primary">View Full Profile</button>
            </div>
        </div>
    );
};

export default KOLCard;
