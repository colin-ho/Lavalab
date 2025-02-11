import { auth, firestore, googleAuthProvider, serverTimestamp } from '../lib/firebase';
import { AuthContext, AuthContextInterface } from '../lib/context';
import { useEffect, useState, useContext, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BusinessNameForm from '../components/BusinessNameForm';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
    FormErrorMessage, Flex, Box, FormControl, FormLabel, Image, Input, VStack, Stack, Link, Button, Heading, Text, useColorModeValue,
} from '@chakra-ui/react';
import { HStack } from '@chakra-ui/layout';

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.


export default function BusinessLogin() {
    const { business } = useContext<AuthContextInterface>(AuthContext);
    const [isSignIn, setIsSignIn] = useState<boolean>(true);

    return (

        business ? business.businessName ? <SignOutButton businessName={business.businessName} /> :
            <BusinessNameForm /> : (isSignIn ? <SignInForm setIsSignIn={setIsSignIn}  />
                : <SignUpForm setIsSignIn={setIsSignIn} />)
    );
}

const signInSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

const signUpSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).required(),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Password confirmation is required.')
});

// Sign in with Google button
function SignInForm({ setIsSignIn}: { setIsSignIn: Dispatch<SetStateAction<boolean>>}) {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInSchema),
    });

    const onGoogleSubmit = async () => {
        try {
            await auth.signInWithPopup(googleAuthProvider);
            const businessDoc = firestore.collection('businesses').doc(auth.currentUser?.uid);
            const { exists } = await businessDoc.get();
            if (!exists) {
                businessDoc.set({ uid: auth.currentUser?.uid, joined: serverTimestamp() });
            }
        } catch (err) {
            console.log(err)
        }
    };

    interface onEmailSubmitProps {
        email: string,
        password: string
    }

    const onEmailSubmit = async ({ email, password }: onEmailSubmitProps) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const exists = (await firestore.collection('businesses').doc(userCredential.user.uid).get()).exists
            if(!exists){
                auth.signOut();
                throw new Error("");
            }
        }
        catch (err) {
            console.log(err)
            setErrorMessage("Incorrect username or password")
        }
    }

    return (
        <Flex
            minH={'100vh'}
            justify={'center'}
            bg={'gray.50'}
        >
            <Stack spacing={8} mx={'auto'} w={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}>Sign in to your account</Heading>
                    <Text fontSize={'ls'} color={'gray.600'}>
                        to start managing subscriptions ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'white'}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={handleSubmit(onEmailSubmit)}>
                            <Stack spacing={5}>
                                <FormControl id="email" isInvalid={errors.email?.message}>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" {...register("email")} />
                                    <FormErrorMessage>{errors.email?.message.charAt(0).toUpperCase() + errors.email?.message.slice(1)}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="password" isInvalid={errors.password?.message}>
                                    <FormLabel>Password</FormLabel>
                                    <Input {...register("password")} type="password" />
                                    <FormErrorMessage>{errors.password?.message.charAt(0).toUpperCase() + errors.password?.message.slice(1)}</FormErrorMessage>
                                </FormControl>
                            </Stack>
                            <Stack spacing={5} mt={5}>
                                <Stack
                                    direction={'column'}
                                    align={'end'}>
                                    <Link color={'blue.400'} onClick={() => setIsSignIn(false)}>Create an account</Link>
                                </Stack>
                                {errorMessage ? <Text fontSize={'sm'} color={'red.500'}>{errorMessage}</Text> : null}
                                <Button boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)"
                                    bg={'black'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'black',
                                    }} type="submit">
                                    Sign in
                                </Button>
                            </Stack>
                        </form>
                        <Button variant="ghost" onClick={onGoogleSubmit}>
                            <HStack>
                                <Image src={'/icons/google.png'} alt="" width="30px" />
                                <Text>Sign in with Google</Text>
                            </HStack>
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

// Sign out button
function SignOutButton({ businessName }: { businessName: string }) {
    const router = useRouter();
    return (
        <div>
            <Flex
                minH={'100vh'}
                justify={'center'}
                bg={'gray.50'}>
                <Stack spacing={8} mx={'auto'} w={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading textAlign="center" fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}>Welcome back {businessName}</Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            Head over to your dashboard to get started ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        p={8}
                    >
                        <VStack spacing={6} >
                            <Box p={4} style={{ boxShadow: "0px 5px 30px rgba(0, 0, 0, 0.07)" }} w="100%" textAlign="center"
                                borderRadius="5px" cursor="pointer" backgroundColor="black" color="white"
                                onClick={() => router.push(`/dashboard`)}>Go to Dashboard</Box >
                            <Box p={4} style={{ boxShadow: "0px 5px 30px rgba(0, 0, 0, 0.07)" }} w="100%" textAlign="center"
                                borderRadius="5px" cursor="pointer"
                                onClick={() => auth.signOut()}>Sign Out</Box >
                        </VStack>
                    </Box>
                </Stack>
            </Flex>

        </div>
    );
}

function SignUpForm({ setIsSignIn }: { setIsSignIn: Dispatch<SetStateAction<boolean>> }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(signUpSchema),
    });
    const [errorMessage, setErrorMessage] = useState(null)

    interface handleSignupProps {
        email: string,
        password: string
    }

    const handleSignup = async ({ email, password }: handleSignupProps) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            setErrorMessage(null)
        }
        catch (err: any) {
            console.log(err)
            setErrorMessage(err.message)
        }

        if (auth.currentUser) {
            const businessDoc = firestore.doc(`businesses/${auth.currentUser.uid}`);
            const { exists } = await businessDoc.get();
            if (!exists) {
                // Commit both docs together as a batch write.
                businessDoc.set({ uid: auth.currentUser.uid, joined: serverTimestamp() });
                setIsSignIn(true);
            }
        }

    };

    return (
        <Flex
            minH={'100vh'}
            justify={'center'}
            bg={'gray.50'}>
            <Stack spacing={8} mx={'auto'} w={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}>Create a business account</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to start selling subscriptions ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'white'}
                    boxShadow={'lg'}
                    p={8}>
                    <form onSubmit={handleSubmit(handleSignup)}>
                        <Stack spacing={5}>
                            <FormControl id="email" isInvalid={errors.email?.message}>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" {...register("email")} />
                                <FormErrorMessage>{errors.email?.message.charAt(0).toUpperCase() + errors.email?.message.slice(1)}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="password" isInvalid={errors.password?.message}>
                                <FormLabel>Password</FormLabel>
                                <Input {...register("password")} type="password" />
                                <FormErrorMessage>{errors.password?.message.charAt(0).toUpperCase() + errors.password?.message.slice(1)}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="confirmPassword" isInvalid={errors.confirmPassword?.message}>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input {...register("confirmPassword")} type="password" />
                                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
                            </FormControl>
                            <Stack spacing={5} mt={5}>
                                <Stack
                                    direction={'column'}
                                    align={'end'}>
                                    <Link color={'blue.400'} onClick={() => setIsSignIn(true)}>Already have an account?</Link>
                                </Stack>
                                {errorMessage ? <Text fontSize={'sm'} color={'red.500'}>{errorMessage}</Text> : null}
                                <Button
                                    bg={'black'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'black',
                                    }} type="submit">
                                    Sign up
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}



