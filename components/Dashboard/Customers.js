import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { firestore } from '../../lib/firebase';

export default function Customers({customers,subscriptions,total}) {
    const [customerData,setCustomerData] = useState();
    useEffect(() => {
        let unsubscribe;

        const getNestedStuff= async(doc,ids)=>{
            const [data,subQuery] = await Promise.all([(firestore.collection('customers').doc(doc.id).get()),(firestore.collection('customers').doc(doc.id).collection('subscribedTo').where('subscriptionId','in',ids).get())])
            let subs=[]
            subQuery.forEach((sub)=>{
                subs.push(sub.data())
            })
            let all = {name:data.data().displayName,email:data.data().email,subs:subs};
            return all;
        }

        const getstuff =async(snapshot,ids)=>{
            let temp=[];
            snapshot.forEach(async(doc) => {
                
                temp.push(getNestedStuff(doc,ids))
            });
            return await Promise.all(temp);
        }
        if(customers.length>0 && subscriptions){
            
            unsubscribe = firestore.collection('customers').where('uid','in',customers).onSnapshot(async (snapshot)=>{
                
                // Use the setState callback 
                let ids = subscriptions.map((sub)=>sub.id);
                setCustomerData(await getstuff(snapshot,ids))
            })
        }

        return unsubscribe
    }, [customers,subscriptions])
    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Customers</Heading>
            <Text>Current subscribers</Text>
            <HStack my="20px" spacing={6}>
                <HStack  w="150px" p={4}  borderRadius="xl" spacing={6} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                    <Text as={'b'}>{customerData? customerData.length:null}</Text>
                    <Text>Current Subscribers</Text>
                </HStack>
                <HStack w="150px" p={4} borderRadius="xl" spacing={6} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                    <Text as={'b'}>{total? total:null}</Text>
                    <Text>All time Subscribers</Text>
                </HStack>
            </HStack>
            {customerData ? customerData.map((customer)=>{
                return <CustomerItem key={customer.name} customer={customer} />
            }):null} 

        </Flex> 
    )
}

function CustomerItem({customer}){
    return(
        <Grid templateColumns='repeat(5, 1fr)' mb="20px" w="100%" p={4} gap={8} borderRadius="xl"boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
            <GridItem colSpan="1">
                <VStack  alignItems="start">
                    <Text as={'b'}>{customer.name}</Text>
                    <Text>Email: {customer.email}</Text>
                </VStack>
            </GridItem>
            <GridItem colSpan="4">
            <VStack alignItems="start">
                <Text fontWeight="500">Active Subscriptions</Text>
                <HStack spacing={12}>
                    {customer.subs.map((sub)=>{
                        return (
                            <VStack alignItems="start" key={sub.subscriptionId}>
                                <Text >{sub.subscriptionTitle}</Text>
                                <Text >Redeemed {sub.redeemedAt.length} times</Text>
                            </VStack>
                        )
                    })}
                </HStack>
            </VStack>
            </GridItem>
        </Grid>
                
    )
}