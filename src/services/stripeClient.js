const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_API_BASE = import.meta.env.VITE_STRIPE_API_BASE || '';
const STRIPE_CUSTOMER_ID = import.meta.env.VITE_STRIPE_CUSTOMER_ID;
const STRIPE_CUSTOMER_EMAIL = import.meta.env.VITE_STRIPE_CUSTOMER_EMAIL;

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
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
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

export const createCheckoutSession = async ({
  priceId,
  quantity = 1,
  mode = 'subscription',
  metadata,
  customerEmail
} = {}) => {
  if (!priceId) {
    throw new Error('Missing priceId for checkout.');
  }

  const resolvedEmail = customerEmail || STRIPE_CUSTOMER_EMAIL;

  return postJson('/api/stripe/create-checkout-session', {
    priceId,
    quantity,
    mode,
    metadata,
    ...(resolvedEmail ? { customerEmail: resolvedEmail } : {})
  });
};

export const createBillingPortal = async ({ returnUrl, customerId, customerEmail } = {}) => {
  const payload = {
    returnUrl: returnUrl || window.location.href
  };

  const resolvedCustomerId = customerId || STRIPE_CUSTOMER_ID;
  const resolvedCustomerEmail = customerEmail || STRIPE_CUSTOMER_EMAIL;

  if (resolvedCustomerId) {
    payload.customerId = resolvedCustomerId;
  }

  if (resolvedCustomerEmail) {
    payload.customerEmail = resolvedCustomerEmail;
  }

  return postJson('/api/stripe/create-billing-portal', payload);
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
