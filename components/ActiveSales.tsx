import { Box, Circle, Flex, Grid, Heading, Spacer, Text, VStack, HStack } from '@chakra-ui/layout';
import { Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Slide } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { Button, IconButton } from '@chakra-ui/button';
import { arrayRemove, arrayUnion, firestore } from '../lib/firebase';
import { useDisclosure } from '@chakra-ui/hooks';
import { StringOrNumber } from '@chakra-ui/utils';

interface ActiveSalesProps {
    businessName: string,
    subscriptions: firebase.default.firestore.DocumentData[],
    redemptions: firebase.default.firestore.DocumentData[],
    open: boolean,
    delay: string,
}

export default function ActiveSales({ businessName, subscriptions, redemptions, open, delay }: ActiveSalesProps) {
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [readyCount, setReadyCount] = useState(0);

    useEffect(() => {
        setInProgressCount(0);
        setNewOrderCount(0);
        setReadyCount(0);
        redemptions.map((r: firebase.default.firestore.DocumentData) => {
            if (!r.confirmed) setNewOrderCount(newOrderCount => newOrderCount + 1);
            else if (!r.ready) setInProgressCount(inProgressCount => inProgressCount + 1);
            else if (r.ready && !r.collected) setReadyCount(readyCount => readyCount + 1);
        })
    }, [redemptions]);


    return (
        <Flex direction="column" align="flex-start">
            <Heading size="lg" mb="10px"> Active Sales Overview</Heading>
            <Text>{businessName} is currently<b> {!open ? ' closed' : ' open and accepting redemptions'}
                {open && (parseInt(delay) > 0) ? ` with ${delay} min delay` : null}</b></Text>

            <Flex marginTop="30px" h="150px" w="100%" direction="row">
                <Flex p="20px" alignItems="flex-start" direction="column" borderRadius="20px" w="32%" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" bg={'#fff'}>
                    <Text borderRadius="5px" fontWeight="500" bg={"brand.200"} px="2" >Received Orders</Text>
                    <Text mt="5px" as="b" flex="1">Needs confirmation</Text>
                    <Text fontSize="3xl">{newOrderCount}</Text>
                </Flex>
                <Spacer />
                <Flex p="20px" alignItems="flex-start" direction="column" borderRadius="20px" w="32%" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" bg={'#fff'}>
                    <Text borderRadius="5px" fontWeight="500" bg={"brand.400"} px="2">In Progress</Text>
                    <Text mt="5px" as="b" flex="1">Preparing Order</Text>
                    <Text fontSize="3xl">{inProgressCount}</Text>
                </Flex>
                <Spacer />
                <Flex p="20px" alignItems="flex-start" direction="column" borderRadius="20px" w="32%" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" bg={'#fff'}>
                    <Text borderRadius="5px" fontWeight="500" bg={"brand.300"} px="2" >Ready</Text>
                    <Text mt="5px" as="b" flex="1">Awaiting collection</Text>
                    <Text fontSize="3xl">{readyCount}</Text>
                </Flex>
            </Flex>

            <Heading mt="30px" size="lg" mb="30px"> Open Orders</Heading>
            <Flex direction="column" w="100%">
                {redemptions.length !== 0 ? redemptions.map((redemption: firebase.default.firestore.DocumentData) => {
                    const sub = subscriptions.filter((subscription: firebase.default.firestore.DocumentData) => subscription.id == redemption.subscriptionId)[0]
                    if (sub) return <OrderItem key={redemption.code} redemption={redemption} title={sub.title} content={sub.content} delay={delay}/>
                }) : <Text>Waiting for new orders ...</Text>}
            </Flex>
        </Flex>
    )
}

interface OrderItemProps {
    redemption: firebase.default.firestore.DocumentData,
    title: string,
    content: string,
    delay:string,
}

