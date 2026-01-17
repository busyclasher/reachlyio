import { useEffect } from 'react';
import styles from '../styles/CampaignDetailModal.module.css';

const CampaignDetailModal = ({ campaign, onClose, onApply, hasApplied = false }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!campaign) {
        return null;
    }

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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close campaign details">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.header}>
                    <div className={styles.businessInfo}>
                        <img
                            src={campaign.businessLogo}
                            alt={campaign.businessName}
                            className={styles.logo}
                        />
                        <div>
                            <span className={styles.businessName}>{campaign.businessName}</span>
                            <h2 className={styles.title}>{campaign.title}</h2>
                            <p className={styles.postedDate}>Posted {formatDate(campaign.postedDate)}</p>
                        </div>
                    </div>
                    <div className={styles.headerMeta}>
                        <span className={`${styles.status} ${styles[campaign.status]}`}>
                            {campaign.status}
                        </span>
                        <span className={styles.budget}>{campaign.budget}</span>
                    </div>
                </div>

                <div className={styles.description}>
                    <h3>Campaign Overview</h3>
                    <p>{campaign.description}</p>
                </div>

                <div className={styles.detailGrid}>
                    <div className={styles.detailCard}>
                        <span className={styles.detailLabel}>Duration</span>
                        <span className={styles.detailValue}>{campaign.duration}</span>
                    </div>
                    <div className={styles.detailCard}>
                        <span className={styles.detailLabel}>Target Audience</span>
                        <span className={styles.detailValue}>{campaign.targetAudience}</span>
                    </div>
                    <div className={styles.detailCard}>
                        <span className={styles.detailLabel}>Applicants</span>
                        <span className={styles.detailValue}>{campaign.applicants}</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Platforms</h3>
                    <div className={styles.platforms}>
                        {campaign.platforms.map(platform => (
                            <span key={platform} className={styles.platformTag}>
                                {platformIcons[platform] || ''} {platform}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Niches</h3>
                    <div className={styles.niches}>
                        {campaign.niche.map((item, index) => (
                            <span key={index} className="badge badge-primary">{item}</span>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Content Needed</h3>
                    <div className={styles.contentTypes}>
                        {campaign.contentType.map((type, index) => (
                            <span key={index} className={styles.contentTag}>{type}</span>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => onApply(campaign)}
                        disabled={hasApplied}
                    >
                        {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={onClose}>
                        Close
                    </button>
                    {hasApplied && (
                        <p className={styles.appliedNote}>You have already applied to this campaign.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailModal;
