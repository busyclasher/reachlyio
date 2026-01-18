import { useRef, useState } from 'react';
import styles from '../styles/CreateProfileModal.module.css';
import { useModalFocus } from '../hooks/useModalFocus';

const CreateProfileModal = ({ onClose, onSubmit }) => {
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        bio: '',
        location: '',
        languages: '',
        niche: [],
        platforms: {
            instagram: { handle: '', followers: 0, engagementRate: 0 },
            tiktok: { handle: '', followers: 0, engagementRate: 0 },
            youtube: { handle: '', followers: 0, engagementRate: 0 },
            twitch: { handle: '', followers: 0, engagementRate: 0 },
            linkedin: { handle: '', followers: 0, engagementRate: 0 },
            twitter: { handle: '', followers: 0, engagementRate: 0 },
            pinterest: { handle: '', followers: 0, engagementRate: 0 }
        },
        pricingRange: ''
    });

    const [activePlatforms, setActivePlatforms] = useState(['instagram']);
    const [selectedNiches, setSelectedNiches] = useState([]);
    const [errors, setErrors] = useState({});

    useModalFocus({ containerRef: modalRef, initialFocusRef: closeButtonRef, onClose });

    const nicheOptions = [
        'Beauty', 'Fashion', 'Lifestyle', 'Tech', 'Gaming', 'Fitness',
        'Wellness', 'Food', 'Travel', 'Photography', 'Business',
        'Finance', 'Marketing', 'Entertainment'
    ];

    const platformLabels = {
        instagram: 'Instagram',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        twitch: 'Twitch',
        linkedin: 'LinkedIn',
        twitter: 'Twitter/X',
        pinterest: 'Pinterest'
    };

    const platformOptions = ['instagram', 'tiktok', 'youtube', 'twitch', 'linkedin', 'twitter', 'pinterest'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlatformChange = (platform, field, value) => {
        setFormData(prev => ({
            ...prev,
            platforms: {
                ...prev.platforms,
                [platform]: {
                    ...(prev.platforms[platform] || {}),
                    [field]: field === 'handle' ? value : Number(value)
                }
            }
        }));
        if (errors.platforms) {
            setErrors(prev => ({ ...prev, platforms: '' }));
        }
    };

    const togglePlatform = (platform) => {
        if (activePlatforms.includes(platform)) {
            setActivePlatforms(prev => prev.filter(p => p !== platform));
        } else {
            setActivePlatforms(prev => [...prev, platform]);
        }
        if (errors.platforms) {
            setErrors(prev => ({ ...prev, platforms: '' }));
        }
    };

    const toggleNiche = (niche) => {
        if (selectedNiches.includes(niche)) {
            setSelectedNiches(prev => prev.filter(n => n !== niche));
        } else {
            setSelectedNiches(prev => [...prev, niche]);
        }
        if (errors.niches) {
            setErrors(prev => ({ ...prev, niches: '' }));
        }
    };

    const previewSeed = formData.name.trim() || 'Reachly';
    const previewPhoto = `https://i.pravatar.cc/150?u=${encodeURIComponent(previewSeed)}`;
    const previewName = formData.name.trim() || 'Your Name';
    const previewTagline = formData.tagline.trim() || 'Add a short tagline to highlight your niche.';
    const previewLocation = formData.location.trim() || 'Location';
    const previewLanguages = formData.languages
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    const previewPricing = formData.pricingRange.trim() || 'Pricing range';

    const handleSubmit = (e) => {
        e.preventDefault();

        const activePlatformData = {};
        activePlatforms.forEach(platform => {
            if (formData.platforms[platform]?.handle) {
                activePlatformData[platform] = formData.platforms[platform];
            }
        });

        const nextErrors = {};

        if (selectedNiches.length === 0) {
            nextErrors.niches = 'Select at least one niche to highlight.';
        }

        if (activePlatforms.length === 0) {
            nextErrors.platforms = 'Select at least one platform.';
        } else {
            const invalidPlatforms = activePlatforms.filter(platform => {
                const platformData = formData.platforms[platform] || {};
                const hasHandle = Boolean(platformData.handle && platformData.handle.trim());
                const hasFollowers = Number(platformData.followers) > 0;
                const hasEngagement = Number(platformData.engagementRate) > 0;
                return !(hasHandle && hasFollowers && hasEngagement);
            });

            if (invalidPlatforms.length > 0) {
                nextErrors.platforms = 'Provide handles and metrics for each active platform.';
            } else if (Object.keys(activePlatformData).length === 0) {
                nextErrors.platforms = 'Add at least one platform handle.';
            }
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const newProfile = {
            id: Date.now().toString(),
            name: formData.name,
            tagline: formData.tagline,
            bio: formData.bio,
            location: formData.location,
            languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
            niche: selectedNiches,
            verified: false,
            platforms: activePlatformData,
            profilePhoto: `https://i.pravatar.cc/300?u=${Date.now()}`,
            coverPhoto: `https://picsum.photos/seed/${Date.now()}/1200/400`,
            portfolio: [],
            collaborations: [],
            pricingRange: formData.pricingRange,
            joinedDate: new Date().toISOString()
        };

        onSubmit(newProfile);
        onClose();
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div
                className={styles.modalContent}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-profile-title"
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

                <h2 className={styles.title} id="create-profile-title">Create Your KOL Profile</h2>
                <p className={styles.subtitle}>Join Reachly.io and connect with businesses looking for influencers like you!</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Basic Info */}
                    <div className={styles.section}>
                        <h3>Basic Information</h3>

                        <div className={styles.formGroup}>
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tagline *</label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleInputChange}
                                placeholder="e.g., Tech Reviewer | Gadget Enthusiast"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Bio *</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell businesses about yourself and your content..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Singapore"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Languages (comma separated) *</label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleInputChange}
                                    placeholder="English, Mandarin"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className={styles.section}>
                        <h3>Profile Preview</h3>
                        <p className={styles.sectionNote}>Preview how brands will see your listing.</p>
                        <div className={styles.previewCard}>
                            <div className={styles.previewHeader}>
                                <img src={previewPhoto} alt={previewName} className={styles.previewAvatar} />
                                <div>
                                    <h4 className={styles.previewName}>{previewName}</h4>
                                    <p className={styles.previewTagline}>{previewTagline}</p>
                                    <p className={styles.previewMeta}>
                                        {previewLocation} | {previewLanguages.length > 0 ? previewLanguages.join(', ') : 'Languages'}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.previewDetails}>
                                <div className={styles.previewDetail}>
                                    <span className={styles.previewLabel}>Pricing</span>
                                    <span className={styles.previewValue}>{previewPricing}</span>
                                </div>
                                <div className={styles.previewDetail}>
                                    <span className={styles.previewLabel}>Active Platforms</span>
                                    <span className={styles.previewValue}>{activePlatforms.length}</span>
                                </div>
                            </div>
                            <div className={styles.previewNiches}>
                                {selectedNiches.length > 0 ? (
                                    selectedNiches.map(niche => (
                                        <span key={niche} className="badge badge-primary">{niche}</span>
                                    ))
                                ) : (
                                    <span className={styles.previewPlaceholder}>Select niches to highlight.</span>
                                )}
                            </div>
                            <div className={styles.previewPlatforms}>
                                {activePlatforms.length > 0 ? (
                                    activePlatforms.map(platform => {
                                        const platformData = formData.platforms[platform] || {};
                                        const followerCount = Number(platformData.followers || 0).toLocaleString('en-US');
                                        return (
                                            <div key={platform} className={styles.previewPlatform}>
                                                <span className={styles.previewPlatformName}>{platformLabels[platform]}</span>
                                                <span className={styles.previewPlatformMeta}>
                                                    {platformData.handle ? platformData.handle : 'Handle'} | {followerCount} followers
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <span className={styles.previewPlaceholder}>Choose platforms to preview.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Niches */}
                    <div className={styles.section}>
                        <h3>Your Niches (Select all that apply)</h3>
                        <div className={styles.nicheGrid}>
                            {nicheOptions.map(niche => (
                                <button
                                    key={niche}
                                    type="button"
                                    className={`${styles.nicheBtn} ${selectedNiches.includes(niche) ? styles.active : ''}`}
                                    onClick={() => toggleNiche(niche)}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                        {errors.niches && (
                            <p className={styles.errorText}>{errors.niches}</p>
                        )}
                    </div>

                    {/* Platforms */}
                    <div className={styles.section}>
                        <h3>Social Media Platforms</h3>
                        <p className={styles.sectionNote}>Add at least one platform</p>
                        {errors.platforms && (
                            <p className={styles.errorText}>{errors.platforms}</p>
                        )}

                        <div className={styles.platformToggles}>
                            {platformOptions.map(platform => (
                                <button
                                    key={platform}
                                    type="button"
                                    className={`${styles.platformToggle} ${activePlatforms.includes(platform) ? styles.active : ''}`}
                                    onClick={() => togglePlatform(platform)}
                                >
                                    {platformLabels[platform]}
                                </button>
                            ))}
                        </div>

                        {activePlatforms.map(platform => (
                            <div key={platform} className={styles.platformForm}>
                                <h4 className={styles.platformTitle}>{platformLabels[platform]}</h4>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Handle *</label>
                                        <input
                                            type="text"
                                            value={formData.platforms[platform]?.handle || ''}
                                            onChange={(e) => handlePlatformChange(platform, 'handle', e.target.value)}
                                            placeholder="@yourhandle"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Followers *</label>
                                        <input
                                            type="number"
                                            value={formData.platforms[platform]?.followers || 0}
                                            onChange={(e) => handlePlatformChange(platform, 'followers', e.target.value)}
                                            placeholder="50000"
                                            min="1"
                                            step="1"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Engagement Rate (%) *</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.platforms[platform]?.engagementRate || 0}
                                            onChange={(e) => handlePlatformChange(platform, 'engagementRate', e.target.value)}
                                            placeholder="5.2"
                                            min="0.1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className={styles.section}>
                        <h3>Pricing Range</h3>
                        <div className={styles.formGroup}>
                            <label>Your typical campaign pricing *</label>
                            <input
                                type="text"
                                name="pricingRange"
                                value={formData.pricingRange}
                                onChange={handleInputChange}
                                placeholder="e.g., $500 - $2000"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className={styles.submitSection}>
                        <button type="submit" className="btn btn-primary btn-lg">
                            Create Profile
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

export default CreateProfileModal;
