const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function CreateProduct(req:any, res:any) {
    const { name,businessId } = req.body;
    const product = await stripe.products.create({
      name: name,
      metadata:{businessId:businessId},
    });
  
    res.json({ id: product.id });
  }