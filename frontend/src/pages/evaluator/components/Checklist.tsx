import React from 'react';
import { Check, X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  passed: boolean;
  manualOverride?: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onToggle }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${item.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {item.passed ? <Check size={16} /> : <X size={16} />}
            </div>
            <span className="font-medium text-gray-700">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.manualOverride && <span className="text-xs text-amber-500 font-medium px-2 py-1 bg-amber-50 rounded">Manual Overridden</span>}
            <button 
              onClick={() => onToggle(item.id)}
              className="text-sm text-gray-500 underline hover:text-gray-800"
            >
              Adjust
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
