import React, { useState, useRef, useCallback, MouseEvent } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import './split.css';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const TASKS = [
    { id: 1, title: 'FizzBuzz', text: 'Print 1-100; multiples of 3 → “Fizz”, 5 → “Buzz”.' },
    { id: 2, title: 'Reverse String', text: 'Return the reverse of the input string.' },
];

const LANGS = ['javascript', 'python', 'cpp', 'java'] as const;
const langSupport = { javascript: javascript(), python: python(), cpp: cpp(), java: java() };

export default function TestTaking() {
    const { user, loading } = useAuth();

    const [lang, setLang] = useState<(typeof LANGS)[number]>('javascript');
    const [source, setSource] = useState('// write your solution here');
    const [consoleText, setConsole] = useState('');
    const [leftPct, setLeftPct] = useState(28);
    const [topPct, setTopPct] = useState(68);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    if (!loading && !user) return <Navigate to="/login" replace />;


    const runCode = async () => {
        const u = auth.currentUser;
        if (!u) { setConsole('not signed in'); return; }
        setConsole('> running …');
        try {
            const token = await u.getIdToken();
            const out = await window.examApi.runCode(lang, source, token);
            setConsole(out);
        } catch (err) {
            setConsole('error: ' + String(err));
        }
    };

    const submitCode = () => navigate('/');
    const submitExam = () => navigate('/');

    const startDrag = useCallback(
        (axis: 'x' | 'y', e: MouseEvent) => {
            e.preventDefault();
            const wrap = wrapRef.current;
            if (!wrap) return;
            const { width, height } = wrap.getBoundingClientRect();
            const sx = e.clientX, sy = e.clientY;
            const initLeft = leftPct, initTop = topPct;
            const move = (ev: MouseEvent) => {
                if (axis === 'x') {
                    const dx = ev.clientX - sx;
                    setLeftPct(Math.min(80, Math.max(18, initLeft + (dx / width) * 100)));
                } else {
                    const dy = ev.clientY - sy;
                    setTopPct(Math.min(90, Math.max(30, initTop + (dy / height) * 100)));
                }
            };
            const up = () => {
                window.removeEventListener('mousemove', move as any);
                window.removeEventListener('mouseup', up as any);
            };
            window.addEventListener('mousemove', move as any);
            window.addEventListener('mouseup', up as any);
        },
        [leftPct, topPct],
    );

    return (
        <div className="wrap" ref={wrapRef} style={{ height: '100vh', width: '100vw' }}>
            <div className="pane tasks" style={{ width: `${leftPct}%`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {TASKS.map(t => (
                        <div key={t.id} className="taskCard">
                            <h3>{t.id}. {t.title}</h3>
                            <p>{t.text}</p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={submitExam}
                    style={{
                        marginTop: 'auto', margin: '1rem',
                        padding: '1rem', fontSize: '1.1rem', fontWeight: 600,
                        background: '#4ade80', border: 'none', borderRadius: 8, cursor: 'pointer'
                    }}
                >
                    Submit Exam
                </button>
            </div>

            <div className="gutter vert" onMouseDown={e => startDrag('x', e)} />

            <div className="pane code" style={{ width: `${100 - leftPct}%` }}>
                <div className="column" style={{ height: `${topPct}%` }}>
                    <div className="toolbar">
                        <select value={lang} onChange={e => setLang(e.target.value as any)}>
                            {LANGS.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                    <CodeMirror
                        value={source}
                        height={`${topPct}vh`}
                        theme={dracula}
                        extensions={[langSupport[lang]]}
                        onChange={(v) => setSource(v)}
                    />
                </div>

                <div className="gutter horiz" onMouseDown={e => startDrag('y', e)} />

                <div
                    className="column console"
                    style={{ height: `${100 - topPct}%`, background: '#1e1e1e', color: '#dcdcdc', position: 'relative' }}
                >
                    <div style={{ position: 'absolute', top: 6, right: 10, display: 'flex', gap: '8px', zIndex: 5 }}>
                        <button
                            onClick={runCode}
                            style={{
                                padding: '8px 20px', fontSize: '1rem', fontWeight: 600,
                                background: '#38bdf8', border: 'none', borderRadius: 8, cursor: 'pointer'
                            }}
                        >
                            Run
                        </button>
                        <button
                            onClick={submitCode}
                            style={{
                                padding: '8px 20px', fontSize: '1rem', fontWeight: 600,
                                background: '#fbbf24', border: 'none', borderRadius: 8, cursor: 'pointer'
                            }}
                        >
                            Submit Code
                        </button>
                    </div>

                    <div style={{ overflowY: 'auto', height: '100%', paddingTop: '40px', padding: '0.6rem 0.8rem' }}>
                        {consoleText.split('\n').map((ln, i) => <div key={i}>{ln}</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
