import { useMemo, useRef, useState } from 'react';
import styles from '../styles/CreateCampaignModal.module.css';
import { useModalFocus } from '../hooks/useModalFocus';

const PLATFORM_OPTIONS = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'twitch', label: 'Twitch' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'Twitter/X' },
    { id: 'pinterest', label: 'Pinterest' }
];

const PLATFORM_LABELS = PLATFORM_OPTIONS.reduce((acc, option) => {
    acc[option.id] = option.label;
    return acc;
}, {});

const NICHE_OPTIONS = [
    'Beauty',
    'Fashion',
    'Lifestyle',
    'Tech',
    'Gaming',
    'Fitness',
    'Wellness',
    'Food',
    'Travel',
    'Photography',
    'Business',
    'Finance',
    'Marketing',
    'Entertainment'
];

const CONTENT_TYPE_OPTIONS = [
    'Reels',
    'Stories',
    'Posts',
    'Review Video',
    'Livestream',
    'Carousel',
    'UGC',
    'Event Coverage'
];

const BRAND_COLORS = ['7C3AED', 'EC4899', '14B8A6', '3B82F6', 'F59E0B', 'EF4444', '22C55E'];

const getBrandColor = (name) => {
    const seed = name.trim() || 'brand';
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % BRAND_COLORS.length;
    return BRAND_COLORS[index];
};

