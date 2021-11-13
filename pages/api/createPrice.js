const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreatePrice(req, res) {
    const { id ,amount} = req.body;
    const price = await stripe.prices.create({
        unit_amount: amount*100,
        currency: 'usd',
        recurring: {interval: 'month'},
        product: id,
      });
    res.json({ id:price.id });
  }