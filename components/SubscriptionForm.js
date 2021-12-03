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
import { AiOutlineLeft } from 'react-icons/ai';
import { AuthContext } from '../lib/context';
import { auth, firestore, serverTimestamp } from '../lib/firebase';
import ImageUploader from './ImageUploader';

export default function SubscriptionForm({ editableSub,setFormMode }) {
    const{displayName,businessType} = useContext(AuthContext);
    const subscription = !editableSub ? {title:'',price:'',content:'',interval:'week',limit:'',dayConstrain:false,description:''} : {title:editableSub.title,price:editableSub.price,content:editableSub.content,interval:editableSub.interval,limit:editableSub.limit,dayConstrain:editableSub.dayConstrain,description:editableSub.description};
    const { register, watch,handleSubmit, formState: { errors } } = useForm({ defaultValues:subscription, mode: 'onSubmit' });
    const initialPhoto = editableSub ? editableSub.photoURL : 'https://firebasestorage.googleapis.com/v0/b/lavalab-23235.appspot.com/o/uploads%2FUATxA2cmfsWO8USvKGoIvnEFZrd2%2F1638431282434.jpeg?alt=media&token=f1f758d9-0619-430a-be81-19f02c856452';
    const watchAllFields = watch(); 
    const [photoURL,setPhotoURL] = useState(initialPhoto);
    const [photoError,setPhotoError] = useState(false);
    const [draftSave,setDraftSave] = useState(false);

    const submitSubscription = async ({title,content,price,interval,limit,dayConstrain,description})=>{
        if(photoURL=='https://firebasestorage.googleapis.com/v0/b/lavalab-23235.appspot.com/o/uploads%2FUATxA2cmfsWO8USvKGoIvnEFZrd2%2F1638431282434.jpeg?alt=media&token=f1f758d9-0619-430a-be81-19f02c856452'){
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
            businessType:businessType,
            description:description,
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
            setFormMode(false);
        } else{
            const ref = await firestore.collection('businesses').doc(uid).collection('subscriptions').add(data);
            await ref.update({id:ref.id})
            toast.success(draftSave ? 'Subscription draft created successfully!' : 'Subscription published successfully!')
            setFormMode(false);
        }
    }
        

    return (
            <Flex direction={{base:"column",pxl:"row"}} >
                <Flex direction="column" w={{base:"100%",pxl:"65%"}} justify="space-around" pr={{base:"30px",pxl:"60px"}}>
                    <Heading  size="lg" mb="10px"> Subscriptions</Heading>
                    <HStack>
                        <AiOutlineLeft cursor="pointer" onClick={()=>setFormMode(false)}/> 
                        <Text>Create new subscriptions or manage existing ones</Text>
                    </HStack>
                    <form onSubmit={handleSubmit(submitSubscription)}>
                        
                        <Stack mt="20px" borderRadius="2xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" p="6" spacing="5">
                        <Heading  size="md" >Editor</Heading>
                            <FormControl id="title" isInvalid={errors.title?.message}>
                                <FormLabel>Title</FormLabel>
                                <Input placeholder="Morning Brew Subscription" type="text" {...register('title',{ required: { value: true, message: 'Subscription name is required'},
                                minLength:{ value: 5, message: 'Name is too short'},maxLength:{ value: 32, message: 'Name is too long'}})} />
                                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                            </FormControl>
                            <HStack spacing="10">
                                <FormControl h="100px" id="price" isInvalid={errors.price?.message}>
                                    <FormLabel >Subscription Price</FormLabel>
                                    <Input type="number" placeholder="19.99"{...register('price',{ required: { value: true, message: 'Price is required'},min:{ value: 1, message: 'Price is too low'}})}/>
                                    <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl h="100px" id="interval" isInvalid={errors.interval?.message}>
                                    <FormLabel>Renewal Cycle</FormLabel>
                                    <Select {...register('interval',{ required: { value: true, message: 'Renewal frequency is required'}})}>
                                        <option value="week">Weekly</option>
                                        <option value="month">Monthly</option>
                                        <option value="year">Yearly</option>
                                    </Select>
                                    <FormErrorMessage>{errors.interval?.message}</FormErrorMessage>
                                </FormControl>
                            </HStack>
                            <FormControl id="content" isInvalid={errors.content?.message}>
                                <FormLabel>Product name</FormLabel>
                                <Input type="text" placeholder="Hot Cappucino" {...register('content',{ required: { value: true, message: 'Product is required'},
                                minLength:{ value: 1, message: 'Product name is too short'}})} />
                                <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="description" isInvalid={errors.description?.message}>
                                <FormLabel>Description</FormLabel>
                                <Input type="text" placeholder="Delicious hot coffee everyday" {...register('description',{ required: { value: true, message: 'Description is required'},
                                minLength:{ value: 1, message: 'Description is too short'},maxLength:{ value: 80, message: 'Description is too long'}})} />
                                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="limit" isInvalid={errors.limit?.message}>
                                <FormLabel>Quantity redeemable</FormLabel>
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
                                <Button colorScheme="black" type="submit" onClick={()=>setDraftSave(false)} variant="outline">Publish</Button>
                                <Button colorScheme="black" type="submit" onClick={()=>setDraftSave(true)} variant="ghost">Save as draft</Button>
                                <Text w = "50%" fontSize="xs">Once you publish your subscription, you will not be able to edit it. Instead, you can archive the subscription, which would remove it from our app.</Text>
                            </ButtonGroup>
                        </Stack>
                    </form>
                </Flex>
                <Flex direction="column" pt={{base:"30px",pxl:"0px"}}>
                    <Box  boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" alignSelf="center" w="sm" p="6" mt="90px" borderRadius="xl"  >
                    <Heading  size="md" mb="10px">Preview</Heading>
                        <Box mt="20px" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" borderRadius="xl" overflow="hidden">
                        <Image w = "sm" h="150px" objectFit="cover" src={photoURL} alt="Upload an image"/>
                        <Flex direction="column" p="4" mb="20px">
                            <Text fontWeight="600">{watchAllFields.title ? watchAllFields.title: "Morning Brew Subscription"}{" from "+displayName}</Text>
                            <Text >{watchAllFields.limit ? watchAllFields.limit : "7"} {watchAllFields.content ? watchAllFields.content : "Coffee"} for {watchAllFields.price ? "$"+watchAllFields.price : "$21"}{watchAllFields.interval ? "/"+watchAllFields.interval :"/Week"}</Text>
                        </Flex>
                        </Box>
                        <Box boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" alignSelf="center" h="auto" mt="20px" borderRadius="xl"  >
                            <Flex direction="column" p="4" >
                            <Text fontWeight="600">{"What's included"}</Text>
                            <Text >{watchAllFields.description ? watchAllFields.description : "Our classic iced americano brewed to perfection" }</Text>
                            </Flex>
                        </Box>
                        <Box boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" alignSelf="center" h="auto" mt="20px" borderRadius="xl"  >
                            <Flex direction="column" p="4" >
                            <Text fontWeight="600">Terms and restrictions</Text>
                            {watchAllFields.dayConstrain ? <Text >Limited to 1 redemption per day</Text>:null}
                            <Text>Cannot be combined with other offers, promotions, sales, or coupons</Text>
                            </Flex>
                        </Box>
                        <Button mt="20px" w="full" color={'white'} bg={'black'} _hover={{bg: 'black'}} onClick={()=>setFormMode(false)}>Purchase</Button>
                    </Box>
                </Flex>
        </Flex>
    );
}