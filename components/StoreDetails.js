import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { PhoneIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton,InputGroup,InputLeftElement, ModalContent,Input, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { firestore } from '../lib/firebase';


export default function StoreDetails() {

    return (
        <Flex direction = "column" align="flex-start">
            <Heading  size="lg" mb="10px"> Store details</Heading>
            <Text>Coming soon...</Text>
            
        </Flex> 
    )
}

