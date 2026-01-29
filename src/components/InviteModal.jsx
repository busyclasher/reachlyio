import { useState, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import styles from '../styles/InviteModal.module.css';

const InviteModal = ({
    isOpen,
    onClose,
    influencer,
    campaigns = [],
    onSendInvite
}) => {
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);

    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [message, setMessage] = useState('');
    const [offerRate, setOfferRate] = useState('');
    const [loading, setLoading] = useState(false);

    useModalFocus({ containerRef: modalRef, initialFocusRef: closeButtonRef, onClose });

    if (!isOpen) return null;

    const activeCampaigns = campaigns.filter(c => c.status === 'live' || c.status === 'active');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCampaign) return;

        setLoading(true);

        const campaign = campaigns.find(c => c.id === selectedCampaign);

        const invite = {
            id: `inv-${Date.now()}`,
            campaignId: selectedCampaign,
            campaignTitle: campaign?.title || 'Campaign',
            influencerId: influencer?.id,
            influencerName: influencer?.name,
            influencerAvatar: influencer?.profilePhoto,
            message: message.trim(),
            offerRate: offerRate.trim(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        await onSendInvite?.(invite);
        setLoading(false);
        onClose();
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div
                className={styles.modalContent}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close"
                    ref={closeButtonRef}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Invite to Campaign</h2>
                    <p className={styles.subtitle}>
                        Send a campaign invitation to {influencer?.name || 'this creator'}
                    </p>
                </div>

                {/* Influencer Preview */}
                <div className={styles.influencerPreview}>
                    <div className={styles.influencerAvatar}>
                        {influencer?.profilePhoto ? (
                            <img src={influencer.profilePhoto} alt={influencer.name} />
                        ) : (
                            <span>⭐</span>
                        )}
                    </div>
                    <div className={styles.influencerInfo}>
                        <div className={styles.influencerName}>{influencer?.name || 'Creator'}</div>
                        <div className={styles.influencerMeta}>
                            {influencer?.niche?.slice(0, 2).join(', ')}
                            {influencer?.totalFollowers && ` • ${(influencer.totalFollowers / 1000).toFixed(0)}K followers`}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Select Campaign *</label>
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            required
                        >
                            <option value="">Choose a campaign...</option>
                            {activeCampaigns.map(campaign => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.title}
                                </option>
                            ))}
                        </select>
                        {activeCampaigns.length === 0 && (
                            <p className={styles.helpText}>
                                You don't have any active campaigns. Create one first!
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Personal Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell them why you think they'd be a great fit for this campaign..."
                            rows="4"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Offer Rate (Optional)</label>
                        <input
                            type="text"
                            value={offerRate}
                            onChange={(e) => setOfferRate(e.target.value)}
                            placeholder="e.g., SGD 800 per deliverable"
                        />
                        <p className={styles.helpText}>
                            Leave blank to use the campaign's default budget range
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={!selectedCampaign || loading}
                        >
                            {loading ? 'Sending...' : '📩 Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteModal;
