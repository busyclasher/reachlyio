import styles from '../styles/StartPage.module.css';

const StartPage = ({ onSelectRole, onSeeOverview }) => {
    const handleSelect = (role) => {
        if (typeof onSelectRole === 'function') {
            onSelectRole(role);
        }
    };

    return (
        <div className={styles.start}>
            <div className={styles.hero}>
                <span className={styles.kicker}>Get started</span>
                <h1 className={styles.title}>Choose your path on Reachly.io</h1>
                <p className={styles.subtitle}>
                    Tell us who you are so we can take you to the right experience.
                </p>
            </div>

            <div className={styles.cards}>
                <button
                    type="button"
                    className={styles.card}
                    onClick={() => handleSelect('business')}
                    style={{ margin: '0 auto' }}
                >
                    <div className={styles.cardHeader}>
                        <span className={styles.cardEyebrow}>For brands</span>
                        <h2 className={styles.cardTitle}>Business owner</h2>
                    </div>
                    <ul className={styles.cardList}>
                        <li>Browse verified KOLs in Singapore</li>
                        <li>Post briefs and compare creators</li>
                        <li>Shortlist talent and manage campaigns</li>
                    </ul>
                    <div className={styles.cardCta}>Browse creators</div>
                </button>
            </div>

            <p className={styles.switchNote}>
                You can switch roles anytime from the header once you are inside the app.
            </p>

            {onSeeOverview && (
                <div className={styles.secondary}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onSeeOverview}>
                        See how Reachly works
                    </button>
                </div>
            )}
        </div>
    );
};

export default StartPage;
