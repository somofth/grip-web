import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from "./lib/utils";
import type { Section } from "./types";
import coinsImg from './assets/coins.png';

interface ConsumerModeProps {
  onComplete: () => void;
  sections: Section[];
}

export function ConsumerMode({ onComplete, sections }: ConsumerModeProps) {
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, number>>({});
  const [purchaseIntention, setPurchaseIntention] = useState<'yes' | 'no' | 'maybe' | null>(null);

  const currentSection = sections[unlockedIndex];
  const isLastSection = unlockedIndex === sections.length - 1;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when unlocking new section
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
      }, 100);
    }
  }, [unlockedIndex]);

  const handleEvaluationSubmit = () => {
    setShowEvaluation(false);
    
    if (isLastSection) {
       // Proceed to final purchase question, handled by UI state
    } else {
       setUnlockedIndex(prev => prev + 1);
       // Small confetti for progress
       confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3182F6', '#ffffff'] 
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const currentQuestions = currentSection?.questions || [];
  const canSubmitEvaluation = currentQuestions.every(q => (feedback[q.id] || 0) > 0);

  const handlePurchaseSubmit = (decision: 'yes' | 'no' | 'maybe') => {
      setPurchaseIntention(decision);
      triggerConfetti();
      // Show completion screen after a delay
      setTimeout(() => onComplete(), 3000); 
  };

  return (
    <div className="w-full max-w-[400px] h-[844px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col mx-auto my-4">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-center bg-white z-10 sticky top-0 shrink-0">
        <span className="font-semibold text-sm">공식 브랜드스토어</span>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar pb-32 relative bg-gray-50"
      >
        {sections.slice(0, unlockedIndex + 1).map((section, idx) => (
          <div key={section.id} className={cn("bg-white mb-4 shadow-sm pb-8", idx !== 0 && "mt-2")}>
             {/* Section Header */}
             <div className={`p-6 bg-gradient-to-b ${section.color || 'from-blue-50 to-white'}`}>
                <span className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1 block">
                    Section 0{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {section.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{section.goal}</p>
             </div>

             {/* Images */}
             <div className="space-y-2 px-0">
                {section.images.map((img, i) => (
                    <img 
                        key={i} 
                        src={img} 
                        alt={`Section ${section.id} detail ${i}`}
                        className="w-full h-auto object-cover" 
                    />
                ))}
             </div>

             {/* Evaluation Trigger (Shown for the current unlocked section only) */}
             {idx === unlockedIndex && !purchaseIntention && (
                 <div className="px-6 mt-8">
                     <div className="bg-[#F2F4F6] rounded-2xl p-6 text-center">
                         <p className="text-gray-900 font-bold mb-2">이 섹션은 어떠셨나요?</p>
                         <p className="text-xs text-gray-500 mb-4">평가를 완료하면 다음 내용을 볼 수 있어요</p>
                         
                         <button 
                            onClick={() => setShowEvaluation(true)}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                         >
                            <Check size={18} />
                            {isLastSection ? '평가하고 구매 결정하기' : '평가하고 계속 보기'}
                         </button>
                     </div>
                 </div>
             )}
          </div>
        ))}
        
        {/* Placeholder for Next Locked Section */}
        {!isLastSection && !purchaseIntention && (
            <div className="p-6 opacity-50 blur-sm pointer-events-none relative h-64 overflow-hidden bg-white mt-4 mx-4 rounded-xl border border-gray-100">
                 <div className="absolute inset-0 flex items-center justify-center z-10">
                     <div className="bg-gray-900/10 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 text-gray-600 font-bold">
                         <Lock size={16} />
                         <span>이전 섹션을 평가해주세요</span>
                     </div>
                 </div>
                 <div className="h-full bg-gray-100 animate-pulse"></div>
            </div>
        )}

        {/* Final Purchase Decision Screen (Shown after last section evaluation) */}
        {isLastSection && unlockedIndex === sections.length - 1 && purchaseIntention === null && (
             <div className="mt-8 px-6 pb-20">
                 <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 text-center">
                     <h3 className="text-xl font-bold mb-2">모든 섹션을 확인하셨네요!</h3>
                     <p className="text-gray-500 text-sm mb-6">이 제품을 구매하실 의향이 있으신가요?</p>
                     
                     <div className="space-y-3">
                         <button onClick={() => handlePurchaseSubmit('yes')} className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">
                            네, 구매할래요!
                         </button>
                         <button onClick={() => handlePurchaseSubmit('maybe')} className="w-full py-4 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors">
                            고민 좀 해볼게요
                         </button>
                         <button onClick={() => handlePurchaseSubmit('no')} className="w-full py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                            아니요
                         </button>
                     </div>
                 </div>
             </div>
        )}
      </div>

      {/* Completion (Reward) Overlay */}
      <AnimatePresence>
        {purchaseIntention && (
            <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center"
            >
                <div className="w-full max-w-sm flex flex-col h-full relative">
                    {/* Top Content */}
                    <div className="flex-1 flex flex-col items-center justify-center mt-10">
                         <h2 className="text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">
                            500P 획득!
                         </h2>
                         
                         <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="relative mb-8"
                         >
                            <img src={coinsImg} alt="Coins" className="w-48 h-48 object-contain drop-shadow-2xl" />
                         </motion.div>
                         
                         <div className="space-y-2">
                             <p className="text-gray-500 text-lg">
                                 꼼꼼한 평가 감사합니다.<br/>
                                 적립된 포인트는 즉시 사용 가능합니다.
                             </p>
                         </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="w-full mt-auto mb-8 space-y-3">
                        <button className="w-full py-4 bg-[#3182F6] text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-[0.98]">
                            이 상품 바로 구매하기
                        </button>
                        <button 
                            onClick={onComplete}
                            className="w-full py-4 bg-gray-100 text-gray-700 text-lg font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                        >
                            다음 제품 리뷰하기
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Evaluation Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {showEvaluation && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowEvaluation(false)}
                    className="absolute inset-0 bg-black z-40"
                />
                
                {/* Drawer */}
                <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-50 p-6 pb-8 h-[70vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                >
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <h3 className="text-2xl font-bold mb-2">상세 평가</h3>
                        <p className="text-gray-500 mb-8">가장 솔직한 의견을 남겨주세요.</p>

                        <div className="space-y-8">
                            {currentQuestions.map((q) => (
                                <div key={q.id}>
                                    <p className="font-bold text-gray-900 mb-3 text-lg">
                                        Q. {q.text}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between px-1 mb-2">
                                            <span className="text-xs text-gray-400">아쉬워요</span>
                                            <span className="text-xs text-gray-400">최고예요</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((score) => {
                                                const isActive = feedback[q.id] === score;
                                                return (
                                                    <button
                                                        key={score}
                                                        onClick={() => setFeedback(prev => ({ ...prev, [q.id]: score }))}
                                                        className={cn(
                                                            "flex-1 h-12 rounded-xl text-lg font-bold transition-all",
                                                            isActive 
                                                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105" 
                                                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                        )}
                                                    >
                                                        {score}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleEvaluationSubmit}
                            disabled={!canSubmitEvaluation}
                            className="w-full py-4 bg-[#3182F6] text-white rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                        >
                            {isLastSection ? '평가 완료' : '다음 섹션 열기'}
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}
