import { useState } from 'react';
import styles from '../styles/Header.module.css';

const Header = ({ onSearch, onViewToggle, onCreateClick, onPageChange, currentPage, viewMode, campaignCount = 0, applicationCount = 0, favoritesCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => onPageChange('landing')} style={{ cursor: 'pointer' }}>
            <div className={styles.logoIcon}>R</div>
            <span className={styles.logoText}>Reachly.io</span>
          </div>

          {/* Navigation Tabs */}
          <nav className={styles.nav}>
            <button
              className={`${styles.navBtn} ${currentPage === 'kols' ? styles.active : ''}`}
              onClick={() => onPageChange('kols')}
            >
              Browse KOLs
            </button>
            <button
              className={`${styles.navBtn} ${currentPage === 'campaigns' ? styles.active : ''}`}
              onClick={() => onPageChange('campaigns')}
            >
              Campaigns
              {campaignCount > 0 && (
                <span className={styles.badge}>{campaignCount}</span>
              )}
            </button>
            <button
              className={`${styles.navBtn} ${currentPage === 'pricing' ? styles.active : ''}`}
              onClick={() => onPageChange('pricing')}
            >
              Pricing
            </button>
            <button
              className={`${styles.navBtn} ${currentPage === 'favorites' ? styles.active : ''}`}
              onClick={() => onPageChange('favorites')}
            >
              ❤️ Favorites
              {favoritesCount > 0 && (
                <span className={styles.badge}>{favoritesCount}</span>
              )}
            </button>
            <button
              className={`${styles.navBtn} ${currentPage === 'applications' ? styles.active : ''}`}
              onClick={() => onPageChange('applications')}
            >
              My Applications
              {applicationCount > 0 && (
                <span className={styles.badge}>{applicationCount}</span>
              )}
            </button>
          </nav>

          {/* Search Bar - Desktop (only show on KOLs page) */}
          {currentPage === 'kols' && (
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, niche, or platform..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearch}
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* View Toggle & CTA */}
          <div className={styles.actions}>
            {/* View Toggle - only on KOLs page */}
            {currentPage === 'kols' && (
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => onViewToggle('grid')}
                  aria-label="Grid view"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => onViewToggle('list')}
                  aria-label="List view"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* List Your Profile CTA */}
            <button className="btn btn-primary btn-sm" onClick={onCreateClick}>
              List Your Profile
            </button>

            {/* Mobile Menu Toggle */}
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

        {/* Mobile Search - only on KOLs page */}
        {currentPage === 'kols' && (
          <div className={styles.mobileSearch}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Search KOLs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <button
            className={`${styles.mobileNavBtn} ${currentPage === 'kols' ? styles.active : ''}`}
            onClick={() => { onPageChange('kols'); setMobileMenuOpen(false); }}
          >
            Browse KOLs
          </button>
          <button
            className={`${styles.mobileNavBtn} ${currentPage === 'campaigns' ? styles.active : ''}`}
            onClick={() => { onPageChange('campaigns'); setMobileMenuOpen(false); }}
          >
            Campaigns
          </button>
          <button
            className={`${styles.mobileNavBtn} ${currentPage === 'pricing' ? styles.active : ''}`}
            onClick={() => { onPageChange('pricing'); setMobileMenuOpen(false); }}
          >
            Pricing
          </button>
          <button
            className={`${styles.mobileNavBtn} ${currentPage === 'applications' ? styles.active : ''}`}
            onClick={() => { onPageChange('applications'); setMobileMenuOpen(false); }}
          >
            My Applications {applicationCount > 0 && `(${applicationCount})`}
          </button>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={onCreateClick}>
            List Your Profile
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
