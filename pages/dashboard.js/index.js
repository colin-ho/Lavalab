import {React,useState,useEffect, useContext, useCallback} from 'react';
import BusinessCheck from '../../components/BusinessCheck';
import { auth, firestore} from '../../lib/firebase';
import { AuthContext } from '../../lib/context';
import {
  IconButton,Box,CloseButton,Flex,HStack,VStack,Icon,useColorModeValue,Link,Drawer,
  DrawerContent,Text,useDisclosure,Menu,MenuButton,MenuDivider,MenuItem,MenuList, Image,
} from '@chakra-ui/react';
import {
  FiHome,FiTrendingUp,FiCompass,FiStar,FiSettings,FiMenu,FiBell,FiChevronDown,
} from 'react-icons/fi';
import { AiOutlineShop,AiOutlineTags } from "react-icons/ai";
import {IoPeopleOutline} from "react-icons/io5";
import Home from '../../components/Dashboard/Home';
import ActiveSales from '../../components/Dashboard/ActiveSales';
import AllSubscriptions from '../../components/Dashboard/AllSubscriptions';
import StoreDetails from '../../components/Dashboard/StoreDetails';
import { useRouter } from 'next/router';
import Customers from '../../components/Dashboard/Customers';

const LinkItems = [
    { name: 'Home', icon: FiHome },
    { name: 'Active Sales', icon: FiTrendingUp },
    { name: 'Subscriptions', icon: AiOutlineTags },
    { name: 'Customers', icon: IoPeopleOutline },
    { name: 'Store Details', icon: AiOutlineShop },
];

export default function Dashboard() {

    const [pageState,setPageState] = useState('Home');
    const { user,displayName } = useContext(AuthContext);
    const [subscriptions,setSubscriptions] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [customerData,setCustomerData] =useState([])
    const [customerIds,setCustomerIds] = useState([])
    const [total,setTotal] = useState(0)

    

  useEffect(() => {
    const getNestedStuff =
      async(doc,ids)=>{
          const [data,subQuery] = await Promise.all([(firestore.collection('customers').doc(doc.id).get()),(firestore.collection('customers').doc(doc.id).collection('subscribedTo').where('subscriptionId','in',ids).get())])
          let subs=[]
          subQuery.forEach((sub)=>{
              subs.push(sub.data())
          })
          let all = {name:data.data().displayName,email:data.data().email,subs:subs};
          console.log(all)
          return all;
      }

  const getstuff = (
      async(snapshot,ids)=>{
          let temp=[];
          snapshot.forEach(async(doc) => {
              
              temp.push(getNestedStuff(doc,ids))
          });
          return await Promise.all(temp);
      })
      
    let unsubscribe;
    if(customerIds.length>0){
      let ids =subscriptions.map((sub)=>sub.id);
      unsubscribe = firestore.collection('customers').where('uid','in',customerIds).onSnapshot(async (snapshot)=>{
        setCustomerData(await getstuff(snapshot,ids))
      })
    }
    
    return unsubscribe
  }, [customerIds,subscriptions])

    useEffect(() => {

      let unsubscribe;
      if(subscriptions.length>0 && user){
        let ids =subscriptions.map((sub)=>sub.id);
        let customers = []
        unsubscribe = firestore.collectionGroup('subscriptions').where('id','in',ids).onSnapshot(async(snapshot)=>{
          console.log('changing')
          let temp = []
          snapshot.forEach((sub)=>{
            if (temp.includes(sub.id) === false) temp.push(firestore.collection('businesses').doc(user.uid).collection('subscriptions').doc(sub.id).collection('customers').get());
          })
          let data = (await Promise.all(temp));
          
          data.forEach((snap)=>{
            snap.forEach((doc)=>{
              if (customers.includes(doc.id) === false) customers.push(doc.id)
            })
          })
          setCustomerIds(customers);
        })
        
      }
      return unsubscribe;
    }, [subscriptions,user])

    
    useEffect(() => {
        // Moved inside "useEffect" to avoid re-creating on render
        const handleRedemptionChanges = (snapshot) => {
            let temp = []
            snapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            
            // Use the setState callback 
            setRedemptions(temp);  
        };
        const handleSubscriptionChanges=(snapshot)=>{
            let temp = []
            snapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            
            // Use the setState callback 
            setSubscriptions(temp);  
        };
        
        let unsubscribe1;
        let unsubscribe2;
        if(user){
            const subscriptionsQuery = firestore.collection('businesses').doc(user.uid).collection('subscriptions');
            var d = new Date();
            d.setHours(0,0,0,0);
            const redemptionsQuery = firestore.collectionGroup('redemptions').where('businessId', '==', user.uid).where('redeemedAt','>=',d).orderBy('redeemedAt','desc')
            // Create the DB listener
            unsubscribe1 = redemptionsQuery.onSnapshot(handleRedemptionChanges, 
                err => console.log(err));
            unsubscribe2 = subscriptionsQuery.onSnapshot(handleSubscriptionChanges, 
                err => console.log(err));
            (async()=>{
              const temp = (await firestore.collection('businesses').doc(user.uid).get()).get('totalCustomers')
              setTotal(temp);
            })()
        }
        
        return unsubscribe1,unsubscribe2;
    }, [user]);

    return (
        <BusinessCheck>
            <Box minH="100vh">
                <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
                setPageState={setPageState}
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
                    <SidebarContent onClose={onClose} display={{ base: 'block', md: 'none' }} setPageState={setPageState} />
                </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav onOpen={onOpen} displayName={displayName}/>
                <Box ml={{ base: 0, md: 60 }} p="10">
                {pageState === 'Home' ? <Home displayName={displayName} subscriptions={subscriptions}redemptions={redemptions}/> : 
                pageState==='Active Sales' ? <ActiveSales displayName={displayName}  subscriptions={subscriptions}redemptions={redemptions.filter(redemption=>!redemption.collected)}/> :
                pageState === 'Subscriptions' ? <AllSubscriptions subscriptions={subscriptions}/> :
                pageState ==='Customers' ? <Customers customerData={customerData} total={total}/> :
                <StoreDetails/>}
                </Box>
            </Box>
        </BusinessCheck>
    )
}
  
const SidebarContent = ({ onClose, setPageState,display }) => {
    return (
      <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        display={{base:display.base,md:display.md}}
        >
        <Flex mt="20px" mb="60px" alignItems="center" mx="8" justifyContent="space-between">
          <Image src={"../../punch-card-logo 1.svg"} alt=""/>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} setPageState={setPageState} page={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    );
  };
  
  const NavItem = ({ icon, children,setPageState,page}) => {
    return (
      <Link onClick = {()=>setPageState(page)} style={{ textDecoration: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
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
  
const MobileNav = ({ onOpen,displayName}) => {
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
  
        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold">
          Logo
        </Text>
  
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
                    <Text fontSize="sm">{displayName}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {(new Date()).toLocaleDateString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                <MenuItem>Settings</MenuItem>
                <MenuItem onClick={()=>router.push(`/`)}>Back to Website</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => {auth.signOut();router.push(`/`)}}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    );
  };