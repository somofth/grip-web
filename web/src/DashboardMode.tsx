import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, AlertCircle, CheckCircle2, MessageCircle, BarChart3, Star, Users, MapPin, User, Home } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import type { Section, Question } from "./types";

// --- Types & Helper Generation Functions ---

// Extended type for Dashboard display handling
interface DashboardResult {
    score?: number;
    distribution?: { name: string; value: number; color: string }[];
    summary?: string;
    keywords?: string[];
}

const generateMockResult = (q: Question): DashboardResult => {
    // Deterministic pseudo-random based on string length to keep demo consistent
    const seed = q.text.length; 
    
    if (q.type === 'choice' && q.options) {
        // Generate distribution for provided options
        const total = 100;
        let remaining = total;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const distribution = q.options.map((opt, i) => {
            // Skew towards first options (usually positive in our data)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const val = i === q.options!.length - 1 ? remaining : Math.floor(remaining * (0.6 - i * 0.1));
            remaining -= val;
            return {
                name: opt.emoji + " " + opt.text.split(':')[0], // Shorten text for chart
                value: val < 0 ? 5 : val, // Fallback safety
                color: i === 0 ? '#3182F6' : i === 1 ? '#9CA3AF' : '#EF4444' // Blue -> Gray -> Red gradient approx
            };
        });
        return { distribution };
    } else if (q.type === 'text') {
        return {
            keywords: ["가격", "디자인", "배송"].sort(() => 0.5 - Math.random()),
            summary: "사용자들은 전반적으로 긍정적이나, 일부 옵션 선택 과정에서 혼란을 겪었다고 언급했습니다."
        };
    } else {
        // Rating default
        return { score: (seed % 20) / 10 + 3.0 }; // Returns 3.0 ~ 4.9
    }
};

const generateInsight = (q: Question, score?: number): { text: string, status: 'good' | 'warning' | 'critical' } => {
    if (q.type === 'text') {
        return { text: "주관식 응답 분석 결과, '배송'과 관련된 키워드가 40% 이상 등장했습니다. 상세페이지 내 배송 안내를 보강히세요.", status: 'warning' };
    }
    
    // Logic based on random score or passed score
    const safeScore = score || 4.0;
    
    if (safeScore >= 4.0) {
        return { text: "매우 긍정적인 반응입니다! 이 섹션은 구매 전환에 크게 기여하고 있습니다. 현재 상태를 유지하세요.", status: 'good' };
    } else if (safeScore >= 3.0) {
        return { text: "평이한 수준입니다. 유저 30%가 이 부분에서 스크롤 속도가 빨라졌습니다. 가독성을 높여보세요.", status: 'warning' };
    } else {
        return { text: "이탈 위험이 높습니다 (Critical). 유저들이 이 질문에 대해 부정적인 반응을 보였습니다. 즉시 수정이 필요합니다.", status: 'critical' };
    }
};

// --- Components ---

const StatusBadge = ({ status }: { status: 'good' | 'warning' | 'critical' }) => {
    switch (status) {
        case 'good': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 우수</span>;
        case 'warning': return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><AlertCircle size={14}/> 개선 필요</span>;
        case 'critical': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><AlertCircle size={14}/> 치명적 문제</span>;
    }
};

