const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateStripeSession(req, res) {
    const { item } = req.body;
    console.log(item);
    const redirectURL = 'http://localhost:3000/shops/'
  
    const transformedItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      description: item.description,
      quantity: 1,
    };
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [transformedItem],
      mode: 'payment',
      success_url: redirectURL + item.id+'/'+item.slug,
      cancel_url: redirectURL + item.id+'/'+item.slug,
    });
  
    res.json({ id: session.id });
  }