import { useMemo, useState } from 'react';
import CampaignCard from './CampaignCard';
import styles from '../styles/CampaignsPage.module.css';

const CampaignsPage = ({ campaigns, onApply, onViewCampaign, appliedCampaignIds, loading = false, onCreateCampaign }) => {
    const [filter, setFilter] = useState('all');

    const platformOptions = ['all', 'instagram', 'tiktok', 'youtube', 'twitch', 'linkedin', 'twitter', 'pinterest'];
    const platformLabels = {
        all: 'All',
        instagram: 'Instagram',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        twitch: 'Twitch',
        linkedin: 'LinkedIn',
        twitter: 'Twitter/X',
        pinterest: 'Pinterest'
    };
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

    const campaignStats = useMemo(() => {
        if (!campaigns.length) {
            return {
                activeCount: 0,
                brandCount: 0,
                avgApplicants: 0,
                topPlatform: 'all'
            };
        }

        const activeCount = campaigns.filter(campaign => campaign.status === 'active').length;
        const brandCount = new Set(campaigns.map(campaign => campaign.businessName)).size;
        const totalApplicants = campaigns.reduce((sum, campaign) => sum + (campaign.applicants || 0), 0);
        const avgApplicants = Math.round(totalApplicants / campaigns.length);
        const platformCounts = campaigns.reduce((acc, campaign) => {
            (campaign.platforms || []).forEach(platform => {
                acc[platform] = (acc[platform] || 0) + 1;
            });
            return acc;
        }, {});
        const topPlatform = Object.entries(platformCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'all';

        return {
            activeCount,
            brandCount,
            avgApplicants,
            topPlatform
        };
    }, [campaigns]);

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
                            {platformLabels[platform] || platform}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Active Campaigns</span>
                    <span className={styles.statValue}>
                        {loading ? '--' : campaignStats.activeCount}
                    </span>
                    <span className={styles.statHint}>Live briefs from brands</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Brands Hiring</span>
                    <span className={styles.statValue}>
                        {loading ? '--' : campaignStats.brandCount}
                    </span>
                    <span className={styles.statHint}>Unique partners this month</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Avg Applicants</span>
                    <span className={styles.statValue}>
                        {loading ? '--' : campaignStats.avgApplicants}
                    </span>
                    <span className={styles.statHint}>Per campaign listing</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Top Platform</span>
                    <span className={styles.statValue}>
                        {loading ? '--' : (platformLabels[campaignStats.topPlatform] || 'All')}
                    </span>
                    <span className={styles.statHint}>Highest demand channel</span>
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
