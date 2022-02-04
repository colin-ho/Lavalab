import Stripe from 'stripe';
import { buffer } from 'micro';
import { arrayUnion, firestore, increment, serverTimestamp } from '../../lib/firebase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.toString();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        let event;

        try {
            // 1. Retrieve the event by ve rifying the signature using the raw body and secret
            const rawBody = await buffer(req);
            const signature = req.headers['stripe-signature'];
            event = stripe.webhooks.constructEvent(
                rawBody.toString(),
                signature,
                webhookSecret
            );
        } catch (err: any) {
            console.log(`❌ Error message: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Successfully constructed event
        console.log('✅ Success:', event.id, event.type);
        const dataObject: any = event.data.object
        // 2. Handle event type (add business logic here)
        if (event.type === "invoice.payment_succeeded") {
            try {
                if (dataObject.billing_reason === 'subscription_create') {
                    // The subscription automatically activates after successful payment
                    // Set the payment method used to pay the first invoice
                    // as the default payment method for that subscription

                    const metadata = dataObject.lines.data[0].metadata;
                    const { start, end } = dataObject.lines.data[0].period;

                    const businessRef = firestore.collection('businesses').doc(metadata.businessId);
                    const subRef = firestore.collection('subscriptions').doc(metadata.subscriptionId);
                    const subscribedTo = firestore.collection('subscribedTo').doc(dataObject.subscription)
                    const newHistory = firestore.collection('customers').doc(metadata.customerId).collection('history').doc()

                    const batch = firestore.batch();
                    batch.update(businessRef, { totalPurchases: increment(1) })
                    batch.update(subRef, { purchases: increment(1) });
                    batch.set(subscribedTo, {
                        customerName: metadata.name, customerId: metadata.customerId, businessId: metadata.businessId, subscriptionTitle: metadata.title, subscriptionId: metadata.subscriptionId, stripeSubscriptionId: dataObject.subscription, redemptionCount: 0,
                        start: new Date(start * 1000), end: new Date(end * 1000), status: 'active'
                    });
                    batch.set(newHistory, { subscriptionTitle: metadata.title, subscriptionId: metadata.subscriptionId, time: serverTimestamp(), price: metadata.price, business: metadata.business, type: 'subscription' })
                    await batch.commit();

                    const subscription_id = dataObject.subscription
                    const payment_intent_id = dataObject.payment_intent

                    // Retrieve the payment intent used to pay the subscription
                    const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

                    if (payment_intent.payment_method) {
                        await stripe.subscriptions.update(
                            subscription_id,
                            {
                                default_payment_method: payment_intent.payment_method.toString(),
                            },
                        );
                    }

                    console.log("Default payment method set for subscription:" + payment_intent.payment_method);
                }
                else {
                    const subscription = dataObject.subscription;
                    const { start, end } = dataObject.lines.data[0].period;
                    const sub = firestore.collection('subscribedTo').doc(subscription)
                    sub.update({ start: new Date(start * 1000), end: new Date(end * 1000), status: 'active' });
                }

            }
            catch (err:any) {
                console.log(`❌ Error message: ${err.message}`);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
        }
        else if (event.type === "invoice.payment_failed") {
            try {
                if (dataObject.billing_reason === 'subscription_cycle') {
                    const subscription = dataObject.subscription;
                    const sub = await firestore.collectionGroup('subscribedTo').where('stripeSubscriptionId', '==', subscription).get();

                    sub.docs.forEach((doc) => doc.ref.update({ status: 'incomplete' }));
                }

            }
            catch (err:any) {
                console.log(`❌ Error message: ${err.message}`);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
        }
        else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }

        // 3. Return a response to acknowledge receipt of the event.
        res.json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}