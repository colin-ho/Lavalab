import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { ChevronDownIcon, ChevronUpIcon, HamburgerIcon, PhoneIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { Modal, IconButton, ModalBody, ModalCloseButton, InputGroup, InputLeftElement, ModalContent, Input, ModalFooter, ModalHeader, ModalOverlay, RadioGroup, Radio, CheckboxGroup, Checkbox } from '@chakra-ui/react';
import { StringOrNumber } from '@chakra-ui/utils';
import { debounce } from 'lodash';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, AuthContextInterface } from '../lib/context';
import { firestore } from '../lib/firebase';

const stringSimilarity = require("string-similarity");

interface CustomerProps {
    subTitles: string[],
}

interface SubInterface {
    subscriptionTitle: string, subscriptionId: string,
    redemptionCount: number,
    boughtAt: firebase.default.firestore.Timestamp,
    end: firebase.default.firestore.Timestamp,
    amountPaid: string, lastRedeemed: firebase.default.firestore.Timestamp
}

interface CustomerInterface {
    customerId: string,
    name: string,
    subs: SubInterface[],

}

export default function Customers({ subTitles }: CustomerProps) {
    const [search, setSearch] = useState('')
    const { user } = useContext<AuthContextInterface>(AuthContext);
    const [data, setData] = useState<CustomerInterface[]>([])
    const [lastDoc, setLastDoc] = useState<firebase.default.firestore.QueryDocumentSnapshot<firebase.default.firestore.DocumentData> | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [sort, setSort] = useState<String>('')
    const [sub, setSub] = useState<StringOrNumber[]>([])
    const [page, setPage] = useState(1)

    const arrangeData = async (customers:CustomerInterface[],customerData:firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>)=>{
        const ids: string[] = []
        customerData.forEach((doc) => {
            const item = doc.data()
            const index = customers.findIndex((c: firebase.default.firestore.DocumentData) => c.customerId === item.customerId)
            ids.push(item.customerId)
            if (index === -1) {
                const customer = {
                    customerId: String(item.customerId), name: String(item.customerName), subs: [
                        {
                            subscriptionTitle: String(item.subscriptionTitle), subscriptionId: String(item.subscriptionId), redemptionCount: parseInt(item.redemptionCount),
                            boughtAt: item.boughtAt, end: item.end, amountPaid: String(item.amountPaid), lastRedeemed: item.lastRedeemed ? item.lastRedeemed : null
                        }
                    ]
                }
                customers.push(customer)
            } else {
                const sub = {
                    subscriptionTitle: item.subscriptionTitle, subscriptionId: item.subscriptionId, redemptionCount: item.redemptionCount,
                    boughtAt: item.boughtAt, end: item.end, amountPaid: item.amountPaid, lastRedeemed: item.lastRedeemed ? item.lastRedeemed : null
                }
                customers[index] = { ...customers[index], subs: [...customers[index].subs, sub] }
            }

        });
        const topUpQuery = firestore.collection('subscribedTo').where('businessId', '==', user?.uid).where('status', '==', 'active')
            .where('customerId', 'in', ids).orderBy('boughtAt')

        const topUpData = await topUpQuery.get()
        topUpData.forEach((doc) => {
            const item = doc.data()
            const index = customers.findIndex((c: firebase.default.firestore.DocumentData) => c.customerId === item.customerId)
            ids.push(item.customerId)
            const sub = {
                subscriptionTitle: item.subscriptionTitle, subscriptionId: item.subscriptionId, redemptionCount: item.redemptionCount,
                boughtAt: item.boughtAt, end: item.end, amountPaid: item.amountPaid, lastRedeemed: item.lastRedeemed ? item.lastRedeemed : null
            }
            customers[index] = { ...customers[index], subs: [...customers[index].subs, sub] }
        });

        setData(customers)
        const newlast = customerData.docs.at(customerData.docs.length - 1)
        if (newlast) {
            setLastDoc(newlast)
        }
    }

    const getMoreData = async () => {
        const dataQuery = firestore.collection('subscribedTo').where('businessId', '==', user?.uid).where('status', '==', 'active').orderBy('boughtAt').limit(2).startAfter(lastDoc)

        const newData = await dataQuery.get()

        const customers = data
        arrangeData(customers,newData);
    }

    const getInitialData = async () => {
        const customerQuery = firestore.collection('subscribedTo').where('businessId', '==', user?.uid).where('status', '==', 'active').orderBy('boughtAt').limit(2)
        const customerData = await customerQuery.get()

        const customers: CustomerInterface[] = []
        arrangeData(customers,customerData);
    }

    useEffect(() => {
        if (user) {
            getInitialData()
        } else {
            setData([])
        }
    }, [user])

    const debouncedSearch = debounce((query: string) => {
        setSearch(query);
    }, 300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    }

    const filterCustomers = (customer: CustomerInterface) => {
        let checker = false;
        if (search != '') {
            if (customer.name.toLowerCase().includes(search.toLowerCase()) || stringSimilarity.compareTwoStrings(customer.name.toLowerCase(), search.toLowerCase()) > 0.5) {
                checker = true;
            } else {
                customer.subs.forEach((sub: SubInterface) => {
                    if (
                        sub.subscriptionTitle.toLowerCase().includes(search.toLowerCase()) ||
                        stringSimilarity.compareTwoStrings(sub.subscriptionTitle.toLowerCase(), search.toLowerCase()) > 0.5)
                        checker = true;
                })
            }
        }
        else if (sub.length > 0) {
            customer.subs.forEach((item: SubInterface) => {
                if (sub.includes(item.subscriptionTitle))
                    checker = true;
            })
        }
        else {
            checker = true;
        }
        return checker;
    }

    const sortCustomer = (a: CustomerInterface, b: CustomerInterface) => {
        let result = 1;
        if (sort === 'name') {
            a.name > b.name ? result = 1 : result = -1;
        }
        else if (sort === 'date_dsc') {
            let a_min = (Math.min.apply(null, a.subs.map((sub: SubInterface) => { return sub.boughtAt.toDate().getTime() })))
            let b_min = (Math.min.apply(null, b.subs.map((sub: SubInterface) => { return sub.boughtAt.toDate().getTime() })))
            a_min < b_min ? result = 1 : result = -1;
        }
        else if (sort === 'date_asc') {
            let a_min = (Math.min.apply(null, a.subs.map((sub: SubInterface) => { return sub.boughtAt.toDate().getTime() })))
            let b_min = (Math.min.apply(null, b.subs.map((sub: SubInterface) => { return sub.boughtAt.toDate().getTime() })))
            a_min > b_min ? result = 1 : result = -1;
        }
        else if (sort === 'total_dsc') {
            let a_total = a.subs.map((sub: SubInterface) => { return parseFloat(sub.amountPaid) }).reduce((a: number, b: number) => a + b, 0)
            let b_total = b.subs.map((sub: SubInterface) => { return parseFloat(sub.amountPaid) }).reduce((a: number, b: number) => a + b, 0)
            a_total < b_total ? result = 1 : result = -1;
        }
        else if (sort === 'total_asc') {
            let a_total = a.subs.map((sub: SubInterface) => { return parseFloat(sub.amountPaid) }).reduce((a: number, b: number) => a + b, 0)
            let b_total = b.subs.map((sub: SubInterface) => { return parseFloat(sub.amountPaid) }).reduce((a: number, b: number) => a + b, 0)
            a_total > b_total ? result = 1 : result = -1;
        }
        return result;
    }

    const setFilter = (sort: String, sub: StringOrNumber[]) => {
        setSort(sort)
        setSub(sub)
    }

    const nextPage = () => {
        setPage(page + 1)
        if (user && data.length - 2 * (page) == 0) {
            getMoreData()

        }
    }

    return (
        <Flex direction="column" align="flex-start">
            <Heading size="lg" mb="10px"> Customers</Heading>
            <Text>Manage your active subscribers</Text>
            <InputGroup my="20px" >
                <InputLeftElement pointerEvents='none' ><SearchIcon color='black' /></InputLeftElement>
                <Input py="10px" mr="4" variant="unstyled" onChange={handleChange} bg="white" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" borderRadius="xl" borderWidth="0" placeholder="Search by name or keyword" />
                <IconButton onClick={onOpen} size="lg" borderRadius="xl" bg="white" aria-label='Drop down' boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)" icon={<HamburgerIcon />} />
            </InputGroup>

            {data.length > 0 ? sort != '' ?
                data.slice((page - 1) * 2, page * 2).sort((a: CustomerInterface, b: CustomerInterface) => { return sortCustomer(a, b) }).filter((customer: CustomerInterface) => filterCustomers(customer)).map((customer: CustomerInterface) => {
                    return <CustomerItem key={customer.name} customer={customer} />
                })
                :
                data.slice((page - 1) * 2, page * 2).filter((customer: CustomerInterface) => filterCustomers(customer)).map((customer: CustomerInterface) => {
                    return <CustomerItem key={customer.name} customer={customer} />
                })
                : null}
            <HStack>
                <Text>{data.slice((page - 1) * 2, page * 2).length} results</Text>
                {page > 1 ? <Button onClick={() => setPage(page - 1)}>Previous</Button> : null}
                {data.length - 2 * page >= 0 ? <Button onClick={() => nextPage()}>Next</Button> : null}
            </HStack>
            <Filter isOpen={isOpen} onClose={onClose} subTitles={subTitles} setFilter={setFilter} />
        </Flex>
    )
}

