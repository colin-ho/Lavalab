import '../styles/globals.css'
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../lib/context';
import { useData } from '../lib/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function MyApp({ Component, pageProps }) {
  const userData = useData();
  return (
    <AuthContext.Provider value={userData}>
      <Elements stripe={stripePromise}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </Elements>
    </AuthContext.Provider>
  );
}

export default MyApp
