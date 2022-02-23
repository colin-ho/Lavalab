import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../lib/firebase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateCustomer(req: NextApiRequest, res: NextApiResponse) {
    const { customerId} = req.body;
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: customerId},
        {apiVersion: '2020-08-27'}
      );
    res.json({ ephemeralKey: ephemeralKey.secret });
}