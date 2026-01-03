import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Wifi, Battery, CheckCircle2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from "../../lib/utils";
import { DUMMY_SECTIONS } from "../../data/optimizerData";

export function ConsumerMode({ onComplete }: { onComplete: () => void }) {
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  /* New: track if scrolled to bottom */
  const [canEvaluate, dpSetCanEvaluate] = useState(false);
  
  // Ref for auto-scrolling
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [feedbackValues, setFeedbackValues] = useState<Record<string, number>>({});

  const handleNext = () => {
    if (unlockedIndex < DUMMY_SECTIONS.length - 1) {
      setUnlockedIndex(prev => prev + 1);
      setShowEvaluation(false);
      setFeedbackValues({}); 
      dpSetCanEvaluate(false); // Reset for new section
      setTimeout(() => {
        sectionRefs.current[unlockedIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setIsFinished(true);
    }
  };

  const handleRating = (questionId: string, score: number) => {
    setFeedbackValues(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Check if near bottom (< 50px remaining)
    if (scrollHeight - scrollTop - clientHeight < 50) {
       dpSetCanEvaluate(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 flex items-center justify-center bg-gray-100"
    >
      <div className="w-[390px] h-[844px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col">
        {/* Mobile Header */}
        <div className="h-12 bg-white/80 backdrop-blur border-b flex items-center justify-center sticky top-0 z-10">
          <span className="font-semibold text-sm">공식 브랜드 스토어</span>
        </div>

        {/* Scrollable Content */}
        {!isFinished ? (
           <div 
             className="flex-1 overflow-y-auto no-scrollbar pb-32"
             onScroll={onScroll}
           >
              {DUMMY_SECTIONS.slice(0, unlockedIndex + 1).map((section, index) => {
                
                return (
                  <div 
                    key={section.id} 
                    ref={el => { sectionRefs.current[index] = el; }}
                    className="relative"
                  >
                    {/* Content Block */}
                    <div 
                      className="w-full flex flex-col items-center justify-start text-center p-0 transition-all duration-500 bg-white"
                    >
                      {/* Section Header */}
                      <div className="w-full py-6 px-4 bg-gray-50 border-b border-gray-100">
                         <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Section 0{index + 1}</span>
                         <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                         <p className="text-sm text-gray-500 mt-1">{section.goal}</p>
                      </div>

                      {/* Images Stack */}
                      <div className="w-full">
                         {section.images.map((img, imgIdx) => (
                           <div key={imgIdx} className="w-full border-b last:border-0 relative">
                              {/* Fallback for missing images using placeholder style if typical 404 behavior occurs, but simpler to just try render */}
                              <img 
                                 src={img} 
                                 alt={`${section.title}-${imgIdx}`} 
                                 className="w-full h-auto object-cover block"
                                 onError={(e) => {
                                   (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=Scan+Placeholder+${index+1}-${imgIdx+1}`;
                                 }}
                              />
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-center">평가 완료!</h2>
              <p className="text-center text-gray-600">소중한 피드백 감사합니다. <br/> 이 데이터는 페이지 최적화에 사용됩니다.</p>
              <button 
                 onClick={onComplete}
                 className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20"
              >
                 최적화 리포트 확인하기
              </button>
           </div>
         )}

        {/* Fixed Bottom Evaluation Bar */}
        {!isFinished && (
            <AnimatePresence>
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl p-6 z-20"
                >
                  {!showEvaluation ? (
                    <div className="space-y-4">
                      <p className="text-center font-semibold text-gray-800">
                        <span className="text-primary">"{DUMMY_SECTIONS[unlockedIndex].title}"</span> 섹션은 어떠셨나요?
                      </p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setShowEvaluation(true)}
                          disabled={!canEvaluate}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ThumbsDown size={20} /> 별로예요
                        </button>
                        <button 
                          onClick={() => setShowEvaluation(true)}
                          disabled={!canEvaluate}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ThumbsUp size={20} /> 좋아요
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                      {/* <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">상세 피드백</p> */ }
                      
                      <div className="space-y-3">
                      <div className="space-y-4">
                         {DUMMY_SECTIONS[unlockedIndex].questions.map(q => (
                            <div key={q.id} className="space-y-2">
                               <p className="text-sm text-gray-700 font-medium text-center">{q.text}</p>
                               <div className="flex items-center justify-between px-2 pt-2">
                                  <span className="text-xs text-gray-400 font-medium">낮음</span>
                                  <div className="flex gap-2">
                                     {[1,2,3,4,5].map(score => {
                                       const isSelected = feedbackValues[q.id] === score;
                                       const opacity = 0.15 + (score - 1) * 0.2; // 0.15, 0.35, 0.55, 0.75, 0.95
                                       const isTextWhite = score > 3;
                                       
                                       return (
                                         <button 
                                           key={score}
                                           onClick={() => handleRating(q.id, score)}
                                           style={isSelected ? { backgroundColor: `rgba(49, 130, 246, ${opacity})` } : {}}
                                           className={cn(
                                             "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm",
                                             isSelected 
                                               ? (isTextWhite ? "text-white scale-110" : "text-[#3182F6] scale-110")
                                               : "bg-white border border-gray-200 text-gray-400 hover:border-primary/50"
                                           )}
                                         >
                                           {score}
                                         </button>
                                       );
                                     })}
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium">높음</span>
                               </div>
                             </div>
                          ))}
                      </div>
                      </div>

                      <button 
                         onClick={handleNext}
                         className="w-full bg-black text-white py-3 rounded-xl font-medium mt-2"
                      >
                         제출하고 다음 보기
                      </button>
                    </motion.div>
                  )}
                </motion.div>
            </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
