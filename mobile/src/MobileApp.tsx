import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, X } from 'lucide-react';

import { DUMMY_SECTIONS } from "./data/optimizerData";
import { ConsumerMode } from "./ConsumerMode";
import { Feed, DUMMY_PRODUCTS } from "./Feed";
import { ABTestMode } from "./ABTestMode";
import type { Section } from "./types";

type ViewState = 'feed' | 'detail' | 'abtest';

export default function MobileApp() {
  const [view, setView] = useState<ViewState>('feed');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [abTestSelection, setAbTestSelection] = useState<'A' | 'B' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  const [sections, setSections] = useState<Section[]>(DUMMY_SECTIONS);

  useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
         if (e.shiftKey && e.key.toLowerCase() === 'x') {
             setShowConfig(prev => !prev);
         }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleQuestionType = (sectionId: number, questionId: string) => {
     // ... (remain same)
     setSections(prev => prev.map(section => {
          if (section.id !== sectionId) return section;
          return {
              ...section,
              questions: section.questions.map(q => {
                  if (q.id !== questionId) return q;
                  return { ...q, type: q.type === 'objective' ? 'subjective' : 'objective' };
              })
          };
      }));
  };

  const handleProductSelect = (id: number) => {
      setSelectedProductId(id);
      setIsLoading(true);
      
      setTimeout(() => {
          setIsLoading(false);
          setView('detail');
      }, 1500);
  };
  
  const handleABTestSelect = (option: 'A' | 'B') => {
      setAbTestSelection(option);
      setView('abtest'); // Immediate transition or add loading if desired
  };

  const handleBackToFeed = () => {
      setView('feed');
      setSelectedProductId(null);
      setAbTestSelection(null);
  };
  
  const selectedProduct = DUMMY_PRODUCTS.find(p => p.id === selectedProductId);

  return (
    <div className="min-h-screen font-sans text-text bg-white">
      {/* ... (Config Modal remains same) */}
      <AnimatePresence>
          {showConfig && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              >
                  <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                          <div className="flex items-center gap-2">
                              <Settings className="w-5 h-5 text-gray-600" />
                              <h3 className="font-bold text-lg">데모 설정</h3>
                          </div>
                          <button onClick={() => setShowConfig(false)} className="p-2 hover:bg-gray-200 rounded-full">
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                      <div className="p-4 overflow-y-auto flex-1 space-y-6">
                          {sections.map(section => (
                              <div key={section.id}>
                                  <h4 className="font-bold text-blue-600 text-sm mb-2">{section.title}</h4>
                                  <div className="space-y-3">
                                      {section.questions.map(q => (
                                          <div key={q.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                              <span className="text-xs text-gray-600 flex-1 mr-4 line-clamp-2">{q.text}</span>
                                              <button 
                                                onClick={() => toggleQuestionType(section.id, q.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${q.type === 'objective' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                                              >
                                                  {q.type === 'objective' ? '객관식 (5점)' : '주관식 (입력)'}
                                              </button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Full Screen App Container */}
      <div className="w-full h-[100dvh] overflow-hidden bg-white relative flex flex-col">
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
                     <Feed 
                        onSelectProduct={handleProductSelect} 
                        onSelectABTest={handleABTestSelect}
                     />
                 </MotionWrapper>
             ) : !isLoading && view === 'detail' ? (
                 <MotionWrapper key="detail">
                    <ConsumerMode 
                      onComplete={handleBackToFeed}
                      onBack={handleBackToFeed}
                      sections={sections}
                      productId={selectedProductId}
                      productTitle={selectedProduct?.title}
                    />
                 </MotionWrapper>
             ) : !isLoading && view === 'abtest' && abTestSelection ? (
                 <MotionWrapper key="abtest">
                     <ABTestMode
                        selectedOption={abTestSelection}
                        onBack={handleBackToFeed}
                        onComplete={handleBackToFeed}
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

