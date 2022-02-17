import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../lib/context';
import { useRouter } from 'next/router'
import { ChakraComponent } from '@chakra-ui/react';

// Component's children only shown to logged-in users

export default function BusinessCheck(props:any) {
  const { business } = useContext(AuthContext);

  return (business ? props.children : <Fallback/>);
}

function Fallback(){
  const router = useRouter()
  useEffect(()=>{
    router.push(`/businessLogin`)
  },[router])
  return<></>
}