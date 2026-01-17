import { useState } from 'react';
import CampaignCard from './CampaignCard';
import styles from '../styles/CampaignsPage.module.css';

const CampaignsPage = ({ campaigns, onApply, onViewCampaign, appliedCampaignIds, loading = false, onCreateCampaign }) => {
    const [filter, setFilter] = useState('all');

    const platformOptions = ['all', 'instagram', 'tiktok', 'youtube', 'twitch', 'linkedin', 'twitter', 'pinterest'];
    const platformIcons = {
        all: '🌐',
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        twitch: '🎮',
        linkedin: '💼',
        twitter: '🐦',
        pinterest: '📌'
    };

    const filteredCampaigns = campaigns.filter(c => {
        if (filter === 'all') return true;
        return c.platforms.includes(filter);
    });

    // Loading skeleton
    const renderSkeletons = () => (
        <div className={styles.grid}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.skeleton}>
                    <div className={styles.skeletonHeader}>
                        <div className={styles.skeletonAvatar}></div>
                        <div className={styles.skeletonText}></div>
                    </div>
                    <div className={styles.skeletonBody}>
                        <div className={styles.skeletonTitle}></div>
                        <div className={styles.skeletonLine}></div>
                        <div className={styles.skeletonLine}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.campaignsPage}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Available Campaigns</h1>
                    <p className={styles.subtitle}>
                        {loading
                            ? 'Loading campaigns...'
                            : `Browse ${campaigns.length} active campaign${campaigns.length !== 1 ? 's' : ''} from brands looking for KOLs like you`
                        }
                    </p>
                </div>
                {onCreateCampaign && (
                    <div className={styles.headerActions}>
                        <button className="btn btn-primary btn-sm" onClick={onCreateCampaign}>
                            Post a Campaign
                        </button>
                        <span className={styles.helperText}>Reach Singapore creators in hours.</span>
                    </div>
                )}
            </div>

            <div className={styles.filters}>
                <span className={styles.filterLabel}>Filter by platform:</span>
                <div className={styles.filterButtons}>
                    {platformOptions.map(platform => (
                        <button
                            key={platform}
                            className={`${styles.filterBtn} ${filter === platform ? styles.active : ''}`}
                            onClick={() => setFilter(platform)}
                        >
                            <span className={styles.filterIcon}>{platformIcons[platform]}</span>
                            {platform === 'all' ? 'All' : platform}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? renderSkeletons() : (
                <>
                    <div className={styles.grid}>
                        {filteredCampaigns.map(campaign => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onApply={onApply}
                                onView={onViewCampaign}
                                isApplied={appliedCampaignIds ? appliedCampaignIds.has(campaign.id) : false}
                            />
                        ))}
                    </div>

                    {filteredCampaigns.length === 0 && (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>🔍</div>
                            <h3>No campaigns found</h3>
                            <p>Try selecting a different platform filter</p>
                            <div className={styles.emptyActions}>
                                <button className="btn btn-secondary" onClick={() => setFilter('all')}>
                                    View all campaigns
                                </button>
                                {onCreateCampaign && (
                                    <button className="btn btn-primary" onClick={onCreateCampaign}>
                                        Post a campaign
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CampaignsPage;
