import { Box, Circle, Flex, Grid, Heading, Spacer, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IconButton } from '@chakra-ui/button';
import { firestore } from '../../lib/firebase';

export default function ActiveSales({ displayName,subscriptions,redemptions}) {
    const [newOrderCount,setNewOrderCount] = useState(0);
    const [inProgressCount,setInProgressCount] = useState(0);
    const [lateCount,setLateCount] = useState(0);
    
    useEffect(() => {
        setLateCount(0);
        setInProgressCount(0);
        setNewOrderCount(0);
        redemptions.map((r)=>{
            if(!r.confirmed ) setNewOrderCount(newOrderCount=>newOrderCount+1);
            else setInProgressCount(inProgressCount=>inProgressCount+1);
            if(r.collectBy.toDate() < new Date()) setLateCount(lateCount=>lateCount+1);
        })
        let interval = setInterval(() => {
            setLateCount(0);
            redemptions.map((r)=>{
                if(r.collectBy.toDate() < new Date()) setLateCount(lateCount=>lateCount+1);
            })
          }, 10000);
        return () => clearInterval(interval);
      }, [redemptions]);

    
    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Active Sales Overview</Heading>
            <Text>{displayName} is currently open and accepting subscriptions </Text>

            <Flex marginTop = "30px" h="150px" w="100%"direction="row">
                <Flex p="20px" direction="column" borderRadius="20px" w="32%" bg="#f4f6fa">
                    <Text as="b">New Orders</Text>
                    <Text flex="1">Needs confirmation</Text>
                    <Text  fontSize="3xl">{newOrderCount}</Text>
                </Flex>
                <Spacer/>
                <Flex p="20px"direction="column"borderRadius="20px"w="32%"bg="#E6F5F9">
                    <Text as="b">In Progress</Text>
                    <Text>Awaiting fulfilment</Text>
                    <Text mt="20px" fontSize="3xl"flex="1">{inProgressCount}</Text>
                </Flex>
                <Spacer/>
                <Flex p="20px"direction="column"borderRadius="20px"w="32%" bg="#FFEFE2">
                    <Text as="b">Late</Text>
                    <Text>Past due</Text>
                    <Text mt="20px" fontSize="3xl"flex="1">{lateCount}</Text>
                </Flex>
            </Flex>

            <Heading mt="30px" size="lg" mb="30px"> Open Orders</Heading>
            <Flex direction="column" w="100%">
                {redemptions.length !== 0 ? redemptions.map((redemption)=>{
                    return <OrderItem key={redemption.code} redemption={redemption} subscription={subscriptions.filter(subscription=>subscription.id == redemption.subscriptionId)[0]}/>
                }) : <Text>Waiting for new orders ...</Text>}
            </Flex>
        </Flex>
    )
}


function OrderItem({ redemption,subscription }) {

    const now = new Date();
    const redemptionTime = typeof redemption?.redeemedAt === 'number' ? new Date(redemption.redeemedAt) : redemption.redeemedAt.toDate();
    const collectionTime = typeof redemption?.collectBy === 'number' ? new Date(redemption.collectBy) : redemption.collectBy.toDate();
    const received = Math.floor((now - redemptionTime) / (1000 * 60));
    const due = (collectionTime - now) / (1000 * 60);
    const confirm = async ()=>{
        const ref = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id).collection('redemptions').doc(redemption.number);
        await ref.update({confirmed:true});
    }

    const collected = async ()=>{
        const redRef = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id).collection('redemptions').doc(redemption.number);
        const customerRef = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id).collection('customers').doc(redemption.redeemedById);
        const batch = firestore.batch();
        batch.update(redRef,{collected:true});
        batch.update(customerRef,{redeeming:false,code:'',currentRef:''});
        await batch.commit();
    }
    //
    return (
        <Box overflow="hidden" bg={due<0 ? "#FFEFE2" : !redemption.confirmed ? "#f4f6fa": "#E6F5F9" } w="100%" p={6} pb="50px" borderRadius="lg" position="relative"  mb="20px">
            <Text as="b">{redemption.redeemedBy}</Text>
            <Grid gap={6}  templateColumns="repeat(3, 1fr)" >
                <Box>
                    <Text >{"Received "+received + " min ago"}</Text>
                    <Text >{"Due "}{due<0 ? "now" : "in " + Math.ceil(due) + " min"}</Text>
                </Box>
                <Box>
                    <Text >{subscription.title}</Text>
                    <Text>{"1x "+subscription.content}</Text>
                </Box>
                <Box>
                <Text as="u">{!redemption.confirmed ? "Needs Confirmation" : "In Progress" }</Text>
                    <Text>{redemption.requests ? "Requests: " + redemption.requests : " "}</Text>
                </Box>
                
            </Grid>
            <Circle position="absolute" right="-3" top="-3" cursor= "pointer" size="60px" bg="rgba(0, 0, 0, 0.05)">
                <Menu >
                    <MenuButton
                        as={IconButton}
                        icon={<BiDotsHorizontalRounded/>}
                        variant="ghost"
                        borderRadius="50px"
                        w="60px"
                        h="60px"
                    />
                    <MenuList mt="-20px">
                        <MenuItem onClick={!redemption.confirmed ? confirm : collected }>
                        {!redemption.confirmed ? "Confirm" : "Collected" }
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Circle>
        </Box>
      
    );
}
