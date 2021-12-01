import {Box,Link as ChakraLink,Flex,Text,IconButton,Button,Stack,Collapse,Icon,Popover,
    PopoverTrigger,PopoverContent,useColorModeValue,Image,useDisclosure,} from '@chakra-ui/react';
import {HamburgerIcon,CloseIcon,ChevronDownIcon,ChevronRightIcon,} from '@chakra-ui/icons';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../lib/context';

export default function NewNavbar() {
    const { isOpen, onToggle } = useDisclosure();
    const { user,displayName } = useContext(AuthContext)
    return (
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                <Link href="/">
                    <Image cursor="pointer" w = "130px" src={"../../punch-card-logo 1.svg"} alt=""/>
                </Link>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>
  
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            {(displayName && user) ? 
            <Link href="/dashboard">
                <Button fontSize={'sm'} fontWeight={600}
                color={'white'} bg={'black'} _hover={{bg: 'black'}}>
                Dashboard
                </Button>
            </Link > : 
            <Link  href="/businessLogin">
                <Button 
                fontSize={'sm'} fontWeight={600} color={'white'} bg={'black'}
               _hover={{bg: 'black'}}>
                Sign In
                </Button>
            </Link >
            }
            
          </Stack>
        </Flex>
  
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    );
  }
  
  const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  
    return (
      <Stack direction={'row'} spacing={4}>
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <ChakraLink
                  p={2}
                  href={navItem.href}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  {navItem.label}
                </ChakraLink>
              </PopoverTrigger>
            
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} label={child.label} subLabel={child.subLabel} href={child.href} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    );
  };
  
  const DesktopSubNav = ({ label, href, subLabel }) => {
    return (
      <ChakraLink
        href={href}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'pink.400' }}
              fontWeight={500}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </ChakraLink>
    );
  };
  
  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
        {NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} navItem={navItem} />
        ))}
      </Stack>
    );
  };
  
  const MobileNavItem = ({navItem}) => {
    const { label, children, href } = navItem;
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          href={href}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
              <>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
          </>
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => (
                <ChakraLink key={child.label} py={2} href={child.href}>
                  {child.label}
                </ChakraLink>
              ))}
          </Stack>
        </Collapse>
      </Stack>
    );
  };
  
const NAV_ITEMS = [
    {
      label: 'Shops',
      children: [
        {
          label: 'Discover Shops',
          subLabel: 'Find your favorite local shops',
          href: '/shops',
        },
        {
          label: 'Explore Subscriptions',
          subLabel: 'Up-and-coming Subscriptions',
          href: '/shops',
        },
      ],
      href: '/shops',
    },
    {
      label: 'About Us',
      children: [
        {
          label: 'Our Story',
          subLabel: 'What we truly stand for',
          href: '/about',
        },
        {
          label: 'Our Team',
          subLabel: 'Learn about PunchCard\'s founders',
          href: '/about',
        },
      ],
      href: '/about',
    },
    {
      label: 'For Businesses',
      href: '/forBusinesses',
    },
];