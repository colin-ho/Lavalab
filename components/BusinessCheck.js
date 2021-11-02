import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function BusinessCheck(props) {
  const { userType,user } = useContext(AuthContext);

  return (userType==='business'&&user) ? props.children : props.fallback || <Link href="/businessLogin">You must be signed in</Link>;
}