import React,{useState,useContext} from 'react'
import { firestore } from '../../lib/firebase';
import { AuthContext } from '../../lib/context';
import { Box,Text,Flex ,Spacer} from "@chakra-ui/react"

export default function Home({displayName, subscriptions,redemptions}){
    let customerCount = 0;
    let waitingCount = 0;
    subscriptions.map((sub)=>{
        customerCount+=sub.customerCount;
    })
    redemptions.map((r)=>{
        if(!r.collected)waitingCount++;
    })
    return(
    <Box marginLeft="50px" marginTop="20px" marginRight="50px">
        <Text fontWeight = "bold" fontSize="3xl">Welcome Back</Text>
        <Text fontSize="lg">{displayName} is currently open and accepting subscriptions</Text>
        <Flex marginTop = "20px" h="200px"direction="row">
            <Flex p="20px" direction="column" borderRadius="20px" w="32%" bg="#f4f6fa">
                <Text as="b">Active Sales</Text>
                <Text>Open Orders</Text>
                <Text mt="20px" fontSize="3xl"flex="1">{waitingCount} waiting</Text>
                <Text color="rgba(0, 0, 0, 0.5)">{redemptions.length} orders today</Text>
            </Flex>
            <Spacer/>
            <Flex p="20px"direction="column"borderRadius="20px"w="32%"bg="#E6F5F9">
                <Text as="b">Sales Revenue</Text>
                <Text>This Week</Text>
            </Flex>
            <Spacer/>
            <Flex p="20px"direction="column"borderRadius="20px"w="32%" bg="#FFEFE2">
                <Text as="b">Subscriptions</Text>
                <Text>Currently Available</Text>
                <Text mt="20px" fontSize="3xl"flex="1">{subscriptions.length} available</Text>
                <Text color="rgba(0, 0, 0, 0.5)">{customerCount} current customers</Text>
            </Flex>
        </Flex>
        {subscriptions.length!==0? redemptions.map((redemption)=>{
            return <RedemptionItem id = {subscriptions.filter((subscription)=>subscription.id === redemption.subscriptionId)[0].id} key = {redemption.redeemedAt} redemption={redemption}/>
        }) : null}
    </Box>)
}

function RedemptionItem({redemption,id}){

    const [collected,setCollected] = useState(redemption.collected)
    const { user} = useContext(AuthContext);

    const confirmCollection = async () =>{
        const redemptionRef = firestore.collection('businesses').doc(user.uid).collection('subscriptions').doc(id).collection('redemptions').doc(redemption.number)
        await redemptionRef.update({collected:true})
        setCollected(true)
    }

    const redemptionTime = typeof redemption?.redeemedAt === 'number' ? new Date(redemption.redeemedAt) : redemption.redeemedAt.toDate();
    const collectionTime = typeof redemption?.collectBy === 'number' ? new Date(redemption.collectBy) : redemption.collectBy.toDate();
    return(
        <div >
            {redemption.redeemedBy} redeemed {redemption.subscriptionName} at {redemptionTime.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })} to collect by {collectionTime.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })} with these requests: {redemption.requests} collection code is {redemption.code}
            {collected ? <p>Collected</p>: <button onClick={confirmCollection}>Confirm Collection </button>}
        </div>
    )
}