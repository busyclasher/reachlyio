// Stripe server for local development.
// Required deps: express, stripe, cors, dotenv.

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.STRIPE_SERVER_PORT || 4242);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY.');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const getOrigin = (req) => req.headers.origin || CLIENT_ORIGIN;
const buildUrl = (req, path) => new URL(path, getOrigin(req)).toString();

const getOrCreateCustomer = async ({ customerId, customerEmail }) => {
  if (customerId) {
    return customerId;
  }

  if (!customerEmail) {
    return null;
  }

  const existing = await stripe.customers.list({ email: customerEmail, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const created = await stripe.customers.create({ email: customerEmail });
  return created.id;
};

app.get('/api/stripe/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const {
      priceId,
      quantity = 1,
      mode = 'subscription',
      metadata,
      customerEmail
    } = req.body || {};

    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId.' });
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity
        }
      ],
      metadata: metadata || {},
      success_url: buildUrl(req, '/?page=pricing&status=success'),
      cancel_url: buildUrl(req, '/?page=pricing&status=cancel'),
      ...(customerEmail ? { customer_email: customerEmail } : {})
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Stripe error.' });
  }
});

app.post('/api/stripe/create-billing-portal', async (req, res) => {
  try {
    const { returnUrl, customerId, customerEmail } = req.body || {};
    const resolvedCustomerId = await getOrCreateCustomer({
      customerId: customerId || process.env.STRIPE_CUSTOMER_ID,
      customerEmail: customerEmail || process.env.STRIPE_CUSTOMER_EMAIL
    });

    if (!resolvedCustomerId) {
      return res.status(400).json({ error: 'Missing customerId or customerEmail.' });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: resolvedCustomerId,
      return_url: returnUrl || buildUrl(req, '/?page=pricing')
    });

    return res.json({ url: portal.url });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Stripe error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Stripe server listening on http://localhost:${PORT}`);
});
