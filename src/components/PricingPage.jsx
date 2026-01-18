import { useMemo, useState } from 'react';
import styles from '../styles/PricingPage.module.css';
import { createBillingPortal, createCheckoutSession, redirectToCheckout } from '../services/stripeClient';

const PRICE_IDS = {
    starter: import.meta.env.VITE_STRIPE_PRICE_STARTER,
    growth: import.meta.env.VITE_STRIPE_PRICE_GROWTH,
    scale: import.meta.env.VITE_STRIPE_PRICE_SCALE
};

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        summary: 'For first-time campaigns and small teams.',
        price: 'SGD 149',
        interval: 'month',
        priceId: PRICE_IDS.starter,
        cta: 'Start Starter',
        features: [
            'Up to 3 active campaigns',
            'Basic creator shortlist',
            'Email support',
            'Campaign reporting'
        ]
    },
    {
        id: 'growth',
        name: 'Growth',
        summary: 'Best for growing brands that run monthly briefs.',
        price: 'SGD 399',
        interval: 'month',
        priceId: PRICE_IDS.growth,
        cta: 'Start Growth',
        featured: true,
        features: [
            'Up to 8 active campaigns',
            'Priority shortlist in 48 hours',
            'Collaboration workspace',
            'Performance dashboards'
        ]
    },
    {
        id: 'scale',
        name: 'Scale',
        summary: 'Built for high-volume teams with repeat creators.',
        price: 'SGD 899',
        interval: 'month',
        priceId: PRICE_IDS.scale,
        cta: 'Start Scale',
        features: [
            'Unlimited active campaigns',
            'Dedicated success manager',
            'Custom reporting exports',
            'Multi-brand workspaces'
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        summary: 'Custom pricing, procurement, and security review.',
        price: 'Custom',
        interval: '',
        priceId: null,
        cta: 'Contact sales',
        isContact: true,
        features: [
            'Quarterly business reviews',
            'Custom contract terms',
            'Single sign-on support',
            'Onsite launch workshops'
        ]
    }
];

const integrationSteps = [
    'Set VITE_STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_PRICE_* in your .env file.',
    'Run the Stripe server with STRIPE_SECRET_KEY.',
    'Optional: set STRIPE_CUSTOMER_ID or STRIPE_CUSTOMER_EMAIL for billing portal.',
    'Point /api/stripe to your backend or serverless route.'
];

const PricingPage = () => {
    const [processingPlan, setProcessingPlan] = useState(null);
    const [error, setError] = useState('');

    const statusMessage = useMemo(() => {
        if (typeof window === 'undefined') {
            return '';
        }

        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        if (status === 'success') {
            return 'Checkout complete. Your subscription is now active.';
        }
        if (status === 'cancel') {
            return 'Checkout canceled. You can try again when ready.';
        }
        return '';
    }, []);

    const handleCheckout = async (plan) => {
        if (!plan.priceId) {
            if (plan.isContact) {
                window.location.href = 'mailto:hello@reachly.io?subject=Reachly Enterprise plan';
                return;
            }

            setError('Missing Stripe price ID for this plan.');
            return;
        }

        setProcessingPlan(plan.id);
        setError('');

        try {
            const session = await createCheckoutSession({ priceId: plan.priceId });
            await redirectToCheckout(session.sessionId);
        } catch (err) {
            setError(err.message || 'Checkout failed. Please try again.');
        } finally {
            setProcessingPlan(null);
        }
    };

    const handleManageBilling = async () => {
        setError('');

        try {
            const portal = await createBillingPortal();
            if (portal?.url) {
                window.location.href = portal.url;
            } else {
                throw new Error('Billing portal URL missing.');
            }
        } catch (err) {
            setError(err.message || 'Billing portal unavailable.');
        }
    };

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.kicker}>Pricing</span>
                    <h1 className={styles.title}>Plans built for creator-led growth</h1>
                    <p className={styles.subtitle}>
                        Launch faster with predictable pricing, Stripe checkout, and a clear path from shortlist to
                        signed creators.
                    </p>
                    <div className={styles.heroActions}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => handleCheckout(plans[1])}
                            disabled={processingPlan === plans[1].id}
                        >
                            {processingPlan === plans[1].id ? 'Processing...' : 'Start Growth'}
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={handleManageBilling}>
                            Manage billing
                        </button>
                    </div>
                    {statusMessage && <div className={styles.notice}>{statusMessage}</div>}
                    {error && <div className={styles.error}>{error}</div>}
                </div>

                <div className={styles.integrationCard}>
                    <h3>Stripe template checklist</h3>
                    <ul className={styles.integrationList}>
                        {integrationSteps.map(step => (
                            <li key={step}>{step}</li>
                        ))}
                    </ul>
                    <div className={styles.endpointList}>
                        <div className={styles.endpointRow}>
                            <span className={styles.endpointBadge}>POST</span>
                            <span>/api/stripe/create-checkout-session</span>
                        </div>
                        <div className={styles.endpointRow}>
                            <span className={styles.endpointBadge}>POST</span>
                            <span>/api/stripe/create-billing-portal</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.pricingGrid}>
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`}
                    >
                        <div className={styles.planHeader}>
                            <div>
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <p className={styles.planSummary}>{plan.summary}</p>
                            </div>
                            {plan.featured && <span className={styles.planBadge}>Most popular</span>}
                        </div>
                        <div className={styles.planPrice}>
                            <span className={styles.planAmount}>{plan.price}</span>
                            {plan.interval && <span className={styles.planInterval}>/{plan.interval}</span>}
                        </div>
                        <ul className={styles.planFeatures}>
                            {plan.features.map(feature => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                        <button
                            className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                            onClick={() => handleCheckout(plan)}
                            disabled={processingPlan === plan.id}
                        >
                            {processingPlan === plan.id ? 'Processing...' : plan.cta}
                        </button>
                    </div>
                ))}
            </section>

            <section className={styles.faq}>
                <div className={styles.faqCard}>
                    <h3>How does billing work?</h3>
                    <p>
                        Plans are billed monthly by default. Stripe handles invoices, payment retries, and taxes when
                        configured on the server side.
                    </p>
                </div>
                <div className={styles.faqCard}>
                    <h3>Can I switch plans later?</h3>
                    <p>
                        Yes. Update the customer subscription in Stripe and reflect changes in your dashboard using the
                        billing portal endpoint.
                    </p>
                </div>
                <div className={styles.faqCard}>
                    <h3>Do I need webhooks?</h3>
                    <p>
                        Use Stripe webhooks to unlock features after payment events. This template leaves the hook
                        wiring to your backend.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
