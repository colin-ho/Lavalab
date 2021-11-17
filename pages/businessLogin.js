import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { AuthContext } from '../lib/context';
import { useEffect, useState, useContext } from 'react';
import ImageUploader from '../components/ImageUploader';
import { useRouter } from 'next/router';
import { Address } from '../components/Address';
import Geocode from "react-geocode";
import { Select } from "@chakra-ui/react"

const geofire = require('geofire-common');
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export default function BusinessLogin(props) {
  const { userType, user } = useContext(AuthContext);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('businesses').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setBusinessName(doc.data()?.businessName);
      });
    } else {
      setBusinessName(" ");
    }

    return unsubscribe;
  }, [user]);
  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main style={{marginTop:50}} >
        {user ? userType ==='customer' ? <UserIsCustomer/> :  businessName!==" " ? <SignOutButton /> : <BusinessNameForm/>:<SignInButton />}
    </main>
  );
}

function UserIsCustomer(){
    return (
        <div>User is already a customer</div>
    );
}

// Sign in with Google button
function SignInButton() {
    
  const onSubmit = async () => {
    await auth.signInWithPopup(googleAuthProvider);
    const userDoc = firestore.collection('users').doc(auth.currentUser.uid);
    const { exists } = await userDoc.get();
    if(!exists){
      const businessDoc = firestore.collection('businesses').doc(auth.currentUser.uid);
      // Commit both docs together as a batch write.
      const batch = firestore.batch();
      batch.set(userDoc, { uid:auth.currentUser.uid, photoURL: auth.currentUser.photoURL, displayName: '', userType:'business'});
      batch.set(businessDoc, { uid: auth.currentUser.uid });
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
  const router = useRouter();
  return (<div>
    <button onClick={()=>router.push(`/dashboard`)}>Go to Dashboard</button>
    <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

// Username form
function BusinessNameForm() {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [businessType, setBusinessType] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    const {lat,lng} = (await Geocode.fromAddress(address)).results[0].geometry.location;
    const geohash = geofire.geohashForLocation([lat, lng]);
    // Create refs for both documents
    const businessDoc = firestore.collection('businesses').doc(auth.currentUser.uid);
    const userDoc = firestore.collection('users').doc(auth.currentUser.uid);
    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.update(userDoc,{displayName:businessName})
    batch.set(businessDoc, { uid:auth.currentUser.uid,businessType: businessType, businessName: businessName, photoURL: imageUrl, address: address,geohash: geohash,description:description,lat:lat,lng:lng },{ merge: true });
    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value;
    const name = e.target.name;

    if(name==='businessName'){
      setBusinessName(val)
    }
    if(name==='description'){
      setDescription(val)
    }
    if(name==='businessType'){
      setBusinessType(val)
  }
  };

  return (
      <section>
        <h3>Business Form</h3>
        <Address address={address} setAddress={setAddress}/>
        <form onSubmit={onSubmit}>
          <input name="businessName" placeholder="Name" value={businessName} onChange={onChange} />
          <Select name = "businessType" onChange={onChange} placeholder="Business Type">
            <option value="cafe">cafe</option>
            <option value="breakfast">breakfast</option>
            <option value="italian">italian</option>
          </Select>
          <input name="description" placeholder="Description" value={description} onChange={onChange} />
          <ImageUploader setPhotoUrl={setImageUrl}/>
          <button type="submit" className="btn-green">
            Submit
          </button>
        </form>
      </section>
  );
}
