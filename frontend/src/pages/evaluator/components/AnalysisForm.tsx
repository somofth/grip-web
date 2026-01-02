import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onSubmit(url);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">New Analysis</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="url"
          placeholder="Enter product detail page URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
        >
          {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
          {isLoading ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
