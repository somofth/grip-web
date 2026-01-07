import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from "./lib/utils"; // Adjusted path
import { MODE_LABELS, DUMMY_SECTIONS } from "./data/optimizerData";
import type { Mode, Section } from "./types";
import { AnalysisMode } from "./AnalysisMode";
import { DashboardMode } from "./DashboardMode";

export default function WebApp() {
  // Web Mode only cycles between 1 (Analysis) and 3 (Dashboard)
  const [mode, setMode] = useState<Mode>(1);

  // Lifted State for Sections (Shared)
  const [sections, setSections] = useState<Section[]>(() => 
    DUMMY_SECTIONS.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, type: 'objective' as const }))
    }))
  );

  // Global Keyboard Listener for Mode Switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + X to toggle modes
      if (e.shiftKey && e.key.toLowerCase() === 'x') {
        setMode((prev) => (prev === 1 ? 3 : 1) as Mode); // Toggle between 1 <-> 3
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
            onComplete={() => setMode(3)} // Skip Mode 2, go straight to 3
            sections={sections}
            onSectionsChange={setSections}
          />
        )}
        {mode === 3 && <DashboardMode key="mode3" />}
      </AnimatePresence>

      {/* Mode Indicator Overlay */}

    </div>
  );
}
