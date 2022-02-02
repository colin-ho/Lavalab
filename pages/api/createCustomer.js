import { firestore } from '../../lib/firebase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateCustomer(req, res) {
    const { userId,email} = req.body;
    const userSnapshot = firestore.collection('customers').doc(userId)

    const customer = await stripe.customers.create({
        metadata: {
            firebaseUID: userId
        },
        email:email,
    });
    await userSnapshot.ref.update({ stripeCustomerId: customer.id });
    res.json({ customer: customer });
    
}