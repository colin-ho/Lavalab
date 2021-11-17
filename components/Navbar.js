import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../lib/context';
// Top navbar
export default function Navbar() {
    const { userType, user } = useContext(AuthContext)

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">LEAL</button>
          </Link>
        </li>
        <li>
          <Link href="/shops">
            <button className="btn-logo">Shops</button>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <button className="btn-logo">About Us</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {(userType==='business'&& user) && (
          <li>
            <Link href="/businessLogin">
              <img src={user?.photoURL} />
            </Link>
          </li>
        )}

        {/* user is not signed OR has not created username */}
        {!user && (
          <li>
              <Link href="/businessLogin">
              <button className="btn-blue">Business Log In</button>
              </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}