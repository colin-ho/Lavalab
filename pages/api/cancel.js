import {GetOrCreateCustomer} from '../../lib/customer'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CancelSubscription(req, res) {
    const { userId,stripeSubscriptionId } = req.body;
    console.log(userId)
    const customer = await GetOrCreateCustomer(userId);
    if (customer.metadata.firebaseUID !== userId) {
      throw Error('Firebase UID does not match Stripe Customer');
    }
    const subscription = await stripe.subscriptions.del(stripeSubscriptionId);
  
    // Cancel at end of period
    // const subscription = stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  
    res.json({ status: subscription.status });
}