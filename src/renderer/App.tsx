import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import React, { useEffect, useState } from 'react';
import { WritingExamProvider } from '../contexts/WritingExamContext';
import StartPage from './pages/StartPage';
import Home from './pages/Home';
import TestTaking from './pages/TestTaking';
import Login from './pages/Login';


export default function App() {
  return (
    <WritingExamProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start/:testId" element={<StartPage />} />
          <Route path="/test/:testId" element={<TestTaking />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </WritingExamProvider>
  );
}
