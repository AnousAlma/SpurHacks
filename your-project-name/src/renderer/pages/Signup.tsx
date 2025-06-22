// src/renderer/pages/ExamAuthPage.jsx
import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import { Eye, EyeOff, User, GraduationCap, Lock, Mail } from 'lucide-react';
import { auth, db }         from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function ExamAuthPage() {
  const nav = useNavigate();

  const [isLogin, setIsLogin]     = useState(true);
  const [showPw,  setShowPw]      = useState(false);
  const [userType, setUserType]   = useState('student');  // picker
  const [form, setForm]           = useState({ email:'', pw:'', cpw:'' });
  const [err,  setErr]            = useState({});

  const handle = (e)=> setForm({ ...form, [e.target.name]: e.target.value });

  const validate = ()=>{
    const e={};
    if(!form.email) e.email='Email required';
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email='Invalid email';
    if(!form.pw) e.pw='Password required';
    else if(form.pw.length<6) e.pw='Min 6 chars';
    if(!isLogin && form.pw!==form.cpw) e.cpw='Passwords differ';
    setErr(e); return !Object.keys(e).length;
  };

  const submit = async ev=>{
    ev.preventDefault();
    if(!validate()) return;

    try{
      if(isLogin){
        const cred = await signInWithEmailAndPassword(auth, form.email, form.pw);
        const snap = await getDoc(doc(db,'users',cred.user.uid));
        const role = snap.exists()? snap.data().role : 'student';
        nav(role==='teacher'? '/teachers' : '/home', {replace:true});
      }else{
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.pw);
        await setDoc(doc(db,'users',cred.user.uid),{
          email: form.email,
          role : userType,
          createdAt: serverTimestamp()
        });
        nav(userType==='teacher'? '/teachers' : '/home', {replace:true});
      }
    }catch(e){
      setErr({ general:e.message });
    }
  };

  /* ---------- UI (same gradient / cards, trimmed for brevity) ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        {/* header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Exam IDE</h1>
          <p className="text-gray-300">{isLogin?'Secure Login':'Create Account'}</p>
        </div>

        {/* toggle */}
        <div className="flex bg-white/5 rounded-lg p-1 mb-6">
          <button className={`flex-1 py-2 rounded-md ${isLogin?'bg-white text-gray-900':'text-gray-300'}`}
                  onClick={()=>setIsLogin(true)}>Login</button>
          <button className={`flex-1 py-2 rounded-md ${!isLogin?'bg-white text-gray-900':'text-gray-300'}`}
                  onClick={()=>setIsLogin(false)}>Sign Up</button>
        </div>

        {/* form */}
        <form onSubmit={submit} className="space-y-4">
          {err.general && <p className="text-red-400">{err.general}</p>}

          {/* email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="email" value={form.email} onChange={handle}
                   placeholder="Email" className="w-full bg-white/5 py-3 pl-12 pr-4
                   rounded-lg text-white placeholder-gray-400"/>
          </div>
          {err.email && <p className="text-red-400">{err.email}</p>}

          {/* password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
            <input type={showPw?'text':'password'} name="pw"
                   value={form.pw} onChange={handle}
                   placeholder="Password"
                   className="w-full bg-white/5 py-3 pl-12 pr-10 rounded-lg
                              text-white placeholder-gray-400"/>
            <button type="button" onClick={()=>setShowPw(!showPw)}
                    className="absolute right-3 top-3 text-gray-400">
              {showPw? <EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
            </button>
          </div>
          {err.pw && <p className="text-red-400">{err.pw}</p>}

          {/* confirm password */}
          {!isLogin && (
            <>
              <input type="password" name="cpw" value={form.cpw} onChange={handle}
                     placeholder="Confirm password"
                     className="w-full bg-white/5 py-3 px-4 rounded-lg
                                text-white placeholder-gray-400"/>
              {err.cpw && <p className="text-red-400">{err.cpw}</p>}
            </>
          )}

          {/* role buttons */}
          {!isLogin && (
            <div className="flex gap-4">
              <button type="button"
                      onClick={()=>setUserType('student')}
                      className={`flex-1 py-3 rounded-lg ${userType==='student'
                        ?'bg-blue-500 text-white':'bg-white/5 text-gray-300'}`}>
                <User className="inline w-5 h-5 mr-1"/>Student
              </button>
              <button type="button"
                      onClick={()=>setUserType('teacher')}
                      className={`flex-1 py-3 rounded-lg ${userType==='teacher'
                        ?'bg-blue-500 text-white':'bg-white/5 text-gray-300'}`}>
                <GraduationCap className="inline w-5 h-5 mr-1"/>Teacher
              </button>
            </div>
          )}

          <button type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg">
            {isLogin? 'Sign In':'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
