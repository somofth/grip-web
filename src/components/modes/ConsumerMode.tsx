import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsDown, ThumbsUp, ArrowRight, ArrowLeft, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from "../../lib/utils";
import type { Section } from "../../types";

interface ConsumerModeProps {
  onComplete: () => void;
  sections: Section[];
}

export function ConsumerMode({ onComplete, sections }: ConsumerModeProps) {
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Purchase Step States
  const [isPurchaseStep, setIsPurchaseStep] = useState(false);
  const [purchaseDecision, setPurchaseDecision] = useState<'yes' | 'unsure' | 'no' | null>(null);
  const [purchaseReason, setPurchaseReason] = useState("");

  // Browser State
  const [showBrowser, setShowBrowser] = useState(false);

  /* New: track if scrolled to bottom */
  const [canEvaluate, dpSetCanEvaluate] = useState(false);
  
  // Ref for auto-scrolling
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [feedbackValues, setFeedbackValues] = useState<Record<string, string | number>>({});

  const currentSection = sections[unlockedIndex];

  const handleNext = () => {
    if (unlockedIndex < sections.length - 1) {
      setUnlockedIndex(prev => prev + 1);
      setShowEvaluation(false);
      setFeedbackValues({}); 
      dpSetCanEvaluate(false); // Reset for new section
      setTimeout(() => {
        sectionRefs.current[unlockedIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // Transition to Purchase Step instead of finishing immediately
      setIsPurchaseStep(true);
    }
  };

  const handleRating = (questionId: string, value: string | number) => {
    setFeedbackValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitPurchaseReview = () => {
     if (purchaseReason.length >= 10) {
        setIsFinished(true);
     }
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Check if near bottom (< 50px remaining)
    if (scrollHeight - scrollTop - clientHeight < 50) {
       dpSetCanEvaluate(true);
    }
  };

  const isSectionValid = () => {
    if (!currentSection) return false;
    return currentSection.questions.every(q => {
      const val = feedbackValues[q.id];
      if (q.type === 'subjective') {
        return typeof val === 'string' && val.trim().length >= 15;
      } else {
        return typeof val === 'number' && val > 0; // Objective
      }
    });
  };

  // Helper to get prompt text based on decision
  const getReasonPrompt = () => {
    switch (purchaseDecision) {
      case 'yes': return "이 상품을 구매하고 싶은 이유는 무엇인가요?";
      case 'unsure': return "구매를 망설이는 이유는 무엇인가요?";
      case 'no': return "구매하지 않는 이유는 무엇인가요?";
      default: return "";
    }
  };

  const handleReset = () => {
    setUnlockedIndex(0);
    setShowEvaluation(false);
    setIsFinished(false);
    setIsPurchaseStep(false);
    setPurchaseDecision(null);
    setPurchaseReason("");
    setFeedbackValues({});
    dpSetCanEvaluate(false);
    setShowBrowser(false);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isFinished && !showBrowser) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isFinished, showBrowser]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 flex items-center justify-center bg-gray-100"
    >
      <div className="w-[390px] h-[844px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Browser Overlay */}
        {showBrowser ? (
          <div className="absolute inset-0 z-50 bg-white flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-4 bg-white/90 backdrop-blur shrink-0">
               <span className="font-bold text-sm truncate pr-4 text-gray-700">coupang.com</span>
               <button 
                 onClick={() => setShowBrowser(false)}
                 className="p-2 -mr-2 text-gray-500 hover:text-black"
               >
                 <X size={24} />
               </button>
            </div>
            <iframe 
              src="https://www.coupang.com/vp/products/9113466210?itemId=26799110929&vendorItemId=93719088111&q=%EB%9D%BC%EB%B3%B4%EC%95%84+%EB%8B%A4%EC%9A%A9%EB%8F%84+%ED%85%8C%EC%9D%B4%EB%B8%94&searchId=f9de008d2339624&sourceType=search&itemsCount=36&searchRank=1&rank=1&traceId=mjyjopvt"
              className="flex-1 w-full bg-white"
              title="Product Page"
            />
          </div>
        ) : (
          <>
            {/* Mobile Header */}
            <div className="h-12 bg-white/80 backdrop-blur border-b flex items-center justify-center sticky top-0 z-10">
              <span className="font-semibold text-sm">공식 브랜드 스토어</span>
            </div>

            {/* Scrollable Content */}
            {!isFinished && !isPurchaseStep ? (
              <div 
                className="flex-1 overflow-y-auto no-scrollbar pb-32"
                onScroll={onScroll}
              >
                  {sections.slice(0, unlockedIndex + 1).map((section, index) => {
                    
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
            ) : isPurchaseStep && !isFinished ? (
                // Purchase Intention UI
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 bg-gray-50/50">
                    {!purchaseDecision ? (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-bold text-gray-900">모든 정보가 확인되었습니다.</h2>
                                <p className="text-sm text-gray-500">이 상품, 어떻게 생각하시나요?</p>
                            </div>

                            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <img src="/thumbnail.jpg" alt="Product Thumbnail" className="w-full h-48 object-cover" />
                                <div className="p-4 text-center">
                                    <p className="text-xs text-gray-400 font-medium mb-1">라보아 다용도 테이블</p>
                                    <p className="text-xl font-bold text-gray-900">49,900원</p>
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <p className="text-center font-bold text-base">이 상품을 구매할 용의가 있나요?</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <button 
                                        onClick={() => setPurchaseDecision('yes')}
                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white hover:bg-blue-50 transition-all border border-gray-200 hover:border-blue-200 shadow-sm"
                                    >
                                        <span className="text-2xl">😍</span>
                                        <span className="text-xs font-bold text-gray-700">네</span>
                                    </button>
                                    <button 
                                        onClick={() => setPurchaseDecision('unsure')}
                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 shadow-sm"
                                    >
                                        <span className="text-2xl">🤔</span>
                                        <span className="text-xs font-bold text-gray-700">글쎄요</span>
                                    </button>
                                    <button 
                                        onClick={() => setPurchaseDecision('no')}
                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white hover:bg-red-50 transition-all border border-gray-200 hover:border-red-200 shadow-sm"
                                    >
                                        <span className="text-2xl">🙅</span>
                                        <span className="text-xs font-bold text-gray-700">아니요</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full h-full flex flex-col"
                        >
                            <div className="flex items-center mb-6">
                                <button 
                                    onClick={() => {
                                        setPurchaseDecision(null);
                                        setPurchaseReason("");
                                    }}
                                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <span className="font-bold text-lg ml-2">이유를 알려주세요</span>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <span className="text-4xl mb-2 block">
                                        {purchaseDecision === 'yes' ? '😍' : purchaseDecision === 'unsure' ? '🤔' : '🙅'}
                                    </span>
                                    <p className="font-bold text-gray-800 text-lg break-keep">{getReasonPrompt()}</p>
                                </div>

                                <div className="relative">
                                    <textarea 
                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none h-40 shadow-sm"
                                        placeholder="솔직한 의견을 10자 이상 적어주세요."
                                        value={purchaseReason}
                                        onChange={(e) => setPurchaseReason(e.target.value)}
                                    />
                                    <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400 bg-white/80 px-2 py-1 rounded-md">
                                        {purchaseReason.length}자
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={submitPurchaseReview}
                                disabled={purchaseReason.length < 10}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all mt-6"
                            >
                                제출하고 결과 보기
                            </button>
                        </motion.div>
                    )}
                </div>
            ) : (
              <div className="flex-1 flex flex-col p-8 animate-in fade-in zoom-in duration-500">
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                      <motion.h2 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="text-3xl font-bold text-center text-gray-900"
                      >
                        500P 획득!
                      </motion.h2>
                      
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                        className="w-24 h-24"
                      >
                        <img src="/coins.png" alt="Coins" className="w-full h-full object-contain" />
                      </motion.div>
                      
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-gray-600 whitespace-pre-line text-lg"
                      >
                        피드백이 등록되었어요!{"\n"}
                        채택되면 추가 포인트를 받아요
                      </motion.p>
                  </div>
                  
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="w-full space-y-3 mt-auto pb-4"
                  >
                    <button 
                      onClick={() => setShowBrowser(true)}
                      className="w-full bg-primary text-white py-4 rounded-3xl font-bold hover:bg-blue-600 transition-all text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      이 상품 바로 구매하기
                    </button>
                    <button 
                      onClick={handleReset}
                      className="w-full bg-white text-gray-700 py-4 rounded-3xl font-bold border-2 border-gray-300 hover:bg-gray-50 transition-all text-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      다음 제품 리뷰하기
                    </button>
                  </motion.div>
              </div>
            )}

            {/* Fixed Bottom Evaluation Bar */}
            {!isFinished && !isPurchaseStep && currentSection && (
                <AnimatePresence>
                    <motion.div 
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl p-6 z-20"
                    >
                      {!showEvaluation ? (
                        <div className="space-y-4">
                          <p className="text-center font-semibold text-gray-800">
                            <span className="text-primary">"{currentSection.title}"</span> 섹션은 어떠셨나요?
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
                          <div className="space-y-6">
                            {currentSection.questions.map(q => (
                                <div key={q.id} className="space-y-3">
                                  <p className="text-sm text-gray-700 font-medium text-center break-keep leading-relaxed px-2">
                                      <span className="font-bold text-primary mr-2">Q.</span>
                                      {q.text}
                                  </p>
                                  
                                  {/* Render based on Question Type */}
                                  {q.type === 'subjective' ? (
                                      <div className="px-1">
                                          <textarea 
                                              placeholder="최소 15자 이상 입력해주세요..."
                                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none h-24"
                                              value={(feedbackValues[q.id] as string) || ''}
                                              onChange={(e) => handleRating(q.id, e.target.value)}
                                          />
                                          <div className="flex justify-end mt-1">
                                              <span className={cn(
                                                  "text-xs font-medium transition-colors",
                                                  ((feedbackValues[q.id] as string) || '').length >= 15 ? "text-green-600" : "text-gray-400"
                                              )}>
                                                  {((feedbackValues[q.id] as string) || '').length} / 15자
                                              </span>
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="flex items-center justify-between px-2 pt-1">
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
                                  )}
                                </div>
                              ))}
                          </div>
                          </div>

                          <button 
                            onClick={handleNext}
                            disabled={!isSectionValid()}
                            className="w-full bg-black text-white py-3 rounded-xl font-medium mt-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            제출하고 다음 보기 <ArrowRight size={16} className="inline ml-1 mb-0.5" />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                </AnimatePresence>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
