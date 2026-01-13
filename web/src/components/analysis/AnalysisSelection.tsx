import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from "../../lib/utils";

interface AnalysisSelectionProps {
    selectedTypes: string[];
    onSelection: (type: string) => void;
    onProceed: () => void;
    onBack: () => void;
}

export function AnalysisSelection({ selectedTypes, onSelection, onProceed, onBack }: AnalysisSelectionProps) {
    return (
        <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full space-y-8"
        >
            <h2 className="text-3xl font-bold text-white text-center mb-10 leading-tight">
                어떤 분석을 진행할까요?
            </h2>
            <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
                <button
                    onClick={() => onSelection('detail')}
                    className={cn(
                        "relative rounded-[2.5rem] p-0 text-left transition-all duration-300 hover:scale-[1.03] group overflow-hidden border-4 flex flex-col h-[28rem] aspect-[5/6] justify-self-end",
                        selectedTypes.includes('detail') 
                            ? "bg-white border-blue-200 ring-8 ring-white/10 shadow-2xl" 
                            : "bg-white/90 border-transparent hover:bg-white"
                    )}
                >
                        <div className="h-[70%] w-full relative bg-gray-50 border-b border-gray-100 grid grid-cols-2 gap-1.5 p-1.5 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative overflow-hidden rounded-xl h-full">
                                <img 
                                    src={`/detailshots/0${i}.jpg`} 
                                    alt={`Detail ${i}`} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        ))}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent" />
                        {selectedTypes.includes('detail') && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg border-2 border-white"
                            >
                                <CheckCircle2 size={32} strokeWidth={3} />
                            </motion.div>
                        )}
                    </div>
                    <div className="h-[30%] w-full p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">상세페이지 분석</h3>
                            <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-md">
                                👍 추천
                            </span>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            구매 전환율을 높이는<br/>최적의 논리 구조 설계
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => onSelection('thumbnail')}
                    className={cn(
                        "relative rounded-[2.5rem] p-0 text-left transition-all duration-300 hover:scale-[1.03] group overflow-hidden border-4 flex flex-col h-[28rem] aspect-[5/6]",
                        selectedTypes.includes('thumbnail')  
                            ? "bg-white border-blue-200 ring-8 ring-white/10 shadow-2xl" 
                            : "bg-white/90 border-transparent hover:bg-white"
                    )}
                >
                    <div className="h-[70%] w-full relative bg-gray-900 border-b border-gray-100">
                        <img 
                            src="/thumbnail.jpg" 
                            alt="Thumbnail Analysis" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent" />
                        {selectedTypes.includes('thumbnail') && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg border-2 border-white"
                            >
                                <CheckCircle2 size={32} strokeWidth={3} />
                            </motion.div>
                        )}
                    </div>
                    <div className="h-[30%] w-full p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">썸네일 분석</h3>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            클릭률을 높이는<br/>매력적인 썸네일 진단
                        </p>
                    </div>
                </button>
            </div>
            
            <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
                    <motion.button 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onProceed}
                    disabled={selectedTypes.length === 0}
                    className="pointer-events-auto w-full max-w-lg bg-[#191F28] hover:bg-black text-white py-6 rounded-3xl font-bold text-2xl transition-all disabled:opacity-0 disabled:translate-y-10 shadow-2xl shadow-black/20 flex items-center justify-center gap-4 group"
                >
                    질문지 구성하기 
                    <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </motion.button>
            </div>
            
            <button 
                onClick={onBack}
                className="mx-auto block text-white/50 hover:text-white text-base font-medium transition-colors mt-8 underline decoration-white/30 hover:decoration-white pb-32"
            >
                URL 다시 입력하기
            </button>
        </motion.div>
    );
}
