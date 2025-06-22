import React, { useState, useEffect } from 'react';

const TeachersPage = () => {
    const [exams, setExams] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        duration: '',
        num_questions: '',
        deadline: '',
        description: '',
        attempts: '',
        userAttempts: 0,
        passingScore: '',
        status:'Available',
        questions: []
    });

    // Load exams from memory on component mount
    useEffect(() => {
        const savedExams = JSON.parse(localStorage.getItem('teacherExams')) || [];
        setExams(savedExams);
    }, []);

    // Save exams to memory
    const saveExamsToMemory = (updatedExams) => {
        window.teacherExams = updatedExams;
        setExams(updatedExams);
        // add it to localstorage with the other exams
        localStorage.setItem('teacherExams', JSON.stringify(updatedExams));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const addQuestion = () => {
        const newQuestion = {
            id: formData.questions.length + 1,
            title: '',
            description: ''
        };
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const removeQuestion = (index) => {
        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
        // Re-index questions
        const reIndexedQuestions = updatedQuestions.map((q, i) => ({
            ...q,
            id: i + 1
        }));
        setFormData(prev => ({
            ...prev,
            questions: reIndexedQuestions
        }));
    };

    const nextStep = () => {
        if (currentStep === 1) {
            // Validate basic info
            if (!formData.title || !formData.subject || !formData.duration || !formData.num_questions) {
                alert('Please fill in all required fields');
                return;
            }
            // Initialize questions array
            const numQuestions = parseInt(formData.num_questions);
            const questions = Array.from({ length: numQuestions }, (_, i) => ({
                id: i + 1,
                title: '',
                description: ''
            }));
            setFormData(prev => ({ ...prev, questions }));
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        setCurrentStep(1);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subject: '',
            duration: '',
            num_questions: '',
            deadline: '',
            description: '',
            attempts: '',
            passingScore: '',
            questions: []
        });
        setCurrentStep(1);
        setShowCreateForm(false);
    };

    const saveExam = () => {
        // Validate questions
        const incompleteQuestions = formData.questions.filter(q => !q.title || !q.description);
        if (incompleteQuestions.length > 0) {
            alert('Please complete all questions before saving');
            return;
        }

        // Generate sequential ID
        const existingExams = exams;
        const newId = existingExams.length > 0 ? Math.max(...existingExams.map(e => e.id)) + 1 : 1;

        const newExam = {
            id: newId,
            ...formData,
            num_questions: parseInt(formData.num_questions),
            attempts: parseInt(formData.attempts),
            userAttempts: 0,
            passingScore: parseInt(formData.passingScore),
            createdAt: new Date().toISOString(),
            status: 'Available'
        };

        const updatedExams = [...existingExams, newExam];
        saveExamsToMemory(updatedExams);
        resetForm();
    };

    const deleteExam = (examId) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            const updatedExams = exams.filter(exam => exam.id !== examId);
            saveExamsToMemory(updatedExams);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            color: 'white',
            fontFamily: 'sans-serif',
            padding: '1.5rem',
            marginTop: '3rem',
            width:'70vw',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            maxWidth: '1200px',
            margin: '0 auto 2rem auto'
        },
        title: {
            fontSize: '2.2rem',
            fontWeight: '300',
            margin: '0',
            letterSpacing: '0.02em'
        },
        createButton: {
            backgroundColor: 'white',
            color: '#333',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.1s ease-in',
            opacity: '0.9'
        },
        examsList: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        examCard: {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        examInfo: {
            flex: 1
        },
        examTitle: {
            fontSize: '1.3rem',
            fontWeight: '500',
            margin: '0 0 0.5rem 0'
        },
        examMeta: {
            fontSize: '0.9rem',
            opacity: '0.7',
            display: 'flex',
            gap: '1rem'
        },
        examActions: {
            display: 'flex',
            gap: '0.5rem'
        },
        actionButton: {
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.1s ease-in'
        },
        deleteButton: {
            backgroundColor: '#ff4444',
            color: 'white'
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            backdropFilter: 'blur(20px)'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        modalTitle: {
            fontSize: '1.8rem',
            fontWeight: '400',
            margin: '0'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0.6'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column'
        },
        label: {
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            opacity: '0.8'
        },
        input: {
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            fontSize: '0.9rem'
        },
        textarea: {
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            fontSize: '0.9rem',
            minHeight: '100px',
            resize: 'vertical'
        },
        stepIndicator: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            gap: '1rem'
        },
        step: {
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem'
        },
        activeStep: {
            background: '#4FC3F7',
            color: '#000'
        },
        inactiveStep: {
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)'
        },
        questionsSection: {
            marginBottom: '2rem'
        },
        questionCard: {
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
        },
        questionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
        },
        questionNumber: {
            fontSize: '1.1rem',
            fontWeight: '500'
        },
        removeButton: {
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            cursor: 'pointer'
        },
        modalButtons: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
        },
        button: {
            backgroundColor: 'white',
            color: '#333',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '1rem',
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
        addQuestionButton: {
            backgroundColor: 'transparent',
            color: '#4FC3F7',
            border: '1px solid #4FC3F7',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '1rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Teacher Dashboard</h1>
                <button
                    style={styles.createButton}
                    onClick={() => setShowCreateForm(true)}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.opacity = '0.9';
                    }}
                >
                    Create New Exam
                </button>
            </div>

            <div style={styles.examsList}>
                {exams.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: '0.6', padding: '3rem' }}>
                        <p>No exams created yet. Click "Create New Exam" to get started.</p>
                    </div>
                ) : (
                    exams.map(exam => (
                        <div key={exam.id} style={styles.examCard}>
                            <div style={styles.examInfo}>
                                <h3 style={styles.examTitle}>{exam.title}</h3>
                                <div style={styles.examMeta}>
                                    <span>{exam.subject}</span>
                                    <span>•</span>
                                    <span>{exam.duration}</span>
                                    <span>•</span>
                                    <span>{exam.num_questions} questions</span>
                                    <span>•</span>
                                    <span>Due: {new Date(exam.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={styles.examActions}>
                                <button
                                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                                    onClick={() => deleteExam(exam.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Exam Modal */}
            {showCreateForm && (
                <div style={styles.modalOverlay} onClick={() => resetForm()}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Create New Exam</h2>
                            <button style={styles.closeButton} onClick={resetForm}>×</button>
                        </div>

                        {/* Step Indicator */}
                        <div style={styles.stepIndicator}>
                            <div style={{
                                ...styles.step,
                                ...(currentStep === 1 ? styles.activeStep : styles.inactiveStep)
                            }}>
                                1. Basic Information
                            </div>
                            <div style={{
                                ...styles.step,
                                ...(currentStep === 2 ? styles.activeStep : styles.inactiveStep)
                            }}>
                                2. Questions
                            </div>
                        </div>

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div>
                                <div style={styles.formGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Title *</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Enter exam title"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Subject *</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => handleInputChange('subject', e.target.value)}
                                            placeholder="Enter subject"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Duration *</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                            placeholder="e.g., 2 hours"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Number of Questions *</label>
                                        <input
                                            style={styles.input}
                                            type="number"
                                            value={formData.num_questions}
                                            onChange={(e) => handleInputChange('num_questions', e.target.value)}
                                            placeholder="Enter number"
                                            min="1"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Deadline</label>
                                        <input
                                            style={styles.input}
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => handleInputChange('deadline', e.target.value)}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Max Attempts</label>
                                        <input
                                            style={styles.input}
                                            type="number"
                                            value={formData.attempts}
                                            onChange={(e) => handleInputChange('attempts', e.target.value)}
                                            placeholder="Enter max attempts"
                                            min="1"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Passing Score (%)</label>
                                        <input
                                            style={styles.input}
                                            type="number"
                                            value={formData.passingScore}
                                            onChange={(e) => handleInputChange('passingScore', e.target.value)}
                                            placeholder="Enter percentage"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        style={styles.textarea}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Enter exam description"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Questions */}
                        {currentStep === 2 && (
                            <div style={styles.questionsSection}>
                                <h3 style={{ marginBottom: '1rem' }}>Questions ({formData.questions.length})</h3>

                                {formData.questions.map((question, index) => (
                                    <div key={question.id} style={styles.questionCard}>
                                        <div style={styles.questionHeader}>
                                            <span style={styles.questionNumber}>Question {question.id}</span>
                                            {formData.questions.length > 1 && (
                                                <button
                                                    style={styles.removeButton}
                                                    onClick={() => removeQuestion(index)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Question Title</label>
                                            <input
                                                style={styles.input}
                                                type="text"
                                                value={question.title}
                                                onChange={(e) => handleQuestionChange(index, 'title', e.target.value)}
                                                placeholder="Enter question title"
                                            />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Question Description</label>
                                            <textarea
                                                style={styles.textarea}
                                                value={question.description}
                                                onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
                                                placeholder="Enter detailed question description"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    style={styles.addQuestionButton}
                                    onClick={addQuestion}
                                >
                                    + Add Question
                                </button>
                            </div>
                        )}

                        {/* Modal Buttons */}
                        <div style={styles.modalButtons}>
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton }}
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                            {currentStep === 1 ? (
                                <button
                                    style={styles.button}
                                    onClick={nextStep}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.opacity = '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.opacity = '0.9';
                                    }}
                                >
                                    Next: Questions
                                </button>
                            ) : (
                                <>
                                    <button
                                        style={{ ...styles.button, ...styles.secondaryButton }}
                                        onClick={prevStep}
                                    >
                                        Back
                                    </button>
                                    <button
                                        style={styles.button}
                                        onClick={saveExam}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                            e.target.style.opacity = '1';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.opacity = '0.9';
                                        }}
                                    >
                                        Save Exam
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeachersPage;