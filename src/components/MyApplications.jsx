import { useMemo, useState } from 'react';
import styles from '../styles/MyApplications.module.css';

const MyApplications = ({ applications, onViewCampaign, onWithdraw, onUpdateStatus, onBrowseCampaigns }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const statusOptions = [
        { id: 'all', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'review', label: 'Review' },
        { id: 'accepted', label: 'Accepted' },
        { id: 'rejected', label: 'Rejected' }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return styles.pending;
            case 'accepted': return styles.accepted;
            case 'rejected': return styles.rejected;
            case 'review': return styles.review;
            default: return styles.pending;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pending Review';
            case 'accepted': return 'Accepted! 🎉';
            case 'rejected': return 'Not Selected';
            case 'review': return 'Under Review';
            default: return 'Pending';
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-SG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredApplications = useMemo(() => {
        const normalized = applications.map(app => ({
            ...app,
            status: app.status || 'pending'
        }));
        const filtered = statusFilter === 'all'
            ? normalized
            : normalized.filter(app => app.status === statusFilter);
        return filtered.sort((a, b) => (
            new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        ));
    }, [applications, statusFilter]);

    const progressCount = applications.filter(app => (
        !app.status || app.status === 'pending' || app.status === 'review'
    )).length;
    const acceptedCount = applications.filter(app => app.status === 'accepted').length;

    if (applications.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📋</div>
                <h2>No Applications Yet</h2>
                <p>Browse campaigns and apply to start working with brands!</p>
                {onBrowseCampaigns && (
                    <button className="btn btn-primary btn-sm" onClick={onBrowseCampaigns}>
                        Browse campaigns
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>My Applications</h2>
            <p className={styles.subtitle}>
                Track the status of your campaign applications
            </p>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{applications.length}</span>
                    <span className={styles.statLabel}>Total Applications</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>
                        {progressCount}
                    </span>
                    <span className={styles.statLabel}>In Progress</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>
                        {acceptedCount}
                    </span>
                    <span className={styles.statLabel}>Accepted</span>
                </div>
            </div>

            <div className={styles.filters}>
                <span className={styles.filterLabel}>Filter by status:</span>
                <div className={styles.filterButtons}>
                    {statusOptions.map(option => (
                        <button
                            key={option.id}
                            className={`${styles.filterBtn} ${statusFilter === option.id ? styles.active : ''}`}
                            onClick={() => setStatusFilter(option.id)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <span className={styles.filterSummary}>
                    Showing {filteredApplications.length} of {applications.length}
                </span>
            </div>

            {filteredApplications.length === 0 ? (
                <div className={styles.filteredEmpty}>
                    <h3>No applications found</h3>
                    <p>Try a different status or review open campaigns.</p>
                    <div className={styles.filteredActions}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setStatusFilter('all')}>
                            Clear filter
                        </button>
                        {onBrowseCampaigns && (
                            <button className="btn btn-primary btn-sm" onClick={onBrowseCampaigns}>
                                Browse campaigns
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.applicationsList}>
                    {filteredApplications.map(app => {
                        const status = app.status || 'pending';
                        const pitch = app.pitch || '';
                        return (
                        <div key={app.id} className={styles.applicationCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.campaignInfo}>
                                    <h3 className={styles.campaignTitle}>{app.campaignTitle}</h3>
                                    <span className={styles.businessName}>{app.businessName}</span>
                                </div>
                                <span className={`${styles.status} ${getStatusColor(status)}`}>
                                    {getStatusLabel(status)}
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.detail}>
                                    <span className={styles.detailLabel}>Your Proposed Rate:</span>
                                    <span className={styles.detailValue}>{app.proposedRate}</span>
                                </div>
                                <div className={styles.detail}>
                                    <span className={styles.detailLabel}>Applied On:</span>
                                    <span className={styles.detailValue}>{formatDate(app.appliedDate)}</span>
                                </div>
                                <div className={styles.detail}>
                                    <span className={styles.detailLabel}>Availability:</span>
                                    <span className={styles.detailValue}>{app.availability}</span>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <p className={styles.pitch}>"{pitch.slice(0, 100)}{pitch.length > 100 ? '...' : ''}"</p>
                                <div className={styles.footerActions}>
                                    {onViewCampaign && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => onViewCampaign(app.campaignId)}
                                        >
                                            View Campaign
                                        </button>
                                    )}
                                    {onWithdraw && (
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => onWithdraw(app.id)}
                                        >
                                            Withdraw
                                        </button>
                                    )}
                                    {onUpdateStatus && (
                                        <div className={styles.statusControl}>
                                            <label className={styles.statusLabel} htmlFor={`status-${app.id}`}>
                                                Status
                                            </label>
                                            <select
                                                id={`status-${app.id}`}
                                                className={styles.statusSelect}
                                                value={status}
                                                onChange={(event) => onUpdateStatus(app.id, event.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="review">Review</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
