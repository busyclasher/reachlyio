import { useMemo, useState } from 'react';
import styles from '../styles/Header.module.css';

const Header = ({
  onSearch,
  onViewToggle,
  onPrimaryAction,
  primaryActionLabel,
  onPageChange,
  currentPage,
  viewMode,
  campaignCount = 0,
  applicationCount = 0,
  favoritesCount = 0,
  userRole,
  onRoleReset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = useMemo(() => ([
    {
      id: 'kols',
      label: 'Browse KOLs',
      show: !userRole || userRole === 'business'
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      show: true,
      badge: campaignCount
    },
    {
      id: 'pricing',
      label: 'Pricing',
      show: !userRole || userRole === 'business'
    },
    {
      id: 'favorites',
      label: '❤️ Favorites',
      show: userRole === 'business',
      badge: favoritesCount
    },
    {
      id: 'applications',
      label: 'My Applications',
      show: userRole === 'kol',
      badge: applicationCount
    }
  ]), [userRole, campaignCount, favoritesCount, applicationCount]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };
  const visibleNavItems = navItems.filter(item => item.show);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          {/* Logo */}
          <button
            type="button"
            className={`${styles.logo} ${styles.logoButton}`}
            onClick={() => onPageChange('landing')}
            aria-label="Go to landing page"
          >
            <div className={styles.logoIcon}>R</div>
            <span className={styles.logoText}>Reachly.io</span>
          </button>

          {/* Navigation Tabs */}
          <nav className={styles.nav}>
            {visibleNavItems.map(item => (
              <button
                key={item.id}
                className={`${styles.navBtn} ${currentPage === item.id ? styles.active : ''}`}
                onClick={() => onPageChange(item.id)}
              >
                {item.label}
                {item.badge > 0 && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </button>
            ))}
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

            {userRole && onRoleReset && (
              <div className={styles.roleMeta}>
                <span className={styles.roleBadge}>
                  {userRole === 'business' ? 'Business' : 'KOL'}
                </span>
                <button type="button" className={styles.roleSwitch} onClick={onRoleReset}>
                  Switch
                </button>
              </div>
            )}

            {/* Primary CTA */}
            <button className="btn btn-primary btn-sm" onClick={onPrimaryAction}>
              {primaryActionLabel}
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
          {visibleNavItems.map(item => (
            <button
              key={item.id}
              className={`${styles.mobileNavBtn} ${currentPage === item.id ? styles.active : ''}`}
              onClick={() => { onPageChange(item.id); setMobileMenuOpen(false); }}
            >
              {item.label} {item.badge > 0 && `(${item.badge})`}
            </button>
          ))}
          {userRole && onRoleReset && (
            <button
              className={styles.mobileNavBtn}
              onClick={() => { onRoleReset(); setMobileMenuOpen(false); }}
            >
              Switch role
            </button>
          )}
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            onClick={() => { onPrimaryAction(); setMobileMenuOpen(false); }}
          >
            {primaryActionLabel}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
