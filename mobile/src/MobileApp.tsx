import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { DUMMY_SECTIONS } from "./data/optimizerData";
import { ConsumerMode } from "./ConsumerMode";
import { Feed } from "./Feed";
import type { Section } from "./types";

type ViewState = 'feed' | 'detail';

export default function MobileApp() {
  const [view, setView] = useState<ViewState>('feed');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Lifted State for Sections (Shared logic if needed, or just local)
  // In a real app, we would load different sections based on the selectedProductId
  const [sections] = useState<Section[]>(() => 
    DUMMY_SECTIONS.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, type: 'objective' as const }))
    }))
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleProductSelect = (id: number) => {
      setSelectedProductId(id);
      setIsLoading(true);
      
      setTimeout(() => {
          setIsLoading(false);
          setView('detail');
      }, 1500);
  };

  const handleBackToFeed = () => {
      setView('feed');
      setSelectedProductId(null);
  };

  return (
    <div className="min-h-screen font-sans text-text bg-[#F2F4F6] flex flex-col items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-full max-w-[400px] h-[844px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
             {isLoading ? (
                 <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                 >
                     <div className="flex flex-col items-center gap-4">
                         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                         <p className="text-xl font-bold text-blue-600 animate-pulse">
                             제품 평가하고 싸게 사자!
                         </p>
                     </div>
                 </motion.div>
             ) : null}

             {!isLoading && view === 'feed' ? (
                 <MotionWrapper key="feed">
                     <Feed onSelectProduct={handleProductSelect} />
                 </MotionWrapper>
             ) : !isLoading && view === 'detail' ? (
                 <MotionWrapper key="detail">
                    <ConsumerMode 
                      onComplete={handleBackToFeed}
                      onBack={handleBackToFeed}
                      sections={sections}
                      productId={selectedProductId}
                    />
                 </MotionWrapper>
             ) : null}
          </AnimatePresence>
      </div>
    </div>
  );
}

function MotionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
        </div>
    );
}

