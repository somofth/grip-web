import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2 } from 'lucide-react';
import { cn } from "../../lib/utils";
import { LOADING_MESSAGES, DUMMY_SECTIONS } from "../../data/optimizerData";
import type { AnalysisState } from "../../types";

export function AnalysisMode() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AnalysisState>('idle');
  const [loadingText, setLoadingText] = useState("");
  
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
        "flex min-h-screen p-6 transition-all duration-700 ease-in-out",
        state === 'complete' ? "items-center justify-between gap-12 max-w-7xl mx-auto" : "items-center justify-center"
    )}>
      <motion.div 
        layout
        className={cn(
            "transition-all duration-700 flex flex-col items-center justify-center space-y-8",
            state === 'complete' ? "w-1/3 items-start text-left" : "w-full max-w-2xl text-center"
        )}
      >
        <div className={cn("space-y-2", state === 'complete' && "w-full")}>
           <motion.div 
            layout
            className={cn(
                "flex items-center justify-center transition-all",
                state === 'complete' ? "w-24 mb-4" : "w-80 mx-auto mb-8"
            )}
          >
            <img src="/grip-logo-w.png" alt="Logo" className="w-full object-contain" />
          </motion.div>
          {/* H1 Removed */}
          <motion.p layout className="text-xl text-white/80">
             상품 URL을 입력하면 AI가 구조를 분석하고<br/> 최적화 솔루션을 제안합니다.
          </motion.p>
        </div>

        {/* Input Area */}
        <div className="w-full space-y-4">
          <motion.div layout className="relative group w-full">
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

      {/* Right Result Panel */}
      <AnimatePresence>
        {state === 'complete' && (
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 w-2/3 max-w-3xl h-[80vh] overflow-y-auto no-scrollbar bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI가 사장님의 상세페이지를 분할했어요!</h2>
                        <p className="text-gray-500">소비자가 이해하기 쉽도록 내용을 나누어 정리했습니다.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {DUMMY_SECTIONS.map((section, idx) => (
                        <motion.div 
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1 block">Section 0{idx + 1}</span>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        {section.title}
                                    </h3>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-gray-900 border border-slate-200">
                                    {section.goal}
                                </span>
                            </div>

                            <div className="flex gap-6">
                                {/* Reason Text */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 text-justify">
                                        {/* @ts-ignore */}
                                        {section.reason}
                                    </p>
                                </div>
                                
                                {/* Thumbnails */}
                                <div className="flex gap-2">
                                    {section.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative group/img">
                                            <img 
                                                src={img} 
                                                alt="thumbnail" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=${idx+1}-${imgIdx+1}`;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
