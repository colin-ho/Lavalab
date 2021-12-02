import React,{useState,useContext} from 'react'
import { firestore } from '../../lib/firebase';
import { AuthContext } from '../../lib/context';
import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { BsArrowRight } from 'react-icons/bs';

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
    </Box>)
}

