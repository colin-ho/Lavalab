import { Select } from "@chakra-ui/select";
import React,{ useState } from "react";
import { auth, firestore } from "../lib/firebase";
import ImageUploader from "./ImageUploader";
import Address from './Address'
import Geocode from "react-geocode";
const geofire = require('geofire-common');
Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export default function BusinessNameForm() {
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