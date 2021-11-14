import Stripe from 'stripe';
import { buffer } from 'micro';
import { firestore,auth, getBusinessWithBusinessId, increment ,serverTimestamp} from '../../lib/firebase';

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
            console.log(metadata)
            const uid = metadata.userId;
            const businessDoc = await getBusinessWithBusinessId(metadata.businessId);
            const subRef = businessDoc.ref.collection('subscriptions').doc(metadata.slug);
            const subscriptionId=subRef.id;
            const customerRef = subRef.collection('customers').doc(uid);
            const customerSub = firestore.collection('customers').doc(uid).collection('subscribedTo').doc(subRef.id);
            const batch = firestore.batch();
            batch.update(subRef, { customerCount: increment(1) });
            batch.set(customerRef, { uid,name:metadata.name });
            batch.set(customerSub, { subscriptionId,boughtAt: serverTimestamp(),stripeSubscriptionId:event.data.object.subscription });
            await batch.commit();
          } catch (err) {
            console.log(`❌ Error message: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
          }
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // 3. Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}