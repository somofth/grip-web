import React, { useState } from 'react';

interface InspectorProps {
  htmlContent: string;
  imageChunks: string[]; // Base64 strings or URLs
  extractedText: string;
}

const Inspector: React.FC<InspectorProps> = ({ htmlContent, imageChunks, extractedText }) => {
  const [tab, setTab] = useState<'text' | 'images' | 'html'>('text');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setTab('text')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Extracted Text
        </button>
        <button 
          onClick={() => setTab('images')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Image Chunks ({imageChunks.length})
        </button>
        <button 
          onClick={() => setTab('html')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'html' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Raw HTML
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-auto bg-gray-50">
        {tab === 'text' && (
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">{extractedText}</pre>
        )}
        {tab === 'images' && (
          <div className="grid grid-cols-2 gap-4">
            {imageChunks.map((chunk, i) => (
              <div key={i} className="border rounded bg-white p-2">
                <img src={chunk} alt={`Chunk ${i}`} className="w-full h-auto" />
                <p className="text-center text-xs text-gray-500 mt-1">Chunk {i+1}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'html' && (
          <pre className="text-xs text-gray-700 overflow-auto h-full">{htmlContent.slice(0, 2000)}... (truncated)</pre>
        )}
      </div>
    </div>
  );
};

export default Inspector;
