import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const handleContinue = () => {
        // Add your navigation logic here
        navigate('/start'); // Example test ID, replace with actual logic
    };
    const handleContinueTeacher = () => {
        // Add your navigation logic here
        navigate('/teacher'); // Example teacher page, replace with actual logic
    };

    const styles = {
        container: {
            minHeight: '100vh',
            width: '100vw',
            color: 'white',
            fontFamily: 'sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        },
        content: {
            textAlign: 'center',
            maxWidth: '600px',
            padding: '2rem'
        },
        title: {
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '100',
            margin: '0 0 1rem 0',
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        subtitle: {
            fontSize: '1.1rem',
            fontWeight: '300',
            margin: '0 0 3rem 0',
            opacity: '0.8',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
        },
        line: {
            width: '40px',
            height: '1px',
            background: 'rgba(255,255,255,0.3)'
        },
        aiIndicator: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '30px',
            margin: '0 0 3rem 0',
            backdropFilter: 'blur(10px)'
        },
        aiDot: {
            width: '8px',
            height: '8px',
            background: '#4FC3F7',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite'
        },
        aiText: {
            fontSize: '0.9rem',
            fontWeight: '300',
            opacity: '0.7'
        },
        button: {
            backgroundColor: 'white',
            color: '#333',
            padding: '1rem 3rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)',
            transition: 'all 0.1s ease-in',
            opacity: '0.9',
            margin: '0 0 4rem 0'
        },
        footer: {
            fontSize: '0.75rem',
            fontWeight: '300',
            opacity: '0.4',
            letterSpacing: '0.1em',
            margin: '0'
        },
        bgElement1: {
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
        },
        bgElement2: {
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '150px',
            height: '150px',
            background: 'rgba(79, 195, 247, 0.05)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.bgElement1}></div>
            <div style={styles.bgElement2}></div>

            <div style={styles.content}>
                <h1 style={styles.title}>ExamForge</h1>

                <div style={styles.subtitle}>
                    <div style={styles.line}></div>
                    <span>AI-Powered Secure Testing Environment</span>
                    <div style={styles.line}></div>
                </div>

                <div style={styles.aiIndicator}>
                    <div style={styles.aiDot}></div>
                    <span style={styles.aiText}>AI Assistant Ready</span>
                </div>

                <button
                    style={styles.button}
                    onClick={handleContinue}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.opacity = '0.9';
                    }}
                >
                    Begin Exam
                </button>
                <button
                    style={styles.button}
                    onClick={handleContinueTeacher}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.opacity = '0.9';
                    }}>
                    Create Exam
                </button>

                <p style={styles.footer}>SECURE • MONITORED • AI-ENHANCED</p>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.4; 
            transform: scale(0.95);
          }
        }
      `}</style>
        </div>
    );
};

export default Home;