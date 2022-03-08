import { IconButton, Button } from '@chakra-ui/button';
import { Badge, Box, Circle, Flex, Grid, Heading, HStack, ListItem, Spacer, Stack, Text, UnorderedList, VStack } from '@chakra-ui/layout';
import React, { useState, useEffect } from 'react'
import SubscriptionForm from './SubscriptionForm'
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { firestore } from '../lib/firebase';
import axios from 'axios';

interface AllSubscriptionsProps{
    subscriptions:firebase.default.firestore.DocumentData[],

}

export default function AllSubscriptions({ subscriptions, }: AllSubscriptionsProps) {
    const [formMode, setFormMode] = useState(false);
    const [editableSub, setEditableSub] = useState<firebase.default.firestore.DocumentData|null>(null);
    const [activeCounts, setActiveCounts] = useState<idObjects>({})
    const [inactiveCounts, setInactiveCounts] = useState<idObjects>({})
    const live = subscriptions.filter((subscription: firebase.default.firestore.DocumentData) => subscription.published && !subscription.archived);
    const drafts = subscriptions.filter((subscription: firebase.default.firestore.DocumentData) => !subscription.published);
    const archived = subscriptions.filter((subscription: firebase.default.firestore.DocumentData) => subscription.archived);

    interface idObjects{
        [key: string]: number,
    }

    return (
        formMode ? <SubscriptionForm setFormMode={setFormMode} editableSub={editableSub} /> :
            <Flex direction="column" align="flex-start">
                <Heading size="lg" mb="10px"> Subscriptions</Heading>
                <Text>Create new subscriptions or manage existing ones</Text>

                <Box cursor="pointer" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" position="relative" alignSelf="flex-start" overflow="hidden" onClick={() => { setEditableSub(null); setFormMode(true) }} bg="white" w="250px" p={6} my="30px" borderRadius="lg">
                    <HStack>
                        <Text >Create New</Text>
                        <AiOutlinePlus />
                    </HStack>
                </Box>


                {live.length !== 0 ?
                    <>
                        <Heading size="md" mb="30px" mt="10px"> Live Subscriptions</Heading>
                        <Flex direction="column" w="100%">
                            {live.map((subscription: firebase.default.firestore.DocumentData) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id}  />)}
                        </Flex>
                    </>
                    : null}

                {drafts.length !== 0 ?
                    <>
                        <Heading size="md" mb="30px" mt="10px"> Drafts</Heading>
                        <Flex direction="column" w="100%">
                            {drafts.map((subscription: firebase.default.firestore.DocumentData) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id} />)}
                        </Flex>
                    </>
                    : null}

                {archived.length !== 0 ?
                    <>
                        <Heading size="md" mb="30px" mt="10px"> Archive</Heading>
                        <Flex direction="column" w="100%">
                            {archived.map((subscription: firebase.default.firestore.DocumentData) => <SubscriptionItem setEditableSub={setEditableSub} setFormMode={setFormMode} subscription={subscription} key={subscription.id}/>)}
                        </Flex>
                    </> : null}

            </Flex>
    )
}

interface SubscriptionItemProps{
    subscription:firebase.default.firestore.DocumentData,
    setFormMode:React.Dispatch<React.SetStateAction<boolean>>,
    setEditableSub:React.Dispatch<React.SetStateAction<firebase.default.firestore.DocumentData | null>>
}

