import styles from '../styles/ApplicantProfileDrawer.module.css';

const ApplicantProfileDrawer = ({
  applicant,
  application,
  decision,
  notes,
  onNotesChange,
  onClose,
  onShortlist,
  onReject,
  onContact
}) => {
  if (!applicant || !application) {
    return null;
  }

  const statusLabels = [];
  if (decision?.decision === 'shortlisted') statusLabels.push('Shortlisted');
  if (decision?.decision === 'rejected') statusLabels.push('Rejected');
  if (decision?.contacted) statusLabels.push('Contacted');
  if (!statusLabels.length) statusLabels.push('Applied');

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <button type="button" className={styles.closeButton} onClick={onClose}>Close</button>
          <div className={styles.profileIntro}>
            <img src={applicant.profilePhoto} alt="" />
            <div>
              <h2>{applicant.name}</h2>
              <p>{applicant.tagline}</p>
              <div className={styles.metaLine}>
                <span>{applicant.location}</span>
                <span>{applicant.languages?.join(', ')}</span>
                <span>Response {applicant.responseTimeHours}h</span>
              </div>
              <div className={styles.statusRow}>
                {statusLabels.map(label => (
                  <span key={label} className={styles.status}>{label}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button className="btn btn-cta btn-sm" type="button" onClick={() => onShortlist(application.id)}>
              Shortlist
            </button>
            <button className="btn btn-cta btn-sm" type="button" onClick={() => onContact(application.id)}>
              Contact influencer
            </button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => onReject(application.id)}>
              Reject
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Platform stats</h3>
          <div className={styles.statGrid}>
            {Object.entries(applicant.platforms || {}).map(([platform, data]) => (
              <div key={platform} className={styles.statCard}>
                <span className={styles.statLabel}>{platform}</span>
                <span className={styles.statValue}>{(data.followers / 1000).toFixed(0)}k followers</span>
                <span className={styles.statMeta}>{data.engagementRate}% engagement</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Audience breakdown</h3>
          <div className={styles.audienceGrid}>
            <div>
              <h4>Top locations</h4>
              {(applicant.audience?.locations || []).map(location => (
                <div key={location.label} className={styles.row}>
                  <span>{location.label}</span>
                  <span>{location.percent}%</span>
                </div>
              ))}
            </div>
            <div>
              <h4>Age split</h4>
              {Object.entries(applicant.audience?.age || {}).map(([range, value]) => (
                <div key={range} className={styles.row}>
                  <span>{range}</span>
                  <span>{value}%</span>
                </div>
              ))}
            </div>
            <div>
              <h4>Gender</h4>
              {Object.entries(applicant.audience?.gender || {}).map(([label, value]) => (
                <div key={label} className={styles.row}>
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Portfolio</h3>
          <div className={styles.mediaGrid}>
            {(applicant.portfolio || []).map((item, index) => (
              <img key={`${item}-${index}`} src={item} alt="" />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Recent posts</h3>
          <div className={styles.mediaGrid}>
            {(applicant.recentPosts || []).map((item, index) => (
              <img key={`${item}-${index}`} src={item} alt="" />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Media kit</h3>
          <div className={styles.mediaKit}>
            <div>
              <strong>{applicant.mediaKit?.fileName}</strong>
              <span>Updated {applicant.mediaKit?.updated} - {applicant.mediaKit?.size}</span>
            </div>
            <button type="button" className="btn btn-secondary btn-sm">Download</button>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Past brand collaborations</h3>
          <div className={styles.list}>
            {(applicant.collaborations || []).map((collab, index) => (
              <div key={`${collab.brand}-${index}`}>
                <strong>{collab.brand}</strong>
                <span>{collab.result}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Rate card</h3>
          <div className={styles.list}>
            {(applicant.rateCard || []).map((item, index) => (
              <div key={`${item.label}-${index}`}>
                <strong>{item.label}</strong>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Notes</h3>
          <textarea
            className={styles.notes}
            value={notes || ''}
            onChange={(event) => onNotesChange(applicant.id, event.target.value)}
            placeholder="Add internal notes about fit, concerns, or next steps."
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileDrawer;

