import { createContext } from 'react';
import { auth, firestore } from './firebase';
import { useEffect, useState } from 'react';

export interface AuthContextInterface {
    user: firebase.default.User| null
    business: firebase.default.firestore.DocumentData | undefined | null
    businessRef:firebase.default.firestore.DocumentReference | null
}

export const AuthContext = createContext<AuthContextInterface>({ user:null,business:null,businessRef:null});

export function useData() {
    const [user,setUser] = useState<firebase.default.User| null>(null)
    const [business, setBusiness] = useState<firebase.default.firestore.DocumentData | null | undefined>(null);
    const [businessRef,setBusinessRef] = useState<firebase.default.firestore.DocumentReference | null>(null)

    useEffect(()=>{
        const userListener = auth.onAuthStateChanged((user) => {
            if(user){
                setUser(user);
            } else{
                setUser(null)
            }
        });
        return userListener
    },[])
    useEffect(() => {
        // turn off realtime subscription
        let businessListener:()=> void
        if (user) {
            const ref = firestore.collection('businesses').doc(user.uid)
            businessListener = ref.onSnapshot((snapshot)=>{
                if(snapshot.exists){
                    setBusinessRef(snapshot.ref)
                    setBusiness(snapshot.data())
                } else{
                    setBusinessRef(null)
                    setBusiness(null)
                }
            },err=>console.log(err))
        } else{
            setBusiness(null)
            setBusinessRef(null)
        }

        return ()=>{
            businessListener?.()
        }
    }, [user]);

    return { user, business,businessRef };
}