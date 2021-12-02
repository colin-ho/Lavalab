import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { PhoneIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton,InputGroup,InputLeftElement, ModalContent,Input, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../lib/context';
import { firestore } from '../lib/firebase';

const stringSimilarity = require("string-similarity");
export default function Customers({customerData,total}) {
    const [search,setSearch] = useState('')

    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Customers</Heading>
            <Text>Current subscribers</Text>
            {customerData? 
            <>
            <HStack w="full" my="20px" justify="space-between" spacing={12}>
                <HStack align="center" flex="1"  p={8}  borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{customerData.length}</Text>
                    <Text>Current customers</Text>
                </HStack>
                <HStack flex="1" p={8} borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32'as={'b'}>{total? total:0}</Text>
                    <Text>All time Subscribers</Text>
                </HStack>
            </HStack>
            <InputGroup my="20px" >
                <InputLeftElement pointerEvents='none' ><SearchIcon color='black' /></InputLeftElement>
                <Input py="10px" variant="unstyled" value={search} onChange={(event)=>setSearch(event.target.value)} bg="white" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)"borderRadius="xl" borderWidth="0" placeholder="Search by name or keyword" />
            </InputGroup>
            
            </>:null} 
            
            {customerData ? search=='' ? customerData.map((customer)=>{
                return <CustomerItem key={customer.name} customer={customer} />
            }):
            customerData.filter((customer)=>customer.name.toLowerCase().includes(search.toLowerCase()) || stringSimilarity.compareTwoStrings(customer.name.toLowerCase(), search.toLowerCase())>0.5).map((customer)=>{
                return <CustomerItem key={customer.name} customer={customer} />
            })
            : null} 
        </Flex> 
    )
}

function CustomerItem({customer}){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <Grid templateColumns='repeat(4, 1fr)' mb="20px" w="100%" p={4} gap={8} borderRadius="xl"boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
            <GridItem colSpan="1">
                <VStack  alignItems="start">
                    <Text as={'b'} fontSize="20px">{customer.name}</Text>
                    <Text>Joined {customer.subs.map((sub)=>sub.boughtAt.toDate()).sort((a, b) => (a > b) ? 1 : -1)[0].toLocaleDateString(undefined,{ year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </VStack>
            </GridItem>
            <GridItem colSpan="1">
                <VStack  alignItems="start">
                    <Text fontWeight="500">Details</Text>
                    <Text>Email: {customer.email}</Text>
                </VStack>
            </GridItem>
            <GridItem colSpan="2">
            <VStack alignItems="start">
                <Text fontWeight="500">Active Subscriptions {customer.subs.length>2 ? <Button ml="10px" size="xs" onClick={onOpen}>See All</Button>:null}</Text>
                <HStack spacing={12}>
                    {customer.subs.slice(0, 2).map((sub)=>{
                        return (
                            <VStack alignItems="start" key={sub.subscriptionId}>
                                <Text >{sub.subscriptionTitle}</Text>
                                <Text color="#959897">Redeemed {sub.redeemedAt.length} times</Text>
                            </VStack>
                        )
                    })}
                </HStack>
            </VStack>
            </GridItem>
            
            <BasicUsage customer={customer} isOpen={isOpen} onClose={onClose}/>
        </Grid>
                
    )
}

function BasicUsage({customer,isOpen,onClose}) {
    
    return (
        <Modal isCentered mt="100px" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{customer.name + "'s"} Subscriptions</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb="20px">
                <VStack align="start" spacing="4">
            {customer.subs.map((sub)=>{
                        return (
                            <VStack alignItems="start" key={sub.subscriptionId}>
                                <Text fontWeight="500">{sub.subscriptionTitle}</Text>
                                <Text color="#959897">Redeemed {sub.redeemedAt.length} times</Text>
                            </VStack>
                        )
                    })}
                </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
    )
  }