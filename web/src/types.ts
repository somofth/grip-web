export type Mode = 1 | 2 | 3;
export type AnalysisState = 'idle' | 'crawling' | 'analyzing' | 'segmenting' | 'complete' | 'refining_questions' | 'setting_target' | 'uploading_detail';

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

export interface DashboardResult {
    score?: number;
    distribution?: { name: string; value: number; color: string }[];
    summary?: string;
    keywords?: string[];
}
