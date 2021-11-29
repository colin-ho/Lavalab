import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useData() {
  const [user] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const [displayName,setDisplayName]=useState(null);
  const [businessType,setBusinessType] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUserType(doc.data()?.userType);
        setDisplayName(doc.data()?.displayName);
        setBusinessType(doc.data()?.businessType);
      });
    } else {
      setUserType(null);
      setDisplayName(null);
      setBusinessType(null);
    }

    return unsubscribe;
  }, [user]);

  return { userType, user,displayName,businessType };
}