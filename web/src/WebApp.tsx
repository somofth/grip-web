import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Smartphone } from 'lucide-react'; 
import { cn } from "./lib/utils";
import { DUMMY_SECTIONS } from "./data/optimizerData";
import type { Mode, Section } from "./types";
import { AnalysisMode } from "./AnalysisMode";
import { DashboardMode } from "./DashboardMode";
import gripLogo from './assets/grip-logo-w.png'; 

export default function WebApp() {
  // ... (state)
  const [mode, setMode] = useState<Mode>(1);
  const [isFocused, setIsFocused] = useState(false);
  const [sections, setSections] = useState<Section[]>(() => 
    DUMMY_SECTIONS.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, type: (q.type || 'rating') as "rating" | "choice" | "text" }))
    }))
  );

  // ... (useEffect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + X to toggle modes
      if (e.shiftKey && e.key.toLowerCase() === 'x') {
        setMode((prev) => (prev === 1 ? 3 : 1) as Mode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
        "min-h-screen font-sans text-text transition-colors duration-500 overflow-x-hidden relative",
        (isFocused && mode === 1) ? "bg-[#5387FF]" : "bg-white"
    )}>
      
      {/* Landing Page Layout Wrapper */}
      <AnimatePresence mode="wait">
        {!isFocused ? (
           <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full flex flex-col items-center"
           >
              {/* Corporate Header */}
              <div className="w-full flex justify-between items-center px-8 py-4 bg-white sticky top-0 z-50">
                  <div className="w-20">
                       <img src={gripLogo} alt="GRIP" className="w-full object-contain brightness-0 opacity-80 filter" /> 
                  </div>
                  <div className="flex items-center gap-3">
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Download className="w-6 h-6 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Smartphone className="w-6 h-6 text-gray-600" />
                      </button>
                  </div>
              </div>

              {/* Hero Banner Section */}
              <div className="w-full bg-[#5387FF] rounded-b-[3rem] pb-8 pt-12 shadow-lg mb-12 transform origin-top">
                  <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
                      <AnalysisMode 
                        key="hero-mode" 
                        onComplete={() => setMode(3)} 
                        sections={sections}
                        onSectionsChange={setSections}
                        onInteract={() => setIsFocused(true)} // Transition Trigger
                        isHero={true}
                      />
                  </div>
              </div>

              {/* Banner Section (Below Fold) - Now on white background */}
              <div className="w-full max-w-6xl mx-auto px-6 pb-20">
                  <div className="text-center mb-10">
                      <span className="text-blue-500 font-bold text-lg mb-2 block">서비스 소개</span>
                      <h2 className="text-3xl font-bold text-gray-900">상세페이지 하나로 매출이 달라집니다.</h2>
                  </div>
                  <img 
                    src="/web-banner.jpg" 
                    alt="Service Introduction" 
                    className="w-full rounded-3xl shadow-2xl border border-gray-100"
                  />
              </div>
           </motion.div>
        ) : (
           <motion.div 
              key="app"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-full h-screen overflow-y-auto" // Full height App Mode
           >
              {mode === 1 && (
                <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                  <AnalysisMode 
                    key="mode1" 
                    onComplete={() => setMode(3)} 
                    sections={sections}
                    onSectionsChange={setSections}
                  />
                </div>
              )}
              {mode === 3 && <DashboardMode key="mode3" sections={sections} />}
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
