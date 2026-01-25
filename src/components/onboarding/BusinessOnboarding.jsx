import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/Onboarding.module.css';

const INDUSTRIES = [
    'Technology', 'Fashion & Beauty', 'Food & Beverage', 'Health & Wellness',
    'Travel & Hospitality', 'Finance', 'Entertainment', 'E-commerce', 'Other'
];

const GOALS = [
    { id: 'awareness', icon: '📢', title: 'Brand Awareness' },
    { id: 'ugc', icon: '🎬', title: 'UGC Content' },
    { id: 'conversion', icon: '💰', title: 'Conversions' },
    { id: 'app', icon: '📱', title: 'App Downloads' }
];

const BusinessOnboarding = ({ onComplete }) => {
    const { completeOnboarding, user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        website: '',
        socialLinks: '',
        goals: []
    });

    const totalSteps = 2;

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleGoal = (goalId) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(g => g !== goalId)
                : [...prev.goals, goalId]
        }));
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

        // Complete onboarding with profile data
        completeOnboarding({
            type: 'business',
            companyName: formData.companyName,
            industry: formData.industry,
            website: formData.website,
            socialLinks: formData.socialLinks,
            goals: formData.goals
        });

        if (onComplete) {
            onComplete();
        }

        setLoading(false);
    };

    const isStep1Valid = formData.companyName.trim() && formData.industry;

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

                {/* Step 1: Business Profile */}
                {step === 1 && (
                    <>
                        <div className={styles.header}>
                            <span className={styles.stepBadge}>Step 1 of {totalSteps}</span>
                            <h1 className={styles.title}>Set up your business profile</h1>
                            <p className={styles.subtitle}>
                                Tell us about your company so creators know who they're working with.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Company / Brand Name</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="e.g., Acme Inc."
                                        value={formData.companyName}
                                        onChange={(e) => updateField('companyName', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Industry / Category</label>
                                    <select
                                        className={`${styles.input} ${styles.select}`}
                                        value={formData.industry}
                                        onChange={(e) => updateField('industry', e.target.value)}
                                    >
                                        <option value="">Select your industry</option>
                                        {INDUSTRIES.map(industry => (
                                            <option key={industry} value={industry}>{industry}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Website <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        className={styles.input}
                                        placeholder="https://yourcompany.com"
                                        value={formData.website}
                                        onChange={(e) => updateField('website', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Social Media Links <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Instagram, LinkedIn, etc."
                                        value={formData.socialLinks}
                                        onChange={(e) => updateField('socialLinks', e.target.value)}
                                    />
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

                {/* Step 2: Goals (Optional) */}
                {step === 2 && (
                    <>
                        <div className={styles.header}>
                            <span className={styles.stepBadge}>Step 2 of {totalSteps}</span>
                            <h1 className={styles.title}>What are you looking for?</h1>
                            <p className={styles.subtitle}>
                                Help us recommend the right creators for your campaigns.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Select your goals</label>
                                    <div className={styles.goalCards}>
                                        {GOALS.map(goal => (
                                            <div
                                                key={goal.id}
                                                className={`${styles.goalCard} ${formData.goals.includes(goal.id) ? styles.selected : ''}`}
                                                onClick={() => toggleGoal(goal.id)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <div className={styles.goalIcon}>{goal.icon}</div>
                                                <p className={styles.goalTitle}>{goal.title}</p>
                                            </div>
                                        ))}
                                    </div>
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

export default BusinessOnboarding;
