import { Box, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/images/logo.svg'

export default function Custom404() {
    return (
        <main>
            <VStack w="full">
            <Box cursor="pointer">
                <Link href="/" >
                    <Image width="165px" height="50px" src={logo} alt="" />
                </Link>
            </Box>
            <h1>404 - That page does not seem to exist...</h1>
            <iframe
                src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
                width="480"
                height="362"
                frameBorder="0"
                allowFullScreen
            ></iframe>
            </VStack>
        </main>
    );
}
