import { useMemo, useState } from 'react';
import styles from '../styles/Header.module.css';

const Header = ({
  currentPage,
  onPageChange,
  onLogout,
  shortlistCount = 0,
  messageCount = 0,
  compareCount = 0,
  isAuthenticated = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => ([
    { id: 'campaigns', label: 'My Campaigns' },
    { id: 'shortlist', label: 'Shortlist', badge: shortlistCount },
    { id: 'messages', label: 'Messages', badge: messageCount },
    { id: 'settings', label: 'Settings' }
  ]), [shortlistCount, messageCount]);

  if (!isAuthenticated) {
    return (
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>R</div>
              <span className={styles.logoText}>Reachly.io</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <button
            type="button"
            className={styles.logoButton}
            onClick={() => onPageChange('campaigns')}
            aria-label="Go to My Campaigns"
          >
            <div className={styles.logoIcon}>R</div>
            <span className={styles.logoText}>Reachly.io</span>
          </button>

          <nav className={styles.nav}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`${styles.navBtn} ${currentPage === item.id ? styles.active : ''}`}
                onClick={() => onPageChange(item.id)}
              >
                {item.label}
                {item.badge > 0 && <span className={styles.badge}>{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className={styles.actions}>
            {compareCount > 0 && (
              <button
                type="button"
                className={styles.compareTag}
                onClick={() => onPageChange('compare')}
              >
                Compare ({compareCount})
              </button>
            )}
            <button type="button" className="btn btn-secondary btn-sm" onClick={onLogout}>
              Sign out
            </button>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`${styles.mobileNavBtn} ${currentPage === item.id ? styles.active : ''}`}
                onClick={() => { onPageChange(item.id); setMobileMenuOpen(false); }}
              >
                {item.label} {item.badge > 0 && `(${item.badge})`}
              </button>
            ))}
            {compareCount > 0 && (
              <button
                className={styles.mobileNavBtn}
                onClick={() => { onPageChange('compare'); setMobileMenuOpen(false); }}
              >
                Compare ({compareCount})
              </button>
            )}
            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
