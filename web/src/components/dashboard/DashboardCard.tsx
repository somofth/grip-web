import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, BarChart3 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { RatingVisualizer, ChoiceVisualizer, TextVisualizer } from './Visualizers';
import type { DashboardResult, Question } from '../../types';

export interface DashboardCardData {
    id: string;
    sectionTitle: string;
    imageColor: string;
    question: string;
    questionType: Question['type'];
    result: DashboardResult;
    insight: { text: string; status: 'good' | 'warning' | 'critical' };
    logic?: string;
}

interface DashboardCardProps {
    data: DashboardCardData;
    index: number;
}

export function DashboardCard({ data, index }: DashboardCardProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
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
                            {(!data.questionType || data.questionType === 'rating') && data.result.score && (
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
    );
}
