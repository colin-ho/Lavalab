import React, { useState, useEffect, useContext, } from 'react';
import { auth, firestore } from '../lib/firebase';
import { AuthContext, AuthContextInterface } from '../lib/context';
import {
    IconButton, Box, CloseButton, Flex, HStack, VStack, Icon, useColorModeValue, Link, Drawer,
    DrawerContent, Text, useDisclosure, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Image,
} from '@chakra-ui/react';
import {
    FiHome, FiTrendingUp, FiMenu, FiChevronDown,
} from 'react-icons/fi';
import { AiOutlineShop, AiOutlineTags } from "react-icons/ai";
import { IoPeopleOutline } from "react-icons/io5";
import Home from '../components/Home';
import ActiveSales from '../components/ActiveSales';
import AllSubscriptions from '../components/AllSubscriptions';
import StoreDetails from '../components/StoreDetails';
import { useRouter } from 'next/router';
import Customers from '../components/Customers';
import { IconType } from 'react-icons';

const LinkItems = [
    { name: 'Home', icon: FiHome },
    { name: 'Active Sales', icon: FiTrendingUp },
    { name: 'Subscriptions', icon: AiOutlineTags },
    { name: 'Customers', icon: IoPeopleOutline },
    { name: 'Store Details', icon: AiOutlineShop },
];

