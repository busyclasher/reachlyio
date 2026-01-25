import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/RoleSelectionPage.module.css';

const RoleSelectionPage = ({ onComplete }) => {
    const { setRole, user } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        if (!selectedRole || !confirmed) return;

        setLoading(true);

        const success = setRole(selectedRole);
        if (success && onComplete) {
            onComplete(selectedRole);
        }

        setLoading(false);
    };

    const roles = [
        {
            id: 'BUSINESS',
            icon: '🏢',
            title: 'Business',
            subtitle: 'Hire creators & post campaigns',
            features: [
                'Browse verified KOL profiles',
                'Post campaign briefs',
                'Manage applications & deals',
                'Access analytics & reporting'
            ]
        },
        {
            id: 'INFLUENCER',
            icon: '⭐',
            title: 'Influencer',
            subtitle: 'Find brand deals & grow your career',
            features: [
                'Create your creator listing',
                'Apply to paid campaigns',
                'Receive brand invites',
                'Track earnings & performance'
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.badge}>
                        👋 Welcome, {user?.name || 'there'}!
                    </span>
                    <h1 className={styles.title}>Choose your account type</h1>
                    <p className={styles.subtitle}>
                        Select how you'll be using Reachly. This determines your dashboard and available features.
                    </p>
                </div>

                <div className={styles.warning}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <p className={styles.warningText}>
                        <strong>Important:</strong> This choice is permanent and cannot be changed later.
                        Please select carefully based on how you plan to use the platform.
                    </p>
                </div>

                <div className={styles.cards}>
                    {roles.map(role => (
                        <div
                            key={role.id}
                            className={`${styles.card} ${selectedRole === role.id ? styles.selected : ''}`}
                            onClick={() => setSelectedRole(role.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setSelectedRole(role.id)}
                        >
                            <div className={styles.cardCheck}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className={styles.cardIcon}>{role.icon}</div>
                            <h3 className={styles.cardTitle}>{role.title}</h3>
                            <p className={styles.cardSubtitle}>{role.subtitle}</p>

                            <ul className={styles.cardFeatures}>
                                {role.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className={styles.confirmation}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            disabled={!selectedRole}
                        />
                        <span>I understand this choice is irreversible and cannot be changed later</span>
                    </label>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.continueBtn}
                        onClick={handleContinue}
                        disabled={!selectedRole || !confirmed || loading}
                    >
                        {loading ? 'Setting up...' : `Continue as ${selectedRole === 'BUSINESS' ? 'Business' : selectedRole === 'INFLUENCER' ? 'Influencer' : '...'}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
