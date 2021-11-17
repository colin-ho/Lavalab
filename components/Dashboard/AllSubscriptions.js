import { Image } from '@chakra-ui/image';
import axios from 'axios';
import kebabCase from 'lodash.kebabcase';
import React,{useContext, useState} from 'react'
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { AuthContext } from '../../lib/context';
import { auth, firestore, serverTimestamp } from '../../lib/firebase';
import ImageUploader from '../ImageUploader';

export default function AllSubscriptions({subscriptions}) {
    const[formMode,setFormMode] = useState(false);
    const[editableSub,setEditableSub] = useState(null);

    return (
        formMode ? <SubscriptionForm editableSub={editableSub}/> : 
        <div>
            <button onClick={()=> {setEditableSub(null);setFormMode(true)}}>Create Subscription</button>
            {subscriptions ? subscriptions.map((subscription) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id}/>) : null}
        </div>
    )
}

function SubscriptionItem({ subscription,setFormMode,setEditableSub }) {
    const edit = ()=>{
        setFormMode(true);
        setEditableSub(subscription);
    }
    return (
      <div style={{marginleft:100}}>
        <p>title: {subscription.title}</p>
        <p>price: {subscription.price}</p>
        <p>description: {subscription.content}</p>
        <p>customer count: {subscription.customerCount }</p>
        <button onClick={edit} className="btn-blue">Edit</button>
      </div>
    );
}


function SubscriptionForm({ editableSub }) {
    const{displayName} = useContext(AuthContext);
    const subscription = !editableSub ? {title:'',price:'',content:''} : {title:editableSub.title,price:editableSub.price,content:editableSub.content};
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues:subscription, mode: 'onSubmit' });
    const initialPhoto = editableSub ? editableSub.photoURL : '';
    const [photoURL,setPhotoURL] = useState(initialPhoto);
    const [photoError,setPhotoError] = useState(false);
    console.log(subscription);

    const submitSubscription = async ({title,content,price})=>{
        if(!photoURL){
            setPhotoError(true);
            return;
        } else{
            setPhotoError(false);
        }
        const uid = auth.currentUser.uid;
        const slug = encodeURI(kebabCase(title));
        if(editableSub){
            const ref = firestore.collection('businesses').doc(uid).collection('subscriptions').doc(editableSub.id);
            const data = {
                title:title,
                photoURL:photoURL,
                slug:slug,
                content: content,
                price:price,
                updatedAt: serverTimestamp(),
                };
            await ref.update(data);
            toast.success('Subscription updated successfully!')
        } else{
            const createdProductId = await axios.post('/api/createProduct', {
                name:title,
                businessId:uid,
            });
            const createdProductPrice = await axios.post('/api/createPrice', {
                id:createdProductId.data.id,amount:price
            });
            const data = {
                title:title,
                photoURL:photoURL,
                slug:slug,
                uid:uid,
                stripePriceId:createdProductPrice.data.id,
                stripeProductId:createdProductId.data.id,
                businessName: displayName,
                businessId:auth.currentUser.uid,
                content: content,
                price:price,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                customerCount: 0,
                redemptionCount:0,
                };
        
            const docref = await firestore.collection('businesses').doc(uid).collection('subscriptions').add(data);
            docref.update({id:docref.id})

            toast.success('Subscription created successfully!')
        }
        
        // Tip: give all fields a default value here
        
    }

    return (
        <form onSubmit={handleSubmit(submitSubscription)}>
            
            <Image src={photoURL} alt=""/>
            <ImageUploader setPhotoUrl={setPhotoURL}/>
            {photoError && <p className="text-danger">{"Please upload an image"}</p>}
            <textarea placeholder="title"name="title" {...register('title',{ required: { value: true, message: 'title is required'}})}></textarea>
            {errors.content && <p className="text-danger">{errors.content.message}</p>}

            <textarea placeholder="content" name="content" {...register('content',{ required: { value: true, message: 'content is required'}})}></textarea>
            {errors.content && <p className="text-danger">{errors.content.message}</p>}

            <input name="price" type="number" {...register('price',{required:{ value: true, message: 'price is required'}, min: 0 })}/>
            <label>Price</label>

            <button type="submit">
            {editableSub ? "Save Changes" : "Create Subscription"}
            </button>
        </form>
    );
}