export default function Dashboard() {

    const [pageState, setPageState] = useState<string>('Home');
    const { user, business } = useContext<AuthContextInterface>(AuthContext);
    const [subscriptions, setSubscriptions] = useState<firebase.default.firestore.DocumentData[]>([]);
    const [redemptions, setRedemptions] = useState<firebase.default.firestore.DocumentData[]>([]);
    const [customerData, setCustomerData] = useState<firebase.default.firestore.DocumentData[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [open, setOpen] = useState(true);

    const handleRedemptionChanges = (snapshot: firebase.default.firestore.QuerySnapshot) => {
        let temp: firebase.default.firestore.DocumentData[] = []
        snapshot.forEach((doc) => {
            temp.push(doc.data())
        });

        // Use the setState callback 
        setRedemptions(temp);
    };
    const handleSubscriptionChanges = (snapshot: firebase.default.firestore.QuerySnapshot) => {
        let temp: firebase.default.firestore.DocumentData[] = []
        snapshot.forEach((doc) => {
            temp.push(doc.data())
        });

        // Use the setState callback 
        setSubscriptions(temp);
    };

    const handleCustomerChanges = (snapshot: firebase.default.firestore.QuerySnapshot) => {
        let temp: firebase.default.firestore.DocumentData[] = []
        snapshot.forEach((doc) => {
            temp.push(doc.data())
        });
        // Use the setState callback 
        setCustomerData(temp);
    };

    useEffect(() => {
        // Moved inside "useEffect" to avoid re-creating on render

        let subscriptionListener: () => void, redemptionListener: () => void, customerListener: () => void;
        if (user) {
            const subscriptionsQuery = firestore.collection('subscriptions').where('businessId', '==', user.uid);
            const redemptionsQuery = firestore.collection('redemptions').where('businessId', '==', user.uid).where('collected', '==', false).orderBy('redeemedAt', 'desc')
            const customerQuery = firestore.collection('subscribedTo').where('businessId', '==', user.uid).orderBy('boughtAt')

            subscriptionListener = redemptionsQuery.onSnapshot(handleRedemptionChanges,
                err => console.log(err));
            redemptionListener = subscriptionsQuery.onSnapshot(handleSubscriptionChanges,
                err => console.log(err));
            customerListener = customerQuery.onSnapshot(handleCustomerChanges,
                err => console.log(err))
        }

        return () => {
            subscriptionListener?.();
            redemptionListener?.();
        }
    }, [user]);

    useEffect(() => {
        if (business) {
            let times = business?.times;
            let hours = null;
            const today = new Date()
            interface ClosureInterface {
                description: string,
                from: string,
                to: string,
                hours: {
                    close: {
                        min: string,
                        hr: string
                    },
                    open: {
                        min: string,
                        hr: string
                    },
                }
            }
            business.closures.forEach((closure: ClosureInterface) => {
                if (today.getUTCDate() >= (new Date(closure.from)).getUTCDate() && today.getUTCDate() <= (new Date(closure.to)).getUTCDate()) {
                    hours = closure.hours;
                }
            })
            if (hours == null) {
                const day = today.getDay();
                if (day === 0) hours = times.sun;
                else if (day === 1) hours = times.mon;
                else if (day === 2) hours = times.tue;
                else if (day === 3) hours = times.wed
                else if (day === 4) hours = times.thu;
                else if (day === 5) hours = times.fri;
                else if (day === 6) hours = times.sat;
            }
            const open = parseInt(hours.open.hr + hours.open.min);
            const close = parseInt(hours.close.hr + hours.close.min);
            const now = today.getHours() * 100 + today.getMinutes();
            setOpen(now > open && now < close && !business.paused);
        }
    }, [business])

    return (
        <>
            {business ?
                <Box minH="100vh">
                    <SidebarContent
                        onClose={() => onClose}
                        display={{ base: 'none', md: 'block' }}
                        setPageState={setPageState}
                        pageState={pageState}
                    />
                    <Drawer
                        autoFocus={false}
                        isOpen={isOpen}
                        placement="left"
                        onClose={onClose}
                        returnFocusOnClose={false}
                        onOverlayClick={onClose}
                        size="full">
                        <DrawerContent>
                            <SidebarContent onClose={onClose} display={{ base: 'block', md: 'none' }} setPageState={setPageState} pageState={pageState} />
                        </DrawerContent>
                    </Drawer>
                    {/* mobilenav */}
                    <MobileNav onOpen={onOpen} businessName={business.businessName} />
                    <Box ml={{ base: 0, md: 60 }} p="10">
                        {pageState === 'Home' ? <Home businessName={business.businessName} joined={business.joined} delay={business.delay} open={open} customerData={customerData} waitingCount={redemptions.length} numOfSubs={subscriptions.length} /> :
                            pageState === 'Active Sales' ? <ActiveSales businessName={business.businessName} subscriptions={subscriptions} redemptions={redemptions} delay={business.delay} open={open} /> :
                                pageState === 'Subscriptions' ? <AllSubscriptions subscriptions={subscriptions} activeIds={customerData.filter(customer => customer.status === 'active').map(item => item.subscriptionId)} inactiveIds={customerData.filter(customer => customer.status !== 'active').map(item => item.subscriptionId)} /> :
                                    pageState === 'Customers' ? <Customers customerData={customerData.filter(customer => customer.status === 'active')} total={customerData.length} subTitles={subscriptions.map((sub) => { return sub.title })} /> :
                                        <StoreDetails open={open} />}
                    </Box>
                </Box> : null}
        </>
    )
}

interface SidebarProps {
    onClose: () => void,
    setPageState: React.Dispatch<React.SetStateAction<string>>,
    display: {
        base: string,
        md: string,
    },
    pageState: string,
}

const SidebarContent = ({ onClose, setPageState, display, pageState }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            display={{ base: display.base, md: display.md }}
        >
            <Flex mt="20px" mb="60px" alignItems="center" mx="8" justifyContent="space-between">
                <Image src={"../../punch-card-logo 1.svg"} alt="" />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} setPageState={setPageState} pageState={pageState} page={link.name} icon={link.icon} onClose={onClose}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps {
    onClose: () => void,
    setPageState: React.Dispatch<React.SetStateAction<string>>,
    pageState: string,
    page: string,
    children: string,
    icon: IconType,
}

const NavItem = ({ icon, children, setPageState, page, pageState, onClose }: NavItemProps) => {
    return (
        <Link onClick={() => {
            setPageState(page);
            onClose();
        }} style={{ textDecoration: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                mb="2"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                background={pageState === page ? 'black' : 'none'}
                color={pageState === page ? 'white' : 'none'}
                _hover={{
                    bg: 'black',
                    color: 'white',
                }}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="20"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileNavProps {
    onOpen: () => void,
    businessName: string
}

const MobileNav = ({ onOpen, businessName }: MobileNavProps) => {
    const router = useRouter();
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="60px"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
        >
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <VStack
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontWeight="600" fontSize="sm">{businessName}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {(new Date()).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem onClick={() => router.push(`/`)}>Back to Website</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => { auth.signOut(); router.push(`/`) }}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};