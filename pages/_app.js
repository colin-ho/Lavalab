import '../styles/globals.css'
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../lib/context';
import { useData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  const userData = useData();
  return (
    <AuthContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </AuthContext.Provider>
  );
}

export default MyApp
