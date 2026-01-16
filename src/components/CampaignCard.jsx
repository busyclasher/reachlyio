import styles from '../styles/CampaignCard.module.css';

const CampaignCard = ({ campaign, onApply }) => {
    const platformIcons = {
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        twitch: '🎮',
        linkedin: '💼',
        twitter: '🐦',
        pinterest: '📌'
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.businessInfo}>
                    <img
                        src={campaign.businessLogo}
                        alt={campaign.businessName}
                        className={styles.businessLogo}
                    />
                    <div>
                        <h4 className={styles.businessName}>{campaign.businessName}</h4>
                        <span className={styles.postedDate}>Posted {formatDate(campaign.postedDate)}</span>
                    </div>
                </div>
                <span className={`${styles.status} ${styles[campaign.status]}`}>
                    {campaign.status}
                </span>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.title}>{campaign.title}</h3>
                <p className={styles.description}>{campaign.description}</p>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>💰 Budget</span>
                        <span className={styles.detailValue}>{campaign.budget}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>⏱️ Duration</span>
                        <span className={styles.detailValue}>{campaign.duration}</span>
                    </div>
                </div>

                <div className={styles.platforms}>
                    {campaign.platforms.map(platform => (
                        <span key={platform} className={styles.platformTag}>
                            {platformIcons[platform]} {platform}
                        </span>
                    ))}
                </div>

                <div className={styles.niches}>
                    {campaign.niche.map((n, i) => (
                        <span key={i} className="badge badge-primary">{n}</span>
                    ))}
                </div>

                <div className={styles.contentTypes}>
                    <span className={styles.contentLabel}>Content needed:</span>
                    {campaign.contentType.map((type, i) => (
                        <span key={i} className={styles.contentTag}>{type}</span>
                    ))}
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.applicants}>
                    <span className={styles.applicantCount}>{campaign.applicants}</span>
                    <span className={styles.applicantLabel}>applicants</span>
                </div>
                <button className="btn btn-primary" onClick={() => onApply(campaign)}>
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default CampaignCard;
