import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, FileImage, ArrowRight } from 'lucide-react';
import { cn } from "./lib/utils";
import { LOADING_MESSAGES } from "./data/optimizerData";
import type { AnalysisState, Section } from "./types";
import gripLogo from './assets/grip-logo-w.png';

import { UrlInputSection } from './components/analysis/UrlInputSection';
import { AnalysisSelection } from './components/analysis/AnalysisSelection';
import { AnalysisResults } from './components/analysis/AnalysisResults';

interface AnalysisModeProps {
  onComplete: () => void;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onInteract?: () => void;
  isHero?: boolean;
}

const SPRING_TRANSITION = { type: "spring" as const, stiffness: 100, damping: 20 };

export function AnalysisMode({ onComplete, sections, onSectionsChange, onInteract, isHero = false }: AnalysisModeProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<AnalysisState | 'selection' | 'uploading_detail'>('idle'); 
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES.crawling);
  
  // Multi-select state
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['detail']);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // URLs for preview

  const handleSelection = (type: string) => {
      setSelectedTypes(prev => 
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
  };

  const handleProceed = () => {
    if (selectedTypes.length === 0) return;
    setStatus('complete');
  };

  const handleUrlSubmit = () => {
    if (!url) return;
    setStatus('crawling');

    // Simulate Process: Crawling -> Analyzing (Wait for confirm)
    setTimeout(() => {
        setStatus('analyzing');
        setLoadingMsg(LOADING_MESSAGES.analyzing);
    }, 1500);
  };

  const handleCategoryConfirm = () => {
    setStatus('segmenting');
    setLoadingMsg(LOADING_MESSAGES.segmenting);

    // After segmenting...
    setTimeout(() => {
        // If we have a URL, it means we came from the initial URL input -> Go to Selection
        // If NO URL, it means we came from "Select Method" -> Manual Upload -> Go directly to Results (Complete)
        if (url) {
            setStatus('selection');
        } else {
            setStatus('complete');
        }
    }, 1500);
  };

  const isComplete = status === 'complete';

  return (
    <div className={cn(
        "flex w-full relative overflow-hidden",
        isHero ? "h-auto min-h-[400px]" : "h-screen"
    )}>
      {/* Background with animated gradient - Only show in full mode or ensure it fits container */}
      <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-[#5387FF] to-[#3182F6] opacity-100 z-0",
          isHero && "hidden" // Hide internal gradient in Hero mode to assume parent's background/rounded style
      )} />
      
      {/* Left Panel (Input & Selection) */}
      <motion.div 
        layout
        transition={SPRING_TRANSITION}
        className={cn(
            "relative z-10 flex flex-col justify-center transition-all duration-700 h-full",
            isComplete ? "w-1/3 px-8 bg-white/10 backdrop-blur-lg border-r border-white/20" : "w-full items-center px-4"
        )}
      >
        <div className={cn("w-full max-w-xl space-y-8", isComplete ? "scale-90 origin-left" : "")}>
            {/* Logo & Header - Visible only in idle or complete/selection (hidden during loading) */}
            {(status === 'idle' || isComplete || status === 'selection') && (
                <motion.div layout className="text-center space-y-6">
                    <motion.div layoutId="logo" className="w-48 mx-auto mb-8">
                        <img src={gripLogo} alt="Logo" className="w-full object-contain brightness-0 invert" /> 
                    </motion.div>

                    {!isComplete && status !== 'selection' && (
                        <motion.p 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed"
                        >
                            고객의 이탈을 막는 <strong>가장 완벽한 논리 구조</strong>를<br/>
                            AI가 단 3초 만에 설계해 드립니다.
                        </motion.p>
                    )}
                </motion.div>
            )}

          {/* Persisted URL Input (Read-Only) */}
          {isComplete && (
            <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full"
            >
                <div className="relative flex items-center bg-white/10 rounded-full p-4 border border-white/20 backdrop-blur-sm">
                    <Search className="text-white/60 ml-1 w-5 h-5 mr-3" />
                    <input 
                        type="text" 
                        value={url}
                        disabled
                        className="flex-1 bg-transparent border-none text-white text-lg px-0 py-0 focus:ring-0 focus:outline-none opacity-80 placeholder:text-white/30 truncate"
                        placeholder="https://example.com/product/12345"
                    />
                </div>
            </motion.div>
          )}

          {/* Portal Target for Extra Content (e.g. Estimate Card) */}
          <div id="left-panel-portal" className="w-full mt-6" />

           {/* Input Section - Only visible in 'idle' */}
          <AnimatePresence mode="wait">
            {status === 'idle' && (
                <UrlInputSection 
                    url={url} 
                    onUrlChange={setUrl} 
                    onSubmit={handleUrlSubmit} 
                    onManualSelect={() => setStatus('selection')}
                    onInteract={onInteract}
                />
            )}

            {/* Selection Section - Visible in 'selection' */}
            {status === 'selection' && (
                <AnalysisSelection
                    selectedTypes={selectedTypes}
                    onSelection={handleSelection}
                    onProceed={() => {
                        if (selectedTypes.includes('detail')) {
                            setStatus('uploading_detail');
                        } else {
                            setStatus('complete');
                        }
                    }}
                    onBack={() => setStatus('idle')}
                />
            )}

            {/* Manual Upload Section for Detail Analysis */}
            {status === 'uploading_detail' && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl relative"
                >
                    <button 
                        onClick={() => setStatus('selection')}
                        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <Search className="w-5 h-5 text-gray-400 rotate-90" />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center mt-4">상세페이지 이미지 업로드</h3>
                    <p className="text-gray-500 text-center mb-8">분석할 상세페이지 이미지를 모두 업로드해주세요.</p>

                    <div className="grid grid-cols-3 gap-4 mb-8 max-h-[400px] overflow-y-auto p-2">
                        {/* Upload Button */}
                        <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all group">
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                                        setUploadedFiles(prev => [...prev, ...newFiles]);
                                    }
                                }} 
                            />
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={24} className="text-blue-500" />
                            </div>
                            <span className="font-bold text-gray-400 group-hover:text-blue-500">추가하기</span>
                        </label>
                        
                        {/* Uploaded Items */}
                        {uploadedFiles.map((src, idx) => (
                            <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 group">
                                <img src={src} alt={`uploaded-${idx}`} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            // Proceed to loading sequence
                            setStatus('analyzing');
                            setLoadingMsg(LOADING_MESSAGES.analyzing);
                        }}
                        disabled={uploadedFiles.length === 0}
                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#3182F6] hover:bg-[#1B64DA] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        업로드 완료
                        <ArrowRight size={20} />
                    </button>
                </motion.div>
            )}

            {/* Loading Section */}
            {status !== 'idle' && status !== 'selection' && status !== 'complete' && status !== 'uploading_detail' && (
                <motion.div 
                    key="loading"
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

                    {/* Category Confirmation - Only show during 'analyzing' phase */}
                    {status === 'analyzing' && (
                         <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }} // Slight delay to feel like "result found"
                            className="mt-8 bg-white rounded-3xl p-8 border border-white/20 w-full max-w-md mx-auto shadow-2xl"
                         >
                            <p className="text-gray-500 text-lg font-bold mb-4">이 분류가 맞나요?</p>
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-gray-800 font-bold text-xl">🪑 #가구</span>
                                <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-gray-800 font-bold text-xl">🍽️ #테이블</span>
                            </div>
                            <button
                                onClick={handleCategoryConfirm}
                                className="w-full bg-[#3182F6] text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg text-lg"
                            >
                                네, 맞습니다
                            </button>
                         </motion.div>
                    )}
                </motion.div>
            )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Panel (Results) */}
      <AnimatePresence>
        {isComplete && (
            <AnalysisResults 
                sections={sections} 
                onSectionsChange={onSectionsChange}
                selectedTypes={selectedTypes}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
