import styles from '../styles/Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <div className={styles.logoIcon}>R</div>
                        <span className={styles.logoText}>Reachly.io</span>
                    </div>
                    <p>Business owner portal for reviewing applicant creators.</p>
                    <span className={styles.copy}>(c) {currentYear} Reachly.io</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

