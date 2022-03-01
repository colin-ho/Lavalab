import { Button } from "@chakra-ui/button";
import Image from 'next/image'
import { ArrowForwardIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Heading, VStack, Grid, GridItem, HStack, Text, Box, } from "@chakra-ui/layout";
import { FormControl, FormErrorMessage, Input, Modal, ModalContent, ModalOverlay, IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import Link from 'next/link';
import { FormEvent, useState } from "react";
import { useSpring, animated } from "react-spring";
import { Contact } from "../components/ContactForm";
import dimsum from "../public/dimsum2.jpeg"
import food from '../public/food.jpg'
import logo from '../public/punch-card-logo 1.svg'
import { MobileDrawer } from "../components/MobileDrawer";

export default function Home() {
    const [{ ml }, set] = useSpring(() => ({ ml: '0%' }));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()

    return (
        <Box>
            <Grid templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(3, 1fr)' }} >
                <GridItem colSpan={1}>
                    <HStack align="flex-start" display={{ base: 'flex', sm: 'none' }} px="50" pt="5" pb="3" w="full" spacing={6}>
                        <Box cursor="pointer">
                            <Link href="/" >
                                <Image width="165px" height="50px" src={logo} alt="" />
                            </Link>
                        </Box>
                        <Box flex="1" />
                        <IconButton  aria-label='Open drawer' variant="unstyled" size="lg"  _focus={{ borderColor: 'none' }} icon={<HamburgerIcon />} onClick={onOpen1} />
                    </HStack>
                    <Box height={{ base: 266, sm: 615, lg: "100vh" }} position="relative">
                        <Image layout="fill" priority={true} objectFit="cover" src={dimsum} alt="" />
                    </Box>
                </GridItem>
                <GridItem colSpan={2} mt={{ sm: "-380px", lg: 0 }} w={{ base: "80%", lg: "100%" }} mx="auto" background="white" position="relative">
                    <VStack alignItems="stretch" h="full">
                        <HStack align={{ sm: 'flex-end', lg: 'flex-start' }} display={{ base: 'none', sm: 'flex' }} px={{ base: 50, lg: 100 }} pt={{ base: 34, lg: 74 }} w="full" spacing={6}>
                            <Box cursor="pointer">
                                <Link href="/" >
                                    <Image width="165px" height="30px" src={logo} alt="" />
                                </Link>
                            </Box>
                            <Box flex="1" />
                            <Link href="/forMerchants">
                                <Text cursor="pointer" display={{ base: 'none', lg: 'inline-block' }}>
                                    For Merchants
                                </Text>
                            </Link>
                            <Text display={{ base: 'none', lg: 'inline-block' }} cursor="pointer" onClick={onOpen2}>
                                Contact Us
                            </Text>
                            <IconButton display={{ base: 'block', lg: 'none' }} aria-label='Open drawer' variant="unstyled" _focus={{ borderColor: 'none' }} size="lg" icon={<HamburgerIcon />} onClick={onOpen1} />
                        </HStack>
                        <Box px={{ sm: 50, lg: 100 }} w="full" pt="10%" >
                            <Heading fontSize={{ base: 37, sm: '45px', lg: '55px', xl: '65px' }} >
                                Subscribe and save to the local businesses you love. No fees.
                            </Heading>
                        </Box>
                        <Box w="full" pl={{ sm: 50, lg: 100 }} pr={{ sm: '20%', lg: "40%" }} pt="40px" >
                            <Text fontSize="20px">
                                Discover new local favorites and support the small businesses you already love.
                            </Text>
                        </Box>
                        <Box pl={{ sm: 50, lg: 100 }} pr={{ sm: '20%', lg: "40%" }} pt="40px"  >
                            <HStack border="1px solid black" w="fit-content" py="5px" px="30px" spacing="10" cursor="pointer"
                                onClick={onOpen}>
                                <Text fontSize="20px">
                                    Join waitlist
                                </Text>
                                <ArrowForwardIcon w={10} h={10} color='black' />
                            </HStack>

                        </Box>
                        {/*
                        <Box w="full" flex="1" >
                            <Box w="70%" mt="60px" p="20px" ml={{ sm: 50, lg: "-15%" }} background="white" cursor="pointer" onMouseEnter={() => set({ ml: '20%' })}
                                onMouseLeave={() => set({ ml: '0%' })} onClick={onOpen}>
                                <HStack justify="space-between">
                                    <animated.p style={{ marginLeft: ml }}>Join our waitlist</animated.p>
                                    <ArrowForwardIcon w={10} h={10} color='black' />
                                </HStack>
                                <Box height="1px" background="black" />
                            </Box>
                        </Box>*/}
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%", lg: "7%" }} pl={{ lg: "3%" }} py="30px" mt={{ base: 50, sm: "80px", lg: -110 }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box pt="20px">
                        <Text fontSize={20}>0&#8202;1</Text>
                    </Box>
                    <Box width="1px" height="50px" background="black" />
                    <Box pt="20px">
                        <Text fontSize={20}>What to expect</Text>
                    </Box>
                </HStack>
            </Box>
            <Heading position="relative" ml="10%" mt="80px">What to expect</Heading>
            <Grid mt="50px" mb={{ base: '100px', sm: '150px', lg: "250px" }} mx="10%" templateColumns={{ base: 'repeat(1,1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3,1fr)' }} gap={20}>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text>.0&#8202;1</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b">Save on your daily purchases</Text>
                        <Text>All those coffees gets expensive. We can help you save.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text>.0&#8202;2</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b">Support your local businesses</Text>
                        <Text>Skip the big guys and enjoy top-quality products from your favorite local businesses.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text>.0&#8202;3</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b">Discover hidden gems</Text>
                        <Text>We make it easy to discover new local favorites.</Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%" }} py="30px" mt={{ base: 50, sm: "80px", lg: -110 }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box pt="20px">
                        <Text fontSize={20}>0&#8202;2</Text>
                    </Box>
                    <Box width="1px" height="50px" background="black" />
                    <Box pt="20px">
                        <Text fontSize={20}>How it works</Text>
                    </Box>
                </HStack>
            </Box>
            <Heading ml="10%" mt="80px">How it works</Heading>
            <Grid mt="50px" mb={{ base: '100px', sm: '150px', lg: "250px" }} mx="10%" templateColumns={{ base: 'repeat(1,1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3,1fr)' }} gap={20}>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text>.01</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b">Find and purchase subscriptions </Text>
                        <Text>Discover and subscribe to hundrends of local favorites.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text>.02</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b">Redeem your subscription</Text>
                        <Text>Place your order in our app.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-" spacing="4">
                        <Text>.03</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b">Pick up in-store</Text>
                        <Text>Enjoy!</Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%", lg: "7%" }} pl={{ lg: "3%" }} py="30px" mt={{ base: 50, sm: "80px", lg: -110 }} background="white" position="relative" zIndex="1">
                <Box height="1px" background="black" />
                <HStack spacing="12"  ml={{ base: 10, sm: 0 }}>
                    <Box pt="20px">
                        <Text fontSize={20}>0&#8202;3</Text>
                    </Box>
                    <Box width="1px" height="50px" background="black" />
                    <Box pt="20px">
                        <Text fontSize={20}>Join us</Text>
                    </Box>
                </HStack>
            </Box>
            <Grid mt={{ base: 0, lg: -110 }} templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(3, 1fr)' }}>
                <GridItem colSpan={1} display={{ base: 'none', lg: 'block' }}>
                    <Box height="615px" position="relative">
                        <Image layout="fill" objectFit='cover' src={food} alt="" />
                    </Box>
                </GridItem>
                <GridItem colSpan={2} w={{ base: "80%", lg: "100%" }} mx="auto" position="relative" background="white">
                    <VStack alignItems="stretch" h="full">
                        <Box px={{ sm: 50, lg: 100 }} w="full" pt={{ base: 30, lg: 150 }} >
                            <Heading fontSize='38px' >
                                Be the first to know
                            </Heading>
                        </Box>
                        <Box w="full" pl={{ sm: 50, lg: 100 }} pr={{ base: "10%", lg: "40%" }} pt="40px" >
                            <Text fontSize="20px">
                                We will be offering significant discounts on our earliest users
                            </Text>
                        </Box>
                        <Box pl={{ sm: 50, lg: 100 }} pr={{ sm: '20%', lg: "40%" }} pt="40px"  >
                            <HStack border="1px solid black" w="fit-content" py="5px" px="30px" spacing="10" cursor="pointer"
                                onClick={onOpen}>
                                <Text fontSize="20px">
                                    Join waitlist
                                </Text>
                                <ArrowForwardIcon w={10} h={10} color='black' />
                            </HStack>

                        </Box>
                        {/*
                        <Box w="full"  >
                            <Box w="70%" mt={{ base: "10px", lg: 30 }} p="20px" ml={{ sm: 50, lg: "-15%" }} background="white" cursor="pointer" onMouseEnter={() => set({ ml: '20%' })}
                                onMouseLeave={() => set({ ml: '0%' })} onClick={onOpen}>
                                <HStack justify="space-between">
                                    <animated.p style={{ marginLeft: ml }}>Join our waitlist</animated.p>
                                    <ArrowForwardIcon w={10} h={10} color='black' />
                                </HStack>
                                <Box height="1px" background="black" />
                            </Box>
                        </Box>
                        */}
                        <HStack display={{ base: 'none', sm: 'flex' }} pb="50px" pt={{ base: "50px", lg: 100 }} px="100px" w="full" justify="flex-end" spacing={8}>
                            <Link href="/forMerchants">
                                <Text cursor="pointer">
                                    For Merchants
                                </Text>
                            </Link>
                            <Text cursor="pointer" onClick={onOpen2}>
                                Contact Us
                            </Text>
                            <Text>
                                ©2022 Punchcard
                            </Text>
                        </HStack>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1} display={{ base: 'block', lg: 'none' }} mt={{ sm: "-400px", lg: 0 }}>
                    <Box mt={{ base: "30px", sm: 0 }} height={{ base: "300px", sm: "670px" }} position="relative" zIndex="-1">
                        <Image layout="fill" objectFit='cover' src={food} alt="" />
                    </Box>
                    <VStack align="flex-end" py={4} px={8} spacing={4} display={{ base: 'flex', sm: 'none' }}>
                        <Link href="/forMerchants">
                            <Text cursor="pointer">
                                For Merchants
                            </Text>
                        </Link>
                        <Text cursor="pointer" onClick={onOpen2}>
                            Contact Us
                        </Text>
                        <Text>
                            ©2022 Punchcard
                        </Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Waitlist isOpen={isOpen} onClose={onClose} />
            <MobileDrawer isOpen={isOpen1} onClose={onClose1} openContact={onOpen2} isMerchant={false}/>
            <Contact isOpen={isOpen2} onClose={onClose2} />
        </Box>
    );
}

