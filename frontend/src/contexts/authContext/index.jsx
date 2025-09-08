import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, createContext, useContext } from "react";
import { reload } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const[userLoggedIn, setUserLoggedIn] = useState(false);
    const[loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);   // <-- add role
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe; 
    }, [])

    async function initializeUser(user) {
        if(user){
            await reload(user);
            setCurrentUser({...user});
            setUserLoggedIn(true);
            setRole(user.displayName || null);  // <-- store role from displayName
        } else{
            setCurrentUser(null);
            setUserLoggedIn(false);
            setRole(null);
        }
        setLoading(false)
    }
    const value = {
        currentUser,
        userLoggedIn,
        role,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}