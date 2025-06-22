// src/contexts/WritingExamContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface WritingExamContextValue {
  writingExam: boolean;
}

const WritingExamContext = createContext<WritingExamContextValue | undefined>(
  undefined,
);

export function WritingExamProvider({ children }: { children: React.ReactNode }) {
  const [writingExam, setWritingExam] = useState<boolean>(true);

  // keep a ref so the effect callback always sees the latest value
  const lockedRef = useRef(writingExam);
  lockedRef.current = writingExam;

  // helper that flips the flag once, never back
  const invalidate = () => {
    if (lockedRef.current) {
      lockedRef.current = false;
      setWritingExam(false);
      // optional: notify the back-end only the first time
      void fetch('/api/exam-ended', { method: 'POST' });
    }
  };

  useEffect(() => {
    // 1. main-process focus packets
    window.examApi.onFocusState(({ focused }) => {
      if (!focused) invalidate();
    });

    // 2. renderer-side visibility
    const onVis = () => {
      if (document.hidden) invalidate();
      window.examApi.reportVisibility(!document.hidden);
    };

    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <WritingExamContext.Provider value={{ writingExam }}>
      {children}
    </WritingExamContext.Provider>
  );
}

export function useWritingExam(): boolean {
  const ctx = useContext(WritingExamContext);
  if (!ctx) throw new Error('useWritingExam must be used inside WritingExamProvider');
  return ctx.writingExam;
}
