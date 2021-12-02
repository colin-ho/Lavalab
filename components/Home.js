import React,{useState,useContext, useEffect} from 'react'
import { firestore } from '../lib/firebase';
import { AuthContext } from '../lib/context';
import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { BsArrowRight } from 'react-icons/bs';
import { AiOutlineTags } from 'react-icons/ai';
import { Select } from '@chakra-ui/select';

export default function Home({displayName, subscriptions,redemptions}){
    const [waitingCount,setWaitingCount] = useState(0);
    const [total,setTotal] = useState(0);

    useEffect(() => {
        let temp1 = 0;
        let tempTotal = 0;
        subscriptions.map((sub)=>{
            tempTotal+=sub.customerCount*sub.price;
        })
        redemptions.map((r)=>{
            if(!r.collected) temp1++;
        })
        setWaitingCount(temp1);
        setTotal(tempTotal);

    }, [subscriptions,redemptions])
    return(
    <Box>
        <Heading  size="lg" mb="10px"> Welcome Back</Heading>
        <Text>{displayName} is currently open and accepting subscriptions</Text>
        <HStack w="full" my="20px" justify="space-between" spacing={12}>
                <HStack align="center" flex="1"  p={8}  borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{waitingCount}</Text>
                    <Text>Open orders</Text>
                </HStack>
                <HStack flex="1" p={8} borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32'as={'b'}>{subscriptions.length}</Text>
                    <Text>Active subscriptions</Text>
                </HStack>
            </HStack>
        <HStack align="center" p="6" borderRadius="xl"  boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
            <VStack flex="1" align="start">
                <Heading fontSize='20'>Total Revenue</Heading>
                <Text fontSize='32'>${total}</Text>
            </VStack>
            <HStack  p={4} spacing={4} borderRadius="xl"  boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                <AiOutlineTags/>
                <Select borderWidth="0" variant="unstyled">
                    <option value="All">All Subscriptions</option>
                </Select>
                <Text></Text>
            </HStack>
        </HStack>
    </Box>)
}

