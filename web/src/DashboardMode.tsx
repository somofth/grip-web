import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

import type { Section } from "./types";
import { generateMockResult, generateInsight } from "./utils/dashboardHelpers";

import { ParticipantSummary } from './components/dashboard/ParticipantSummary';
import { DashboardCard, type DashboardCardData } from './components/dashboard/DashboardCard';

export function DashboardMode({ sections }: { sections: Section[] }) {
  // Use the passed sections to generate dynamic content
  const dashboardData: DashboardCardData[] = sections.flatMap((section) => 
     section.questions.map((q) => {
         const result = generateMockResult(q);
         const insight = generateInsight(q, result.score);
         
         return {
             id: section.id + "_" + q.id,
             sectionTitle: section.title,
             imageColor: "from-blue-50 to-white", // Default or map existing
             question: q.text,
             questionType: q.type,
             result,
             insight,
             logic: q.logic
         };
     })
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#F2F4F6] min-h-screen p-6 md:p-12 overflow-y-auto"
    >
      {/* Header Area */}
      <header className="max-w-4xl mx-auto mb-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">상세페이지 AI 진단 리포트</h1>
                <p className="text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    분석 완료: 2026.01.11 14:30
                </p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <div className="text-sm text-gray-500 font-medium">예상 구매 전환율</div>
                    <div className="text-2xl font-bold text-gray-900">3.2% <span className="text-emerald-500 text-lg font-medium">(+1.1%)</span></div>
                </div>
            </div>
         </div>
      </header>

      {/* Participant Profile Summary */}
      <div className="max-w-4xl mx-auto">
        <ParticipantSummary />
      </div>

      {/* Main Content: Vertical Stack */}
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        {dashboardData.map((data, index) => (
            <DashboardCard 
                key={data.id} 
                data={data} 
                index={index} 
            />
        ))}
      </div>
    </motion.div>
  );
}
