import { useMemo } from 'react';
import styles from '../styles/MyCampaignsPage.module.css';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const MyCampaignsPage = ({ campaigns, applications, decisions, onSelectCampaign }) => {
  const stats = useMemo(() => {
    const totalApplicants = applications.length;
    const shortlisted = Object.values(decisions || {}).filter(item => item.decision === 'shortlisted').length;
    return {
      totalCampaigns: campaigns.length,
      totalApplicants,
      shortlisted
    };
  }, [campaigns, applications, decisions]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My Campaigns</h1>
          <p>Review applicants and move fast on the best-fit creators.</p>
        </div>
        <div className={styles.stats}>
          <div>
            <span className={styles.statLabel}>Campaigns</span>
            <span className={styles.statValue}>{stats.totalCampaigns}</span>
          </div>
          <div>
            <span className={styles.statLabel}>Applicants</span>
            <span className={styles.statValue}>{stats.totalApplicants}</span>
          </div>
          <div>
            <span className={styles.statLabel}>Shortlisted</span>
            <span className={styles.statValue}>{stats.shortlisted}</span>
          </div>
        </div>
      </div>

      <div className={styles.campaignGrid}>
        {campaigns.map((campaign) => (
          <article key={campaign.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <span className={styles.brand}>{campaign.businessName}</span>
                <h2>{campaign.title}</h2>
                <p>{campaign.description}</p>
              </div>
              <div className={styles.meta}>
                <span className={styles.status}>{campaign.status}</span>
                <span className={styles.date}>Posted {formatDate(campaign.postedDate)}</span>
              </div>
            </div>
            <div className={styles.details}>
              <div>
                <span className={styles.detailLabel}>Budget</span>
                <span className={styles.detailValue}>{campaign.budget}</span>
              </div>
              <div>
                <span className={styles.detailLabel}>Platforms</span>
                <span className={styles.detailValue}>{campaign.platforms.join(', ')}</span>
              </div>
              <div>
                <span className={styles.detailLabel}>Applicants</span>
                <span className={styles.detailValue}>{campaign.applicantIds.length}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button className="btn btn-cta btn-sm" onClick={() => onSelectCampaign(campaign.id)}>
                View applicants
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MyCampaignsPage;

