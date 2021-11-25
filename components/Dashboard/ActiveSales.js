import { Box, Circle, Flex, Grid, Heading, Spacer, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';

export default function ActiveSales({ displayName,subscriptions,redemptions}) {
    const live = redemptions.filter(redemption=>!redemption.collected);
    let newOrderCount = 0;
    let inProgressCount = 0;
    let lateCount = 0;
    live.map((r)=>{
        if(!r.collected && !r.confirmed )newOrderCount++;
        else if(!r.collected && r.confirmed) inProgressCount++;
        else if(r.collectBy > new Date()) lateCount++; 
    })

    
    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Active Sales Overview</Heading>
            <Text>{displayName} is currently open and accepting subscriptions <BsArrowRight/> </Text>

            <Flex marginTop = "20px" h="200px"direction="row">
                <Flex p="20px" direction="column" borderRadius="20px" w="32%" bg="#f4f6fa">
                    <Text as="b">New Orders</Text>
                    <Text>Needs confirmation</Text>
                    <Text mt="20px" fontSize="3xl"flex="1">{newOrderCount}</Text>
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

            <Heading  size="lg" mb="30px"> Open Orders</Heading>
            <Flex direction="column" w="100%">
                {live.map((redemption)=>{
                    <OrderItem redemption={redemption} subscription={subscriptions.filter(subscription=>subscription.id === redemption.subscriptionId)[0]}/>
                })}
            </Flex>
        </Flex>
    )
}


function OrderItem({ redemption,subscription }) {

    const confirm = async ()=>{
        const ref = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id).collection('redemptions').doc(redemption.number);
        await ref.update({confirmed:true});
    }

    const collected = async ()=>{
        const ref = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id).collection('redemptions').doc(redemption.number);
        await ref.update({collected:true});
    }
    //
    return (
        <Box overflow="hidden" position="relative"  mb="20px">
            <Text as="b">{redemption.redeemedBy}</Text>
            <Grid gap={6}  templateColumns="repeat(3, 1fr)" bg="brand.100" w="100%" p={6} pb="50px" borderRadius="lg">
                <Box>
                    <Text >{redemption.redeemedAt}</Text>
                    <Text >{redemption.collectBy}</Text>
                </Box>
                <Box>
                    <Text >{subscription.title}</Text>
                    <Text>{subscription.content}</Text>
                </Box>
                <Text >{!redemption.confirmed ? "Needs Confirmation" : "In Progress" }</Text>
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
