import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { AuthContext } from '../lib/context';
import { useContext } from 'react';

export default function CustomerLogin(props) {
  const { userType, user } = useContext(AuthContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {userType ==='business' ? <UserIsBusiness/> : user ? <SignOutButton /> : <SignInButton />}
    </main>
  );
}

function UserIsBusiness(){
    return (
        <div>User already has a business account</div>
    );
}

// Sign in with Google button
function SignInButton() {

  const onSubmit = async () => {
    await auth.signInWithPopup(googleAuthProvider);
    const userDoc = firestore.doc(`users/${auth.currentUser.uid}`);
    const { exists } = await userDoc.get();
    if(!exists){
      const customerDoc = firestore.doc(`customers/${auth.currentUser.uid}`);
      // Commit both docs together as a batch write.
      const batch = firestore.batch();
      batch.set(userDoc, { uid:auth.currentUser.uid, photoURL: auth.currentUser.photoURL, displayName: auth.currentUser.displayName, userType:'customer'});
      batch.set(customerDoc, { uid: auth.currentUser.uid });
      await batch.commit();
    }
  };

  return (
      <button className="btn-google" onClick={onSubmit}>
        <img src={'/google.png'} width="30px" /> Sign in with Google
      </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
