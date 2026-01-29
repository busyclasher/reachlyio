import { useState, useMemo } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/Dashboard.module.css';

const CAMPAIGN_STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'draft', label: 'Draft' },
    { id: 'paused', label: 'Paused' },
    { id: 'closed', label: 'Closed' }
];

const APPLICATION_STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'shortlisted', label: 'Shortlisted' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' }
];

const DEAL_STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'pending_approval', label: 'Pending Approval' },
    { id: 'completed', label: 'Completed' }
];

const BusinessDashboard = ({
    campaigns = [],
    applications = [],
    deals = [],
    onBrowseKOLs,
    onPostCampaign,
    onViewCampaigns,
    onViewApplications,
    onViewDeals,
    onAcceptApplication,
    onRejectApplication,
    onShortlistApplication,
    onViewDeal
}) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('campaigns');
    const [campaignFilter, setCampaignFilter] = useState('all');
    const [applicationFilter, setApplicationFilter] = useState('all');
    const [dealFilter, setDealFilter] = useState('all');

    // Calculate stats
    const stats = useMemo(() => ({
        activeCampaigns: campaigns.filter(c => c.status === 'live').length,
        applicants: applications.filter(a => a.status === 'new' || a.status === 'pending').length,
        inProgressDeals: deals.filter(d => d.status === 'in_progress' || d.status === 'funded').length,
        completed: deals.filter(d => d.status === 'completed').length
    }), [campaigns, applications, deals]);

    // Filter data based on sub-tabs
    const filteredCampaigns = useMemo(() => {
        if (campaignFilter === 'all') return campaigns;
        return campaigns.filter(c => c.status === campaignFilter);
    }, [campaigns, campaignFilter]);

    const filteredApplications = useMemo(() => {
        if (applicationFilter === 'all') return applications;
        const statusMap = { new: 'pending', shortlisted: 'shortlisted', accepted: 'accepted', rejected: 'rejected' };
        return applications.filter(a => a.status === applicationFilter || a.status === statusMap[applicationFilter]);
    }, [applications, applicationFilter]);

    const filteredDeals = useMemo(() => {
        if (dealFilter === 'all') return deals;
        return deals.filter(d => d.status === dealFilter);
    }, [deals, dealFilter]);

    const kpis = [
        { id: 'active', icon: '📢', label: 'Active Campaigns', value: stats.activeCampaigns, color: 'primary' },
        { id: 'applicants', icon: '👥', label: 'New Applicants', value: stats.applicants, color: 'info' },
        { id: 'inProgress', icon: '🤝', label: 'In-Progress Deals', value: stats.inProgressDeals, color: 'warning' },
        { id: 'completed', icon: '✅', label: 'Completed', value: stats.completed, color: 'success' }
    ];

    const companyName = user?.profile?.companyName || user?.name || 'there';

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            live: styles.statusLive,
            draft: styles.statusDraft,
            paused: styles.statusPaused,
            closed: styles.statusClosed,
            pending: styles.statusPending,
            new: styles.statusPending,
            shortlisted: styles.statusShortlisted,
            accepted: styles.statusAccepted,
            rejected: styles.statusRejected,
            in_progress: styles.statusInProgress,
            funded: styles.statusFunded,
            submitted: styles.statusSubmitted,
            completed: styles.statusCompleted
        };
        return statusMap[status] || styles.statusDefault;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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
                    <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
                        💳 Billing
                    </button>
                </div>

                {/* KPI Cards */}
                <div className={styles.kpiGrid}>
                    {kpis.map(kpi => (
                        <div key={kpi.id} className={`${styles.kpiCard} ${styles[`kpi${kpi.color.charAt(0).toUpperCase() + kpi.color.slice(1)}`]}`}>
                            <div className={styles.kpiIcon}>{kpi.icon}</div>
                            <div className={styles.kpiValue}>{kpi.value}</div>
                            <p className={styles.kpiLabel}>{kpi.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'campaigns' ? styles.active : ''}`}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        📢 Campaigns
                        {campaigns.length > 0 && <span className={styles.tabBadge}>{campaigns.length}</span>}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        👥 Applications
                        {applications.filter(a => a.status === 'pending' || a.status === 'new').length > 0 && (
                            <span className={styles.tabBadge}>
                                {applications.filter(a => a.status === 'pending' || a.status === 'new').length}
                            </span>
                        )}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'deals' ? styles.active : ''}`}
                        onClick={() => setActiveTab('deals')}
                    >
                        🤝 Deals
                        {deals.length > 0 && <span className={styles.tabBadge}>{deals.length}</span>}
                    </button>
                </div>

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                    <div className={styles.section}>
                        <div className={styles.subTabs}>
                            {CAMPAIGN_STATUS_TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.subTab} ${campaignFilter === tab.id ? styles.active : ''}`}
                                    onClick={() => setCampaignFilter(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {filteredCampaigns.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📢</div>
                                <h3 className={styles.emptyTitle}>No campaigns {campaignFilter !== 'all' ? `with status "${campaignFilter}"` : 'yet'}</h3>
                                <p className={styles.emptyText}>
                                    Post your first campaign to start receiving applications from creators.
                                </p>
                                <button className={styles.actionBtn} onClick={onPostCampaign}>
                                    Post a Campaign
                                </button>
                            </div>
                        ) : (
                            <div className={styles.listContainer}>
                                {filteredCampaigns.map(campaign => (
                                    <div key={campaign.id} className={styles.listItem}>
                                        <div className={styles.listItemIcon}>
                                            {campaign.businessLogo ? (
                                                <img src={campaign.businessLogo} alt="" className={styles.listItemAvatar} />
                                            ) : '📢'}
                                        </div>
                                        <div className={styles.listItemContent}>
                                            <div className={styles.listItemTitle}>{campaign.title}</div>
                                            <div className={styles.listItemMeta}>
                                                {campaign.platforms?.join(', ')} •
                                                {campaign.compensationType === 'product' ? ' Product Only' : ` SGD ${campaign.budgetMin || campaign.budget}${campaign.budgetMax ? `-${campaign.budgetMax}` : ''}`}
                                                {campaign.applicationDeadline && ` • Due ${formatDate(campaign.applicationDeadline)}`}
                                            </div>
                                        </div>
                                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(campaign.status)}`}>
                                            {campaign.status || 'Live'}
                                        </span>
                                        <div className={styles.listItemStats}>
                                            <span>{campaign.applicants || 0} applicants</span>
                                        </div>
                                        <button className={styles.listItemAction} onClick={() => onViewCampaigns?.()}>
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className={styles.section}>
                        <div className={styles.subTabs}>
                            {APPLICATION_STATUS_TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.subTab} ${applicationFilter === tab.id ? styles.active : ''}`}
                                    onClick={() => setApplicationFilter(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {filteredApplications.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>👥</div>
                                <h3 className={styles.emptyTitle}>No applications {applicationFilter !== 'all' ? `with status "${applicationFilter}"` : 'yet'}</h3>
                                <p className={styles.emptyText}>
                                    Creators will apply here when you post campaigns.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.listContainer}>
                                {filteredApplications.map(app => (
                                    <div key={app.id} className={styles.applicationCard}>
                                        <div className={styles.applicationHeader}>
                                            <div className={styles.applicationAvatar}>
                                                {app.creatorAvatar ? (
                                                    <img src={app.creatorAvatar} alt="" />
                                                ) : '⭐'}
                                            </div>
                                            <div className={styles.applicationInfo}>
                                                <div className={styles.applicationName}>{app.creatorName || 'Creator'}</div>
                                                <div className={styles.applicationMeta}>
                                                    Applied to: {app.campaignTitle || 'Campaign'}
                                                </div>
                                            </div>
                                            <span className={`${styles.statusBadge} ${getStatusBadgeClass(app.status)}`}>
                                                {app.status || 'Pending'}
                                            </span>
                                        </div>

                                        {app.message && (
                                            <div className={styles.applicationPitch}>
                                                <p>"{app.message}"</p>
                                            </div>
                                        )}

                                        <div className={styles.applicationStats}>
                                            {app.proposedRate && (
                                                <span className={styles.applicationRate}>
                                                    💰 {app.proposedRate}
                                                </span>
                                            )}
                                            {app.followers && (
                                                <span>👥 {app.followers} followers</span>
                                            )}
                                            {app.engagement && (
                                                <span>📊 {app.engagement}% engagement</span>
                                            )}
                                        </div>

                                        {(app.status === 'pending' || app.status === 'new') && (
                                            <div className={styles.applicationActions}>
                                                <button
                                                    className={`${styles.appActionBtn} ${styles.appActionReject}`}
                                                    onClick={() => onRejectApplication?.(app.id)}
                                                >
                                                    ✕ Reject
                                                </button>
                                                <button
                                                    className={`${styles.appActionBtn} ${styles.appActionShortlist}`}
                                                    onClick={() => onShortlistApplication?.(app.id)}
                                                >
                                                    ⭐ Shortlist
                                                </button>
                                                <button className={`${styles.appActionBtn} ${styles.appActionMessage}`}>
                                                    💬 Message
                                                </button>
                                                <button
                                                    className={`${styles.appActionBtn} ${styles.appActionAccept}`}
                                                    onClick={() => onAcceptApplication?.(app.id)}
                                                >
                                                    ✓ Accept
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Deals Tab */}
                {activeTab === 'deals' && (
                    <div className={styles.section}>
                        <div className={styles.subTabs}>
                            {DEAL_STATUS_TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.subTab} ${dealFilter === tab.id ? styles.active : ''}`}
                                    onClick={() => setDealFilter(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {filteredDeals.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🤝</div>
                                <h3 className={styles.emptyTitle}>No deals {dealFilter !== 'all' ? `with status "${dealFilter}"` : 'yet'}</h3>
                                <p className={styles.emptyText}>
                                    When you accept an application, it becomes a deal.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.listContainer}>
                                {filteredDeals.map(deal => (
                                    <div key={deal.id} className={styles.dealCard}>
                                        <div className={styles.dealHeader}>
                                            <div className={styles.dealInfo}>
                                                <div className={styles.dealTitle}>{deal.campaignTitle}</div>
                                                <div className={styles.dealMeta}>
                                                    with {deal.influencerName} • {deal.compensation}
                                                </div>
                                            </div>
                                            <span className={`${styles.statusBadge} ${getStatusBadgeClass(deal.status)}`}>
                                                {deal.status?.replace('_', ' ') || 'Active'}
                                            </span>
                                        </div>

                                        <div className={styles.dealProgress}>
                                            <div className={styles.dealProgressLabel}>
                                                Deliverables: {deal.completedDeliverables || 0}/{deal.totalDeliverables || 0}
                                            </div>
                                            <div className={styles.dealProgressBar}>
                                                <div
                                                    className={styles.dealProgressFill}
                                                    style={{ width: `${((deal.completedDeliverables || 0) / (deal.totalDeliverables || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.dealFooter}>
                                            {deal.escrowStatus && (
                                                <span className={`${styles.escrowBadge} ${deal.escrowStatus === 'funded' ? styles.escrowFunded : ''}`}>
                                                    {deal.escrowStatus === 'funded' ? '💰 Escrow Funded' : '⏳ Awaiting Payment'}
                                                </span>
                                            )}
                                            <button
                                                className={styles.dealActionBtn}
                                                onClick={() => onViewDeal?.(deal.id)}
                                            >
                                                Open Workroom →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessDashboard;
