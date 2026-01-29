import styles from '../styles/LoginPage.module.css';

const LoginPage = ({ onLogin }) => (
  <div className={styles.loginPage}>
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>Business owner portal</span>
        <h1>Review applicants faster</h1>
        <p>
          Browse, compare, and shortlist creators who already applied to your campaigns.
        </p>
        <div className={styles.heroMeta}>
          <div>
            <span className={styles.metaLabel}>Average review time</span>
            <span className={styles.metaValue}>2.3 days</span>
          </div>
          <div>
            <span className={styles.metaLabel}>Active campaigns</span>
            <span className={styles.metaValue}>5</span>
          </div>
          <div>
            <span className={styles.metaLabel}>Shortlist rate</span>
            <span className={styles.metaValue}>18%</span>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.signInCard}>
      <div className={styles.cardHeader}>
        <h2>Sign in</h2>
        <p>Access your campaigns, applicants, and shortlists.</p>
      </div>
      <form className={styles.form} onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
        <label className={styles.label} htmlFor="email">Work email</label>
        <input className={styles.input} id="email" type="email" placeholder="you@company.com" required />
        <label className={styles.label} htmlFor="password">Password</label>
        <input className={styles.input} id="password" type="password" placeholder="Enter your password" required />
        <button type="submit" className="btn btn-bright">Get Started</button>
      </form>
      <div className={styles.helperText}>
        Use any email for demo access. MFA available in settings.
      </div>
    </section>
  </div>
);

export default LoginPage;
