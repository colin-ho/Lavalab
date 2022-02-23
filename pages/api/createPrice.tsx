import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreatePrice(req: NextApiRequest, res: NextApiResponse) {
    const { id ,amount,interval} = req.body;
    const price = await stripe.prices.create({
        unit_amount: amount,
        currency: 'usd',
        recurring: {interval: interval},
        product: id,
      });
    res.json({ id:price.id });
  }