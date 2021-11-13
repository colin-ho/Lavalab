import { createContext } from 'react';

export const AuthContext = createContext({ userType:null, user:null,displayName:null });