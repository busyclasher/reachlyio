import styles from '../styles/Footer.module.css';

const Footer = ({ onPageChange }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>R</div>
                            <span className={styles.logoText}>Reachly.io</span>
                        </div>
                        <p className={styles.tagline}>
                            Singapore's #1 KOL Marketplace. Connect brands with top influencers.
                        </p>
                        <div className={styles.social}>
                            <a href="#" className={styles.socialLink} aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="TikTok">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div className={styles.column}>
                        <h4>Explore</h4>
                        <ul>
                            <li>
                                <button type="button" className={styles.footerLink} onClick={() => onPageChange('kols')}>
                                    Browse KOLs
                                </button>
                            </li>
                            <li>
                                <button type="button" className={styles.footerLink} onClick={() => onPageChange('campaigns')}>
                                    View Campaigns
                                </button>
                            </li>
                            <li><a href="#">Success Stories</a></li>
                            <li>
                                <button type="button" className={styles.footerLink} onClick={() => onPageChange('pricing')}>
                                    Pricing
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* For KOLs */}
                    <div className={styles.column}>
                        <h4>For KOLs</h4>
                        <ul>
                            <li><a href="#">Create Profile</a></li>
                            <li><a href="#">Find Campaigns</a></li>
                            <li><a href="#">KOL Resources</a></li>
                            <li><a href="#">Growth Tips</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className={styles.column}>
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {currentYear} Reachly.io. All rights reserved.</p>
                    <p className={styles.location}>🇸🇬 Made in Singapore</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
