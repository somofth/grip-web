import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Eye, Plus } from 'lucide-react';
import { TargetingMode } from "../../TargetingMode"; // Adjusted path
import { QuestionAccordion } from "./QuestionAccordion";
import { ThumbnailArena } from "./ThumbnailArena";
import type { Section } from "../../types";

interface AnalysisResultsProps {
    sections: Section[];
    onSectionsChange: (sections: Section[]) => void;
    selectedTypes: string[];
    onComplete: () => void;
}

export function AnalysisResults({ sections, onSectionsChange, selectedTypes, onComplete }: AnalysisResultsProps) {
    const [view, setView] = useState<'analysis' | 'targeting'>('analysis');
    const [scrollProgress, setScrollProgress] = useState(0);

    // Flow State: If 'detail' is selected, start there. Otherwise start at 'thumbnail' (if selected).
    const [step, setStep] = useState<'detail' | 'thumbnail'>(
        selectedTypes.includes('detail') ? 'detail' : 'thumbnail'
    );

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - clientHeight > 0) {
            setScrollProgress(scrollTop / (scrollHeight - clientHeight));
        }
    };

    const handleNextStep = () => {
        if (step === 'detail' && selectedTypes.includes('thumbnail')) {
            setStep('thumbnail');
            // Scroll to top when switching steps
            const container = document.querySelector('.overflow-y-auto');
            if (container) container.scrollTop = 0;
        } else {
            setView('targeting');
        }
    };

    const isLastStep = (step === 'detail' && !selectedTypes.includes('thumbnail')) || step === 'thumbnail';

    return (
        <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
            className="flex-1 h-full bg-[#F2F4F6] relative z-20 flex flex-col overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {view === 'targeting' && (
                    <motion.div
                        key="targeting"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="bg-white absolute inset-0 z-30"
                    >
                        <TargetingMode onBack={() => setView('analysis')} onComplete={onComplete} />
                    </motion.div>
                )}
                {view === 'analysis' && (
                    <motion.div 
                        key="analysis"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-full relative"
                    >
                        {/* Header */}
                        <div className="bg-white px-8 py-6 shadow-sm z-10 flex justify-between items-center relative">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500 fill-emerald-50" />
                                    {step === 'detail' ? "상세페이지 분석 & 질문 구성" : "썸네일 A/B 테스트 설정"}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {step === 'detail' 
                                        ? "AI가 제안하는 질문을 확인하고 수정해보세요." 
                                        : "클릭률을 높일 비교군 썸네일을 준비해보세요."}
                                </p>
                            </div>
                            <button 
                                className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <Eye size={18} />
                                모바일 미리보기
                            </button>
                            {/* Scroll Progress Bar */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                                <motion.div 
                                    className="h-full bg-[#3182F6]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scrollProgress * 100}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 overflow-y-auto p-8" onScroll={handleScroll}>
                            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                                
                                {/* Detail Page Step */}
                                {step === 'detail' && selectedTypes.includes('detail') && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        {sections.map((section, idx) => (
                                            <div
                                                key={section.id}
                                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-300 hover:shadow-md transition-shadow group flex flex-col"
                                            >
                                                <div className="flex items-start gap-8">
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-baseline gap-3 mb-4">
                                                            <span className="text-blue-600 text-2xl font-bold">
                                                                0{idx + 1}
                                                            </span>
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#3182F6] transition-colors">
                                                                {section.title}
                                                            </h3>
                                                            <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                                                {section.goal}
                                                            </span>
                                                        </div>
                                                        
                                                        <p className="text-gray-500 text-lg leading-relaxed mb-4">
                                                            {section.reason.split(',').map((segment, i, arr) => (
                                                                <span key={i} className="block">
                                                                    {segment.trim()}{i < arr.length - 1 ? ',' : ''}
                                                                </span>
                                                            ))}
                                                        </p>
                                                    </div>

                                                    {/* Right Side Thumbnails */}
                                                    <div className="flex gap-3 shrink-0">
                                                        {section.images.slice(0, 2).map((img, i) => (
                                                            <div key={i} className="w-28 h-28 rounded-2xl overflow-hidden relative bg-gray-100 border-2 border-gray-200">
                                                                <img 
                                                                    src={img} 
                                                                    alt={`Thumbnail ${i + 1}`} 
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                {/* Accordion Questions */}
                                                {section.questions && (
                                                    <QuestionAccordion 
                                                        questions={section.questions} 
                                                        onUpdate={(newQs) => {
                                                            const updatedSections = sections.map(s => 
                                                                s.id === section.id ? { ...s, questions: newQs } : s
                                                            );
                                                            onSectionsChange(updatedSections);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Thumbnail Step */}
                                {step === 'thumbnail' && selectedTypes.includes('thumbnail') && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className=""
                                    >
                                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-300">
                                            <ThumbnailArena />
                                            
                                            {/* Optional: Add Thumbnail specific questions here later */}
                                            <div className="mt-8 pt-8 border-t border-gray-100">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle2 size={20} className="text-blue-500" />
                                                    썸네일 평가 질문
                                                </h3>
                                                <div className="bg-gray-50 rounded-xl p-4 text-gray-500 text-sm">
                                                     * 썸네일 클릭율 테스트는 자동으로 A/B 테스트 방식으로 진행됩니다.
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </div>
                            <div className="max-w-4xl mx-auto mt-12 flex justify-end pb-12">
                                <button 
                                    onClick={handleNextStep}
                                    className="bg-[#3182F6] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 text-lg hover:scale-105 active:scale-95 duration-200"
                                >
                                    {isLastStep ? (
                                        <>
                                            <Plus size={24} />
                                            진단 시작하기
                                        </>
                                    ) : (
                                        <>
                                            다음 단계로
                                            <motion.div 
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Eye size={24} /> 
                                            </motion.div> 
                                            {/* Using Eye temporarily as generic arrow replacement if ArrowRight not imported, 
                                                but context shows ArrowRight is common. Let's stick to what's available or clean icons. */}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
