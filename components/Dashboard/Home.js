import React,{useState,useContext} from 'react'
import { firestore } from '../../lib/firebase';
import { AuthContext } from '../../lib/context';
import { Box,Text,Flex ,Spacer,Heading} from "@chakra-ui/react"
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
        <Flex marginTop = "30px" h="150px"direction="row">
            <Flex p="20px" direction="column" borderRadius="20px" w="32%" bg="#f4f6fa">
                <Text as="b">Active Sales</Text>
                <Text>Open Orders</Text>
                <Text mt="20px" fontSize="3xl"flex="1">{waitingCount}</Text>
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
                <Text mt="20px" fontSize="3xl"flex="1">{subscriptions.length}</Text>
            </Flex>
        </Flex>
    </Box>)
}

