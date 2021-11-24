import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../lib/context';
import { useData } from '../lib/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChakraProvider } from "@chakra-ui/react"
import { useRouter } from 'next/router'
import NewNavbar from '../components/NewNavbar';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function MyApp({ Component, pageProps }) {
  const userData = useData();
  const router = useRouter()
  return (
    <ChakraProvider>
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
