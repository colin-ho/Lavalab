import { Button } from "@chakra-ui/button";
import { ArrowForwardIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import Image from 'next/image'
import { Heading, VStack, Grid, GridItem, HStack, Text, Box } from "@chakra-ui/layout";
import { FormControl, FormErrorMessage, Input, Modal, ModalContent, ModalOverlay, Textarea, useDisclosure, useToast, IconButton } from "@chakra-ui/react";
import axios from "axios";
import Link from 'next/link';
import { FormEvent, useState } from "react";
import { useSpring, animated } from "react-spring";
import { Contact } from "../components/ContactForm";
import barista from '../public/images/barista.jpeg'
import counter from '../public/images/counter.jpeg'
import logo from '../public/images/logo.svg'
import { MobileDrawer } from "../components/MobileDrawer";
import Head from 'next/head'
import arrow from '../public/icons/icon-arrow-right.svg'

export default function ForMerchantsPage() {
    const [{ ml }, set] = useSpring(() => ({ ml: '0%' }));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()

    return (
        <Box>
            <Head>
                <meta name="twitter:description" content="Punchcard is a online subscription marketplace the connects customers to local businesses." key="twitterDescription" />
                <meta property="og:description" content="Punchcard is a online subscription marketplace the connects customers to local businesses." key="description" />
            </Head>
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
                    <Box height={{ base: 266, sm: 615, lg: '95vh' }} position="relative">
                        <Image priority={true} layout="fill" objectFit="cover" src={barista} alt="" />
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
                            <Link href="/">
                                <Text cursor="pointer" fontSize="20px" display={{ base: 'none', lg: 'inline-block' }}>
                                    For Customers
                                </Text>
                            </Link>
                            <Text fontSize="20px" display={{ base: 'none', lg: 'inline-block' }} cursor="pointer" onClick={onOpen2}>
                                Contact Us
                            </Text>
                            <IconButton display={{ base: 'block', lg: 'none' }} aria-label='Open drawer' variant="unstyled" size="lg" _focus={{ borderColor: 'none' }} icon={<HamburgerIcon />} onClick={onOpen1} />
                        </HStack>
                        <Box px={{ sm: 50, lg: "10%" }} w="full" pt="5%" >
                            <Heading fontSize={{ base: 37, sm: '45px', lg: '55px', xl: '65px' }} >
                                Turn customers into regulars in less than 15 minutes.
                            </Heading>
                        </Box>
                        <Box w="full" pl={{ sm: 50, lg: "10%" }} pr={{ sm: '20%', lg: "30%" }} pt="40px" >
                            <Text fontSize="20px">
                                Punchcard is a online subscription marketplace that connects customers to local businesses.
                            </Text>
                        </Box>
                        <Box pl={{ sm: 50, lg: "10%" }} pr={{ sm: '20%', lg: "40%" }} pt="40px"  >
                            <HStack border="1px solid black" w="fit-content" py="15px" px="40px" spacing="10" cursor="pointer"
                                onClick={onOpen}>
                                <Text fontSize="20px" mr="50px">
                                    Start selling
                                </Text>
                                <Image src={arrow} width="25px" height="15px" />
                            </HStack>

                        </Box>
                        {/*
                        <Box w="full" flex="1" >
                            <Box w="70%" mt="60px" p="20px" ml={{ sm: 50, lg: "-15%" }} background="white" cursor="pointer" onMouseEnter={() => set({ ml: '20%' })}
                                onMouseLeave={() => set({ ml: '0%' })} onClick={onOpen}>
                                <HStack justify="space-between">
                                    <animated.p style={{ marginLeft: ml }}>Start selling</animated.p>
                                    <ArrowForwardIcon w={10} h={10} color='black' />
                                </HStack>
                                <Box height="1px" background="black" />
                            </Box>
                        </Box>
                        */}
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%", lg: "7%" }} pl={{ lg: "3%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box >
                        <Text fontSize={20}>0&#8202;1</Text>
                    </Box>
                    <Box width="1px" height="40px" background="black" />
                    <Box >
                        <Text fontSize={20}>What to expect</Text>
                    </Box>
                </HStack>
            </Box>
            <Heading position="relative" mx="10%" mt="80px">We make loyalty easy</Heading>
            <Grid mt="50px" mb={{ base: '100px', sm: '150px', lg: "250px" }} mx="10%" templateColumns={{ base: 'repeat(1,1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3,1fr)' }} gap={20}>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.0&#8202;1</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b" fontSize="20px">Predictable revenue</Text>
                        <Text fontSize="20px">Subscriptions help to create a predictable revenue stream.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.0&#8202;2</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b" fontSize="20px">Build customer relationships</Text>
                        <Text fontSize="20px">Relationships go both ways. Increase your customers’ lifetime value through loyalty rewards.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.0&#8202;3</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b" fontSize="20px">Be discovered</Text>
                        <Text fontSize="20px">Reach new customers and retain the ones your already have.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.0&#8202;4</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b" fontSize="20px">Increase sales</Text>
                        <Text fontSize="20px">Cross sell and upsell opportunities each time a customer redeems a subscription.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.0&#8202;5</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text as="b" fontSize="20px">Analyze product performance</Text>
                        <Text fontSize="20px">We make it easy to analyze product performance.</Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box>
                        <Text fontSize={20}>0&#8202;2</Text>
                    </Box>
                    <Box width="1px" height="40px" background="black" />
                    <Box>
                        <Text fontSize={20}>How it works</Text>
                    </Box>
                </HStack>
            </Box>
            <Heading mx="10%" mt="80px">3 simple steps to securing loyal customers</Heading>
            <Grid mt="50px" mb={{ base: '100px', sm: '150px', lg: "250px" }} mx="10%" templateColumns={{ base: 'repeat(1,1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3,1fr)' }} gap={20}>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.01</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Create a subscription</Text>
                        <Text fontSize="20px">Improve the customer experience by offering more options and added convenience.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.02</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Customers buy and redeem subscriptions</Text>
                        <Text fontSize="20px">Reach new customers and track live redemptions.</Text>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1}>
                    <VStack w="full" alignItems="flex-start" spacing="4">
                        <Text fontSize="20px">.03</Text>
                        <Box height="1px" w="full" background="black" />
                        <Text fontSize="20px" as="b">Complete the sale</Text>
                        <Text fontSize="20px">Process orders and analyze sales performance.</Text>
                    </VStack>
                </GridItem>
            </Grid>
            <Box ml={{ sm: "10%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box >
                        <Text fontSize={20}>0&#8202;3</Text>
                    </Box>
                    <Box width="1px" height="40px" background="black" />
                    <Box>
                        <Text fontSize={20}>Pricing</Text>
                    </Box>
                </HStack>
            </Box>
            <VStack mt="80px" align="flex-start" px="10%" mb={{ base: '100px', sm: '150px', lg: "250px" }}>
                <Heading flex="1" >Your success is our success</Heading>
                <VStack align="flex-start" w="full">
                    <Text fontSize="20px" mt="50px" >.0&#8202;1</Text>
                    <Box height="1px" w="full" background="black" />
                    <Text fontSize="20px">We charge 7.9% + $0.30 per purchased subscription purchased. No sign up fee, usuage fees, or hidden fees.</Text>
                </VStack>
            </VStack>

            <Box ml={{ sm: "10%", lg: "7%" }} pl={{ lg: "3%" }} py="20px" mt={{ base: 50, sm: "80px", lg: "-80px" }} background="white" position="relative" zIndex="1">
                <Box height="1px" background="black" />
                <HStack spacing="12" ml={{ base: 10, sm: 0 }}>
                    <Box >
                        <Text fontSize={20}>0&#8202;4</Text>
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
                        <Image layout="fill" objectFit='cover' src={counter} alt="" />
                    </Box>
                </GridItem>
                <GridItem colSpan={2} w={{ base: "80%", lg: "100%" }} mx="auto" position="relative" background="white">
                    <VStack alignItems="stretch" h="full">
                        <Box px={{ sm: 50, lg: 100 }} w="full" pt={{ base: 30, lg: 150 }} >
                            <Heading fontSize='38px' >
                                Become a merchant
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
                                    Start selling
                                </Text>
                                <Image src={arrow} width="25px" height="15px" />
                            </HStack>
                        </Box>
                        {/*
                        <Box w="full"  >
                            <Box w="70%" mt={{ base: "10px", lg: 30 }} p="20px" ml={{ sm: 50, lg: "-15%" }} background="white" cursor="pointer" onMouseEnter={() => set({ ml: '20%' })}
                                onMouseLeave={() => set({ ml: '0%' })} onClick={onOpen}>
                                <HStack justify="space-between">
                                    <animated.p style={{ marginLeft: ml }}>Start selling</animated.p>
                                    <ArrowForwardIcon w={10} h={10} color='black' />
                                </HStack>
                                <Box height="1px" background="black" />
                            </Box>
                        </Box>
                        */}
                        <HStack display={{ base: 'none', sm: 'flex' }} pb="50px" pt={{ base: "50px", lg: 100 }} px="100px" w="full" justify="flex-end" spacing={8}>
                            <Link href="/">
                                <Text fontSize="20px" cursor="pointer">
                                    For Customers
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
                        <Image layout="fill" objectFit='cover' src={counter} alt="" />
                    </Box>
                    <VStack align="flex-end" py={4} pr={8} spacing={4} display={{ base: 'flex', sm: 'none' }}>
                        <Link href="/">
                            <Text fontSize="20px" cursor="pointer">
                                For Customers
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
            <MerchantWaitList isOpen={isOpen} onClose={onClose} />
            <MobileDrawer isOpen={isOpen1} onClose={onClose1} openContact={onOpen2} isMerchant={true} />
            <Contact isOpen={isOpen2} onClose={onClose2} />
        </Box>
    );
}

interface MerchantWaitListProps {
    isOpen: boolean,
    onClose: () => void
}

function MerchantWaitList({ isOpen, onClose }: MerchantWaitListProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [companyNameError, setCompanyNameError] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name) setNameError(true)
        else if (!email) {
            setNameError(false)
            setEmailError(true)
        }
        else if (!companyName) {
            setNameError(false)
            setEmailError(false)
            setCompanyNameError(true)
        }
        else {
            setNameError(false)
            setEmailError(false)
            setCompanyNameError(false)
            setLoading(true)
            try {
                await axios.post('https://sheet.best/api/sheets/c8b913e2-b28d-421e-9d5c-51e379d050ad', {
                    Date: (new Date()).toDateString(),
                    Name: name,
                    CompanyName: companyName,
                    Email: email,
                    Message: message,
                })
                setLoading(false)
                toast({
                    title: 'Form received',
                    description: "We will be in contact with you shortly!",
                    status: 'success',
                    position: 'top',
                    duration: 4000,
                    isClosable: true,
                })
                setName('')
                setEmail('')
                setMessage('')
                setCompanyName('')
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
            <ModalContent py="8" px="12" borderRadius="none" mx="4">
                <VStack spacing="8" alignItems="flex-start">
                    <HStack w="full" justify="flex-end">
                        <IconButton aria-label='Close form' variant="unstyled" _focus={{ borderColor: 'none' }} icon={<CloseIcon />} onClick={onClose} />
                    </HStack>
                    <Heading>Become a merchant</Heading>
                    <Text>Please fill out the form below and a Punchcard representative will be in touch with you soon.</Text>
                    <form style={{ width: "100%" }} onSubmit={(e) => handleSubmit(e)}>
                        <VStack align="flex-end" w="full" spacing="4">
                            <FormControl isInvalid={nameError}>
                                <FormErrorMessage>Name cannot be empty</FormErrorMessage>
                                <Input placeholder="Name*" type="text" value={name} onChange={(e) => setName(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <FormControl isInvalid={companyNameError}>
                                <FormErrorMessage>Company name cannot be empty</FormErrorMessage>
                                <Input placeholder="Company Name*" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <FormControl isInvalid={emailError}>
                                <FormErrorMessage>Email cannot be empty</FormErrorMessage>
                                <Input placeholder="Email*" type="email" value={email} onChange={(e) => setEmail(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <FormControl>
                                <Textarea placeholder="Message" type="text" value={message} onChange={(e) => setMessage(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <Button isLoading={loading} type="submit" variant="ghost" _focus={{ borderColor: 'none' }} rightIcon={<ArrowForwardIcon />}>Submit</Button>
                        </VStack>
                    </form>
                </VStack>
            </ModalContent>
        </Modal>

    )
}

