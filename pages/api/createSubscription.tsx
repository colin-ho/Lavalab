const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateSubscription(req, res) {
    const { stripeCustomerId,
        priceId,metadata } = req.body;
    try {
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [{
            price: priceId,
          }],
          metadata:metadata,
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });
    
        res.json({
          stripeSubscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
      } catch (error) {
        res.status(400).send({ error: { message: error.message } });
      }
}
