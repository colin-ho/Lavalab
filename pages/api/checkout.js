import {GetOrCreateCustomer} from '../../lib/customer'
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST','HEAD'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateStripeSession(req, res) {
    await runMiddleware(req, res, cors)
    const { item,customerId,subscriptionId,name,title } = req.body;

    const stripeCustomer = await GetOrCreateCustomer(customerId);
    const redirectURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/shops/'
    : 'https://lavalab.vercel.app/shops/';
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: item.stripePriceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: redirectURL + '?sc_checkout=success',
      cancel_url: redirectURL + '?sc_checkout=cancel',
      customer:stripeCustomer.id,
      metadata:{
        customerId:customerId,
        name:name,
        subscriptionId:subscriptionId,
        businessId:item.businessId,
        title:title,
      }
    });
  
    res.json({ id: session.id });
  }