import styles from '../styles/KOLCard.module.css';

const KOLCard = ({ kol, viewMode, onClick }) => {
    const formatFollowers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const totalFollowers = Object.values(kol.platforms).reduce((sum, p) => sum + p.followers, 0);

    const platformIcons = {
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        twitch: '🎮',
        linkedin: '💼',
        twitter: '🐦',
        pinterest: '📌'
    };

    // Get years of experience
    const getExperience = () => {
        if (!kol.proSince) return null;
        const years = new Date().getFullYear() - parseInt(kol.proSince);
        return years > 0 ? `${years}+ years` : 'New';
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
                            <h3 className={styles.name}>
                                {kol.name}
                                {kol.proSince && new Date().getFullYear() - parseInt(kol.proSince) >= 2 && (
                                    <span className={styles.proBadge}>PRO</span>
                                )}
                            </h3>
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
                        {/* Stats Bar */}
                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <span className={styles.statIcon}>⭐</span>
                                <span className={styles.statNumber}>{kol.rating || 4.5}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{kol.campaignsCompleted || 0}</span>
                                <span className={styles.statText}>campaigns</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{kol.successRate || 90}%</span>
                                <span className={styles.statText}>success</span>
                            </div>
                        </div>
                        <div className={styles.platforms}>
                            {Object.entries(kol.platforms).map(([name, data]) => (
                                <div key={name} className={styles.platformTag}>
                                    <span className={styles.platformIcon}>{platformIcons[name]}</span>
                                    <span>{formatFollowers(data.followers)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.listRight}>
                        <div className={styles.niches}>
                            {kol.niche.slice(0, 2).map((n, i) => (
                                <span key={i} className="badge badge-primary">{n}</span>
                            ))}
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
                {kol.proSince && new Date().getFullYear() - parseInt(kol.proSince) >= 2 && (
                    <div className={styles.proTag}>PRO</div>
                )}
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.name}>{kol.name}</h3>
                <p className={styles.tagline}>{kol.tagline}</p>

                {/* Stats Bar - Staffie Style */}
                <div className={styles.statsBar}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>⭐ {kol.rating || 4.5}</span>
                        <span className={styles.statLabel}>Rating</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{kol.campaignsCompleted || 0}</span>
                        <span className={styles.statLabel}>Campaigns</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{kol.successRate || 90}%</span>
                        <span className={styles.statLabel}>Success</span>
                    </div>
                </div>

                <div className={styles.location}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {kol.location}
                </div>

                <div className={styles.platformsCompact}>
                    {Object.entries(kol.platforms).map(([name, data]) => (
                        <span key={name} className={styles.platformCompact}>
                            {platformIcons[name]} {formatFollowers(data.followers)}
                        </span>
                    ))}
                </div>

                <div className={styles.niches}>
                    {kol.niche.slice(0, 3).map((n, i) => (
                        <span key={i} className="badge badge-primary">{n}</span>
                    ))}
                </div>

                {/* Latest Review Preview */}
                {kol.reviews && kol.reviews.length > 0 && (
                    <div className={styles.reviewPreview}>
                        <div className={styles.reviewStars}>
                            {'⭐'.repeat(kol.reviews[0].rating)}
                        </div>
                        <p className={styles.reviewText}>"{kol.reviews[0].text.slice(0, 60)}..."</p>
                        <span className={styles.reviewAuthor}>— {kol.reviews[0].businessName}</span>
                    </div>
                )}
            </div>

            <div className={styles.cardOverlay}>
                <button className="btn btn-primary">View Full Profile</button>
            </div>
        </div>
    );
};

export default KOLCard;
