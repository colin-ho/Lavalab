import { firestore, auth, increment ,serverTimestamp} from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import Loader from './Loader';
import { useState } from 'react';


// Allows user to heart or like a post
export default function SubButton({ subRef ,subscription}) {

  const [loading,setLoading] = useState(false);
  // Listen to heart document for currently logged in user
  const customerRef = subRef.collection('customers').doc(auth.currentUser.uid);
  const [customerDoc] = useDocument(customerRef);
  const customerSub = firestore.collection('customers').doc(auth.currentUser.uid).collection('subscribedTo').doc(subRef.id)
  const stripe = useStripe();
  // Create a user-to-post relationship
  const addCustomer = async () => {
    setLoading(true);
    const uid = auth.currentUser.uid;
    const subscriptionId = subRef.id;
    const batch = firestore.batch();
    batch.update(subRef, { customerCount: increment(1) });
    batch.set(customerRef, { uid });
    batch.set(customerSub, { subscriptionId,boughtAt: serverTimestamp() });

    await batch.commit();
    
    const item = {name:subscription.title, 
      price:subscription.price,
      description:subscription.content,
      id:subscription.businessId,
      slug:subscription.slug
    };

    const checkoutSession = await axios.post('/api/checkout', {
      item,
    });
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) {
      alert(result.error.message);
    }
  };

  // Remove a user-to-post relationship
  const removeCustomer = async () => {
    const batch = firestore.batch();

    batch.update(subRef, { customerCount: increment(-1) });
    batch.delete(customerRef);
    batch.delete(customerSub);

    await batch.commit();
  };

  return (
    <>
    {customerDoc?.exists ? (
    <button onClick={removeCustomer}>💔 Unsubcribe</button>
  ) : (
    <button onClick={addCustomer}>💗 Subscribe</button>
  )}
  <Loader show={loading}/>
  </>
  );
}