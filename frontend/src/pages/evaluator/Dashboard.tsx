import React, { useState } from 'react';
import AnalysisForm from './components/AnalysisForm';
import { startAnalysis } from '../../services/api';

const EvaluatorDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await startAnalysis(url);
      console.log("Analysis started:", response);
      // In a real app we'd likely poll for status or redirect to a detail view for the evaluator
      // For now, let's just log it. Maybe redirect to the report view for preview?
      // Or stay here and show status.
      // The requirement says "Control Dashboard... Realtime logs". 
      // We'll implemented a simple status message for now.
      alert(`Analysis started! ID: ${response.id}`);
      // navigate(/workspace/${response.id}); // If we had a workspace detail view
    } catch (err) {
      console.error(err);
      setError("Failed to start analysis. Please check the backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Evaluator Workspace</h1>
          <p className="text-gray-600 mt-2">Manage and analyze product detail pages.</p>
        </header>

        <AnalysisForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-gray-400">
            <span>Recent Analyses (Placeholder)</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-gray-400">
             <span>System Logs (Placeholder)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorDashboard;
