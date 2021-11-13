import { firestore } from '../lib/firebase';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function GetOrCreateCustomer(customerId,params) {
    const userSnapshot = await firestore.collection('customers').doc(customerId).get();

    const { stripeCustomerId } = userSnapshot.data() || {};

    // If missing customerID, create it
    if (!stripeCustomerId) {
        // CREATE new customer
        const customer = await stripe.customers.create({
            metadata: {
                firebaseUID: customerId
            },
            ...params
        });
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    } else {
        return await stripe.customers.retrieve(stripeCustomerId)
    }

}