import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../renderer/firebase';

interface Ctx { user: User | null; loading: boolean }
const AuthC = createContext<Ctx>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    // listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);

    //   // if signed in, start a Firestore listener on their user doc
    //   if (firebaseUser) {
    //     const userDocRef = doc(db, 'users', firebaseUser.uid);

    //     // live updates so profile edits appear immediately
    //     const unsubscribeInfo = onSnapshot(
    //       userDocRef,
    //       (docSnap) => {
    //         setUserInfo(docSnap.exists() ? docSnap.data() : null);
    //         setInfoLoading(false);
    //       },
    //       () => {
    //         setUserInfo(null);
    //         setInfoLoading(false);
    //       }
    //     );

    //     // clean up Firestore listener when auth state changes or component unmounts
    //     return () => unsubscribeInfo();
    //   } else {
    //     // signed out: clear profile and stop showing loading spinner
    //     setUserInfo(null);
    //     setInfoLoading(false);
    //   }
    });

    // clean up auth listener on unmount
    return () => unsubscribeAuth();
  }, []);


    return (
        <AuthC.Provider value={{ user, loading }}>
            {loading ? 'Loading…' : children}
        </AuthC.Provider>
    );
};

export const useAuth = () => useContext(AuthC);
