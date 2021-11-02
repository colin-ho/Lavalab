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
          <>
            <li className="push-left">
              <Link href="/business">
                <button className="btn-blue">Create Subscriptions</button>
              </Link>
            </li>
            <li>
              <Link href="/businessLogin">
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {(userType==='customer'&& user) && (
          <>
            <li className="push-left">
              <Link href="/customer">
                <button className="btn-blue">My Subscriptions</button>
              </Link>
            </li>
            <li>
              <Link href="/customerLogin">
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!user && (
        <>
            <li>
                <Link href="/businessLogin">
                <button className="btn-blue">Business Log In</button>
                </Link>
            </li>
            <li>
                <Link href="/customerLogin">
                <button className="btn-blue">Customer Log in</button>
                </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}