const RatingVisualizer = ({ score }: { score: number }) => (
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

const ChoiceVisualizer = ({ data }: { data: { name: string; value: number, color: string }[] }) => (
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

const TextVisualizer = ({ keywords, summary }: { keywords: string[], summary: string }) => (
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

const ParticipantSummary = () => {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8"
        >
            <div className="flex items-center gap-2 mb-6">
                <Users className="text-blue-500" size={24} />
                <h3 className="text-lg font-bold text-gray-900">참여 유저 프로필 요약</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">N = 50명</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Location */}
                <div className="flex items-start gap-4 pt-4 md:pt-0 pl-0 md:pl-4 first:pl-0">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl shrink-0">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">주요 거주지</div>
                        <div className="text-xl font-bold text-gray-900">서울/경기 <span className="text-blue-500 text-base">(62%)</span></div>
                        <div className="text-xs text-gray-400 mt-1">부산(15%), 대구(8%)</div>
                    </div>
                </div>

                {/* Gender & Age */}
                <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-8">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
                        <User size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">성별 / 연령</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">여성 58%</span>
                            <div className="h-4 w-[1px] bg-gray-300"></div>
                            <span className="text-xl font-bold text-gray-900">2030</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">구매력 높은 직장인 비중 높음</div>
                    </div>
                </div>

                {/* Persona / Household */}
                <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-8">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl shrink-0">
                        <Home size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">가구 형태 (Persona)</div>
                        <div className="text-xl font-bold text-gray-900">1인 가구 <span className="text-emerald-500 text-base">(45%)</span></div>
                        <div className="text-xs text-gray-400 mt-1">"좁은 공간 활용"에 관심 높음</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export function DashboardMode({ sections }: { sections: Section[] }) {
  // Use the passed sections to generate dynamic content
  const dashboardData = sections.flatMap((section) => 
     section.questions.map((q) => {
         const result = generateMockResult(q);
         const insight = generateInsight(q, result.score);
         
         return {
             id: section.id + "_" + q.id,
             sectionTitle: section.title,
             imageColor: "from-blue-50 to-white", // Default or map existing
             question: q.text,
             questionType: q.type || 'rating',
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
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                key={data.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
            >
                {/* Visual Placeholder (Left) */}
                <div className={`md:w-1/3 min-h-[240px] bg-gradient-to-br ${data.imageColor} flex items-center justify-center p-6 relative`}>
                    <div className="text-center opacity-40">
                        <BarChart3 size={48} className="mx-auto mb-3" />
                        <span className="font-bold text-lg block text-gray-800 tracking-wider">SECTION CHART</span>
                        <div className="text-xs mt-2">{data.sectionTitle}</div>
                    </div>
                </div>

                {/* Content (Right) */}
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Question Analysis</span>
                            <h3 className="text-xl font-bold text-gray-900">{data.sectionTitle}</h3>
                        </div>
                        <StatusBadge status={data.insight.status} />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2 font-medium flex items-center gap-1">
                            <MessageCircle size={14} />
                            유저에게 물었습니다:
                        </p>
                        <p className="text-lg font-medium text-gray-800 mb-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                            "{data.question}"
                        </p>

                        {/* Visualizer Switch */}
                        <div className="pl-2">
                             {data.questionType === 'rating' && data.result.score && (
                                 <RatingVisualizer score={data.result.score} />
                             )}
                             {data.questionType === 'choice' && data.result.distribution && (
                                 <ChoiceVisualizer data={data.result.distribution} />
                             )}
                             {data.questionType === 'text' && data.result.keywords && data.result.summary && (
                                 <TextVisualizer keywords={data.result.keywords} summary={data.result.summary} />
                             )}
                        </div>
                    </div>

                    {/* AI Insight Footer */}
                    <div className={`mt-6 pt-5 border-t border-gray-100 ${
                        data.insight.status === 'critical' ? 'bg-red-50 -mx-8 -mb-8 px-8 py-5 border-t-red-100' : 
                        data.insight.status === 'warning' ? 'bg-amber-50 -mx-8 -mb-8 px-8 py-5 border-t-amber-100' : ''
                    }`}>
                        <div className="flex items-start gap-3">
                            <Sparkles className={`mt-0.5 flex-shrink-0 ${
                                data.insight.status === 'critical' ? 'text-red-500' : 
                                data.insight.status === 'warning' ? 'text-amber-500' : 'text-blue-500'
                            }`} size={18} />
                            <div>
                                <h4 className={`text-sm font-bold mb-1 ${
                                    data.insight.status === 'critical' ? 'text-red-800' : 
                                    data.insight.status === 'warning' ? 'text-amber-800' : 'text-blue-800'
                                }`}>AI Insight</h4>
                                <p className={`text-sm leading-relaxed ${
                                    data.insight.status === 'critical' ? 'text-red-700' : 
                                    data.insight.status === 'warning' ? 'text-amber-700' : 'text-gray-600'
                                }`}>
                                    {data.insight.text}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
