import { firestore, auth, increment ,serverTimestamp,arrayUnion} from '../lib/firebase';
import { useDocument} from 'react-firebase-hooks/firestore';
import Loader from './Loader';
import { useContext, useState } from 'react';
import { AuthContext } from '../lib/context';

// Allows user to heart or like a post
export default function RedeemButton({ subRef ,subscription}) {

  const [loading,setLoading] = useState(false);
  const {displayName} = useContext(AuthContext)
  // Listen to heart document for currently logged in user
  const uid = auth.currentUser.uid;
  const customerRef = subRef.collection('customers').doc(uid);
  let count = subscription.redemptionCount+1
  const redemptionRef = subRef.collection('redemptions').doc(count.toString());
  const [customerDoc] = useDocument(customerRef);
  const customerSub = firestore.collection('customers').doc(uid).collection('subscribedTo').doc(subRef.id)
  // Create a user-to-post relationship
  const redeem = async () => {
    setLoading(true);
    
    const batch = firestore.batch();
    batch.update(customerRef, { redemptionCount: increment(1)});
    batch.update(subRef, { redemptionCount: increment(1)});
    batch.set(redemptionRef, { redeemedBy:displayName,redeemedAt: serverTimestamp(),businessId:subscription.uid,subscriptionName:subscription.title });
    batch.set(customerSub, { redemptionCount: increment(1),redeemedAt: arrayUnion(new Date()) },{merge:true});

    await batch.commit();
    
    setLoading(false);
    count = count+1;
  };

  return (
    <>
      {customerDoc?.exists ? <button onClick={redeem}>Redeem</button>:null}
      <Loader show={loading}/>
    </>
  );
}