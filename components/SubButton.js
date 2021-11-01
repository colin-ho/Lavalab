import { firestore, auth, increment } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

// Allows user to heart or like a post
export default function SubButton({ subRef }) {
  // Listen to heart document for currently logged in user
  const customerRef = subRef.collection('customers').doc(auth.currentUser.uid);
  const [customerDoc] = useDocument(customerRef);

  // Create a user-to-post relationship
  const addCustomer = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(subRef, { customerCount: increment(1) });
    batch.set(customerRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeCustomer = async () => {
    const batch = firestore.batch();

    batch.update(subRef, { customerCount: increment(-1) });
    batch.delete(customerRef);

    await batch.commit();
  };

  return customerDoc?.exists ? (
    <button onClick={removeCustomer}>💔 Unsubcribe</button>
  ) : (
    <button onClick={addCustomer}>💗 Subscribe</button>
  );
}