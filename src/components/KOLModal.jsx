import { useEffect } from 'react';
import styles from '../styles/KOLModal.module.css';

const KOLModal = ({ kol, onClose }) => {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const formatFollowers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const platformIcons = {
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        twitch: '🎮',
        linkedin: '💼',
        twitter: '🐦',
        pinterest: '📌'
    };

    const totalFollowers = Object.values(kol.platforms).reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement = (
        Object.values(kol.platforms).reduce((sum, p) => sum + p.engagementRate, 0) /
        Object.values(kol.platforms).length
    ).toFixed(1);

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Header */}
                <div className={styles.header}>
                    <img src={kol.coverPhoto} alt="" className={styles.coverPhoto} />
                    <div className={styles.profileSection}>
                        <div className={styles.profilePhotoWrapper}>
                            <img src={kol.profilePhoto} alt={kol.name} className={styles.profilePhoto} />
                            {kol.verified && (
                                <div className={styles.verifiedBadge} title="Verified">✓</div>
                            )}
                        </div>
                        <div className={styles.profileInfo}>
                            <h2 className={styles.name}>{kol.name}</h2>
                            <p className={styles.tagline}>{kol.tagline}</p>
                            <div className={styles.meta}>
                                <span className={styles.location}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 1a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    {kol.location}
                                </span>
                                <span className={styles.languages}>
                                    🌐 {kol.languages.join(', ')}
                                </span>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg">
                            Contact KOL
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{formatFollowers(totalFollowers)}</div>
                        <div className={styles.statLabel}>Total Reach</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{avgEngagement}%</div>
                        <div className={styles.statLabel}>Avg. Engagement</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{Object.keys(kol.platforms).length}</div>
                        <div className={styles.statLabel}>Platforms</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{kol.collaborations.length}</div>
                        <div className={styles.statLabel}>Campaigns</div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className={styles.content}>
                    {/* About */}
                    <section className={styles.section}>
                        <h3>About</h3>
                        <p className={styles.bio}>{kol.bio}</p>
                        <div className={styles.niches}>
                            {kol.niche.map((n, i) => (
                                <span key={i} className="badge badge-primary">{n}</span>
                            ))}
                        </div>
                    </section>

                    {/* Platforms */}
                    <section className={styles.section}>
                        <h3>Social Media Platforms</h3>
                        <div className={styles.platformsGrid}>
                            {Object.entries(kol.platforms).map(([name, data]) => (
                                <div key={name} className={styles.platformCard}>
                                    <div className={styles.platformHeader}>
                                        <span className={styles.platformIcon}>{platformIcons[name]}</span>
                                        <span className={styles.platformName}>{name}</span>
                                    </div>
                                    <div className={styles.platformStats}>
                                        <div>
                                            <div className={styles.platformValue}>{formatFollowers(data.followers)}</div>
                                            <div className={styles.platformLabel}>Followers</div>
                                        </div>
                                        <div>
                                            <div className={styles.platformValue}>{data.engagementRate}%</div>
                                            <div className={styles.platformLabel}>Engagement</div>
                                        </div>
                                    </div>
                                    <div className={styles.platformHandle}>@{data.handle}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Portfolio */}
                    <section className={styles.section}>
                        <h3>Portfolio</h3>
                        <div className={styles.portfolio}>
                            {kol.portfolio.map((img, i) => (
                                <div key={i} className={styles.portfolioItem}>
                                    <img src={img} alt={`Portfolio ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Past Collaborations */}
                    <section className={styles.section}>
                        <h3>Past Collaborations</h3>
                        <div className={styles.collaborations}>
                            {kol.collaborations.map((collab, i) => (
                                <div key={i} className={styles.collabCard}>
                                    <div className={styles.collabBrand}>{collab.brand}</div>
                                    <div className={styles.collabResult}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M13 5L6 12L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {collab.result}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className={styles.section}>
                        <h3>Pricing Range</h3>
                        <div className={styles.pricing}>
                            <div className={styles.priceTag}>{kol.pricingRange}</div>
                            <p className={styles.priceNote}>Per campaign (varies by scope and deliverables)</p>
                        </div>
                    </section>
                </div>

                {/* Footer CTA */}
                <div className={styles.footer}>
                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Contact {kol.name.split(' ')[0]}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KOLModal;
