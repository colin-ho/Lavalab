import { IconButton } from '@chakra-ui/button';
import { Badge, Box, Circle, Flex, Grid, Heading, HStack, ListItem, Spacer, Stack, Text, UnorderedList, VStack } from '@chakra-ui/layout';
import React,{useState,useEffect} from 'react'
import SubscriptionForm from '../SubscriptionForm';
import {BiDotsHorizontalRounded} from "react-icons/bi";
import {AiOutlinePlus} from "react-icons/ai";
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { firestore } from '../../lib/firebase';

export default function AllSubscriptions({subscriptions}) {
    const[formMode,setFormMode] = useState(false);
    const[editableSub,setEditableSub] = useState(null);
    const live = subscriptions.filter(subscription=>subscription.published && !subscription.archived);
    const drafts = subscriptions.filter(subscription=>!subscription.published);
    const archived =subscriptions.filter(subscription=>subscription.archived);

    return (
        formMode ? <SubscriptionForm setFormMode={setFormMode} editableSub={editableSub}/> : 
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Subscriptions</Heading>
            <Text>Create new subscriptions or manage existing ones</Text>

            <Box cursor="pointer" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" position="relative" alignSelf="flex-end" overflow="hidden" onClick={()=> {setEditableSub(null);setFormMode(true)}} bg="white" w="250px" p={6} my="30px" borderRadius="lg">
                <HStack>
                <Text >Create New</Text>
                <AiOutlinePlus/>
                </HStack>
            </Box>

            <Heading  size="md"  mb="30px"> Live Subscriptions</Heading>
            <Flex direction="column" w="100%">
                {live.length!==0 ? live.map((subscription) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id}/>) : <Text my="10px" alignSelf="center">You have no live subscriptions</Text>}
            </Flex>

            <Heading  size="md" mb="30px" mt="10px"> Drafts</Heading>
            <Flex direction="column" w="100%">
                {drafts.length!==0 ? drafts.map((subscription) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id}/>) : <Text my="10px" alignSelf="center">You have no drafts</Text>}
            </Flex>

            <Heading  size="md"mb="30px" mt="10px"> Archive</Heading>
            <Flex direction="column" w="100%">
                {archived.length!==0 ? archived.map((subscription) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id}/>) : <Text my="10px" alignSelf="center">You have no archived subscriptions</Text>}
            </Flex>
        </Flex>
    )
}

function SubscriptionItem({ subscription,setFormMode,setEditableSub }) {
    const edit = ()=>{
        setFormMode(true);
        setEditableSub(subscription);
    }

    const archive = async ()=>{
        const ref = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id);
        await ref.update({archived:true});
    }

    const unarchive = async ()=>{
        const ref = firestore.collection('businesses').doc(subscription.businessId).collection('subscriptions').doc(subscription.id);
        await ref.update({archived:false});
    }
    //
    return (
        <Box overflow="hidden" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" borderRadius="xl" position="relative"  mb="20px">
        <Grid gap={6}  templateColumns="repeat(4, 1fr)" bg="white" w="100%" p={6} pb="30px" borderRadius="lg">
            <VStack align="start"> 
                <Text as="b">{subscription.title}</Text>
                <Text >Created {subscription.updatedAt.toDate().toLocaleDateString(undefined,{ year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </VStack>
            <VStack align="start">
                <Text fontWeight="500">Overview</Text>
                <Text >{subscription.dayConstrain ? "1 " :  subscription.limit} {subscription.content} for {"$"+subscription.price + "/"+ subscription.interval}</Text>
                {subscription.dayConstrain ? <Text>Limit 1 redemption/day</Text>:null} 
            </VStack>
            <VStack align="start">
                <Text fontWeight="500">Performance</Text>
                <Text >{subscription.customerCount+ " subscribers"}</Text>
                <Text >{subscription.redemptionCount+ " redemptions"}</Text>
            </VStack>
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
                    <MenuList mt="-30px" mr="20px">
                        <MenuItem onClick={subscription.published ? subscription.archived ? unarchive :archive:edit}>
                        {subscription.published ? subscription.archived ? "Unarchive" : "Archive":"Edit"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Circle>
        </Box>
      
    );
}


