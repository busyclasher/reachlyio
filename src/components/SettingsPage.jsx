import styles from '../styles/SettingsPage.module.css';

const teamMembers = [
  { name: 'Ava Morgan', email: 'ava@reachly.io', role: 'Owner', permissions: ['All access'] },
  { name: 'Jules Tan', email: 'jules@reachly.io', role: 'Team member', permissions: ['Review applicants', 'Add notes'] },
  { name: 'Priya Patel', email: 'priya@reachly.io', role: 'Team member', permissions: ['Shortlist', 'Export'] }
];

const SettingsPage = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <h1>Settings</h1>
      <p>Manage team access, roles, and billing preferences.</p>
    </div>

    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Team members</h2>
        <button className="btn btn-secondary btn-sm" type="button">Invite member</button>
      </div>
      <div className={styles.cardGrid}>
        {teamMembers.map(member => (
          <div key={member.email} className={styles.card}>
            <div>
              <strong>{member.name}</strong>
              <span>{member.email}</span>
            </div>
            <div className={styles.role}>{member.role}</div>
            <ul>
              {member.permissions.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Permissions</h2>
        <p>Define what team members can do without owner approval.</p>
      </div>
      <div className={styles.permissionGrid}>
        <label className={styles.permissionItem}>
          <input type="checkbox" defaultChecked />
          Allow team members to shortlist applicants
        </label>
        <label className={styles.permissionItem}>
          <input type="checkbox" />
          Allow team members to contact influencers
        </label>
        <label className={styles.permissionItem}>
          <input type="checkbox" defaultChecked />
          Allow team members to export CSV
        </label>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Billing</h2>
        <p>Invoices are issued monthly for active campaigns and usage.</p>
      </div>
      <div className={styles.billingCard}>
        <div>
          <span className={styles.billingLabel}>Current plan</span>
          <strong>Business Growth</strong>
        </div>
        <div>
          <span className={styles.billingLabel}>Next invoice</span>
          <strong>Feb 15, 2026</strong>
        </div>
        <button className="btn btn-secondary btn-sm" type="button">Manage billing</button>
      </div>
    </section>
  </div>
);

export default SettingsPage;

