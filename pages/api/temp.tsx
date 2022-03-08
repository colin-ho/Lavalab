import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../lib/firebase-admin';


export default async function CreateCustomer(req: NextApiRequest, res: NextApiResponse) {

    try{
        const batch = firestore.batch();
        const snapshot = await firestore.collection('subscribedTo').get();
        snapshot.forEach(doc=>{
            const data = doc.data();
            const payment = firestore.collection('payments').doc();
            batch.set(payment,{
                customerName: data.customerName, customerId: data.customerId,amountPaid:data.amountPaid,subscriptionTitle: data.subscriptionTitle, subscriptionId: data.subscriptionId,
                date:data.boughtAt,reason:"subscription_create",businessId: data.businessId, businessName:data.businessName,
            })
        })
    
        await batch.commit();
        res.json({ received: true });
    } catch (err:any) {
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    
}