import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from "./lib/utils";
import { MODE_LABELS, DUMMY_SECTIONS } from "./data/optimizerData";
import type { Mode, Section } from "./types";
import { AnalysisMode } from "./components/modes/AnalysisMode";
import { ConsumerMode } from "./components/modes/ConsumerMode";
import { DashboardMode } from "./components/modes/DashboardMode";

export default function OptimizerDemo() {
  const [mode, setMode] = useState<Mode>(1);

  // Lifted State for Sections (Shared between Mode 1 & 2)
  const [sections, setSections] = useState<Section[]>(() => 
    DUMMY_SECTIONS.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, type: 'objective' as const }))
    }))
  );

  // Global Keyboard Listener for Mode Switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'x') {
        setMode((prev) => (prev === 3 ? 1 : prev + 1) as Mode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
        "min-h-screen font-sans text-text transition-colors duration-500 overflow-hidden relative",
        mode === 1 ? "bg-[#5387FF]" : "bg-[#F2F4F6]"
    )}>
      <AnimatePresence mode="wait">
        {mode === 1 && (
          <AnalysisMode 
            key="mode1" 
            onComplete={() => setMode(2)} 
            sections={sections}
            onSectionsChange={setSections}
          />
        )}
        {mode === 2 && (
          <ConsumerMode 
            key="mode2" 
            onComplete={() => setMode(3)} 
            sections={sections}
          />
        )}
        {mode === 3 && <DashboardMode key="mode3" />}
      </AnimatePresence>

      {/* Mode Indicator Overlay */}
      <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg z-50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
        {MODE_LABELS[mode]} <span className="text-white/50 ml-1">(Shift+X)</span>
      </div>
    </div>
  );
}
