import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamsPage = () => {
    const [selectedExam, setSelectedExam] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

    // get exams from local storage
    const raw = JSON.parse(localStorage.getItem('teacherExams') || 'null');
    const exams = Array.isArray(raw) ? raw : [
        {
            id: 1,
            title: "Advanced JavaScript",
            subject: "Computer Science",
            duration: "2h",
            questions: [
                { id: 1, question: "What is a closure in JavaScript?", options: ["A function that retains access to its lexical scope", "A way to handle asynchronous operations", "A type of error handling", "A method for manipulating the DOM"], answer: 0 },
                { id: 2, question: "Explain the concept of promises in JavaScript.", options: ["A way to handle synchronous code", "A method for creating classes", "An object representing the eventual completion or failure of an asynchronous operation", "A technique for optimizing performance"], answer: 2 }
            ],
            deadline: "2025-06-30",
            status: "Available",
            description: "Comprehensive assessment covering ES6+, async programming, DOM manipulation, and modern JavaScript frameworks.",
            attempts: 0,
            maxAttempts: 2,
            passingScore: 75
        },
        {
            id: 2,
            title: "Data Structures & Algorithms",
            subject: "Computer Science",
            duration: "3h",
            questions: [
                { id: 1, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1 },
                { id: 2, question: "Explain the difference between a stack and a queue.", options: ["Stack is LIFO, Queue is FIFO", "Stack is FIFO, Queue is LIFO", "Both are the same", "Neither is used in programming"], answer: 0 },
                { id: 3, question: "What is a hash table?", options: ["A data structure that maps keys to values", "A type of algorithm", "A way to store images", "A method for sorting data"], answer: 0 }
            ],
            deadline: "2025-07-05",
            status: "Available",
            description: "In-depth examination of fundamental data structures, algorithm design, complexity analysis, and problem-solving techniques.",
            attempts: 1,
            maxAttempts: 3,
            passingScore: 80
        },
        {
            id: 3,
            title: "Database Management Systems",
            subject: "Information Systems",
            duration: "2.5h",
            questions: [
                { id: 1, question: "What is normalization in databases?", options: ["The process of organizing data to reduce redundancy", "A method for encrypting data", "A way to optimize queries", "A technique for indexing data"], answer: 0 },
                { id: 2, question: "Explain the concept of ACID properties in databases.", options: ["Atomicity, Consistency, Isolation, Durability", "Accessibility, Compatibility, Integrity, Distribution", "Analysis, Creation, Implementation, Deployment", "None of the above"], answer: 0 }
            ],
            deadline: "2025-06-28",
            status: "Completed",
            description: "Covers SQL queries, database design, normalization, transactions, and database administration concepts.",
            attempts: 2,
            maxAttempts: 2,
            passingScore: 70,
            score: 88
        },
        {
            id: 4,
            title: "Machine Learning Fundamentals",
            subject: "Artificial Intelligence",
            duration: "3.5h",
            questions: [
                { id: 1, question: "What is supervised learning?", options: ["Learning from labeled data", "Learning without labels", "A type of unsupervised learning", "A method for clustering data"], answer: 0 },
                { id: 2, question: "Explain the concept of neural networks.", options: ["A network of interconnected nodes that mimics the human brain", "A type of database", "A method for sorting data", "A way to handle errors"], answer: 0 },
                { id: 3, question: "What is overfitting in machine learning?", options: ["When a model performs well on training data but poorly on unseen data", "When a model is too simple", "When a model is too complex", "None of the above"], answer: 0 }
            ],
            deadline: "2025-07-10",
            status: "Available",
            description: "Introduction to ML algorithms, supervised/unsupervised learning, neural networks, and practical applications.",
            attempts: 0,
            maxAttempts: 2,
            passingScore: 75
        },
        {
            id: 5,
            title: "Web Security",
            subject: "Cybersecurity",
            duration: "2h",
            questions: [
                { id: 1, question: "What is SQL injection?", options: ["A type of security vulnerability that allows attackers to execute arbitrary SQL code", "A method for optimizing database queries", "A way to encrypt data", "A technique for indexing data"], answer: 0 },
                { id: 2, question: "    ", options: ["A vulnerability that allows attackers to inject malicious scripts into web pages viewed by users", "A method for securing web applications", "A way to handle user authentication", "None of the above"], answer: 0 }
            ],
            deadline: "2025-07-02",
            status: "Locked",
            description: "Security vulnerabilities, authentication, encryption, secure coding practices, and web application security.",
            attempts: 0,
            maxAttempts: 1,
            passingScore: 85
        },
        {
            id: 6,
            title: "Software Engineering Principles",
            subject: "Software Engineering",
            duration: "2.5h",
            questions: [
                { id: 1, question: "What is the purpose of version control systems?", options: ["To track changes in code and collaborate with others", "To optimize database queries", "To handle user authentication", "To encrypt data"], answer: 0 },
                { id: 2, question: "Explain the concept of agile software development.", options: ["A methodology that emphasizes iterative development, collaboration, and flexibility", "A type of database management", "A way to handle errors", "A method for sorting data"], answer: 0 },
                { id: 3, question: "What is unit testing?", options: ["Testing individual components of a software application to ensure they work as intended", "A method for optimizing performance", "A way to handle user authentication", "A technique for indexing data"], answer: 0 }
            ],
            deadline: "2025-07-08",
            status: "Available",
            description: "Software development lifecycle, design patterns, testing methodologies, and project management.",
            attempts: 0,
            maxAttempts: 2,
            passingScore: 75
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return '#4FC3F7';
            case 'Completed': return '#66BB6A';
            case 'Locked': return '#FF7043';
            default: return '#9E9E9E';
        }
    };

    const getStatusText = (exam) => {
        if (exam.status === 'Completed') {
            return `Completed (${exam.score}%)`;
        }
        return exam.status;
    };
    const handleStartExam = (examId: any) => {
        console.log(`Starting exam ${examId}...`);
        navigate(`/exam/${examId}`, {state: {title: examId.title, duration: examId.duration, questions: examId.questions}});
        setSelectedExam(null);
        // Add your exam start logic here
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(200.96deg, #535151 -29.09%, #292828 51.77%, #0d0d0d 129.35%)',
            color: 'white',
            fontFamily: 'sans-serif',
            padding: '1.5rem',
            marginTop: '100px',
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '2.2rem',
            fontWeight: '300',
            margin: '0 0 0.5rem 0',
            letterSpacing: '0.02em'
        },
        subtitle: {
            fontSize: '0.9rem',
            opacity: '0.7',
            fontWeight: '300',
            margin: '0'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
            maxWidth: '1400px',
            margin: '0 auto'
        },
        examCard: {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            height: 'fit-content'
        },
        examCardHover: {
            transform: 'translateY(-3px)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.75rem'
        },
        examTitle: {
            fontSize: '1.1rem',
            fontWeight: '500',
            margin: '0',
            flex: 1,
            marginRight: '1rem'
        },
        statusBadge: {
            padding: '0.2rem 0.6rem',
            borderRadius: '15px',
            fontSize: '0.75rem',
            fontWeight: '500',
            whiteSpace: 'nowrap'
        },
        examSubject: {
            fontSize: '0.8rem',
            opacity: '0.6',
            margin: '0 0 0.75rem 0'
        },
        examMeta: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            opacity: '0.8'
        },
        examInfo: {
            display: 'flex',
            gap: '0.75rem'
        },
        deadline: {
            fontSize: '0.75rem',
            opacity: '0.6'
        },
        // Modal styles
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        },
        modal: {
            background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            maxHeight: '80vh',
            overflowY: 'auto'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
        },
        modalTitleSection: {
            flex: 1
        },
        modalTitle: {
            fontSize: '1.6rem',
            fontWeight: '400',
            margin: '0 0 0.25rem 0'
        },
        modalSubject: {
            fontSize: '0.95rem',
            opacity: '0.7',
            margin: '0'
        },
        modalDescription: {
            fontSize: '0.9rem',
            lineHeight: '1.5',
            opacity: '0.9',
            margin: '0 0 1.5rem 0'
        },
        modalDetails: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem'
        },
        modalDetail: {
            background: 'rgba(255,255,255,0.03)',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
        },
        modalDetailLabel: {
            fontSize: '0.75rem',
            opacity: '0.6',
            marginBottom: '0.25rem'
        },
        modalDetailValue: {
            fontSize: '0.9rem',
            fontWeight: '500'
        },
        modalButtons: {
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end'
        },
        button: {
            backgroundColor: 'white',
            color: '#333',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.1s ease-in',
            opacity: '0.9'
        },
        secondaryButton: {
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0.6',
            padding: '0.5rem',
            marginLeft: '1rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Your Exams</h1>
                <p style={styles.subtitle}>Select an exam to view details and begin testing</p>
            </div>

            <div style={styles.grid}>
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        style={{
                            ...styles.examCard,
                            ...(hoveredCard === exam.id ? styles.examCardHover : {})
                        }}
                        onClick={() => setSelectedExam(exam)}
                        onMouseEnter={() => setHoveredCard(exam.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div style={styles.cardHeader}>
                            <h3 style={styles.examTitle}>{exam.title}</h3>
                            <div
                                style={{
                                    ...styles.statusBadge,
                                    background: getStatusColor(exam.status),
                                    color: exam.status === 'Available' ? '#000' : '#fff'
                                }}
                            >
                                {exam.status}
                            </div>
                        </div>

                        <p style={styles.examSubject}>{exam.subject}</p>

                        <div style={styles.examMeta}>
                            <div style={styles.examInfo}>
                                <span>{exam.duration}</span>
                                <span>•</span>
                                <span>{exam.questions.length}Q</span>
                                <span>•</span>
                                <span>{exam.attempts}/{exam.maxAttempts}</span>
                            </div>
                            <div style={styles.deadline}>
                                {new Date(exam.deadline).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedExam && (
                <div style={styles.modalOverlay} onClick={() => setSelectedExam(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div style={styles.modalTitleSection}>
                                <h2 style={styles.modalTitle}>{selectedExam.title}</h2>
                                <p style={styles.modalSubject}>{selectedExam.subject}</p>
                            </div>
                            <button
                                style={styles.closeButton}
                                onClick={() => setSelectedExam(null)}
                            >
                                ×
                            </button>
                        </div>

                        <p style={styles.modalDescription}>{selectedExam.description}</p>

                        <div style={styles.modalDetails}>
                            <div style={styles.modalDetail}>
                                <div style={styles.modalDetailLabel}>Duration</div>
                                <div style={styles.modalDetailValue}>{selectedExam.duration}</div>
                            </div>
                            <div style={styles.modalDetail}>
                                <div style={styles.modalDetailLabel}>Questions</div>
                                <div style={styles.modalDetailValue}>{selectedExam.questions.length}</div>
                            </div>
                            <div style={styles.modalDetail}>
                                <div style={styles.modalDetailLabel}>Passing Score</div>
                                <div style={styles.modalDetailValue}>{selectedExam.passingScore}%</div>
                            </div>
                            <div style={styles.modalDetail}>
                                <div style={styles.modalDetailLabel}>Attempts</div>
                                <div style={styles.modalDetailValue}>{selectedExam.attempts}/{selectedExam.maxAttempts}</div>
                            </div>
                            <div style={styles.modalDetail}>
                                <div style={styles.modalDetailLabel}>Deadline</div>
                                <div style={styles.modalDetailValue}>{new Date(selectedExam.deadline).toLocaleDateString()}</div>
                            </div>
                            <div style={styles.modalDetail}>
                                <div style={styles.modalDetailLabel}>Status</div>
                                <div style={styles.modalDetailValue}>{getStatusText(selectedExam)}</div>
                            </div>
                        </div>

                        <div style={styles.modalButtons}>
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton }}
                                onClick={() => setSelectedExam(null)}
                            >
                                Cancel
                            </button>
                            {selectedExam.status === 'Available' && (
                                <button
                                    style={styles.button}
                                    onClick={() => handleStartExam(selectedExam)}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.opacity = '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.opacity = '0.9';
                                    }}
                                >
                                    Start Exam
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamsPage;