import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../renderer/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Ctx {
  user: User | null;
  role: 'teacher' | 'student' | null;
  loading: boolean;
}
const AuthC = createContext<Ctx>({ user: null, role: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [loading, setLd] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) { setUser(null); setRole(null); setLd(false); return; }
      const snap = await getDoc(doc(db, 'users', u.uid));
      setUser(u);
      setRole(snap.exists() ? (snap.data().role as 'teacher' | 'student') : null);
      setLd(false);
    });
  }, []);


  return (
    <AuthC.Provider value={{ user, role, loading: loading }}>
      {loading ? null : children}
    </AuthC.Provider>
  );
};
export const useAuth = () => useContext(AuthC);
