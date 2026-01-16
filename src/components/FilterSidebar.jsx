import { useState } from 'react';
import styles from '../styles/FilterSidebar.module.css';

const FilterSidebar = ({ onFilterChange, activeFilters }) => {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        platform: true,
        followers: true,
        engagement: false
    });

    const categories = [
        { id: 'beauty', label: 'Beauty & Fashion', count: 2 },
        { id: 'tech', label: 'Tech & Gaming', count: 3 },
        { id: 'fitness', label: 'Fitness & Wellness', count: 1 },
        { id: 'food', label: 'Food & Lifestyle', count: 1 },
        { id: 'business', label: 'Business & Finance', count: 1 },
        { id: 'travel', label: 'Travel & Photography', count: 1 }
    ];

    const platforms = [
        { id: 'instagram', label: 'Instagram', icon: '📷' },
        { id: 'tiktok', label: 'TikTok', icon: '🎵' },
        { id: 'youtube', label: 'YouTube', icon: '▶️' },
        { id: 'twitch', label: 'Twitch', icon: '🎮' },
        { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { id: 'twitter', label: 'Twitter/X', icon: '🐦' }
    ];

    const followerRanges = [
        { id: '10k-50k', label: '10K - 50K', min: 10000, max: 50000 },
        { id: '50k-100k', label: '50K - 100K', min: 50000, max: 100000 },
        { id: '100k-500k', label: '100K - 500K', min: 100000, max: 500000 },
        { id: '500k-1m', label: '500K - 1M', min: 500000, max: 1000000 },
        { id: '1m+', label: '1M+', min: 1000000, max: Infinity }
    ];

    const engagementRanges = [
        { id: '1-3', label: '1% - 3%', min: 1, max: 3 },
        { id: '3-5', label: '3% - 5%', min: 3, max: 5 },
        { id: '5-10', label: '5% - 10%', min: 5, max: 10 },
        { id: '10+', label: '10%+', min: 10, max: Infinity }
    ];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCheckboxChange = (filterType, value) => {
        const currentValues = activeFilters[filterType] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        onFilterChange(filterType, newValues);
    };

    const hasActiveFilters = () => {
        return Object.values(activeFilters).some(arr => arr && arr.length > 0);
    };

    const clearAllFilters = () => {
        onFilterChange('clear', null);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h3>Filters</h3>
                {hasActiveFilters() && (
                    <button className={styles.clearAll} onClick={clearAllFilters}>
                        Clear All
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className={styles.filterSection}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('category')}
                >
                    <span>Category</span>
                    <svg
                        className={`${styles.chevron} ${expandedSections.category ? styles.expanded : ''}`}
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {expandedSections.category && (
                    <div className={styles.sectionContent}>
                        {categories.map(cat => (
                            <label key={cat.id} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={(activeFilters.categories || []).includes(cat.id)}
                                    onChange={() => handleCheckboxChange('categories', cat.id)}
                                />
                                <span className={styles.checkboxLabel}>
                                    {cat.label}
                                    <span className={styles.count}>({cat.count})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Platforms */}
            <div className={styles.filterSection}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('platform')}
                >
                    <span>Platform</span>
                    <svg
                        className={`${styles.chevron} ${expandedSections.platform ? styles.expanded : ''}`}
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {expandedSections.platform && (
                    <div className={styles.sectionContent}>
                        {platforms.map(platform => (
                            <label key={platform.id} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={(activeFilters.platforms || []).includes(platform.id)}
                                    onChange={() => handleCheckboxChange('platforms', platform.id)}
                                />
                                <span className={styles.checkboxLabel}>
                                    <span className={styles.platformIcon}>{platform.icon}</span>
                                    {platform.label}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Follower Range */}
            <div className={styles.filterSection}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('followers')}
                >
                    <span>Followers</span>
                    <svg
                        className={`${styles.chevron} ${expandedSections.followers ? styles.expanded : ''}`}
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {expandedSections.followers && (
                    <div className={styles.sectionContent}>
                        {followerRanges.map(range => (
                            <label key={range.id} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={(activeFilters.followerRange || []).includes(range.id)}
                                    onChange={() => handleCheckboxChange('followerRange', range.id)}
                                />
                                <span className={styles.checkboxLabel}>{range.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Engagement Rate */}
            <div className={styles.filterSection}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('engagement')}
                >
                    <span>Engagement Rate</span>
                    <svg
                        className={`${styles.chevron} ${expandedSections.engagement ? styles.expanded : ''}`}
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {expandedSections.engagement && (
                    <div className={styles.sectionContent}>
                        {engagementRanges.map(range => (
                            <label key={range.id} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={(activeFilters.engagementRate || []).includes(range.id)}
                                    onChange={() => handleCheckboxChange('engagementRate', range.id)}
                                />
                                <span className={styles.checkboxLabel}>{range.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Verified Only */}
            <div className={styles.filterSection}>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={activeFilters.verifiedOnly || false}
                        onChange={() => onFilterChange('verifiedOnly', !activeFilters.verifiedOnly)}
                    />
                    <span className={styles.checkboxLabel}>
                        <span className={styles.verifiedBadge}>✓</span>
                        Verified Only
                    </span>
                </label>
            </div>
        </aside>
    );
};

export default FilterSidebar;
