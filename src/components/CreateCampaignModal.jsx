import { useMemo, useRef, useState } from 'react';
import styles from '../styles/CreateCampaignModal.module.css';
import { useModalFocus } from '../hooks/useModalFocus';

const PLATFORM_OPTIONS = [
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'youtube', label: 'YouTube', icon: '▶️' },
    { id: 'twitch', label: 'Twitch', icon: '🎮' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { id: 'pinterest', label: 'Pinterest', icon: '📌' }
];

const NICHE_OPTIONS = [
    'Beauty', 'Fashion', 'Lifestyle', 'Tech', 'Gaming', 'Fitness',
    'Wellness', 'Food', 'Travel', 'Photography', 'Business', 'Finance',
    'Marketing', 'Entertainment', 'Music', 'Education', 'Parenting'
];

const OBJECTIVE_OPTIONS = [
    { id: 'awareness', label: 'Brand Awareness', icon: '📢' },
    { id: 'conversion', label: 'Conversions / Sales', icon: '💰' },
    { id: 'ugc', label: 'UGC Content', icon: '🎬' },
    { id: 'app_downloads', label: 'App Downloads', icon: '📱' },
    { id: 'engagement', label: 'Engagement', icon: '💬' },
    { id: 'traffic', label: 'Website Traffic', icon: '🔗' }
];

const CONTENT_TYPE_OPTIONS = [
    { id: 'reel', label: 'Reel/Short' },
    { id: 'story', label: 'Story' },
    { id: 'post', label: 'Feed Post' },
    { id: 'video', label: 'Long Video' },
    { id: 'livestream', label: 'Livestream' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'ugc', label: 'UGC Only' },
    { id: 'review', label: 'Review' }
];

const AUDIENCE_SIZE_OPTIONS = [
    { id: 'nano', label: '1K - 10K (Nano)' },
    { id: 'micro', label: '10K - 50K (Micro)' },
    { id: 'mid', label: '50K - 100K (Mid)' },
    { id: 'macro', label: '100K - 500K (Macro)' },
    { id: 'mega', label: '500K+ (Mega)' }
];

const COMPENSATION_OPTIONS = [
    { id: 'fixed', label: 'Fixed Rate', icon: '💵' },
    { id: 'negotiable', label: 'Negotiable', icon: '🤝' },
    { id: 'product', label: 'Product Only', icon: '📦' },
    { id: 'commission', label: 'Commission', icon: '📈' }
];

const PAYMENT_TERMS_OPTIONS = [
    { id: 'upfront', label: '100% Upfront' },
    { id: 'on_approval', label: 'On Content Approval' },
    { id: 'split', label: '50/50 Split' },
    { id: 'milestone', label: 'Milestone Based' }
];

const USAGE_RIGHTS_OPTIONS = [
    { id: 'organic', label: 'Organic Only' },
    { id: 'whitelisting', label: 'Whitelisting / Paid Ads' },
    { id: 'repost', label: 'Brand Repost Rights' },
    { id: 'perpetual', label: 'Perpetual Usage' }
];

const VISIBILITY_OPTIONS = [
    { id: 'public', label: 'Public', desc: 'All creators can see and apply' },
    { id: 'filtered', label: 'Filtered Only', desc: 'Only matching creators see it' },
    { id: 'invite_only', label: 'Invite Only', desc: 'Only invited creators can apply' }
];

const BRAND_COLORS = ['7C3AED', 'EC4899', '14B8A6', '3B82F6', 'F59E0B', 'EF4444', '22C55E'];
const STEPS = ['Basics', 'Objectives', 'Targeting', 'Deliverables', 'Timeline', 'Budget', 'Assets', 'Visibility', 'Review'];

const getBrandColor = (name) => {
    const seed = name.trim() || 'brand';
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length];
};

