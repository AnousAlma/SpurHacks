import useWindowFocus from '../../hooks/useWindowFocus';
import { Navigate, useNavigate } from 'react-router-dom';
import { useWritingExam } from '../../contexts/WritingExamContext';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


export default function Home() {
    const writing = useWritingExam();

    const navigate = useNavigate();

    const { user, loading } = useAuth();
    if (!loading && !user) {navigate('/login'); };

    return (
        <>
            <button
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    padding: '6px 12px',
                    backgroundColor: '#f87171',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    signOut(auth).then(() => {
                        navigate('/login');
                    }).catch((error) => {
                        console.error('Sign out error:', error);
                    })
                }}
            >
                Sign Out
            </button>
            <div
                style={{
                    width: '100%',
                    padding: '6px 0',
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 600,
                    backgroundColor: writing ? '#16a34a' : '#dc2626',
                }}
            >
                {writing ? 'Exam window active' : 'You left the exam window'}
            </div>
            {/* rest of the IDE UI */}
            <button onClick={() => navigate('/start/12345')}>Start</button>
        </>
    );
}