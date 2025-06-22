// src/renderer/pages/AuthPage.tsx
import { useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    AuthError,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const nav = useNavigate();

    const { user, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && user) nav('/', { replace: true });
    }, [loading, user, nav]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await setPersistence(auth, browserLocalPersistence);
        setMsg('Checking…');

        try {
            await createUserWithEmailAndPassword(auth, email.trim(), pw);
            nav('/');
        } catch (err) {
            const code = (err as AuthError).code;
            console.log(code);                // <-- shows the real cause

            if (code === 'auth/email-already-in-use') {
                try {
                    await signInWithEmailAndPassword(auth, email.trim(), pw);
                    nav('/');
                } catch (e) {
                    setMsg((e as Error).message);
                }
            } else {
                setMsg((err as Error).message);
            }
        }
    };


    return (
        <form onSubmit={submit} className="loginCard">
            <h2>Log in / Sign up</h2>

            <input
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
            />

            {msg && <p style={{ color: '#e66' }}>{msg}</p>}
            <button>Continue</button>
            <p>No account? <Link to="/signup">Sign up</Link></p>
        </form>
    );
}
