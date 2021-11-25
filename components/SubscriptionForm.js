import { Button, ButtonGroup } from '@chakra-ui/button';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Image } from '@chakra-ui/image';
import { Input} from '@chakra-ui/input';
import { Box, Flex, Heading, HStack, ListItem, Stack, Text, UnorderedList, VStack } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Checkbox } from '@chakra-ui/switch/node_modules/@chakra-ui/checkbox';
import axios from 'axios';
import kebabCase from 'lodash.kebabcase';
import React,{useContext, useState} from 'react'
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { AuthContext } from '../lib/context';
import { auth, firestore, serverTimestamp } from '../lib/firebase';
import ImageUploader from './ImageUploader';

export default function SubscriptionForm({ editableSub,setFormMode }) {
    const{displayName} = useContext(AuthContext);
    const subscription = !editableSub ? {title:'',price:'',content:'',interval:'week',limit:'',dayConstrain:false} : {title:editableSub.title,price:editableSub.price,content:editableSub.content,interval:editableSub.interval,limit:editableSub.limit,dayConstrain:editableSub.dayConstrain};
    const { register, watch,handleSubmit, formState: { errors } } = useForm({ defaultValues:subscription, mode: 'onSubmit' });
    const initialPhoto = editableSub ? editableSub.photoURL : "https://firebasestorage.googleapis.com/v0/b/lavalab-23235.appspot.com/o/uploads%2F6p1j3C5k3tgZg0BfJo2s4k2OO9O2%2F1637781076553.jpeg?alt=media&token=284d2ee6-5998-461d-a716-ee0d6b8f49af";
    const watchAllFields = watch(); 
    const [photoURL,setPhotoURL] = useState(initialPhoto);
    const [photoError,setPhotoError] = useState(false);
    const [draftSave,setDraftSave] = useState(false);

    const submitSubscription = async ({title,content,price,interval,limit,dayConstrain})=>{
        if(!photoURL){
            setPhotoError(true);
            return;
        } else{
            setPhotoError(false);
        }
        const uid = auth.currentUser.uid;
        const slug = encodeURI(kebabCase(title));
        const data = {
            title:title,
            photoURL:photoURL,
            slug:slug,
            stripePriceId:'',
            stripeProductId:'',
            businessName: displayName,
            businessId:uid,
            content: content,
            price:price,
            interval:interval,
            limit:limit,
            dayConstrain:dayConstrain,
            updatedAt: serverTimestamp(),
            published:false,
            customerCount: 0,
            redemptionCount:0,
            archived:false,
        };

        if(!draftSave){
            const createdProductId = await axios.post('/api/createProduct', {
                name:title,
                businessId:uid,
            });
            const createdProductPrice = await axios.post('/api/createPrice', {
                id:createdProductId.data.id,amount:price,interval: interval
            });
            data.stripeProductId = createdProductId.data.id;
            data.stripePriceId = createdProductPrice.data.id;
            data.published = true;
        }
        if(editableSub){
            const ref = firestore.collection('businesses').doc(uid).collection('subscriptions').doc(editableSub.id);
            await ref.update(data);
            toast.success(draftSave ? 'Subscription draft updated successfully!' : 'Subscription published successfully!')
        } else{
            const ref = await firestore.collection('businesses').doc(uid).collection('subscriptions').add(data);
            ref.update({id:ref.id})
            toast.success(draftSave ? 'Subscription draft created successfully!' : 'Subscription published successfully!')
        }
        setFormMode(false);
        }
        

    return (
            <Flex direction={{base:"column",pxl:"row"}} >
                {console.log(errors)}
                <Flex direction="column" w={{base:"100%",pxl:"65%"}} justify="space-around" pr={{base:"30px",pxl:"60px"}}>
                    <Heading  size="lg" mb="20px">
                        Create a New Subscription
                    </Heading>
                    <form onSubmit={handleSubmit(submitSubscription)}>
                        <Stack spacing="5">
                            <FormControl id="title" isInvalid={errors.title?.message}>
                                <FormLabel>Subscription Name:</FormLabel>
                                <Input placeholder="Morning Brew Subscription" type="text" {...register('title',{ required: { value: true, message: 'Subscription name is required'},
                                minLength:{ value: 5, message: 'Name is too short'},maxLength:{ value: 32, message: 'Name is too long'}})} />
                                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                            </FormControl>
                            <HStack spacing="10">
                                <FormControl h="100px" id="price" isInvalid={errors.price?.message}>
                                    <FormLabel >Price:</FormLabel>
                                    <Input type="number" placeholder="19.99"{...register('price',{ required: { value: true, message: 'Price is required'},min:{ value: 1, message: 'Price is too low'}})}/>
                                    <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl h="100px" id="interval" isInvalid={errors.interval?.message}>
                                    <FormLabel>Renewal Frequency:</FormLabel>
                                    <Select {...register('interval',{ required: { value: true, message: 'Renewal frequency is required'}})}>
                                        <option value="week">Weekly</option>
                                        <option value="month">Monthly</option>
                                        <option value="year">Yearly</option>
                                    </Select>
                                    <FormErrorMessage>{errors.interval?.message}</FormErrorMessage>
                                </FormControl>
                            </HStack>
                            <FormControl id="content" isInvalid={errors.content?.message}>
                                <FormLabel>Product or service offered:</FormLabel>
                                <Input type="text" placeholder="Hot Cappucino" {...register('content',{ required: { value: true, message: 'Product is required'},
                                minLength:{ value: 1, message: 'Product name is too short'}})} />
                                <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="limit" isInvalid={errors.limit?.message}>
                                <FormLabel># of total redemptions allowed:</FormLabel>
                                <Input type="number" placeholder="10" {...register('limit',{ required: { value: true, message: 'Limit is required'},
                                min:{ value: 1, message: 'Number is too low'},max:{ 
                                    value: watchAllFields.dayConstrain ? watchAllFields.interval ==="Weekly" ? 
                                    7 : watchAllFields.interval==="Monthly" ? 31 : 366 : 9999999999, message: 'Number is too high'}})}/>
                                <FormErrorMessage>{errors.limit?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="dayConstrain" >
                                <Checkbox {...register('dayConstrain')} >
                                    Limit customers to one redemption per day
                                </Checkbox>
                            </FormControl>
                            <ImageUploader setPhotoUrl={setPhotoURL}/>
                            {photoError ? <Text fontSize={'sm'} color={'red.500'}>Please upload an image</Text> : null}

                            <ButtonGroup spacing="6">
                                <Button colorScheme="blue" type="submit" onClick={()=>setDraftSave(false)} variant="outline">Publish</Button>
                                <Button type="submit" onClick={()=>setDraftSave(true)} variant="ghost">Save as draft</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant = "outline" onClick={()=>setFormMode(false)}>Back</Button>
                            </ButtonGroup>
                        </Stack>
                    </form>
                </Flex>
                <Flex direction="column" pt={{base:"30px",pxl:"0px"}}>
                    <Heading alignSelf="left" size="lg" mb="20px">
                        Preview
                    </Heading>

                    <Box alignSelf="center" w="sm" mt="20px" borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Image w = "sm" h="3xs" objectFit="cover" src={photoURL} alt="Upload an image"/>

                        <Flex direction="column" p="6">
                            <Flex direction="row" justify="space-between" mb="20px">
                                <Text w="200px" as="b">{displayName}</Text>
                                <VStack spacing="0" alignItems="flex-end">
                                    <Text>${watchAllFields.price ? (Math.round(watchAllFields.price * 100) / 100).toFixed(2) : 19.99}</Text>
                                    <Text>Renews {watchAllFields.interval ? watchAllFields.interval.charAt(0).toUpperCase() +  watchAllFields.interval.slice(1) + "ly": "Weekly"}</Text>
                                </VStack>
                            </Flex>
                            <Text>{watchAllFields.title ? watchAllFields.title: "Morning Brew Subscription"}</Text>
                            <UnorderedList ml="30px">
                                <ListItem>{watchAllFields.dayConstrain ? "1 " : watchAllFields.limit ? watchAllFields.limit+"x " : "10x "}{watchAllFields.content ? watchAllFields.content : "Hot Cappucino"} {watchAllFields.dayConstrain ? " per Day" : ""}</ListItem>
                            </UnorderedList>
                            <Button mt="30px">Purchase Subscription</Button>
                        </Flex>
                    </Box>
                </Flex>
            
        
        </Flex>
    );
}