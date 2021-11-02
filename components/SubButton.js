import { firestore, auth, increment ,serverTimestamp} from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

// Allows user to heart or like a post
export default function SubButton({ subRef }) {
  // Listen to heart document for currently logged in user
  const customerRef = subRef.collection('customers').doc(auth.currentUser.uid);
  const [customerDoc] = useDocument(customerRef);
  const customerSub = firestore.collection('customers').doc(auth.currentUser.uid).collection('subscribedTo').doc(subRef.id)

  // Create a user-to-post relationship
  const addCustomer = async () => {
    const uid = auth.currentUser.uid;
    const subscription = subRef.id;
    const batch = firestore.batch();
    batch.update(subRef, { customerCount: increment(1) });
    batch.set(customerRef, { uid });
    batch.set(customerSub, { subscription,boughtAt: serverTimestamp() });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeCustomer = async () => {
    const batch = firestore.batch();

    batch.update(subRef, { customerCount: increment(-1) });
    batch.delete(customerRef);
    batch.delete(customerSub);

    await batch.commit();
  };

  return customerDoc?.exists ? (
    <button onClick={removeCustomer}>💔 Unsubcribe</button>
  ) : (
    <button onClick={addCustomer}>💗 Subscribe</button>
  );
}