import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { PhoneIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton,InputGroup,InputLeftElement, ModalContent,Input, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'

const stringSimilarity = require("string-similarity");
export default function Customers({customerData,total}:any) {
    const [search,setSearch] = useState('')
    const [data,setData] = useState([])
    useEffect(()=>{
        if(customerData){
            const customers:any = []
            customerData.forEach((item:any) => {
                const index = customers.findIndex((c:any) => c.customerId ===item.customerId)
                if(index===-1){
                    const customer = {customerId:item.customerId,name:item.customerName,subs:[
                        {subscriptionTitle:item.subscriptionTitle,subscriptionId:item.subscriptionId,redemptionCount:item.redemptionCount,
                        boughtAt:item.boughtAt,end:item.end,lastRedeemed:item.lastRedeemed?item.lastRedeemed:null}
                    ]}
                    customers.push(customer)
                } else{
                    const sub = {subscriptionTitle:item.subscriptionTitle,subscriptionId:item.subscriptionId,redemptionCount:item.redemptionCount,
                        boughtAt:item.boughtAt,end:item.end,lastRedeemed:item.lastRedeemed?item.lastRedeemed:null}
                    customers[index] = {...customers[index],subs:[...customers[index].subs,sub]}
                }
                
            });
            setData(customers)
        } else{
            setData([])
        }
    },[customerData])

    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Customers</Heading>
            <Text>Current subscribers</Text>
            {data.length>0? 
            <>
            <HStack w="full" my="20px" justify="space-between" spacing={12}>
                <HStack align="center" flex="1"  p={8}  borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{Object.keys(data).length}</Text>
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
            
            {data.length>0 ? search=='' ? data.map((customer:any)=>{
                return <CustomerItem key={customer.name} customer={customer} />
            }):
            data.filter((customer:any)=>customer.name.toLowerCase().includes(search.toLowerCase()) || stringSimilarity.compareTwoStrings(customer.name.toLowerCase(), search.toLowerCase())>0.5).map((customer:any)=>{
                return <CustomerItem key={customer.name} customer={customer} />
            })
        : null} 
        </Flex> 
    )
}

function CustomerItem({customer}:any){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <Grid templateColumns='repeat(4, 1fr)' mb="20px" w="100%" p={4} gap={8} borderRadius="xl"boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
            <GridItem colSpan={1}>{console.log(customer)}
                <VStack  alignItems="start">
                    <Text as={'b'} fontSize="20px">{customer.name}</Text>
                </VStack>
            </GridItem>
            <GridItem colSpan={3}>
            <VStack alignItems="start">
                <Text fontWeight="500">Active Subscriptions {customer.subs.length>2 ? <Button ml="10px" size="xs" onClick={onOpen}>See All</Button>:null}</Text>
                <HStack spacing={12}>
                    {customer.subs.slice(0, 3).map((sub:any)=>{
                        return (
                            <VStack alignItems="start" spacing="1" key={sub.subscriptionId}>
                                <Text >{sub.subscriptionTitle}</Text>
                                <Text pl="4" color="#959897">Redeemed {sub.redemptionCount} times</Text>
                                {sub.lastRedeemed ? <Text pl="4" color="#959897">Last redeemed {sub.lastRedeemed.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text>:null}
                                <Text  pl="4" color="#959897">Renews on {sub.end.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
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

function BasicUsage({customer,isOpen,onClose}:any) {
    
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{customer.name + "'s"} Subscriptions</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb="20px">
                <VStack align="start" spacing="4">
            {customer.subs.map((sub:any)=>{
                        return (
                            <VStack alignItems="start" key={sub.subscriptionId}>
                                <Text fontWeight="500">{sub.subscriptionTitle}</Text>
                                <Text color="#959897">Redeemed {sub.redemptionCount} times</Text>
                            </VStack>
                        )
                    })}
                </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
    )
  }