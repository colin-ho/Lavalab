import { Toaster } from 'react-hot-toast';
import { AuthContext, useData } from '../lib/context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { Fonts } from '../styles/Fonts';
import Metatags from '../components/Metatags';
import type { AppProps /*, AppContext */ } from 'next/app'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const theme = extendTheme({
    fonts: {
        heading: "Roobert",
        body: "Roobert",
    },
    colors: {
        brand: {
            100: "#f4f6fa",
            200: "#FE7886",
            300: "#ACFFDC",
            400: "#FCE86B",
            900: "#1a202c",
        },
    },
    breakpoints: {
        sm: "36em",
        md: "48em",
        lg: "62em",
        pxl: "70em",
        xl: "80em",
        "2xl": "96em",
    }
})

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
