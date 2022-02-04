import { Toaster } from 'react-hot-toast';
import { AuthContext, useData } from '../lib/context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChakraProvider } from "@chakra-ui/react"
import { useRouter } from 'next/router'
import { extendTheme } from "@chakra-ui/react"
import NewNavbar from '../components/NewNavbar';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f4f6fa",
      200:"#FE7886",
      300:"#ACFFDC",
      400:"#FCE86B",
      900: "#1a202c",
    },
  },
  breakpoints:{
    sm: "30em",
    md: "48em",
    lg: "62em",
    pxl:"70em",
    xl: "80em",
    "2xl": "96em",
  }
})

function MyApp({ Component, pageProps }:any) {
  const userData = useData();
  const router = useRouter()
  return (
    <ChakraProvider theme = {theme}>
      <AuthContext.Provider value={userData}>
        <Elements stripe={stripePromise}>
          {router.asPath === '/dashboard' ? null: <NewNavbar />}
          <Component {...pageProps} />
          <Toaster />
        </Elements>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp
