import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { DUMMY_SECTIONS } from "./data/optimizerData";
import { ConsumerMode } from "./ConsumerMode";
import type { Section } from "./types";

export default function MobileApp() {
  // Mobile App only shows ConsumerMode (Mode 2)
  const [isFinished, setIsFinished] = useState(false);
  
  // Lifted State for Sections (Shared logic if needed, or just local)
  const [sections] = useState<Section[]>(() => 
    DUMMY_SECTIONS.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, type: 'objective' as const }))
    }))
  );

  return (
    <div className="min-h-screen font-sans text-text bg-[#F2F4F6] overflow-hidden relative">
      <AnimatePresence mode="wait">
         {!isFinished ? (
            <ConsumerMode 
              key="mode2" 
              onComplete={() => setIsFinished(true)}
              sections={sections}
            />
         ) : (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Thank you for testing!</h1>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
