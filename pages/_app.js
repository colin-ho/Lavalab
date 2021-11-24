import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../lib/context';
import { useData } from '../lib/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChakraProvider } from "@chakra-ui/react"
import { useRouter } from 'next/router'
import NewNavbar from '../components/NewNavbar';
import { extendTheme } from "@chakra-ui/react"

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      // ...
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

function MyApp({ Component, pageProps }) {
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
