import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/Dashboard.module.css';

const InfluencerDashboard = ({
    campaigns = [],
    applications = [],
    invites = [],
    onBrowseCampaigns,
    onCreateListing,
    onViewApplications
}) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('feed');

    const stats = {
        newCampaigns: campaigns.filter(c => c.status === 'LIVE').length,
        applications: applications.length,
        invites: invites.length,
        earnings: 0
    };

    const kpis = [
        { id: 'campaigns', icon: '📢', label: 'New Campaigns', value: stats.newCampaigns, change: '+8' },
        { id: 'applications', icon: '📝', label: 'My Applications', value: stats.applications, change: null },
        { id: 'invites', icon: '💌', label: 'Brand Invites', value: stats.invites, change: '+3' },
        { id: 'earnings', icon: '💰', label: 'Pending Earnings', value: `$${stats.earnings}`, change: null }
    ];

    const displayName = user?.profile?.displayName || user?.name || 'Creator';

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                {/* Welcome Section */}
                <div className={styles.welcome}>
                    <h1 className={styles.welcomeTitle}>Hey, {displayName}! ✨</h1>
                    <p className={styles.welcomeSubtitle}>
                        Ready to find your next brand deal? Check out what's new.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <button className={styles.actionBtn} onClick={onBrowseCampaigns}>
                        🔍 Find Campaigns
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`} onClick={onCreateListing}>
                        ⭐ Edit My Listing
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
                        📊 Boost Profile
                    </button>
                </div>

                {/* KPI Cards */}
                <div className={styles.kpiGrid}>
                    {kpis.map(kpi => (
                        <div key={kpi.id} className={styles.kpiCard}>
                            <div className={styles.kpiHeader}>
                                <div className={styles.kpiIcon}>{kpi.icon}</div>
                                {kpi.change && (
                                    <span className={`${styles.kpiChange} ${styles.kpiChangeUp}`}>
                                        {kpi.change}
                                    </span>
                                )}
                            </div>
                            <div className={styles.kpiValue}>{kpi.value}</div>
                            <p className={styles.kpiLabel}>{kpi.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'feed' ? styles.active : ''}`}
                        onClick={() => setActiveTab('feed')}
                    >
                        Campaign Feed
                        {stats.newCampaigns > 0 && <span className={styles.tabBadge}>{stats.newCampaigns}</span>}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'invites' ? styles.active : ''}`}
                        onClick={() => setActiveTab('invites')}
                    >
                        Invites
                        {invites.length > 0 && <span className={styles.tabBadge}>{invites.length}</span>}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'deals' ? styles.active : ''}`}
                        onClick={() => setActiveTab('deals')}
                    >
                        Deals
                    </button>
                </div>

                {/* Campaign Feed Tab */}
                {activeTab === 'feed' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Recommended Campaigns</h2>
                            <button className={styles.sectionAction} onClick={onBrowseCampaigns}>
                                Browse all →
                            </button>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📢</div>
                                <h3 className={styles.emptyTitle}>No campaigns available</h3>
                                <p className={styles.emptyText}>
                                    New campaigns will appear here. Check back soon!
                                </p>
                            </div>
                        ) : (
                            campaigns.slice(0, 5).map(campaign => (
                                <div key={campaign.id} className={styles.listItem}>
                                    <div className={styles.listItemIcon}>🏢</div>
                                    <div className={styles.listItemContent}>
                                        <div className={styles.listItemTitle}>{campaign.title}</div>
                                        <div className={styles.listItemMeta}>
                                            {campaign.brand} • {campaign.budget}
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles.statusLive}`}>
                                        Open
                                    </span>
                                    <button className={styles.listItemAction}>Apply</button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Invites Tab */}
                {activeTab === 'invites' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Brand Invites</h2>
                        </div>

                        {invites.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>💌</div>
                                <h3 className={styles.emptyTitle}>No invites yet</h3>
                                <p className={styles.emptyText}>
                                    Brands will send invites here when they want to work with you.
                                </p>
                                <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`} onClick={onCreateListing}>
                                    Complete Your Profile
                                </button>
                            </div>
                        ) : (
                            invites.map(invite => (
                                <div key={invite.id} className={styles.listItem}>
                                    <div className={styles.listItemIcon}>💌</div>
                                    <div className={styles.listItemContent}>
                                        <div className={styles.listItemTitle}>{invite.brandName}</div>
                                        <div className={styles.listItemMeta}>{invite.campaignTitle}</div>
                                    </div>
                                    <button className={styles.listItemAction}>View</button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>My Applications</h2>
                            <button className={styles.sectionAction} onClick={onViewApplications}>
                                View all →
                            </button>
                        </div>

                        {applications.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📝</div>
                                <h3 className={styles.emptyTitle}>No applications yet</h3>
                                <p className={styles.emptyText}>
                                    Apply to campaigns to start working with brands.
                                </p>
                                <button className={styles.actionBtn} onClick={onBrowseCampaigns}>
                                    Browse Campaigns
                                </button>
                            </div>
                        ) : (
                            applications.slice(0, 5).map(app => (
                                <div key={app.id} className={styles.listItem}>
                                    <div className={styles.listItemIcon}>📝</div>
                                    <div className={styles.listItemContent}>
                                        <div className={styles.listItemTitle}>{app.campaignTitle || 'Campaign'}</div>
                                        <div className={styles.listItemMeta}>
                                            Applied {app.appliedDate || 'recently'}
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${app.status === 'ACCEPTED' ? styles.statusLive :
                                            app.status === 'PENDING' ? styles.statusPending :
                                                styles.statusDraft
                                        }`}>
                                        {app.status || 'Pending'}
                                    </span>
                                    <button className={styles.listItemAction}>View</button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Deals Tab */}
                {activeTab === 'deals' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Active Deals</h2>
                        </div>

                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🤝</div>
                            <h3 className={styles.emptyTitle}>No active deals</h3>
                            <p className={styles.emptyText}>
                                When a brand accepts your application, it becomes a deal.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfluencerDashboard;
