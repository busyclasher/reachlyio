import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/Onboarding.module.css';

const NICHES = [
    'Fashion', 'Beauty', 'Tech', 'Gaming', 'Fitness', 'Food',
    'Travel', 'Lifestyle', 'Business', 'Entertainment', 'Parenting', 'Other'
];

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn', 'Facebook'];

const FOLLOWER_RANGES = [
    { id: '1k-10k', label: '1K - 10K (Nano)' },
    { id: '10k-50k', label: '10K - 50K (Micro)' },
    { id: '50k-100k', label: '50K - 100K (Mid)' },
    { id: '100k-500k', label: '100K - 500K (Macro)' },
    { id: '500k+', label: '500K+ (Mega)' }
];

const InfluencerOnboarding = ({ onComplete }) => {
    const { completeOnboarding, user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        displayName: user?.name || '',
        niches: [],
        platforms: [{ platform: '', handle: '' }],
        followerRange: '',
        location: '',
        languages: ''
    });

    const totalSteps = 2;

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleNiche = (niche) => {
        setFormData(prev => ({
            ...prev,
            niches: prev.niches.includes(niche)
                ? prev.niches.filter(n => n !== niche)
                : [...prev.niches, niche]
        }));
    };

    const updatePlatform = (index, field, value) => {
        setFormData(prev => {
            const platforms = [...prev.platforms];
            platforms[index] = { ...platforms[index], [field]: value };
            return { ...prev, platforms };
        });
    };

    const addPlatform = () => {
        setFormData(prev => ({
            ...prev,
            platforms: [...prev.platforms, { platform: '', handle: '' }]
        }));
    };

    const removePlatform = (index) => {
        if (formData.platforms.length > 1) {
            setFormData(prev => ({
                ...prev,
                platforms: prev.platforms.filter((_, i) => i !== index)
            }));
        }
    };

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        setLoading(true);

        completeOnboarding({
            type: 'influencer',
            displayName: formData.displayName,
            niches: formData.niches,
            platforms: formData.platforms.filter(p => p.platform && p.handle),
            followerRange: formData.followerRange,
            location: formData.location,
            languages: formData.languages
        });

        if (onComplete) {
            onComplete();
        }

        setLoading(false);
    };

    const isStep1Valid = formData.displayName.trim() &&
        formData.niches.length > 0 &&
        formData.platforms.some(p => p.platform && p.handle);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Progress */}
                <div className={styles.progress}>
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.progressDot} ${i < step ? styles.completed : ''} ${i === step - 1 ? styles.active : ''}`}
                        />
                    ))}
                </div>

                {/* Step 1: Creator Profile */}
                {step === 1 && (
                    <>
                        <div className={styles.header}>
                            <span className={styles.stepBadge}>Step 1 of {totalSteps}</span>
                            <h1 className={styles.title}>Create your profile</h1>
                            <p className={styles.subtitle}>
                                Help brands discover you by sharing your creator info.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Display Name</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Your creator name"
                                        value={formData.displayName}
                                        onChange={(e) => updateField('displayName', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Your Niche(s)</label>
                                    <div className={styles.chips}>
                                        {NICHES.map(niche => (
                                            <button
                                                key={niche}
                                                type="button"
                                                className={`${styles.chip} ${formData.niches.includes(niche) ? styles.selected : ''}`}
                                                onClick={() => toggleNiche(niche)}
                                            >
                                                {niche}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Platforms & Handles</label>
                                    <div className={styles.platformInputs}>
                                        {formData.platforms.map((p, index) => (
                                            <div key={index} className={styles.platformRow}>
                                                <select
                                                    className={`${styles.input} ${styles.select} ${styles.platformSelect}`}
                                                    value={p.platform}
                                                    onChange={(e) => updatePlatform(index, 'platform', e.target.value)}
                                                >
                                                    <option value="">Platform</option>
                                                    {PLATFORMS.map(platform => (
                                                        <option key={platform} value={platform}>{platform}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    className={`${styles.input} ${styles.platformHandle}`}
                                                    placeholder="@handle"
                                                    value={p.handle}
                                                    onChange={(e) => updatePlatform(index, 'handle', e.target.value)}
                                                />
                                                {formData.platforms.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className={styles.backBtn}
                                                        onClick={() => removePlatform(index)}
                                                        style={{ padding: 'var(--space-3)', minWidth: '44px' }}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" className={styles.addPlatformBtn} onClick={addPlatform}>
                                            + Add another platform
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <div></div>
                            <button
                                className={styles.nextBtn}
                                onClick={handleNext}
                                disabled={!isStep1Valid}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2: Quick Stats (Optional) */}
                {step === 2 && (
                    <>
                        <div className={styles.header}>
                            <span className={styles.stepBadge}>Step 2 of {totalSteps}</span>
                            <h1 className={styles.title}>Add some quick stats</h1>
                            <p className={styles.subtitle}>
                                This helps brands find the right match faster.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Follower Range <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <select
                                        className={`${styles.input} ${styles.select}`}
                                        value={formData.followerRange}
                                        onChange={(e) => updateField('followerRange', e.target.value)}
                                    >
                                        <option value="">Select range</option>
                                        {FOLLOWER_RANGES.map(range => (
                                            <option key={range.id} value={range.id}>{range.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Location <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="e.g., Singapore"
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Languages <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="e.g., English, Mandarin"
                                        value={formData.languages}
                                        onChange={(e) => updateField('languages', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.backBtn} onClick={handleBack}>
                                Back
                            </button>
                            <button className={styles.skipBtn} onClick={handleSkip}>
                                Skip
                            </button>
                            <button
                                className={styles.nextBtn}
                                onClick={handleComplete}
                                disabled={loading}
                            >
                                {loading ? 'Setting up...' : 'Finish Setup'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InfluencerOnboarding;
