import { Toaster } from 'react-hot-toast';
import { AuthContext, useData } from '../lib/context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChakraProvider } from "@chakra-ui/react"

import { Fonts } from '../styles/Fonts';
import Metatags from '../components/Metatags';
import type { AppProps /*, AppContext */ } from 'next/app'
import { theme } from '../styles/Theme';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function MyApp({ Component, pageProps }: AppProps) {
    const userData = useData();
    return (
        stripePromise ?
            <ChakraProvider theme={theme}>
                <Fonts/>
                <AuthContext.Provider value={userData}>
                    <Elements stripe={stripePromise}>
                        <Metatags/>
                        <Component {...pageProps} />
                        <Toaster />
                    </Elements>
                </AuthContext.Provider>
            </ChakraProvider> : null
    );
}

export default MyApp
