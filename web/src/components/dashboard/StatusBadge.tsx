import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status }: { status: 'good' | 'warning' | 'critical' }) => {
    switch (status) {
        case 'good': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 우수</span>;
        case 'warning': return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><AlertCircle size={14}/> 개선 필요</span>;
        case 'critical': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><AlertCircle size={14}/> 치명적 문제</span>;
    }
};
