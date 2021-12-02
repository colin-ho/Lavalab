import { useContext, useEffect } from 'react';
import { AuthContext } from '../lib/context';
import { useRouter } from 'next/router'

// Component's children only shown to logged-in users
export default function BusinessCheck(props) {
  const { userType,user } = useContext(AuthContext);

  return (userType&&user ? userType==='business'&&user ? props.children : <Fallback/>:null);
}

function Fallback(){
  const router = useRouter()
  useEffect(()=>{
    router.push(`/businessLogin`)
  },[router])
  return<></>
}