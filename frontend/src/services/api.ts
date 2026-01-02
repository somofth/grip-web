import axios from 'axios';

const API_BASE_URL = '/api'; // Proxy will handle this in development

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface AnalysisRequest {
  url: string;
  evaluator_id: string;
}

export interface AnalysisResponse {
  id: string;
  status: string;
}

export const startAnalysis = async (url: string): Promise<AnalysisResponse> => {
  const response = await api.post<AnalysisResponse>('/analyze', { url, evaluator_id: 'user' });
  return response.data;
};

export const getAnalysisResult = async (id: string) => {
  const response = await api.get(`/analyze/${id}`);
  return response.data;
};
