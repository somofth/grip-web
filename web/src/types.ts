export type Mode = 1 | 2 | 3;
export type AnalysisState = 'idle' | 'crawling' | 'analyzing' | 'segmenting' | 'complete' | 'refining_questions' | 'setting_target';

export interface Question {
  id: string;
  text: string;
  type?: 'rating' | 'choice' | 'text';
  options?: { emoji: string; text: string; }[];
  logic?: string;
}

export interface Section {
  id: number;
  title: string;
  goal: string;
  reason: string;
  images: string[];
  questions: Question[];
}
