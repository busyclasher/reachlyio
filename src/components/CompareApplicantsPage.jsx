import styles from '../styles/CompareApplicantsPage.module.css';

const CompareApplicantsPage = ({ rows, onRemove, onShortlist, onContact, onBack }) => {
  if (!rows.length) {
    return (
      <div className={styles.empty}>
        <h2>No applicants selected</h2>
        <p>Select up to three applicants from a campaign to compare.</p>
        <button className="btn btn-secondary btn-sm" type="button" onClick={onBack}>
          Back to applicants
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Compare applicants</h1>
          <p>Side-by-side metrics to choose the best fit.</p>
        </div>
        <button className="btn btn-secondary btn-sm" type="button" onClick={onBack}>
          Back to applicants
        </button>
      </div>

      <div className={styles.compareGrid}>
        {rows.map(({ application, applicant }) => (
          <article key={application.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <img src={applicant.profilePhoto} alt="" />
              <div>
                <h3>{applicant.name}</h3>
                <p>{applicant.tagline}</p>
              </div>
              <button type="button" className={styles.remove} onClick={() => onRemove(application.id)}>
                Remove
              </button>
            </div>
            <div className={styles.section}>
              <h4>Key metrics</h4>
              <div className={styles.metrics}>
                <div>
                  <span>Engagement</span>
                  <strong>{applicant.maxEngagement.toFixed(1)}%</strong>
                </div>
                <div>
                  <span>Followers</span>
                  <strong>{(applicant.followerTotal / 1000).toFixed(0)}k</strong>
                </div>
                <div>
                  <span>Response</span>
                  <strong>{applicant.responseTimeHours}h</strong>
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <h4>Audience</h4>
              <p>Top location: {applicant.audience?.locations?.[0]?.label}</p>
              <p>Top age: {applicant.topAgeRange}</p>
            </div>
            <div className={styles.section}>
              <h4>Content formats</h4>
              <div className={styles.tagList}>
                {(applicant.contentFormats || []).map(format => (
                  <span key={format}>{format}</span>
                ))}
              </div>
            </div>
            <div className={styles.section}>
              <h4>Rate card</h4>
              <p>{applicant.pricingRange}</p>
              <div className={styles.list}>
                {(applicant.rateCard || []).slice(0, 2).map(item => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.price}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.section}>
              <h4>Past brand categories</h4>
              <p>{(applicant.pastBrandCategories || []).join(', ')}</p>
            </div>
            <div className={styles.actions}>
              <button className="btn btn-cta btn-sm" type="button" onClick={() => onShortlist(application.id)}>
                Shortlist
              </button>
              <button className="btn btn-cta btn-sm" type="button" onClick={() => onContact(application.id)}>
                Contact
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CompareApplicantsPage;