function OrderItem({ redemption, title, content,delay }: OrderItemProps) {
    const now: Date = new Date();
    const redemptionTime = typeof redemption?.redeemedAt === 'number' ? new Date(redemption.redeemedAt) : redemption.redeemedAt.toDate();
    const collectionTime = typeof redemption?.collectBy === 'number' ? new Date(redemption.collectBy) : redemption.collectBy.toDate();
    const received = Math.floor((+now - redemptionTime) / (1000 * 60));
    const due = (collectionTime - +now) / (1000 * 60);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const confirm = async (duration:string) => {
        const ref = firestore.collection('redemptions').doc(redemption.id);
        if(redemption.orderAhead) ref.update({ confirmed: true })
        else ref.update({ confirmed: true,collectBy: new Date((new Date()).getTime() + parseInt(duration)*60000) })
        
    }

    const ready = async () => {
        const ref = firestore.collection('redemptions').doc(redemption.id);
        ref.update({ ready: true })
    }

    const collected = async () => {
        const redRef = firestore.collection('redemptions').doc(redemption.id);
        redRef.update({ collected: true });
    }

    const cancel = async () => {
        const redRef = firestore.collection('redemptions').doc(redemption.id);
        redRef.set({ canceled: true, confirmed: true, ready: true, collected: true }, { merge: true });
    }
    //
    return (
        <Box overflow="hidden" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" bg={'#fff'} w="100%" p={6} pb="30px" borderRadius="20px" position="relative" mb="20px">
            <Text borderRadius="5px" as="span" fontWeight="500" bg={!redemption.confirmed ? "brand.200" : !redemption.ready ? "brand.400" : "brand.300"}
                px="2" py="1">{!redemption.confirmed ? "Received" : !redemption.ready ? "In Progress" : "Ready"}</Text>
            <Grid gap={6} mt="10px" templateColumns="repeat(4, 1fr)" >
                <VStack spacing={1} alignItems="start">
                    <Text as="b">{redemption.redeemedBy}</Text>
                    {redemption.orderAhead ?
                        <>
                            <Text >{"Pickup Order in "}{Math.ceil(due) + " min"}</Text>
                            <Text >{"Received " + received + " min ago"}</Text>
                        </> :
                        <>
                            <Text >{"ASAP Order"}</Text>
                            <Text >{"Received " + received + " min ago"}</Text>
                        </>
                    }

                </VStack>
                <VStack spacing={1} alignItems="start">
                    <Text as="b">Overview</Text>
                    <Text >{title}</Text>
                    <Text>{"1x " + content}</Text>
                </VStack>
                <VStack spacing={1} alignItems="start">
                    <Text as="b">Customer Message</Text>
                    <Text>{redemption.requests ? "\"" + redemption.requests + "\"" : " "}</Text>
                </VStack>
                <VStack spacing={1} alignItems="start">
                    <Text as="b" >Redemption Code: {redemption.code}</Text>
                    <Button fontSize={'md'} variant="ghost" fontWeight={500} onClick={onOpen}
                        color={'white'} bg={'black'} _hover={{ bg: 'black', color: 'white' }}>
                        {!redemption.confirmed ? "Confirm Order" : !redemption.ready ? "Mark as ready" : "Complete order"}</Button>

                </VStack>

            </Grid>
            <RedemptionModal redemption={redemption} isOpen={isOpen} onClose={onClose} confirm={confirm} collected={collected} ready={ready} cancel={cancel} delay={delay} />
        </Box>

    );
}


function RedemptionModal({ redemption, isOpen, onClose, confirm, collected, ready, cancel,delay }: any) {
    const [duration,setDuration] = useState<string>(delay)

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{!redemption.confirmed ? "Confirm Order" : !redemption.ready ? "Mark as ready" : "Complete order"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} pb="15px">
                        {!redemption.confirmed&&!redemption.orderAhead ?
                            <HStack justifyContent="space-between" w="full">
                                <Text>Set duration (mins)</Text>
                                <NumberInput value={duration} onChange={(e)=>setDuration(e)} min={0}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                
                            </HStack>
                            : null}
                        <Button boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)"
                            bg={'black'} color={'white'}
                            _hover={{ bg: 'black', color: 'white' }} w="full" py="25px" onClick={() => {
                                !redemption.confirmed ? confirm(duration) : !redemption.ready ? ready() : collected()
                                onClose()
                            }}>
                            {!redemption.confirmed ? "Confirm Order" : !redemption.ready ? "Mark as ready" : "Complete order"}
                        </Button>

                        <Button boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)"
                            bg={'white'} color={'brand.200'} py="25px"
                            hover={{ bg: 'white', color: "brand.200" }} w="full" onClick={() => {
                                cancel()
                            }}>
                            Cancel Order
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}