const Stripe = require('stripe');
const { PRODUCTS } = require('./products');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
      return res.status(400).json({ error: 'Invalid cart.' });
    }

    const line_items = items.map((item) => {
      const id = Number(item.id);
      const product = PRODUCTS[id];
      const size = String(item.size || '');
      const quantity = Number(item.quantity || 1);

      if (!product || !['S', 'M', 'L', 'XL', '2XL'].includes(size)) {
        throw new Error('Invalid product or size.');
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        throw new Error('Invalid quantity.');
      }

      return {
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: product.price * 100,
          product_data: {
            name: product.name,
            metadata: { product_id: String(id), size }
          }
        }
      };
    });

    const origin =
      process.env.SITE_URL ||
      `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_creation: 'always',
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['US'] },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#shop`,
      metadata: { brand: 'AGNUS-DEI' }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message || 'Checkout failed.' });
  }
};
