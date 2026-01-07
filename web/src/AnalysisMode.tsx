import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from "./lib/utils";
import { LOADING_MESSAGES } from "./data/optimizerData";
import type { AnalysisState, Section } from "./types";
import gripLogo from './assets/grip-logo-w.png';

interface AnalysisModeProps {
  onComplete: () => void;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
}

const SPRING_TRANSITION = { type: "spring" as const, stiffness: 100, damping: 20 };

export function AnalysisMode({ onComplete, sections }: AnalysisModeProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<AnalysisState>('idle');
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES.crawling);

  const startAnalysis = () => {
    if (!url) return;
    setStatus('crawling');

    // Simulate Process
    setTimeout(() => {
        setStatus('analyzing');
        setLoadingMsg(LOADING_MESSAGES.analyzing);
    }, 1500);

    setTimeout(() => {
        setStatus('segmenting');
        setLoadingMsg(LOADING_MESSAGES.segmenting);
    }, 3000);

    setTimeout(() => {
        setStatus('complete');
    }, 4500);
  };

  const isComplete = status === 'complete';

  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5387FF] to-[#3182F6] opacity-100 z-0" />
      
      {/* Left Panel (Input) - Animates to side on completion */}
      <motion.div 
        layout
        transition={SPRING_TRANSITION}
        className={cn(
            "relative z-10 flex flex-col justify-center transition-all duration-700 h-full",
            isComplete ? "w-1/3 px-8 bg-white/10 backdrop-blur-lg border-r border-white/20" : "w-full items-center px-4"
        )}
      >
        <div className={cn("w-full max-w-xl space-y-8", isComplete ? "scale-90 origin-left" : "")}>
          {/* Logo & Header */}
          <motion.div layout className="text-center space-y-6">
             <motion.div layoutId="logo" className="w-48 mx-auto mb-8">
                <img src={gripLogo} alt="Logo" className="w-full object-contain brightness-0 invert" /> 
             </motion.div>

             {!isComplete && (
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed"
                >
                    고객의 이탈을 막는 <strong>가장 완벽한 논리 구조</strong>를<br/>
                    AI가 단 3초 만에 설계해 드립니다.
                </motion.p>
             )}
          </motion.div>

          {/* Input Section */}
          <motion.div layout className="relative group">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all" />
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl ring-4 ring-white/10">
                <Search className="text-gray-400 ml-4 w-6 h-6" />
                <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="진단할 상세페이지 URL을 입력하세요" 
                    className="flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-lg px-4 py-3 focus:ring-0 focus:outline-none"
                    disabled={status !== 'idle'}
                    onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                />
                <button 
                    onClick={startAnalysis}
                    disabled={!url || status !== 'idle'}
                    className="bg-[#191F28] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:hover:bg-[#191F28] flex items-center gap-2 shadow-lg"
                >
                    {status === 'idle' ? (
                        <>무료 진단하기 <ArrowRight className="w-5 h-5" /></>
                    ) : (
                        <span className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                           <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-75" />
                           <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                        </span>
                    )}
                </button>
            </div>
          </motion.div>

          {/* Loading States */}
          <AnimatePresence mode="wait">
            {status !== 'idle' && status !== 'complete' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center space-y-4"
                >
                    <div className="flex justify-center mb-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin" />
                        </div>
                    </div>
                    <p className="text-xl text-white font-medium animate-pulse">
                        {loadingMsg}
                    </p>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Panel (Results) */}
      <AnimatePresence>
        {isComplete && (
            <motion.div 
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
                className="flex-1 h-full bg-[#F2F4F6] relative z-20 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-white px-8 py-6 shadow-sm z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                             <CheckCircle2 className="text-emerald-500 fill-emerald-50" />
                             진단 완료: 4개 섹션으로 구조화 성공
                        </h2>
                        <p className="text-gray-500 mt-1">AI가 맥락에 따라 상세페이지를 재구성했습니다.</p>
                    </div>
                    <button 
                        onClick={onComplete}
                        className="bg-[#3182F6] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Sparkles size={18} />
                        리포트 확인하기
                    </button>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 + 0.5 }}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-start gap-6"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                         <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                Section 0{idx + 1}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <CheckCircle2 size={16} />
                                            </div>
                                         </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3182F6] transition-colors">{section.title}</h3>
                                    
                                    <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50/50 rounded-xl">
                                        <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                            {section.goal}
                                        </p>
                                    </div>
                                    
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {section.reason}
                                    </p>
                                </div>

                                {/* Right Side Thumbnail - Square */}
                                <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden relative bg-gray-100 border border-gray-100">
                                    {section.images[0] ? (
                                        <img 
                                            src={section.images[0]} 
                                            alt="Thumbnail" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
