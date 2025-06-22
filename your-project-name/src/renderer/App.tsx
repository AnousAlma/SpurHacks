import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import React, { useEffect, useState } from 'react';
import { WritingExamProvider } from '../contexts/WritingExamContext';
import StartPage from './pages/StartPage';
import Home from './pages/Home';
import TestTaking from './pages/TestTaking';
import Login from './pages/Login';
import TeachersPage from './pages/TeachersHome';
import ExamAuthPage from './pages/Signup';


export default function App() {
  return (
    <WritingExamProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/exam/:testId" element={<TestTaking />} />
          <Route path="/signin" element={<ExamAuthPage />} />
          <Route path="/teacher" element={<TeachersPage/>} />
        </Routes>
      </Router>
    </WritingExamProvider>
  );
}