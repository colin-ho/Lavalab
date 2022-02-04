import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Flex, Heading, VStack } from "@chakra-ui/layout";
import Link from 'next/link';
export default function Home(props:any) {

  return (

      <Flex justify="center" align="center" h={'calc(100vh - 60px)'} flex="1">
        <Image position="absolute" h={'calc(100vh - 60px)'} w="full" objectFit='cover' src={"/landing.jpg"} alt=""/>
        <VStack w="sm" align="center" zIndex="1" p ="6" bg="white" borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
          <Image src={"/logo2.png"} w="50px" alt=""/>
          <Heading py="20px" textAlign="center" fontSize="20">Create subscriptions for your loyal customers</Heading>
          <Link href="/businessLogin">
              <Button p="7"w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'} _hover={{bg: 'black',color:'white'}}>
                Join Us</Button>
          </Link>
          <Link href="/businessLogin">
            <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'black'} bg={'white'} _hover={{bg: 'white',color:'black'}}>
            Sign in</Button>
          </Link>
        </VStack>
      </Flex>
  );
}