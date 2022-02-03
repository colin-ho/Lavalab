import Stripe from 'stripe';
import { buffer } from 'micro';
import { firestore, increment, serverTimestamp } from '../../lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET.toString();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
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
        } catch (err) {
            console.log(`❌ Error message: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Successfully constructed event
        console.log('✅ Success:', event.id);

        // 2. Handle event type (add business logic here)
        if (event.type === 'checkout.session.completed') {
            try {
                const metadata = event.data.object.metadata;
                const businessRef = firestore.collection('businesses').doc(metadata.businessId);
                const subRef = businessRef.collection('subscriptions').doc(metadata.subscriptionId);
                const customerRef = subRef.collection('customers').doc(metadata.customerId);
                const customerSub = firestore.collection('customers').doc(metadata.customerId).collection('subscribedTo').doc(metadata.subscriptionId);
                const newHistory = firestore.collection('customers').doc(metadata.customerId).collection('history').doc()
                const batch = firestore.batch();
                batch.update(businessRef, { totalCustomers: increment(1) })
                batch.update(subRef, { customerCount: increment(1) });
                batch.set(customerRef, { uid: metadata.customerId, name: metadata.name, redeeming: false, code: '', currentRef: '' });
                batch.set(customerSub, { subscriptionTitle: metadata.title, subscriptionId: metadata.subscriptionId, stripeSubscriptionId: event.data.object.subscription, redemptionCount: 0 });
                batch.set(newHistory, { subscriptionTitle: metadata.title, subscriptionId: metadata.subscriptionId, time: serverTimestamp(), price: metadata.price, business: metadata.business,type:'subscription' })
                await batch.commit();
            } catch (err) {
                console.log(`❌ Error message: ${err.message}`);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
        }
        else if (event.type==="invoice.payment_succeeded"){
            try{
                const subscription =  event.data.object.subscription;
                const {start,end} = event.data.object.lines.data[0].period;
                const sub = await firestore.collectionGroup('subscribedTo').where('stripeSubscriptionId','==',subscription).get();
                sub.docs.forEach((doc)=>doc.ref.set({start:new Date(start*1000),end:new Date(end*1000),status:'active'},{merge:true}));
            }
            catch(err){
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