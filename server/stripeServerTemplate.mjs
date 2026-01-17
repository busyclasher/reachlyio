// Basic Stripe server template for local testing.
// Required deps: express, stripe, cors, dotenv (optional).

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId, quantity = 1, mode = 'subscription', metadata } = req.body || {};

    if (!priceId) {
      return res.status(400).send('Missing priceId.');
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
      success_url: 'http://localhost:5173/?page=pricing&status=success',
      cancel_url: 'http://localhost:5173/?page=pricing&status=cancel'
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    return res.status(500).send(error.message || 'Stripe error.');
  }
});

app.post('/api/stripe/create-billing-portal', async (req, res) => {
  try {
    const { returnUrl } = req.body || {};
    const customerId = req.body?.customerId || process.env.STRIPE_CUSTOMER_ID;

    if (!customerId) {
      return res.status(400).send('Missing customerId.');
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || 'http://localhost:5173/?page=pricing'
    });

    return res.json({ url: portal.url });
  } catch (error) {
    return res.status(500).send(error.message || 'Stripe error.');
  }
});

app.listen(4242, () => {
  console.log('Stripe server template listening on http://localhost:4242');
});