const CreateCampaignModal = ({ onClose, onSubmit }) => {
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        // Basics
        title: '',
        businessName: '',
        category: '',
        description: '',
        // Objectives
        objectives: [],
        // Targeting
        niches: [],
        platforms: ['instagram'],
        location: '',
        audienceSize: [],
        engagementMin: '',
        // Deliverables
        deliverables: [{ type: 'reel', quantity: 1 }],
        talkingPoints: '',
        dos: '',
        donts: '',
        usageRights: ['organic'],
        // Timeline
        applicationDeadline: '',
        contentDueDate: '',
        postingWindowStart: '',
        postingWindowEnd: '',
        // Budget
        compensationType: 'fixed',
        budgetMin: '',
        budgetMax: '',
        paymentTerms: 'on_approval',
        // Assets
        brandKitUrl: '',
        referenceLinks: '',
        briefNotes: '',
        // Visibility
        visibility: 'public',
        featured: false
    });

    useModalFocus({ containerRef: modalRef, initialFocusRef: closeButtonRef, onClose });

    const brandName = formData.businessName.trim() || 'Your Brand';
    const brandColor = useMemo(() => getBrandColor(brandName), [brandName]);
    const brandLogo = useMemo(() => (
        `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=${brandColor}&color=fff`
    ), [brandName, brandColor]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const toggleArrayItem = (field, value) => {
        setFormData(prev => {
            const arr = prev[field];
            if (arr.includes(value)) {
                return { ...prev, [field]: arr.filter(v => v !== value) };
            }
            return { ...prev, [field]: [...arr, value] };
        });
    };

    const updateDeliverable = (index, key, value) => {
        setFormData(prev => {
            const deliverables = [...prev.deliverables];
            deliverables[index] = { ...deliverables[index], [key]: value };
            return { ...prev, deliverables };
        });
    };

    const addDeliverable = () => {
        setFormData(prev => ({
            ...prev,
            deliverables: [...prev.deliverables, { type: 'reel', quantity: 1 }]
        }));
    };

    const removeDeliverable = (index) => {
        setFormData(prev => ({
            ...prev,
            deliverables: prev.deliverables.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 0: // Basics
                if (!formData.title.trim()) newErrors.title = 'Campaign title is required';
                if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
                break;
            case 1: // Objectives
                if (formData.objectives.length === 0) newErrors.objectives = 'Select at least one objective';
                break;
            case 2: // Targeting
                if (formData.niches.length === 0) newErrors.niches = 'Select at least one niche';
                if (formData.platforms.length === 0) newErrors.platforms = 'Select at least one platform';
                break;
            case 3: // Deliverables
                if (formData.deliverables.length === 0) newErrors.deliverables = 'Add at least one deliverable';
                break;
            case 4: // Timeline
                if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
                break;
            case 5: // Budget
                if (!formData.budgetMin && formData.compensationType !== 'product') {
                    newErrors.budgetMin = 'Budget minimum is required';
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = () => {
        const newCampaign = {
            id: `c-${Date.now()}`,
            ...formData,
            businessLogo: brandLogo,
            applicants: 0,
            status: 'live',
            postedDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        onSubmit(newCampaign);
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Basics
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Campaign Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="e.g., Summer Product Launch Campaign"
                            />
                            {errors.title && <p className={styles.errorText}>{errors.title}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Business / Brand Name *</label>
                            <input
                                type="text"
                                value={formData.businessName}
                                onChange={(e) => updateField('businessName', e.target.value)}
                                placeholder="e.g., StyleCo Singapore"
                            />
                            {errors.businessName && <p className={styles.errorText}>{errors.businessName}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Category / Industry</label>
                            <select
                                value={formData.category}
                                onChange={(e) => updateField('category', e.target.value)}
                            >
                                <option value="">Select category...</option>
                                {NICHE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Campaign Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                placeholder="Describe your campaign goals, product focus, and key messaging..."
                                rows="4"
                            />
                        </div>
                    </div>
                );

            case 1: // Objectives
                return (
                    <div className={styles.stepContent}>
                        <p className={styles.stepNote}>What do you want to achieve with this campaign?</p>
                        <div className={styles.objectiveGrid}>
                            {OBJECTIVE_OPTIONS.map(obj => (
                                <button
                                    key={obj.id}
                                    type="button"
                                    className={`${styles.objectiveCard} ${formData.objectives.includes(obj.id) ? styles.active : ''}`}
                                    onClick={() => toggleArrayItem('objectives', obj.id)}
                                >
                                    <span className={styles.objectiveIcon}>{obj.icon}</span>
                                    <span>{obj.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.objectives && <p className={styles.errorText}>{errors.objectives}</p>}
                    </div>
                );

            case 2: // Targeting
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Target Niches *</label>
                            <div className={styles.optionGrid}>
                                {NICHE_OPTIONS.map(niche => (
                                    <button
                                        key={niche}
                                        type="button"
                                        className={`${styles.optionButton} ${formData.niches.includes(niche) ? styles.active : ''}`}
                                        onClick={() => toggleArrayItem('niches', niche)}
                                    >
                                        {niche}
                                    </button>
                                ))}
                            </div>
                            {errors.niches && <p className={styles.errorText}>{errors.niches}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Platforms *</label>
                            <div className={styles.optionGrid}>
                                {PLATFORM_OPTIONS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className={`${styles.optionButton} ${formData.platforms.includes(p.id) ? styles.active : ''}`}
                                        onClick={() => toggleArrayItem('platforms', p.id)}
                                    >
                                        {p.icon} {p.label}
                                    </button>
                                ))}
                            </div>
                            {errors.platforms && <p className={styles.errorText}>{errors.platforms}</p>}
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    placeholder="e.g., Singapore, Southeast Asia"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Min Engagement Rate</label>
                                <input
                                    type="text"
                                    value={formData.engagementMin}
                                    onChange={(e) => updateField('engagementMin', e.target.value)}
                                    placeholder="e.g., 3%"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Audience Size Range</label>
                            <div className={styles.optionGrid}>
                                {AUDIENCE_SIZE_OPTIONS.map(a => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        className={`${styles.optionButton} ${formData.audienceSize.includes(a.id) ? styles.active : ''}`}
                                        onClick={() => toggleArrayItem('audienceSize', a.id)}
                                    >
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3: // Deliverables
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Deliverable Types & Quantities *</label>
                            <div className={styles.deliverablesList}>
                                {formData.deliverables.map((d, i) => (
                                    <div key={i} className={styles.deliverableRow}>
                                        <select
                                            value={d.type}
                                            onChange={(e) => updateDeliverable(i, 'type', e.target.value)}
                                        >
                                            {CONTENT_TYPE_OPTIONS.map(c => (
                                                <option key={c.id} value={c.id}>{c.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
                                            value={d.quantity}
                                            onChange={(e) => updateDeliverable(i, 'quantity', parseInt(e.target.value) || 1)}
                                            className={styles.quantityInput}
                                        />
                                        <span>x</span>
                                        {formData.deliverables.length > 1 && (
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => removeDeliverable(i)}
                                            >✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className={styles.addBtn} onClick={addDeliverable}>
                                    + Add Deliverable
                                </button>
                            </div>
                            {errors.deliverables && <p className={styles.errorText}>{errors.deliverables}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Mandatory Talking Points</label>
                            <textarea
                                value={formData.talkingPoints}
                                onChange={(e) => updateField('talkingPoints', e.target.value)}
                                placeholder="Key messages, product features, hashtags to include..."
                                rows="3"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Do's (Brand Guidelines)</label>
                                <textarea
                                    value={formData.dos}
                                    onChange={(e) => updateField('dos', e.target.value)}
                                    placeholder="What creators should do..."
                                    rows="3"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Don'ts (Brand Safety)</label>
                                <textarea
                                    value={formData.donts}
                                    onChange={(e) => updateField('donts', e.target.value)}
                                    placeholder="What creators should avoid..."
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Content Usage Rights</label>
                            <div className={styles.optionGrid}>
                                {USAGE_RIGHTS_OPTIONS.map(u => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        className={`${styles.optionButton} ${formData.usageRights.includes(u.id) ? styles.active : ''}`}
                                        onClick={() => toggleArrayItem('usageRights', u.id)}
                                    >
                                        {u.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Timeline
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Application Deadline *</label>
                            <input
                                type="date"
                                value={formData.applicationDeadline}
                                onChange={(e) => updateField('applicationDeadline', e.target.value)}
                            />
                            {errors.applicationDeadline && <p className={styles.errorText}>{errors.applicationDeadline}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Content Due Date</label>
                            <input
                                type="date"
                                value={formData.contentDueDate}
                                onChange={(e) => updateField('contentDueDate', e.target.value)}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Posting Window Start</label>
                                <input
                                    type="date"
                                    value={formData.postingWindowStart}
                                    onChange={(e) => updateField('postingWindowStart', e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Posting Window End</label>
                                <input
                                    type="date"
                                    value={formData.postingWindowEnd}
                                    onChange={(e) => updateField('postingWindowEnd', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5: // Budget
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Compensation Type</label>
                            <div className={styles.objectiveGrid}>
                                {COMPENSATION_OPTIONS.map(c => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className={`${styles.objectiveCard} ${formData.compensationType === c.id ? styles.active : ''}`}
                                        onClick={() => updateField('compensationType', c.id)}
                                    >
                                        <span className={styles.objectiveIcon}>{c.icon}</span>
                                        <span>{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {formData.compensationType !== 'product' && (
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Budget Min (SGD) *</label>
                                    <input
                                        type="number"
                                        value={formData.budgetMin}
                                        onChange={(e) => updateField('budgetMin', e.target.value)}
                                        placeholder="e.g., 500"
                                    />
                                    {errors.budgetMin && <p className={styles.errorText}>{errors.budgetMin}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Budget Max (SGD)</label>
                                    <input
                                        type="number"
                                        value={formData.budgetMax}
                                        onChange={(e) => updateField('budgetMax', e.target.value)}
                                        placeholder="e.g., 2000"
                                    />
                                </div>
                            </div>
                        )}
                        <div className={styles.formGroup}>
                            <label>Payment Terms</label>
                            <div className={styles.optionGrid}>
                                {PAYMENT_TERMS_OPTIONS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className={`${styles.optionButton} ${formData.paymentTerms === p.id ? styles.active : ''}`}
                                        onClick={() => updateField('paymentTerms', p.id)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 6: // Assets
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Brand Kit / Assets URL</label>
                            <input
                                type="url"
                                value={formData.brandKitUrl}
                                onChange={(e) => updateField('brandKitUrl', e.target.value)}
                                placeholder="Link to Google Drive, Dropbox, etc."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Reference Content Links</label>
                            <textarea
                                value={formData.referenceLinks}
                                onChange={(e) => updateField('referenceLinks', e.target.value)}
                                placeholder="Links to inspiration content, one per line..."
                                rows="3"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Additional Brief Notes</label>
                            <textarea
                                value={formData.briefNotes}
                                onChange={(e) => updateField('briefNotes', e.target.value)}
                                placeholder="Any other information for creators..."
                                rows="4"
                            />
                        </div>
                    </div>
                );

            case 7: // Visibility
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label>Campaign Visibility</label>
                            <div className={styles.visibilityOptions}>
                                {VISIBILITY_OPTIONS.map(v => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        className={`${styles.visibilityCard} ${formData.visibility === v.id ? styles.active : ''}`}
                                        onClick={() => updateField('visibility', v.id)}
                                    >
                                        <span className={styles.visibilityLabel}>{v.label}</span>
                                        <span className={styles.visibilityDesc}>{v.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => updateField('featured', e.target.checked)}
                                />
                                <span>🔥 Feature this campaign (priority placement)</span>
                            </label>
                        </div>
                    </div>
                );

            case 8: // Review
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <img src={brandLogo} alt={brandName} className={styles.reviewLogo} />
                                <div>
                                    <p className={styles.reviewBrand}>{brandName}</p>
                                    <h3 className={styles.reviewTitle}>{formData.title || 'Campaign Title'}</h3>
                                </div>
                            </div>

                            <div className={styles.reviewSection}>
                                <h4>Objectives</h4>
                                <div className={styles.reviewTags}>
                                    {formData.objectives.map(o => {
                                        const obj = OBJECTIVE_OPTIONS.find(x => x.id === o);
                                        return <span key={o} className={styles.reviewTag}>{obj?.icon} {obj?.label}</span>;
                                    })}
                                </div>
                            </div>

                            <div className={styles.reviewSection}>
                                <h4>Deliverables</h4>
                                <div className={styles.reviewTags}>
                                    {formData.deliverables.map((d, i) => {
                                        const type = CONTENT_TYPE_OPTIONS.find(c => c.id === d.type);
                                        return <span key={i} className={styles.reviewTag}>{d.quantity}x {type?.label}</span>;
                                    })}
                                </div>
                            </div>

                            <div className={styles.reviewGrid}>
                                <div>
                                    <span className={styles.reviewLabel}>Budget</span>
                                    <span className={styles.reviewValue}>
                                        {formData.compensationType === 'product' ? 'Product Only' :
                                            `SGD ${formData.budgetMin}${formData.budgetMax ? ` - ${formData.budgetMax}` : '+'}`}
                                    </span>
                                </div>
                                <div>
                                    <span className={styles.reviewLabel}>Deadline</span>
                                    <span className={styles.reviewValue}>{formData.applicationDeadline || 'Not set'}</span>
                                </div>
                                <div>
                                    <span className={styles.reviewLabel}>Platforms</span>
                                    <span className={styles.reviewValue}>
                                        {formData.platforms.map(p => PLATFORM_OPTIONS.find(x => x.id === p)?.label).join(', ')}
                                    </span>
                                </div>
                                <div>
                                    <span className={styles.reviewLabel}>Visibility</span>
                                    <span className={styles.reviewValue}>
                                        {VISIBILITY_OPTIONS.find(v => v.id === formData.visibility)?.label}
                                        {formData.featured && ' 🔥'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div
                className={styles.modalContent}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                tabIndex="-1"
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

                <h2 className={styles.title}>Campaign Builder</h2>

                {/* Progress Steps */}
                <div className={styles.stepIndicator}>
                    {STEPS.map((step, i) => (
                        <div
                            key={step}
                            className={`${styles.step} ${i === currentStep ? styles.active : ''} ${i < currentStep ? styles.completed : ''}`}
                            onClick={() => i < currentStep && setCurrentStep(i)}
                        >
                            <span className={styles.stepNumber}>{i < currentStep ? '✓' : i + 1}</span>
                            <span className={styles.stepLabel}>{step}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                    {renderStepContent()}

                    <div className={styles.submitSection}>
                        {currentStep > 0 && (
                            <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                Back
                            </button>
                        )}
                        {currentStep < STEPS.length - 1 ? (
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                                Continue
                            </button>
                        ) : (
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}>
                                🚀 Publish Campaign
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
