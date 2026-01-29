import { useState } from 'react';
import styles from '../../styles/DealWorkroom.module.css';

const DEAL_STATUSES = {
    pending: { label: 'Pending', icon: '⏳', color: 'warning' },
    funded: { label: 'Funded', icon: '💰', color: 'info' },
    in_progress: { label: 'In Progress', icon: '🔄', color: 'primary' },
    submitted: { label: 'Submitted', icon: '📤', color: 'secondary' },
    revision_requested: { label: 'Revision Requested', icon: '✏️', color: 'warning' },
    approved: { label: 'Approved', icon: '✅', color: 'success' },
    completed: { label: 'Completed', icon: '🎉', color: 'success' }
};

const DealWorkroom = ({
    deal,
    onClose,
    onFundEscrow,
    onApproveDeliverable,
    onRequestRevision,
    onCompleteAndPay,
    onSubmitRating,
    onUpdateChecklist,
    onAddFile,
    isBusiness = true
}) => {
    const [rating, setRating] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [newFileUrl, setNewFileUrl] = useState('');
    const [newFileLabel, setNewFileLabel] = useState('');

    if (!deal) return null;

    const statusInfo = DEAL_STATUSES[deal.status] || DEAL_STATUSES.pending;
    const deliverables = deal.deliverables || [];
    const completedCount = deliverables.filter(d => d.completed).length;
    const files = deal.files || [];

    const handleToggleChecklist = (index) => {
        onUpdateChecklist?.(deal.id, index);
    };

    const handleAddFile = () => {
        if (!newFileUrl.trim()) return;
        onAddFile?.(deal.id, {
            url: newFileUrl.trim(),
            label: newFileLabel.trim() || 'Uploaded file',
            uploadedAt: new Date().toISOString(),
            uploadedBy: isBusiness ? 'business' : 'influencer'
        });
        setNewFileUrl('');
        setNewFileLabel('');
    };

    const handleSubmitRating = () => {
        onSubmitRating?.(deal.id, { rating, comment: ratingComment });
        setShowRatingModal(false);
    };

    return (
        <div className={styles.workroom}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={onClose}>
                    ← Back to Deals
                </button>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>{deal.campaignTitle}</h1>
                    <p className={styles.subtitle}>
                        Deal with {isBusiness ? deal.influencerName : deal.businessName}
                    </p>
                </div>
                <div className={`${styles.statusBadge} ${styles[`status${statusInfo.color.charAt(0).toUpperCase() + statusInfo.color.slice(1)}`]}`}>
                    {statusInfo.icon} {statusInfo.label}
                </div>
            </div>

            <div className={styles.grid}>
                {/* Terms Panel */}
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>📋 Deal Terms</h3>
                    <div className={styles.termsList}>
                        <div className={styles.termItem}>
                            <span className={styles.termLabel}>Compensation</span>
                            <span className={styles.termValue}>{deal.compensation || 'TBD'}</span>
                        </div>
                        <div className={styles.termItem}>
                            <span className={styles.termLabel}>Content Due</span>
                            <span className={styles.termValue}>{deal.contentDueDate || 'TBD'}</span>
                        </div>
                        <div className={styles.termItem}>
                            <span className={styles.termLabel}>Usage Rights</span>
                            <span className={styles.termValue}>{deal.usageRights?.join(', ') || 'Organic only'}</span>
                        </div>
                        <div className={styles.termItem}>
                            <span className={styles.termLabel}>Payment Terms</span>
                            <span className={styles.termValue}>{deal.paymentTerms || 'On approval'}</span>
                        </div>
                    </div>
                </div>

                {/* Escrow Panel */}
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>💳 Payment Status</h3>
                    <div className={styles.escrowStatus}>
                        {deal.escrowStatus === 'funded' ? (
                            <>
                                <div className={styles.escrowIcon}>💰</div>
                                <p className={styles.escrowText}>Escrow Funded</p>
                                <span className={styles.escrowAmount}>{deal.compensation}</span>
                            </>
                        ) : (
                            <>
                                <div className={styles.escrowIcon}>⏳</div>
                                <p className={styles.escrowText}>Awaiting Payment</p>
                                {isBusiness && deal.status === 'pending' && (
                                    <button
                                        className={styles.fundBtn}
                                        onClick={() => onFundEscrow?.(deal.id)}
                                    >
                                        Fund Escrow
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Deliverables Checklist */}
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>
                        ✅ Deliverables ({completedCount}/{deliverables.length})
                    </h3>
                    <div className={styles.checklist}>
                        {deliverables.length === 0 ? (
                            <p className={styles.emptyText}>No deliverables defined</p>
                        ) : (
                            deliverables.map((item, index) => (
                                <div key={index} className={styles.checkItem}>
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={() => handleToggleChecklist(index)}
                                        disabled={isBusiness}
                                    />
                                    <span className={item.completed ? styles.completed : ''}>
                                        {item.quantity}x {item.type}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${deliverables.length ? (completedCount / deliverables.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                {/* Files & Links */}
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>📁 Files & Links</h3>
                    <div className={styles.filesList}>
                        {files.length === 0 ? (
                            <p className={styles.emptyText}>No files uploaded yet</p>
                        ) : (
                            files.map((file, index) => (
                                <a
                                    key={index}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.fileItem}
                                >
                                    <span className={styles.fileIcon}>📎</span>
                                    <span className={styles.fileLabel}>{file.label}</span>
                                    <span className={styles.fileMeta}>by {file.uploadedBy}</span>
                                </a>
                            ))
                        )}
                    </div>
                    <div className={styles.fileUpload}>
                        <input
                            type="text"
                            placeholder="Paste link URL..."
                            value={newFileUrl}
                            onChange={(e) => setNewFileUrl(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Label (optional)"
                            value={newFileLabel}
                            onChange={(e) => setNewFileLabel(e.target.value)}
                        />
                        <button onClick={handleAddFile} disabled={!newFileUrl.trim()}>
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className={styles.actionBar}>
                {isBusiness ? (
                    <>
                        {deal.status === 'submitted' && (
                            <>
                                <button
                                    className={styles.revisionBtn}
                                    onClick={() => onRequestRevision?.(deal.id)}
                                >
                                    ✏️ Request Revision
                                </button>
                                <button
                                    className={styles.approveBtn}
                                    onClick={() => onApproveDeliverable?.(deal.id)}
                                >
                                    ✅ Approve Content
                                </button>
                            </>
                        )}
                        {deal.status === 'approved' && (
                            <button
                                className={styles.completeBtn}
                                onClick={() => {
                                    onCompleteAndPay?.(deal.id);
                                    setShowRatingModal(true);
                                }}
                            >
                                💰 Release Payment & Complete
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {(deal.status === 'in_progress' || deal.status === 'funded') && (
                            <button
                                className={styles.submitBtn}
                                onClick={() => onApproveDeliverable?.(deal.id)}
                            >
                                📤 Submit for Review
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className={styles.ratingOverlay}>
                    <div className={styles.ratingModal}>
                        <h3>Rate Your Experience</h3>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    className={`${styles.star} ${rating >= star ? styles.active : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        <textarea
                            placeholder="Leave a comment (optional)..."
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                            rows="3"
                        />
                        <div className={styles.ratingActions}>
                            <button onClick={() => setShowRatingModal(false)}>Skip</button>
                            <button className={styles.submitRatingBtn} onClick={handleSubmitRating}>
                                Submit Rating
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealWorkroom;
