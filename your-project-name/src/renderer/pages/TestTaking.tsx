import React, {
  useState,
  useRef,
  useCallback,
  MouseEvent,
  useEffect,
} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import './split.css';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const LANGS = ['javascript', 'python', 'cpp', 'java'] as const;
const langSupport = { javascript: javascript(), python: python(), cpp: cpp(), java: java() };

interface ChatLine { role: 'user' | 'assistant'; text: string }
interface TestTakingProps {
  title?: string;
  duration?: String; // in seconds
  questions?: any[]; // list of question IDs or titles
}

export default function TestTaking() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (!loading && !user) return <Navigate to="/login" replace />;
  const { state } = useLocation();
  const { title, duration, questions } = state;

  const [lang, setLang] = useState<(typeof LANGS)[number]>('javascript');
  const [source, setSource] = useState('// write your solution here');
  const [consoleTxt, setCon] = useState('');
  const [leftPct, setLeftPct] = useState(28);
  const [topPct, setTopPct] = useState(68);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMsg, setAiMsg] = useState<ChatLine[]>([]);
  const [aiLoading, setAiLoad] = useState(false);

  const TASKS = questions ? questions.map(q => (
    { id: q.id, title: q.title, text: q.description || 'No description provided.' }
  )) :
    [
      { id: 1, title: 'FizzBuzz', text: 'Print 1-100; multiples of 3 → “Fizz”, 5 → “Buzz”.' },
      { id: 2, title: 'Reverse String', text: 'Return the reverse of the input string.' },
    ];

  const runCode = async () => {
    const u = auth.currentUser;
    if (!u) { setCon('not signed in'); return; }
    setCon('> running …');
    try {
      const token = await u.getIdToken();
      const out = await window.examApi.runCode(lang, source, token);
      setCon(out);
    } catch (err) {
      setCon('error: ' + String(err));
    }
  };

  const askAI = async () => {
    if (!aiInput.trim()) return;
    const u = auth.currentUser;
    if (!u) return;

    const token = await u.getIdToken();

    const examTasks = TASKS.map(t => `${t.id}. ${t.title}: ${t.text}`).join('\n');

    const chatHistory = aiMsg
      .map(l =>
        `${l.role === 'user' ? 'Student' : 'Assistant'}: ${l.text.replace(/\n+/g, ' ')}`
      )
      .join('\n');

    const context = [
      `Language: ${lang}`,
      'Current code (trimmed to 200 lines):',
      source.split('\n').slice(0, 200).join('\n'),
      '',
      'Conversation so far:',
      chatHistory || '(none)',
      '',
      'Exam tasks:',
      examTasks,
    ].join('\n');

    setAiMsg(m => [...m, { role: 'user', text: aiInput }]);
    setAiInput('');
    setAiLoad(true);


    try {
      const reply = await window.examApi.askAssistant(aiInput, context, token);
      setAiMsg(m => [...m, { role: 'assistant', text: reply.answer || 'No answer provided.' }]);
    } catch (e) {
      setAiMsg(m => [...m, { role: 'assistant', text: 'error: ' + String(e) }]);
    } finally {
      setAiLoad(false);
    }
  };


  const submitExam = () => navigate('/');

  const startDrag = useCallback((axis: 'x' | 'y', e: MouseEvent) => {
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
  }, [leftPct, topPct]);

  const [seconds, setSeconds] = useState(duration ? parseInt(duration[0]) : 100);

  useEffect(() => {
    // Exit early if countdown is finished
    if (seconds <= 0) {
      submitExam();
    }

    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds: number) => prevSeconds - 1);
    }, 1000); // Update every 1 second

    // Clean up the timer when the component unmounts or seconds change
    return () => clearInterval(timer);
  }, [seconds]); // Re-run effect when 'seconds' changes

  // Format the time for display
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  return (
    <div className="wrap" ref={wrapRef} style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div className="pane tasks" style={{ width: `${leftPct}%`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', background: 'black', color: 'white', width: '3vh', height: '2vh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20%', borderColor: 'white', borderWidth: '1px', margin: '1rem' }}>
          <p>{formatTime(seconds)}</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {TASKS.map(t => (
            <div key={t.id} className="taskCard">
              <h3>{t.id}. {t.title}</h3><p>{t.text}</p>
            </div>
          ))}
        </div>
        <button onClick={submitExam}
          style={{
            margin: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 600,
            background: '#4ade80', border: 'none', borderRadius: 8, cursor: 'pointer'
          }}>
          Submit Exam
        </button>
      </div>

      <div className="gutter vert" onMouseDown={e => startDrag('x', e)} />

      <div className="pane code" style={{ width: `${100 - leftPct}%`, position: 'relative' }}>
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
            onChange={v => setSource(v)}
          />
        </div>

        <div className="gutter horiz" onMouseDown={e => startDrag('y', e)} />

        <div className="column console"
          style={{
            height: `${100 - topPct}%`, background: '#1e1e1e', color: '#dcdcdc',
            position: 'relative', overflow: 'hidden'
          }}>
          <div style={{
            position: 'absolute', top: 6, right: aiOpen ? 330 : 10,
            display: 'flex', gap: 8, zIndex: 5
          }}>
            <button onClick={runCode}
              style={{
                padding: '8px 20px', fontSize: '1rem', fontWeight: 600,
                background: '#38bdf8', border: 'none', borderRadius: 8, cursor: 'pointer'
              }}>
              Run
            </button>
            <button onClick={() => setAiOpen(o => !o)}
              style={{
                padding: '8px', fontSize: '1.2rem', fontWeight: 600,
                background: '#64748b', border: 'none', borderRadius: 8, cursor: 'pointer'
              }}>
              💡
            </button>
          </div>

          <div style={{
            overflowY: 'auto', height: '100%', paddingTop: '40px',
            padding: '0.6rem 0.8rem', whiteSpace: 'pre-wrap'
          }}>
            {consoleTxt}
          </div>

          {aiOpen && (
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '100%',
              height: '95%', background: '#0f172a', color: '#e5e7eb',
              display: 'flex', flexDirection: 'column', borderLeft: '1px solid #334155',
            }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
                {aiMsg.map((m, i) => (
                  <div key={i} style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: m.role === 'user' ? '#93c5fd' : '#fbbf24' }}>
                      {m.role === 'user' ? 'You' : 'AI'}
                    </strong>
                    <div>{m.text}</div>
                  </div>
                ))}
                {aiLoading && <div>…</div>}
              </div>
              <form onSubmit={e => { e.preventDefault(); askAI(); }}
                style={{ display: 'flex', borderTop: '1px solid #334155' }}>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                  style={{
                    flex: 1, padding: '8px', background: '#1e293b',
                    color: '#e5e7eb', border: 'none'
                  }} />
                <button disabled={aiLoading}
                  style={{
                    padding: '0 16px', background: '#38bdf8',
                    border: 'none', cursor: 'pointer'
                  }}>
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
