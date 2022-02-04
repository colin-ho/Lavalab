const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CancelSubscription(req:any, res:any) {
    const { stripeSubscriptionId } = req.body;
    const subscription = await stripe.subscriptions.del(stripeSubscriptionId);
    // Cancel at end of period
    // const subscription = stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  
    res.json({ status: subscription.status });
}