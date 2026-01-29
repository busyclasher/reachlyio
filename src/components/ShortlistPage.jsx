import styles from '../styles/ShortlistPage.module.css';

const ShortlistPage = ({ shortlisted, onContact, onRemove, onExport }) => {
  if (!shortlisted.length) {
    return (
      <div className={styles.empty}>
        <h2>No shortlisted applicants yet</h2>
        <p>Shortlist applicants from a campaign to review and export here.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Shortlist</h1>
          <p>Share internal reviews and move applicants to outreach.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary btn-sm" type="button" onClick={onExport}>
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Campaign</th>
              <th>Platforms</th>
              <th>Engagement</th>
              <th>Price range</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shortlisted.map((row) => (
              <tr key={row.application.id}>
                <td>
                  <div className={styles.applicantCell}>
                    <img src={row.applicant.profilePhoto} alt="" />
                    <div>
                      <strong>{row.applicant.name}</strong>
                      <span>{row.applicant.tagline}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{row.campaign.title}</strong>
                  <span className={styles.muted}>{row.campaign.businessName}</span>
                </td>
                <td>
                  <div className={styles.tagList}>
                    {row.applicant.primaryPlatforms.map(platform => (
                      <span key={platform}>{platform}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <strong>{row.applicant.maxEngagement.toFixed(1)}%</strong>
                  <span className={styles.muted}>{(row.applicant.followerTotal / 1000).toFixed(0)}k</span>
                </td>
                <td>{row.applicant.pricingRange}</td>
                <td>
                  {row.decision.contacted ? 'Contacted' : 'Shortlisted'}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className="btn btn-cta btn-sm" type="button" onClick={() => onContact(row.application.id)}>
                      Contact
                    </button>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => onRemove(row.application.id)}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShortlistPage;