function SubscriptionItem({ subscription, setFormMode, setEditableSub, }: SubscriptionItemProps) {
    const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
    const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure()
    const edit = () => {
        setFormMode(true);
        setEditableSub(subscription);
    }

    const archive = async () => {
        const ref = firestore.collection('subscriptions').doc(subscription.id);
        await ref.update({ archived: true });
    }

    const unarchive = async () => {
        const ref = firestore.collection('subscriptions').doc(subscription.id);
        await ref.update({ archived: false });
    }

    const cancel = async () => {
        try {
            const main = await firestore.collection('subscriptions').doc(subscription.id).get()
            const promises = [];
            const batch = firestore.batch();
            const subs = await firestore.collection('subscribedTo').where('businessId','==',subscription.businessId).where('subscriptionId', '==', subscription.id).get()
            subs.forEach((doc) => {
                promises.push(axios.post('/api/cancel', {
                    stripeSubscriptionId: doc.id,
                }))
                batch.delete(doc.ref);
            })
            batch.delete(main.ref);
            promises.push(batch.commit());
            await Promise.all(promises)
        }
        catch (err) {
            console.log(err)
        }
    }
    //
    return (

        <>
            {subscription ?
                <Box overflow="hidden" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" borderRadius="xl" position="relative" mb="20px">
                    <Grid gap={6} templateColumns="repeat(4, 1fr)" bg="white" w="100%" p={6} pb="30px" borderRadius="lg">
                        <VStack align="start">
                            <Text as="b">{subscription.title}</Text>
                            {subscription.published ? <Text >Created {subscription.updatedAt?.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text> : null}
                        </VStack>
                        <VStack align="start">
                            <Text fontWeight="500">Overview</Text>
                            <Text >{subscription.dayConstrain ? "1 " : subscription.limit} {subscription.content} for {"$" + subscription.price + "/" + subscription.interval}</Text>
                            {subscription.dayConstrain ? <Text>Limit 1 redemption/day</Text> : null}
                        </VStack>
                        <VStack align="start">
                            <Text fontWeight="500">Performance</Text>
                            <Text >{subscription.totalPurchases} total purchases</Text>
                            <Text >{subscription.activeSubscribers} active subscribers</Text>
                            <Text >{subscription.redemptionCount + " redemptions"}</Text>
                        </VStack>
                    </Grid>
                    <Circle position="absolute" right="-3" top="-3" cursor="pointer" size="60px" bg="rgba(0, 0, 0, 0.05)">
                        <Menu >
                            <MenuButton
                                as={IconButton}
                                icon={<BiDotsHorizontalRounded />}
                                variant="ghost"
                                borderRadius="50px"
                                w="60px"
                                h="60px"
                            />
                            <MenuList mt="-30px" mr="20px">
                                <MenuItem onClick={subscription.published ? subscription.archived ? onOpen2 : onOpen1 : edit}>
                                    {subscription.published ? subscription.archived ? "Unarchive" : "Archive" : "Edit"}
                                </MenuItem>
                                <MenuItem onClick={onOpen3}>
                                    Cancel
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Circle>
                    <ArchiveSub isOpen={isOpen1} onClose={onClose1} archive={archive} title={subscription.title} />
                    <UnarchiveSub isOpen={isOpen2} onClose={onClose2} unarchive={unarchive} title={subscription.title} />
                    <CancelSub isOpen={isOpen3} onClose={onClose3} cancel={cancel} isPublished={subscription.published} title={subscription.title} />
                </Box> : null}
        </>
    );
}

interface ArchiveSubProps{
    isOpen:boolean,
    onClose:()=>void,
    archive:() => Promise<void>,
    title:string
}

function ArchiveSub({ isOpen, onClose, archive, title }: ArchiveSubProps) {

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Archive {title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Once you archive this subscription, it will <Text as="b">not be visible on our app</Text> and customers
                        <Text as="b"> cannot purchase it. </Text>
                    </Text>
                    <Text mt="4">However, <Text as="b">current customers will still be able to redeem this subscription.</Text> If you would like to
                        fully discontinue redemptions, please cancel the subscription.
                    </Text>
                    <Button my="5" p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                        _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                            boxShadow:
                                '0px 16px 50px rgba(0, 0, 0, 0.12)',
                        }}
                        onClick={archive}>
                        Archive</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

interface UnarchiveSubProps{
    isOpen:boolean,
    onClose:()=>void,
    unarchive:() => Promise<void>,
    title:string
}

function UnarchiveSub({ isOpen, onClose, unarchive, title }: UnarchiveSubProps) {

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Unarchive {title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Once you unarchive this subscription, it will be <Text as="b">visible on our app </Text>and <Text as="b">customers
                        will be able to purchase it. </Text>
                    </Text>
                    <Button my="5" p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                        _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                            boxShadow:
                                '0px 16px 50px rgba(0, 0, 0, 0.12)',
                        }}
                        onClick={unarchive}>
                        Unarchive</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

interface CancelSubProps{
    isOpen:boolean,
    onClose:()=>void,
    cancel:() => Promise<void>,
    title:string,
    isPublished:boolean,
}

function CancelSub({ isOpen, onClose, cancel, title, isPublished }: CancelSubProps) {

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cancel {title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isPublished ?
                        <>
                            <Text>Upon cancellation <Text as="b">current customers will have their individual subscriptions cancelled without refund. </Text>
                                Please carefully consider before cancelling this subscription.
                            </Text>
                        </> : 
                        <Text>Once you cancel this draft, all your saved data will be lost</Text>}

                    <Button my="5" p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                        _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                            boxShadow:
                                '0px 16px 50px rgba(0, 0, 0, 0.12)',
                        }}
                        onClick={cancel}>
                        Cancel subscription</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}


