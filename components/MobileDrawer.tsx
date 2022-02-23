import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";
import Image from 'next/image'
import { VStack, HStack, Text, Box } from "@chakra-ui/layout";
import { Drawer, DrawerContent,  DrawerOverlay,  } from "@chakra-ui/react";
import Link from 'next/link';
import logo from '../public/punch-card-logo 1.svg'

interface MobileDrawerProps{
    onClose:()=>void
    isOpen:boolean
    openContact:()=>void;
}

export function MobileDrawer({ onClose, isOpen, openContact }: MobileDrawerProps) {

    return (
        <Drawer onClose={onClose} isOpen={isOpen} size="sm">
            <DrawerOverlay />
            <DrawerContent>
                <HStack px="50px" py="10" w="full" spacing={6}>
                    <Box cursor="pointer">
                        <Link href="/" >
                            <Image width="165px" height="30px" src={logo} alt="" />
                        </Link>
                    </Box>
                    <Box flex="1" />
                    <CloseIcon cursor="pointer" onClick={onClose} />
                </HStack>
                <VStack w="full" mt="50px" align="flex-start" px="50px" spacing="5">
                    <Box w="full">
                        <Link href="/forMerchants" >
                            <HStack justify="space-between" cursor="pointer">
                                <Text>For merchants</Text>
                                <ArrowForwardIcon w={10} h={10} color='black' />
                            </HStack>
                        </Link>
                        <Box w="full" height="1px" background="black" />
                    </Box>
                    <Box w="full">
                        <HStack justify="space-between" cursor="pointer" onClick={() => {
                            onClose()
                            openContact()
                        }}>
                            <Text>
                                Contact Us
                            </Text>
                            <ArrowForwardIcon w={10} h={10} color='black' />
                        </HStack>
                        <Box w="full" height="1px" background="black" />
                    </Box>
                </VStack>
            </DrawerContent>
        </Drawer>
    )
}