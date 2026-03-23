export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: '700',
        currency: 'usd',
        'automatic_payment_methods[enabled]': 'true',
      }).toString(),
    });

    const paymentIntent = await response.json();

    if (paymentIntent.error) {
      return res.status(400).json({ error: paymentIntent.error.message });
    }

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
