import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface StartPageProps {
    testName: string;
    durationMinutes: number;
    description: string;
    onStart: () => void;
}

const cardStyle: React.CSSProperties = {
    width: 420,
    padding: '2.5rem 2.75rem',
    borderRadius: 16,
    background: '#1f1f1f',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4rem',
};

const titleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 4,
};

const metaStyle: React.CSSProperties = {
    fontSize: 16,
    opacity: 0.85,
};

const descStyle: React.CSSProperties = {
    lineHeight: 1.45,
    fontSize: 15,
    opacity: 0.9,
};

const buttonStyle: React.CSSProperties = {
    marginTop: 8,
    padding: '0.75rem 0',
    fontSize: 17,
    fontWeight: 600,
    color: '#0d0d0d',
    background: '#e6e267',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
};

const warnStyle: React.CSSProperties = {
    marginTop: 18,
    fontSize: 13,
    color: '#ff7676',
    textAlign: 'center',
    lineHeight: 1.3,
};

export default function StartPage() {
    const testName = "Sample Test";
    const durationMinutes = 30;
    const description = "This is a sample test description to help you prepare for the exam.";
    const navigate = useNavigate();
    const onStart = () => {
        navigate(`/test/12345`);
    }

    const { user, loading } = useAuth();
    if (!loading && !user) return <Navigate to="/login" replace />;


    return (
        <div style={cardStyle}>
            <div style={titleStyle}>{testName}</div>
            <div style={metaStyle}>Duration — {durationMinutes} minutes</div>
            <p style={descStyle}>{description}</p>
            <button style={buttonStyle} onClick={onStart}>
                Start Test
            </button>
            <div style={warnStyle}>
                Leaving or Alt-Tabbing from this window will immediately end the test.
            </div>
        </div>
    );
}
