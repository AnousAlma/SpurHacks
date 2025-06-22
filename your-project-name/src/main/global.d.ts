/** Make TypeScript aware of window.examApi provided by preload.ts */
import type { ExamApi } from './preload';

declare global {
  interface Window {
    examApi: ExamApi;
  }
}
