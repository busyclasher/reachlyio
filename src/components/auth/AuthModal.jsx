import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import styles from '../../styles/AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'signup' }) => {
    const { signup, login, socialLogin } = useAuth();
    const [mode, setMode] = useState(initialMode); // 'signup' | 'login'
    const [step, setStep] = useState('form'); // 'form' | 'verify'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

    const codeInputRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setStep('form');
            setError('');
            setEmail('');
            setPassword('');
            setName('');
            setVerificationCode(['', '', '', '', '', '']);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        setError('');
        try {
            const result = await socialLogin(provider);
            if (result.success) {
                onClose();
            }
        } catch (err) {
            setError('Social login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signup') {
                // Show verification step for email signup
                setStep('verify');
            } else {
                // Login directly
                const result = await login({ email, password });
                if (result.success) {
                    onClose();
                }
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            setError('Please enter the complete verification code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Mock verification - accept any 6-digit code
            const result = await signup({ email, password, name });
            if (result.success) {
                onClose();
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            codeInputRefs.current[index + 1]?.focus();
        }
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            codeInputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendCode = () => {
        // Mock resend
        setError('');
        // Could show a toast here
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    <div className={styles.logo}>R</div>
                    <h2 className={styles.title}>
                        {step === 'verify' ? 'Verify your email' : 'Welcome to Reachly'}
                    </h2>
                    <p className={styles.subtitle}>
                        {step === 'verify'
                            ? `We sent a code to ${email}`
                            : 'Connect with top influencers and brands'
                        }
                    </p>
                </div>

                {step === 'form' && (
                    <>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`}
                                onClick={() => setMode('signup')}
                            >
                                Sign Up
                            </button>
                            <button
                                className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`}
                                onClick={() => setMode('login')}
                            >
                                Log In
                            </button>
                        </div>

                        <div className={styles.content}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.socialButtons}>
                                <button
                                    className={`${styles.socialBtn} ${styles.googleBtn}`}
                                    onClick={() => handleSocialLogin('google')}
                                    disabled={loading}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <button
                                    className={`${styles.socialBtn} ${styles.appleBtn}`}
                                    onClick={() => handleSocialLogin('apple')}
                                    disabled={loading}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Continue with Apple
                                </button>
                            </div>

                            <div className={styles.divider}>
                                <span>or</span>
                            </div>

                            <form className={styles.form} onSubmit={handleSubmit}>
                                {mode === 'signup' && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="name">Full Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className={styles.input}
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={styles.input}
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className={styles.input}
                                        placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={loading}
                                >
                                    {loading ? 'Please wait...' : (mode === 'signup' ? 'Create Account' : 'Log In')}
                                </button>
                            </form>

                            <div className={styles.footer}>
                                <p className={styles.footerText}>
                                    {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                                    <button
                                        className={styles.footerLink}
                                        onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                                    >
                                        {mode === 'signup' ? 'Log in' : 'Sign up'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {step === 'verify' && (
                    <div className={styles.content}>
                        <div className={styles.verificationSection}>
                            <div className={styles.verificationIcon}>📧</div>

                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.codeInputs}>
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => codeInputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className={styles.codeInput}
                                        value={digit}
                                        onChange={e => handleCodeChange(index, e.target.value)}
                                        onKeyDown={e => handleCodeKeyDown(index, e)}
                                    />
                                ))}
                            </div>

                            <button
                                className={styles.submitBtn}
                                onClick={handleVerifyCode}
                                disabled={loading || verificationCode.some(d => !d)}
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>

                            <p className={styles.resendLink} style={{ marginTop: 'var(--space-4)' }}>
                                Didn't receive the code?{' '}
                                <button onClick={handleResendCode}>Resend</button>
                            </p>

                            <button
                                className={styles.footerLink}
                                onClick={() => setStep('form')}
                                style={{ marginTop: 'var(--space-4)', display: 'block', margin: '0 auto' }}
                            >
                                ← Back to sign up
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
