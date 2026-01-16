import { useState } from 'react';
import styles from '../styles/ApplyModal.module.css';

const ApplyModal = ({ campaign, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        pitch: '',
        proposedRate: '',
        availability: '',
        portfolio: '',
        experience: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const application = {
            id: Date.now().toString(),
            campaignId: campaign.id,
            campaignTitle: campaign.title,
            businessName: campaign.businessName,
            ...formData,
            status: 'pending',
            appliedDate: new Date().toISOString()
        };

        onSubmit(application);
        setSubmitting(false);
        onClose();
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.header}>
                    <div className={styles.campaignInfo}>
                        <img src={campaign.businessLogo} alt="" className={styles.logo} />
                        <div>
                            <h2 className={styles.title}>Apply to Campaign</h2>
                            <p className={styles.campaignName}>{campaign.title}</p>
                            <p className={styles.business}>by {campaign.businessName}</p>
                        </div>
                    </div>
                    <div className={styles.budget}>
                        <span className={styles.budgetLabel}>Budget</span>
                        <span className={styles.budgetValue}>{campaign.budget}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Why are you the right fit for this campaign? *</label>
                        <textarea
                            name="pitch"
                            value={formData.pitch}
                            onChange={handleInputChange}
                            placeholder="Tell the brand why you're perfect for this campaign. Mention your audience, content style, and any relevant experience..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Your Proposed Rate (SGD) *</label>
                            <input
                                type="text"
                                name="proposedRate"
                                value={formData.proposedRate}
                                onChange={handleInputChange}
                                placeholder="e.g., SGD 1,500"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Availability *</label>
                            <input
                                type="text"
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange}
                                placeholder="e.g., Available from 20 Jan"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Relevant Portfolio Links</label>
                        <input
                            type="text"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            placeholder="Links to similar work you've done (optional)"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Relevant Experience</label>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="Have you worked on similar campaigns before? Share your experience..."
                            rows="3"
                        />
                    </div>

                    <div className={styles.submitSection}>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <p className={styles.note}>
                            The brand will review your application and contact you if interested.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;
