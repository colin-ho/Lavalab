import { Select } from "@chakra-ui/select";
import React,{ useState } from "react";
import { auth, firestore } from "../lib/firebase";
import ImageUploader from "./ImageUploader";
import Geocode from "react-geocode";
import { Box, Flex, Heading, Stack, Text,HStack} from "@chakra-ui/layout";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { useForm } from "react-hook-form";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Textarea } from "@chakra-ui/textarea";

const geofire = require('geofire-common');
process.env.NEXT_PUBLIC_GOOGLE_API_KEY&&Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export default function BusinessNameForm() {
    const [photoURL,setPhotoURL] = useState(null);
    const [photoError,setPhotoError] = useState(false);
    const { register, handleSubmit, watch,formState: { errors } } = useForm({mode: 'onSubmit' });
    const watchAllFields = watch(); 
    const [address,setAddress] = useState('');
    const [addressError,setAddressError] = useState(false);
    const [showSuggestions,setShowSuggestions] = useState(false);

    const createShop = async ({businessName,description,businessType,email,phone,website}:any) => {
        if(!photoURL){
            setPhotoError(true);
            return;
        } else{
            setPhotoError(false);
        }
        if(!address){
            setAddressError(true);
            return;
        } else{
            setAddressError(false);
        }
  
        const {lat,lng} = (await Geocode.fromAddress(address)).results[0].geometry.location;
        const geohash = geofire.geohashForLocation([lat, lng]);
        // Create refs for both documents
        const businessDoc = firestore.collection('businesses').doc(auth.currentUser?.uid);
        // Commit both docs together as a batch write.
        const batch = firestore.batch();
        batch.set(businessDoc, { businessType: businessType, 
            businessName: businessName, photoURL: photoURL, address: address,
            geohash: geohash,description:description,lat:lat,lng:lng,
            totalPurchases:0,tags:[],phone:phone,email:email,website:website,delay:"0",paused:false,
        closures:[],times:{'mon':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},
        'tue':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},
        'wed':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},
        'thu':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},
        'fri':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},
        'sat':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},
        'sun':{'open':{'hr':0,'min':0},'close':{'hr':0,'min':0}},}
        },{ merge: true });
        await batch.commit();
    };

    const {
        placePredictions,
        getPlacePredictions,
      } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      });
  
    return (
        <Flex direction={{base:"column",pxl:"row"}} p="10" minH={'calc(100vh - 60px)'} >
            <Flex direction="column" w={{base:"100%",pxl:"65%"}} justify="space-around" pr={{base:"30px",pxl:"60px"}}>
                <Heading  size="lg" mb="20px">
                    Set up your shop
                </Heading>
                <form onSubmit={handleSubmit(createShop)}>
                    <Stack spacing="4">
                        <FormControl id="businessName" isInvalid={errors.businessName?.message}>
                            <FormLabel>Business Name: *</FormLabel>
                            <Input placeholder="Morning Brew" type="text" {...register('businessName',{ required: { value: true, message: 'Business name is required'},
                            minLength:{ value: 1, message: 'Name is too short'},maxLength:{ value: 32, message: 'Name is too long'}})} />
                            <FormErrorMessage>{errors.businessName?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="address" isInvalid={addressError}>
                            <FormLabel>Address: *</FormLabel>
                            <Input type="text" value={address} onChange={(evt) => {setAddressError(false);setShowSuggestions(evt.target.value!=='' ? true : false);setAddress(evt.target.value);getPlacePredictions({ input: evt.target.value })}} />
                            <FormErrorMessage>Address is Required</FormErrorMessage>
                        </FormControl>
                            {placePredictions && showSuggestions ? (
                                <Flex direction="column">
                                <>{placePredictions.map((item)=>{ 
                                    return(
                                    <Button mb="10px" key = {item.description} onClick={() => {setShowSuggestions(false);setAddress(item.description)}}>
                                        {item.description}
                                    </Button>
                                    )
                                })}</>
                                </Flex>
                            ):null}
                        <FormControl id="email" isInvalid={errors.email?.message}>
                            <FormLabel>Email: *</FormLabel>
                            <Input placeholder="Email" type="email" {...register('email',{ required: { value: true, message: 'Email is required'},
                            pattern: {value:/^\S+@\S+$/i,message:"Please enter an appropriate email"}})} />
                            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                        </FormControl>
                        <HStack spacing="4" align="flex-start">
                            <FormControl id="phone" isInvalid={errors.phone?.message}>
                                <FormLabel>Phone number: *</FormLabel>
                                <Input placeholder="Phone" type="number" {...register('phone',{ required: {value:true,message:"Phone number is required"},
                                    minLength:{ value: 10, message: 'Phone number is too short'},maxLength:{ value: 10, message: 'Phone number is too long'}})} />
                                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="website" >
                                <FormLabel>Website:</FormLabel>
                                <Input placeholder="Website" type="website" {...register('website',{ required: false})} />
                            </FormControl>
                        </HStack>
                        <FormControl id="businessType" isInvalid={errors.businessType?.message}>
                            <FormLabel>Business Type: *</FormLabel>
                            <Select {...register('businessType',{ required: { value: true, message: 'Business type is required'}})}>
                            <option value="American">American</option>
                            <option value="Boba">Boba</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Burgers">Burgers</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Italian">Italian</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Juice">Juice</option>
                            <option value="Mediterranean">Mediterranean</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Poke">Poke</option>
                            <option value="South American">South American</option>
                            <option value="Thai">Thai</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Mexican">Mexican</option>
                            </Select>
                            <FormErrorMessage>{errors.businessType?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="description" isInvalid={errors.description?.message}>
                            <FormLabel>Description: *</FormLabel>
                            <Textarea placeholder="Serving your favorite hot coffee..." {...register('description',{ required: { value: true, message: 'Description is required'},
                            minLength:{ value: 1, message: 'Description is too short'},maxLength:{ value: 100, message: 'Description is too long'}})} />
                            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                        </FormControl>
                        <ImageUploader setPhotoUrl={setPhotoURL}/>
                        {photoError ? <Text fontSize={'sm'} color={'red.500'}>Please upload an image</Text> : null}

                        <ButtonGroup spacing="6">
                            <Button colorScheme="blue" type="submit" variant="outline">Open Store</Button>
                            <Button onClick={() => auth.signOut()} variant="ghost">Continue later</Button>
                        </ButtonGroup>
                    </Stack>
                </form>
            </Flex>
            <Flex direction="column" pt={{base:"30px",pxl:"0px"}}>
                <Heading alignSelf="left" size="lg" mb="20px">
                    Preview
                </Heading>

                <Box alignSelf="center" w="sm" mt="20px" borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Image w = "sm" h="3xs" objectFit="cover" src={photoURL ? photoURL : 'https://firebasestorage.googleapis.com/v0/b/lavalab-23235.appspot.com/o/uploads%2F8PhXWUO9DTgEqWo7K9i71Y2UKPs2%2F1639988894935.png?alt=media&token=ecbc4b90-2fbd-407c-8d00-3e1004d58dba'} alt="Upload an image"/>

                    <Flex direction="column" align="flex-start" p="6">
                        <Button borderRadius="50px">{watchAllFields.businessType ? watchAllFields.businessType : "American" }</Button>
                        <Heading mt="10px" size="lg">{watchAllFields.businessName ? watchAllFields.businessName : "Morning Brew"}</Heading>
                        <Text fontSize="sm">{watchAllFields.description ? watchAllFields.description: "Serving your favorite hot coffee..."}</Text>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
        
    );
  }