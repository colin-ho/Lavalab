import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useData() {
  const [user] = useAuthState(auth);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUserType(doc.data()?.userType);
      });
    } else {
      setUserType(null);
    }

    return unsubscribe;
  }, [user]);

  return { userType, user };
}