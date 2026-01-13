import { Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export const RatingVisualizer = ({ score }: { score: number }) => (
    <div className="flex items-end gap-3">
        <div className="flex items-center gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={24} fill={star <= score ? "currentColor" : "none"} strokeWidth={star <= score ? 0 : 2} className="text-yellow-400" />
            ))}
        </div>
        <div className="flex flex-col">
            <span className="text-3xl font-bold text-gray-900 leading-none">{score.toFixed(1)} <span className="text-lg text-gray-400 font-normal">/ 5.0</span></span>
        </div>
    </div>
);

export const ChoiceVisualizer = ({ data }: { data: { name: string; value: number, color: string }[] }) => (
    <div className="w-full h-32 text-xs">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const TextVisualizer = ({ keywords, summary }: { keywords: string[], summary: string }) => (
    <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
            {keywords.map((k, i) => (
                <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-sm cursor-help hover:bg-slate-200 transition-colors">#{k}</span>
            ))}
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed border border-gray-100">
            <span className="font-bold mr-1">💡 AI 요약:</span> {summary}
        </p>
    </div>
);
