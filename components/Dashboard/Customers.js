import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { firestore } from '../../lib/firebase';

export default function Customers({customers,subscriptions,total}) {
    const [customerData,setCustomerData] = useState(null);
    useEffect(() => {
        let unsubscribe;

        if(customers.length>0 && subscriptions){
            let ids = subscriptions.map((sub)=>sub.id);
            unsubscribe = firestore.collection('customers').where('uid','in',customers).onSnapshot((snapshot)=>{
                let temp = []
                snapshot.forEach((doc) => {
                    let temp2 ={name:'',email:'',subscriptions:[]};
                    const customerRef = firestore.collection('customers').doc(doc.id)
                    customerRef.onSnapshot((snapshot)=>{
                        const data = snapshot.data();
                        temp2.name = data.displayName;
                        temp2.email = data.email;
                    })
                    customerRef.collection('subscribedTo').where('subscriptionId','in',ids).onSnapshot((snapshot)=>{
                        let temp3 = []
                        snapshot.forEach((doc)=>{
                            temp3.push(doc.data())
                        })
                        temp2.subscriptions=temp3;
                    })
                    temp.push(temp2);
                });
                
                // Use the setState callback 
                setCustomerData(temp);  
            })
        }

        return unsubscribe
    }, [customers,subscriptions])
    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Customers</Heading>
            <Text>Current subscribers</Text>
            <HStack mt="20px" spacing={6}>
                <HStack  w="150px" p={4} borderRadius="2xl" spacing={6} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                    <Text as={'b'}>{customerData? customerData.length:null}</Text>
                    <Text>Current Subscribers</Text>
                </HStack>
                <HStack w="150px" p={4} borderRadius="2xl" spacing={6} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                    <Text as={'b'}>{total? total:null}</Text>
                    <Text>All time Subscribers</Text>
                </HStack>
            </HStack>
        </Flex>
    )
}

function CustomerItem({customer,subscriptions}){

    return(
        <Box>
            <Text>
                {customer.name}
            </Text>
        </Box>
    )
}