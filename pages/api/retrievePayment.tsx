import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function RetrievePayment(req: NextApiRequest, res: NextApiResponse) {
    const { paymentIntentId } = req.body;
    try {
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
        res.json({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error:any) {
        res.status(400).send({ error: { message: error.message } });
      }
}
