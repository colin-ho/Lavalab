import { Button } from "@chakra-ui/button";
import Image from 'next/image'
import { ArrowForwardIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Heading, VStack, Grid, GridItem, HStack, Text, Box, } from "@chakra-ui/layout";
import { FormControl, FormErrorMessage, Input, Modal, ModalContent, ModalOverlay, IconButton, useDisclosure, useToast, Icon } from "@chakra-ui/react";
import axios from "axios";
import Link from 'next/link';
import { FormEvent, useState } from "react";
import { useSpring, animated } from "react-spring";
import { Contact } from "../components/ContactForm";
import dimsum from "../public/images/dimsum2.jpeg"
import food from '../public/images/food.jpg'
import logo from '../public/images/logo.svg'
import arrow from '../public/icons/icon-arrow-right.svg'
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
                                <Image width="200px" height="50px" src={logo} alt="" />
                            </Link>
                        </Box>
                        <Box flex="1" />
                        <IconButton aria-label='Open drawer' variant="unstyled" size="lg" _focus={{ borderColor: 'none' }} icon={<HamburgerIcon />} onClick={onOpen1} />
                    </HStack>
                    <Box height={{ base: 266, sm: 615, lg: "95vh" }} position="relative">
                        <Image layout="fill" priority={true} objectFit="cover" src={dimsum} alt="" />
                    </Box>
                </GridItem>
                <GridItem colSpan={2} mt={{ sm: "-380px", lg: 0 }} w={{ base: "80%", lg: "100%" }} mx="auto" background="white" position="relative">
                    <VStack alignItems="stretch" h="full">
                        <HStack align={{ sm: 'flex-start', lg: 'center' }} display={{ base: 'none', sm: 'flex' }} px={{ base: 50, lg: "10%" }} pt={{ base: 34, lg: 74 }} w="full" spacing={6}>
                            <Box cursor="pointer">
                                <Link href="/" >
                                    <Image width="200px" height="50px" src={logo} alt="" />
                                </Link>
                            </Box>
                            <Box flex="1" />
                            <Link href="/forMerchants">
                                <Text fontSize="20px" cursor="pointer" display={{ base: 'none', lg: 'inline-block' }}>
                                    For Merchants
                                </Text>
                            </Link>
                            <Text fontSize="20px" display={{ base: 'none', lg: 'inline-block' }} cursor="pointer" onClick={onOpen2}>
                                Contact Us
                            </Text>
                            <IconButton display={{ base: 'block', lg: 'none' }} aria-label='Open drawer' variant="unstyled" _focus={{ borderColor: 'none' }} size="lg" icon={<HamburgerIcon />} onClick={onOpen1} />
                        </HStack>
                        <Box px={{ sm: 50, lg: "10%" }} w="full" pt="5%" >
                            <Heading fontSize={{ base: 37, sm: '45px', lg: '55px', xl: '65px' }} >
                                Subscribe and save to the local businesses you love.
                            </Heading>
                        </Box>
                        <Box w="full" pl={{ sm: 50, lg: "10%" }} pr={{ sm: '20%', lg: "30%" }} pt="40px" >
                            <Text fontSize="20px">
                                Discover new local favorites and support the small businesses you already love.
                            </Text>
                        </Box>
                        <Box pl={{ sm: 50, lg: "10%" }} pr={{ sm: '20%', lg: "40%" }} pt="40px"  >
                            <HStack border="1px solid black" w="fit-content" py="15px" px="40px" spacing="10" cursor="pointer"
                                onClick={onOpen}>
                                <Text fontSize="20px" mr="50px">
                                    Join waitlist
                                </Text>
                                <Image src={arrow} width="25px" height="25px" />
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
            <Box ml={{ sm: "10%", lg: "7%" }} pl={{ lg: "3%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box>
                        <Text fontSize={20}>0&#8202;1</Text>
                    </Box>
                    <Box width="1px" height="40px" background="black" />
                    <Box>
                        <Text fontSize={20}>What to expect</Text>
                    </Box>
                </HStack>
            </Box>
            <Heading position="relative" mx="10%" mt="80px">You deserve the best, for less</Heading>
            <Grid mt="50px" mb={{ base: '100px', sm: '150px', lg: "250px" }} mx="10%" templateColumns={{ base: 'repeat(1,1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3,1fr)' }} gap={20}>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Image src={"/icons/i-save_money.svg"} width="30px" height="30px" />
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Save on your daily purchases</Text>
                        <Text fontSize="20px">All those coffees gets expensive. We can help you save.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Image src={"/icons/i-support_local.svg"} width="30px" height="30px" />
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Support your local businesses</Text>
                        <Text fontSize="20px">Skip the big guys and enjoy top-quality products from your favorite local businesses.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Image src={"/icons/i-local_gems.svg"} width="30px" height="30px" />
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Discover hidden gems</Text>
                        <Text fontSize="20px">We make it easy to discover new local favorites.</Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box >
                        <Text fontSize={20}>0&#8202;2</Text>
                    </Box>
                    <Box width="1px" height="40px" background="black" />
                    <Box >
                        <Text fontSize={20}>How it works</Text>
                    </Box>
                </HStack>
            </Box>
            <Heading mx="10%" mt="80px">Supporting local businesses is as easy as 1, 2, 3</Heading>
            <Grid mt="50px" mb={{ base: '100px', sm: '150px', lg: "250px" }} mx="10%" templateColumns={{ base: 'repeat(1,1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3,1fr)' }} gap={20}>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Image src={"/icons/i-find_subscriptions.svg"} width="30px" height="30px" />
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Find and purchase subscriptions </Text>
                        <Text fontSize="20px">Discover and subscribe to hundrends of local favorites.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Image src={"/icons/i-redeem.svg"} width="30px" height="30px" />
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Redeem your subscription</Text>
                        <Text fontSize="20px">Place your order in our app.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Image src={"/icons/i-enjoy.svg"} width="30px" height="30px" />
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Pick up in-store</Text>
                        <Text fontSize="20px">Enjoy!</Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%", lg: "7%" }} pl={{ lg: "3%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative" zIndex="1">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box >
                        <Text fontSize={20}>0&#8202;3</Text>
                    </Box>
                    <Box width="1px" height="40px" background="black" />
                    <Box >
                        <Text fontSize={20}>Join us</Text>
                    </Box>
                </HStack>
            </Box>
            <Grid mt={{ base: 0, lg: "-80px" }} templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(3, 1fr)' }}>
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
                        <Box w="full" pl={{ sm: 50, lg: 100 }} pr={{ base: "30%", lg: "40%" }} pt="40px" >
                            <Text fontSize="20px">
                                We will be offering significant discounts on our earliest users
                            </Text>
                        </Box>
                        <Box pl={{ sm: 50, lg: 100 }} pr={{ sm: '20%', lg: "40%" }} pt="40px"  >
                            <HStack border="1px solid black" w="fit-content" py="15px" px="40px" spacing="10" cursor="pointer"
                                onClick={onOpen}>
                                <Text fontSize="20px" mr="50px">
                                    Join waitlist
                                </Text>
                                <Image src={arrow} width="25px" height="25px" />
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
                                <Text cursor="pointer" fontSize="20px">
                                    For Merchants
                                </Text>
                            </Link>
                            <Text fontSize="20px" cursor="pointer" onClick={onOpen2}>
                                Contact Us
                            </Text>
                            <Text fontSize="20px">
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
                            <Text cursor="pointer" fontSize="20px">
                                For Merchants
                            </Text>
                        </Link>
                        <Text fontSize="20px" cursor="pointer" onClick={onOpen2}>
                            Contact Us
                        </Text>
                        <Text fontSize="20px">
                            ©2022 Punchcard
                        </Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Waitlist isOpen={isOpen} onClose={onClose} />
            <MobileDrawer isOpen={isOpen1} onClose={onClose1} openContact={onOpen2} isMerchant={false} />
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
                            <Button isLoading={loading} type="submit" variant="ghost" _focus={{ borderColor: 'none' }} rightIcon={<ArrowForwardIcon />}>Submit</Button>
                        </VStack>
                    </form>
                </VStack>
            </ModalContent>
        </Modal>

    )
}