interface CustomerItemProps {
    customer: CustomerInterface
}

function CustomerItem({ customer }: CustomerItemProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [drop, setDrop] = useState(false)

    return (
        <Grid templateColumns='repeat(4, 1fr)' mb="20px" w="100%" p={4} gap={8} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
            <GridItem colSpan={1}>
                <VStack alignItems="start">
                    <Text as={'b'} fontSize="20px">{customer.name}</Text>
                    <Text>Joined {(new Date(Math.min.apply(null, customer.subs.map((sub: SubInterface) => { return sub.boughtAt.toDate().getTime() })))).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} </Text>
                </VStack>
            </GridItem>
            <GridItem colSpan={3}>
                <VStack alignItems="start">
                    <HStack w="full">
                        <HStack flex="0.5">
                            <Text fontWeight="500">Active Subscriptions {customer.subs.length > 2 ? <Button ml="10px" size="xs" onClick={onOpen}>See All</Button> : null}</Text>
                            <IconButton size="sm" onClick={() => setDrop(!drop)} variant="ghost" aria-label='Drop down' icon={!drop ? <ChevronDownIcon /> : <ChevronUpIcon />} />
                        </HStack>
                        <Text fontWeight="500">Total spent: ${customer.subs.map((sub: SubInterface) => { return parseFloat(sub.amountPaid) }).reduce((a: number, b: number) => a + b, 0)}</Text>
                    </HStack>
                    <HStack spacing={12}>
                        {customer.subs.slice(0, 3).map((sub: SubInterface) => {
                            return (
                                <VStack alignItems="start" spacing="1" key={sub.subscriptionId}>
                                    <Text >{sub.subscriptionTitle}</Text>
                                    {drop ?
                                        <>
                                            <Text pl="4" color="#959897">Redeemed {sub.redemptionCount} times</Text>
                                            {sub.lastRedeemed ? <Text pl="4" color="#959897">Last redeemed {sub.lastRedeemed.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text> : null}
                                            <Text pl="4" color="#959897">Renews on {sub.end.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                        </> : null
                                    }
                                </VStack>
                            )
                        })}
                    </HStack>
                </VStack>
            </GridItem>

            <CustomerModal customer={customer} isOpen={isOpen} onClose={onClose} />
        </Grid>

    )
}

interface CustomerModalProps {
    customer: CustomerInterface,
    isOpen: boolean,
    onClose: () => void,
}

function CustomerModal({ customer, isOpen, onClose }: CustomerModalProps) {

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{customer.name + "'s"} Subscriptions</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="20px">
                    <VStack align="start" spacing="4">
                        {customer.subs.map((sub: SubInterface) => {
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

interface FilterProps {
    isOpen: boolean,
    onClose: () => void,
    subTitles: string[],
    setFilter: (sort: String, sub: StringOrNumber[]) => void,
}

function Filter({ isOpen, onClose, subTitles, setFilter }: FilterProps) {
    const [sort, setSort] = useState('')
    const [sub, setSub] = useState<StringOrNumber[]>([])

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Filter customers</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <RadioGroup onChange={setSort} value={sort}>
                        <VStack align="flex-start" mb="20px" spacing="4">
                            <Text as={'b'}>Sort by</Text>
                            <Radio value='name'>
                                Name
                            </Radio>
                            <Radio value='date_dsc'>
                                Date subscribed (newest-oldest)
                            </Radio>
                            <Radio value='date_asc'>
                                Date subscribed (oldest-newest)
                            </Radio>
                            <Radio value='total_dsc'>
                                Total spent (most-least)
                            </Radio>
                            <Radio value='total_asc'>
                                Total spent (least-most)
                            </Radio>
                        </VStack>
                    </RadioGroup>
                    <Divider />
                    <CheckboxGroup onChange={(e) => setSub(e)} value={sub}>
                        <VStack align="flex-start" mt="20px" mb="20px" spacing="4">
                            <Text as={'b'}>Subscriptions</Text>
                            {subTitles.map((title: string) => {
                                return (
                                    <Checkbox key={title} value={title}>
                                        {title}
                                    </Checkbox>
                                )
                            })}

                        </VStack>
                    </CheckboxGroup>
                </ModalBody>
                <ModalFooter>
                    <VStack w="full">
                        <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                            _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                                boxShadow:
                                    '0px 16px 50px rgba(0, 0, 0, 0.12)',
                            }} onClick={() => { setFilter(sort, sub), onClose() }} >
                            Set Filter
                        </Button>
                        <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'black'} bg={'white'}
                            _hover={{ bg: 'white', color: 'black' }} _active={{ bg: 'white', color: 'black' }} _focus={{
                                boxShadow:
                                    '0px 16px 50px rgba(0, 0, 0, 0.12)',
                            }} onClick={() => { setSort(''), setSub([]), setFilter('', []) }}>Reset</Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}