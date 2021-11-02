import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function CustomerCheck(props) {
  const { userType,user } = useContext(AuthContext);

  return (userType==='customer' && user) ? props.children : props.fallback || <Link href="/customerLogin">You must be signed in</Link>;
}