import { useState } from 'react';
import styles from '../styles/CreateProfileModal.module.css';

const CreateProfileModal = ({ onClose, onSubmit }) => {
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
            youtube: { handle: '', followers: 0, engagementRate: 0 }
        },
        pricingRange: ''
    });

    const [activePlatforms, setActivePlatforms] = useState(['instagram']);
    const [selectedNiches, setSelectedNiches] = useState([]);

    const nicheOptions = [
        'Beauty', 'Fashion', 'Lifestyle', 'Tech', 'Gaming', 'Fitness',
        'Wellness', 'Food', 'Travel', 'Photography', 'Business',
        'Finance', 'Marketing', 'Entertainment'
    ];

    const platformOptions = ['instagram', 'tiktok', 'youtube', 'twitch', 'linkedin', 'twitter'];

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
                    ...prev.platforms[platform],
                    [field]: field === 'handle' ? value : Number(value)
                }
            }
        }));
    };

    const togglePlatform = (platform) => {
        if (activePlatforms.includes(platform)) {
            setActivePlatforms(prev => prev.filter(p => p !== platform));
        } else {
            setActivePlatforms(prev => [...prev, platform]);
        }
    };

    const toggleNiche = (niche) => {
        if (selectedNiches.includes(niche)) {
            setSelectedNiches(prev => prev.filter(n => n !== niche));
        } else {
            setSelectedNiches(prev => [...prev, niche]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter only active platforms
        const activePlatformData = {};
        activePlatforms.forEach(platform => {
            if (formData.platforms[platform]?.handle) {
                activePlatformData[platform] = formData.platforms[platform];
            }
        });

        const newProfile = {
            id: Date.now().toString(),
            name: formData.name,
            tagline: formData.tagline,
            bio: formData.bio,
            location: formData.location,
            languages: formData.languages.split(',').map(l => l.trim()),
            niche: selectedNiches,
            verified: false,
            platforms: activePlatformData,
            profilePhoto: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
            coverPhoto: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=1200&h=400&fit=crop`,
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
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <h2 className={styles.title}>Create Your KOL Profile</h2>
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
                    </div>

                    {/* Platforms */}
                    <div className={styles.section}>
                        <h3>Social Media Platforms</h3>
                        <p className={styles.sectionNote}>Add at least one platform</p>

                        <div className={styles.platformToggles}>
                            {platformOptions.map(platform => (
                                <button
                                    key={platform}
                                    type="button"
                                    className={`${styles.platformToggle} ${activePlatforms.includes(platform) ? styles.active : ''}`}
                                    onClick={() => togglePlatform(platform)}
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>

                        {activePlatforms.map(platform => (
                            <div key={platform} className={styles.platformForm}>
                                <h4 className={styles.platformTitle}>{platform}</h4>
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