const CreateCampaignModal = ({ onClose, onSubmit }) => {
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const [formData, setFormData] = useState({
        businessName: '',
        title: '',
        description: '',
        budget: '',
        duration: '',
        targetAudience: ''
    });
    const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram']);
    const [selectedNiches, setSelectedNiches] = useState([]);
    const [selectedContentTypes, setSelectedContentTypes] = useState([]);
    const [errors, setErrors] = useState({});

    useModalFocus({ containerRef: modalRef, initialFocusRef: closeButtonRef, onClose });

    const brandName = formData.businessName.trim() || 'Your Brand';
    const brandColor = useMemo(() => getBrandColor(brandName), [brandName]);
    const brandLogo = useMemo(() => (
        `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=${brandColor}&color=fff`
    ), [brandName, brandColor]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleSelection = (value, values, setter) => {
        if (values.includes(value)) {
            setter(values.filter(item => item !== value));
        } else {
            setter([...values, value]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = {};

        if (selectedPlatforms.length === 0) {
            nextErrors.platforms = 'Select at least one platform.';
        }

        if (selectedNiches.length === 0) {
            nextErrors.niches = 'Select at least one niche.';
        }

        if (selectedContentTypes.length === 0) {
            nextErrors.contentTypes = 'Select at least one content type.';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const newCampaign = {
            id: `u-${Date.now()}`,
            businessName: formData.businessName.trim() || brandName,
            businessLogo: brandLogo,
            title: formData.title.trim(),
            description: formData.description.trim(),
            budget: formData.budget.trim(),
            platforms: selectedPlatforms,
            niche: selectedNiches,
            contentType: selectedContentTypes,
            duration: formData.duration.trim(),
            targetAudience: formData.targetAudience.trim(),
            applicants: 0,
            status: 'active',
            postedDate: new Date().toISOString().split('T')[0]
        };

        onSubmit(newCampaign);
        onClose();
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div
                className={styles.modalContent}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-campaign-title"
                tabIndex="-1"
                onClick={(event) => event.stopPropagation()}
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

                <h2 className={styles.title} id="create-campaign-title">Post a Campaign</h2>
                <p className={styles.subtitle}>
                    Share your brief and reach creators who match your audience.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h3>Campaign Details</h3>

                        <div className={styles.formGroup}>
                            <label>Business Name *</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                placeholder="e.g., Sephora Singapore"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Campaign Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., CNY Beauty Collection"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Campaign Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the campaign goals, product focus, and key messaging."
                                rows="4"
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Budget Range *</label>
                                <input
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    placeholder="e.g., SGD 1,000 - 2,500"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Duration *</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2 weeks"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Target Audience *</label>
                            <input
                                type="text"
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={handleInputChange}
                                placeholder="e.g., Women 18-35 in Singapore"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Campaign Preview</h3>
                        <p className={styles.sectionNote}>This is how your listing will appear.</p>

                        <div className={styles.previewCard}>
                            <div className={styles.previewHeader}>
                                <img src={brandLogo} alt={brandName} className={styles.previewLogo} />
                                <div>
                                    <p className={styles.previewBrand}>{brandName}</p>
                                    <h4 className={styles.previewTitle}>
                                        {formData.title.trim() || 'Campaign title'}
                                    </h4>
                                    <p className={styles.previewBudget}>
                                        {formData.budget.trim() || 'Budget range'}
                                    </p>
                                </div>
                            </div>
                            <p className={styles.previewDescription}>
                                {formData.description.trim() || 'Campaign description goes here.'}
                            </p>
                            <div className={styles.previewMeta}>
                                <div>
                                    <span className={styles.previewLabel}>Duration</span>
                                    <span className={styles.previewValue}>
                                        {formData.duration.trim() || 'Duration'}
                                    </span>
                                </div>
                                <div>
                                    <span className={styles.previewLabel}>Audience</span>
                                    <span className={styles.previewValue}>
                                        {formData.targetAudience.trim() || 'Target audience'}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.previewTags}>
                                {selectedPlatforms.length > 0 ? (
                                    selectedPlatforms.map(platform => (
                                        <span key={platform} className={styles.previewTag}>
                                            {PLATFORM_LABELS[platform] || platform}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.previewPlaceholder}>Select platforms</span>
                                )}
                            </div>
                            <div className={styles.previewTags}>
                                {selectedNiches.length > 0 ? (
                                    selectedNiches.map(niche => (
                                        <span key={niche} className={styles.previewTag}>{niche}</span>
                                    ))
                                ) : (
                                    <span className={styles.previewPlaceholder}>Select niches</span>
                                )}
                            </div>
                            <div className={styles.previewTags}>
                                {selectedContentTypes.length > 0 ? (
                                    selectedContentTypes.map(type => (
                                        <span key={type} className={styles.previewTag}>{type}</span>
                                    ))
                                ) : (
                                    <span className={styles.previewPlaceholder}>Select content types</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Platforms</h3>
                        <p className={styles.sectionNote}>Choose where you want the content to go live.</p>
                        <div className={styles.optionGrid}>
                            {PLATFORM_OPTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`${styles.optionButton} ${selectedPlatforms.includes(option.id) ? styles.active : ''}`}
                                    onClick={() => toggleSelection(option.id, selectedPlatforms, setSelectedPlatforms)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {errors.platforms && (
                            <p className={styles.errorText}>{errors.platforms}</p>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3>Niches</h3>
                        <p className={styles.sectionNote}>Help creators understand the focus area.</p>
                        <div className={styles.optionGrid}>
                            {NICHE_OPTIONS.map(niche => (
                                <button
                                    key={niche}
                                    type="button"
                                    className={`${styles.optionButton} ${selectedNiches.includes(niche) ? styles.active : ''}`}
                                    onClick={() => toggleSelection(niche, selectedNiches, setSelectedNiches)}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                        {errors.niches && (
                            <p className={styles.errorText}>{errors.niches}</p>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3>Content Types</h3>
                        <p className={styles.sectionNote}>Select the deliverables you need.</p>
                        <div className={styles.optionGrid}>
                            {CONTENT_TYPE_OPTIONS.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`${styles.optionButton} ${selectedContentTypes.includes(type) ? styles.active : ''}`}
                                    onClick={() => toggleSelection(type, selectedContentTypes, setSelectedContentTypes)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {errors.contentTypes && (
                            <p className={styles.errorText}>{errors.contentTypes}</p>
                        )}
                    </div>

                    <div className={styles.submitSection}>
                        <button type="submit" className="btn btn-primary btn-lg">
                            Publish Campaign
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
