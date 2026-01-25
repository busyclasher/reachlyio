import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/Dashboard.module.css';

const BusinessDashboard = ({
    campaigns = [],
    applications = [],
    onBrowseKOLs,
    onPostCampaign,
    onViewCampaigns,
    onViewApplications
}) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('campaigns');

    const stats = {
        activeCampaigns: campaigns.filter(c => c.status === 'LIVE').length,
        applicants: applications.length,
        inProgressDeals: applications.filter(a => a.status === 'ACCEPTED').length,
        completed: applications.filter(a => a.status === 'COMPLETED').length
    };

    const kpis = [
        { id: 'active', icon: '📢', label: 'Active Campaigns', value: stats.activeCampaigns, change: '+2' },
        { id: 'applicants', icon: '👥', label: 'New Applicants', value: stats.applicants, change: '+12' },
        { id: 'inProgress', icon: '🤝', label: 'In-Progress Deals', value: stats.inProgressDeals, change: null },
        { id: 'completed', icon: '✅', label: 'Completed', value: stats.completed, change: '+5' }
    ];

    const companyName = user?.profile?.companyName || user?.name || 'there';

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                {/* Welcome Section */}
                <div className={styles.welcome}>
                    <h1 className={styles.welcomeTitle}>Welcome back, {companyName}!</h1>
                    <p className={styles.welcomeSubtitle}>
                        Here's what's happening with your campaigns today.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <button className={styles.actionBtn} onClick={onPostCampaign}>
                        ➕ Post Campaign
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`} onClick={onBrowseKOLs}>
                        🔍 Browse Influencers
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
                        💬 Messages
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
                        className={`${styles.tab} ${activeTab === 'campaigns' ? styles.active : ''}`}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        Campaigns
                        {campaigns.length > 0 && <span className={styles.tabBadge}>{campaigns.length}</span>}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications
                        {applications.length > 0 && <span className={styles.tabBadge}>{applications.length}</span>}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'deals' ? styles.active : ''}`}
                        onClick={() => setActiveTab('deals')}
                    >
                        Deals
                    </button>
                </div>

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Your Campaigns</h2>
                            <button className={styles.sectionAction} onClick={onViewCampaigns}>
                                View all →
                            </button>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📢</div>
                                <h3 className={styles.emptyTitle}>No campaigns yet</h3>
                                <p className={styles.emptyText}>
                                    Post your first campaign to start receiving applications from creators.
                                </p>
                                <button className={styles.actionBtn} onClick={onPostCampaign}>
                                    Post a Campaign
                                </button>
                            </div>
                        ) : (
                            campaigns.slice(0, 5).map(campaign => (
                                <div key={campaign.id} className={styles.listItem}>
                                    <div className={styles.listItemIcon}>📢</div>
                                    <div className={styles.listItemContent}>
                                        <div className={styles.listItemTitle}>{campaign.title}</div>
                                        <div className={styles.listItemMeta}>
                                            {campaign.platforms?.join(', ')} • {campaign.budget}
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles.statusLive}`}>
                                        {campaign.status || 'Live'}
                                    </span>
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
                            <h2 className={styles.sectionTitle}>Recent Applications</h2>
                            <button className={styles.sectionAction} onClick={onViewApplications}>
                                View all →
                            </button>
                        </div>

                        {applications.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>👥</div>
                                <h3 className={styles.emptyTitle}>No applications yet</h3>
                                <p className={styles.emptyText}>
                                    Creators will apply here when you post campaigns.
                                </p>
                            </div>
                        ) : (
                            applications.slice(0, 5).map(app => (
                                <div key={app.id} className={styles.listItem}>
                                    <div className={styles.listItemIcon}>⭐</div>
                                    <div className={styles.listItemContent}>
                                        <div className={styles.listItemTitle}>{app.creatorName || 'Creator'}</div>
                                        <div className={styles.listItemMeta}>
                                            Applied to: {app.campaignTitle || 'Campaign'}
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                                        {app.status || 'Pending'}
                                    </span>
                                    <button className={styles.listItemAction}>Review</button>
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
                                When you accept an application, it becomes a deal.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessDashboard;