interface WaitlistProps {
    isOpen: boolean,
    onClose: () => void,
}

function Waitlist({ isOpen, onClose }: WaitlistProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name) setNameError(true)
        else if (!email) {
            setNameError(false)
            setEmailError(true)
        }
        else {
            setNameError(false)
            setEmailError(false)
            setLoading(true)
            try {
                await axios.post('https://sheet.best/api/sheets/de3ff418-bff0-495e-872f-e5182eacb8dd', {
                    Date: (new Date()).toDateString(),
                    Name: name,
                    Email: email
                })
                setLoading(false)
                toast({
                    title: 'Added to waitlist',
                    description: "Get ready to start punching!",
                    status: 'success',
                    position: 'top',
                    duration: 4000,
                    isClosable: true,
                })
                setName('')
                setEmail('')
                onClose()
            } catch (err) {
                setLoading(false)
                alert('Error in submitting')
                console.log(err)
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent py="8" px="12" mx="4" borderRadius="none">
                <VStack spacing="8" alignItems="flex-start">
                    <HStack w="full" justify="flex-end">
                        <IconButton aria-label='Close form' variant="unstyled" _focus={{ borderColor: 'none' }} icon={<CloseIcon />} onClick={onClose} />
                    </HStack>
                    <Heading>Join our waitlist</Heading>
                    <Text>Get first access to our platform, special deals, and limited time offers.</Text>
                    <form style={{ width: "100%" }} onSubmit={(e) => handleSubmit(e)}>
                        <VStack align="flex-end" w="full" spacing="4">
                            <FormControl isInvalid={nameError}>
                                <FormErrorMessage>Name cannot be empty</FormErrorMessage>
                                <Input placeholder="Name*" type="text" value={name} onChange={(e) => setName(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <FormControl isInvalid={emailError}>
                                <FormErrorMessage>Email cannot be empty</FormErrorMessage>
                                <Input placeholder="Email*" type="email" value={email} onChange={(e) => setEmail(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <Button isLoading={loading} type="submit" variant="unstyled" _focus={{ borderColor: 'none' }} rightIcon={<ArrowForwardIcon />}>Submit</Button>
                        </VStack>
                    </form>
                </VStack>
            </ModalContent>
        </Modal>

    )
}