import {GetOrCreateCustomer} from '../../lib/customer'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateStripeSession(req, res) {
    const { item,userId,subscriptionId,name } = req.body;
    console.log(name)
    const customer = await GetOrCreateCustomer(userId);
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
      success_url: redirectURL + item.id+'/'+item.slug,
      cancel_url: redirectURL + item.id+'/'+item.slug,
      customer:customer.id,
      metadata:{userId:userId,
        name:name,
        subscriptionId:subscriptionId,
        slug:item.slug,
        businessId:item.id}
    });
  
    res.json({ id: session.id });
  }