const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripeClient = null;

const getStripeClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Stripe can only run in the browser.');
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Missing VITE_STRIPE_PUBLISHABLE_KEY.');
  }

  if (!window.Stripe) {
    throw new Error('Stripe.js not loaded. Add https://js.stripe.com/v3 to index.html.');
  }

  if (!stripeClient) {
    stripeClient = window.Stripe(STRIPE_PUBLISHABLE_KEY);
  }

  return stripeClient;
};

const postJson = async (path, payload) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Stripe request failed.');
  }

  return response.json();
};

export const createCheckoutSession = async ({ priceId, quantity = 1, mode = 'subscription', metadata } = {}) => {
  if (!priceId) {
    throw new Error('Missing priceId for checkout.');
  }

  return postJson('/api/stripe/create-checkout-session', {
    priceId,
    quantity,
    mode,
    metadata
  });
};

export const createBillingPortal = async ({ returnUrl } = {}) => {
  return postJson('/api/stripe/create-billing-portal', {
    returnUrl: returnUrl || window.location.href
  });
};

export const redirectToCheckout = async (sessionId) => {
  if (!sessionId) {
    throw new Error('Missing sessionId for redirect.');
  }

  const stripe = getStripeClient();
  const result = await stripe.redirectToCheckout({ sessionId });

  if (result?.error) {
    throw new Error(result.error.message || 'Stripe redirect failed.');
  }
};
