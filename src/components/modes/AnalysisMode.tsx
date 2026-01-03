import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ArrowRight, ChevronDown, Plus } from 'lucide-react';
import { cn } from "../../lib/utils";
import { LOADING_MESSAGES, DUMMY_SECTIONS } from "../../data/optimizerData";
import type { AnalysisState } from "../../types";
import { Button } from "../ui/Button";

const SPRING_TRANSITION = { type: "spring", stiffness: 200, damping: 25, mass: 1 };

export function AnalysisMode({ onComplete }: { onComplete: () => void }) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AnalysisState>('idle');
  const [loadingText, setLoadingText] = useState("");
  const [activeSection, setActiveSection] = useState<number | null>(0);
  
  const startAnalysis = () => {
    if (!url) return;
    setState('crawling');
    
    // Simulation Sequence
    const steps = [
      { state: 'crawling', text: LOADING_MESSAGES.crawling, time: 0 },
      { state: 'analyzing', text: LOADING_MESSAGES.analyzing, time: 1500 },
      { state: 'segmenting', text: LOADING_MESSAGES.segmenting, time: 3000 },
      { state: 'complete', text: "분석 완료!", time: 4500 },
    ];

    steps.forEach(({ state: s, text, time }) => {
      setTimeout(() => {
        setState(s as AnalysisState);
        setLoadingText(text);
      }, time);
    });
  };

  return (
    <div className={cn(
        "flex min-h-screen p-6",
        state === 'complete' ? "items-center justify-between gap-12 w-full max-w-[95vw] mx-auto" : "items-center justify-center"
    )}>
      <AnimatePresence mode="popLayout">
      {(state !== 'refining_questions') && (
      <motion.div 
        layout="position"
        key="left-panel"
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        transition={SPRING_TRANSITION}
        className={cn(
            "flex flex-col items-center justify-center space-y-8",
            state === 'complete' ? "w-[20%] min-w-[320px] items-start text-left" : "w-full max-w-2xl text-center"
        )}
      >
        <div className={cn("space-y-2", state === 'complete' && "w-full")}>
           <motion.div 
            layout
            transition={SPRING_TRANSITION}
            className={cn(
                "flex items-center justify-center",
                state === 'complete' ? "w-24 mb-4" : "w-80 mx-auto mb-8"
            )}
          >
            <img src="/grip-logo-w.png" alt="Logo" className="w-full object-contain" />
          </motion.div>
          {/* H1 Removed */}
          <motion.p layout transition={SPRING_TRANSITION} className="text-xl text-white/80">
             진짜 고객의 눈으로 보는 데이터로,<br/> 최적화 솔루션을 제안합니다.
          </motion.p>
        </div>

        {/* Input Area */}
        <div className="w-full space-y-4">
          <motion.div layout transition={SPRING_TRANSITION} className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="https://smartstore.naver.com/..."
              className="block w-full pl-11 pr-32 py-4 bg-white border-2 border-transparent focus:border-primary/20 rounded-3xl text-lg focus:ring-0 focus:outline-none transition-all placeholder:text-gray-300"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={state !== 'idle'}
              onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
            />
            <button
              onClick={startAnalysis}
              disabled={state !== 'idle' || !url}
              className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-600 text-white px-6 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:hover:bg-primary"
            >
              {state === 'idle' ? '분석 시작' : '분석 중...'}
            </button>
          </motion.div>

          <AnimatePresence>
            {!url && (
              <motion.button 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  disabled={state !== 'idle'}
                  className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-3xl text-lg font-medium backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                  또는, 이미지 파일 직접 등록하기
              </motion.button>
            )}
          </AnimatePresence>
        </div>

         {/* Loading State Only (Centered) */}
         {state !== 'idle' && state !== 'complete' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 pt-8"
              >
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium text-white"
                  >
                    {loadingText}
                  </motion.p>
              </motion.div>
        )}

        {/* Proceed Button Removed per request */}
      </motion.div>
      )}
      </AnimatePresence>

      {/* Right Result Panel */}
      <AnimatePresence mode='popLayout'>
        {(state === 'complete' || state === 'refining_questions') && (
            <motion.div 
                layout="position"
                key="results-panel"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING_TRANSITION}
                className={cn(
                    "bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-[80vh] overflow-y-auto no-scrollbar",
                    state === 'refining_questions' ? "w-1/3 min-w-[400px]" : "flex-1"
                )}
            >
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <motion.h2 layout="position" className="text-xl font-bold text-gray-900">
                            {state === 'refining_questions' ? "AI 분할 결과" : "AI가 사장님의 상세페이지를 분할했어요!"}
                        </motion.h2>
                        {state === 'complete' && 
                          <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-gray-500">
                            소비자가 이해하기 쉽도록 내용을 나누어 정리했습니다.
                          </motion.p>
                        }
                    </div>
                </div>

                <div className="space-y-8">
                    {DUMMY_SECTIONS.map((section, idx) => (
                        <motion.div 
                            layout="position"
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...SPRING_TRANSITION, delay: 0.3 + (idx * 0.1) }}
                            className={cn(
                                "bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-colors group",
                                state === 'refining_questions' && "p-4"
                            )}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xl font-bold text-primary">0{idx + 1}</span>
                                <h3 className={cn("font-bold text-gray-900", state === 'refining_questions' ? "text-base" : "text-xl")}>
                                    {section.title}
                                </h3>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-gray-900 border border-slate-200">
                                    {section.goal}
                                </span>
                            </div>

                            <div className={cn("flex gap-6", state === 'refining_questions' && "flex-col gap-4")}>
                                {/* Reason Text - Hide in refining mode to save space or keep compact */}
                                {state !== 'refining_questions' && (
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 text-justify h-full flex items-center">
                                            {/* @ts-ignore */}
                                            {section.reason}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Thumbnails */}
                                <div className="flex gap-2">
                                    {section.images.map((img, imgIdx) => (
                                        <motion.div layout="position" key={imgIdx} className={cn(
                                            "rounded-lg overflow-hidden border border-gray-200 relative group/img",
                                            state === 'refining_questions' ? "w-24 h-24" : "w-32 h-32"
                                        )}>
                                            <img 
                                                src={img} 
                                                alt="thumbnail" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=${idx+1}-${imgIdx+1}`;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {state === 'complete' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex justify-end pt-8">
                            <Button 
                                variant="black" 
                                onClick={() => setState('refining_questions')}
                                className="bg-[#000000CC] hover:bg-black text-white px-8 py-4 rounded-3xl"
                            >
                                타깃 구체화하기 <ArrowRight size={20} />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* New Right Panel: Question Refinement */}
      <AnimatePresence>
        {state === 'refining_questions' && (
             <motion.div 
                key="questions-panel"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
                className="flex-1 max-w-2xl h-[80vh] bg-white rounded-3xl shadow-xl border border-gray-100 p-8 overflow-y-auto no-scrollbar ml-6 flex flex-col"
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 추천 질문 리스트</h2>
                    <p className="text-gray-500">각 섹션의 목적에 맞는 질문을 AI가 생성했습니다. <br/>클릭하여 선택하거나 직접 수정할 수 있습니다.</p>
                </div>

                <div className="space-y-4 flex-1">
                    {DUMMY_SECTIONS.map((section, idx) => (
                        <div key={section.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                             {/* Accordion Header */}
                             <button 
                                onClick={() => setActiveSection(activeSection === idx ? null : idx)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left",
                                    activeSection === idx && "bg-white border-b border-gray-100 shadow-sm"
                                )}
                             >
                                 <div className="flex items-center gap-3">
                                     <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                                         {idx + 1}
                                     </span>
                                     <h4 className="font-bold text-gray-800 text-base">{section.title}</h4>
                                 </div>
                                 <ChevronDown 
                                    className={cn(
                                        "text-gray-400 transition-transform duration-300",
                                        activeSection === idx && "transform rotate-180 text-primary"
                                    )} 
                                    size={20} 
                                />
                             </button>

                             {/* Accordion Content */}
                             <AnimatePresence>
                                {activeSection === idx && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 space-y-3 bg-white">
                                            {section.questions.map((q) => (
                                                <div key={q.id} className="group relative flex items-start gap-3">
                                                    <div className="pt-4 px-1">
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-primary cursor-pointer flex items-center justify-center transition-colors">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        defaultValue={q.text}
                                                        className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium leading-relaxed"
                                                        rows={2}
                                                    />
                                                </div>
                                            ))}
                                            
                                            {/* Add Manually Button */}
                                            <button className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/30 transition-all font-medium text-sm">
                                                <Plus size={16} /> 직접 질문 추가하기
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="pt-8 mt-4 border-t border-gray-100">
                    <Button 
                        variant="black" 
                        onClick={onComplete}
                        className="w-full bg-[#000000CC] hover:bg-black text-white px-8 py-5 rounded-3xl text-lg shadow-xl"
                    >
                        소비자 반응 테스트 시작하기 <ArrowRight size={20} />
                    </Button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
