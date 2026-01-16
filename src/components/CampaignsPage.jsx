import { useState } from 'react';
import CampaignCard from './CampaignCard';
import styles from '../styles/CampaignsPage.module.css';

const CampaignsPage = ({ campaigns, onApply }) => {
    const [filter, setFilter] = useState('all');

    const platformOptions = ['all', 'instagram', 'tiktok', 'youtube', 'twitch', 'linkedin'];

    const filteredCampaigns = campaigns.filter(c => {
        if (filter === 'all') return true;
        return c.platforms.includes(filter);
    });

    return (
        <div className={styles.campaignsPage}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Available Campaigns</h1>
                    <p className={styles.subtitle}>
                        Browse {campaigns.length} active campaign{campaigns.length !== 1 ? 's' : ''} from businesses looking for KOLs like you
                    </p>
                </div>
            </div>

            <div className={styles.filters}>
                <span className={styles.filterLabel}>Filter by platform:</span>
                {platformOptions.map(platform => (
                    <button
                        key={platform}
                        className={`${styles.filterBtn} ${filter === platform ? styles.active : ''}`}
                        onClick={() => setFilter(platform)}
                    >
                        {platform === 'all' ? 'All' : platform}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {filteredCampaigns.map(campaign => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onApply={onApply}
                    />
                ))}
            </div>

            {filteredCampaigns.length === 0 && (
                <div className={styles.empty}>
                    <p>No campaigns found for this filter.</p>
                    <button className="btn btn-secondary" onClick={() => setFilter('all')}>
                        View all campaigns
                    </button>
                </div>
            )}
        </div>
    );
};

export default CampaignsPage;
