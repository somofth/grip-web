import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ArrowRight, ChevronDown, HelpCircle, Plus } from 'lucide-react';
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

function QuestionAccordion({ 
    questions, 
    onUpdate 
}: { 
    questions: Section['questions']; 
    onUpdate: (newQuestions: Section['questions']) => void; 
}) {
    const [isOpen, setIsOpen] = useState(true);

    const handleTextChange = (id: string, newText: string) => {
        const updated = questions.map(q => q.id === id ? { ...q, text: newText } : q);
        onUpdate(updated);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: `manual_${Date.now()}`,
            text: "",
            type: 'objective' as const,
            logic: "사용자가 직접 추가한 질문입니다."
        };
        onUpdate([...questions, newQuestion]);
    };

    return (
        <div className="mt-6 border-t border-gray-300 pt-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <div className="flex items-center gap-2 text-base font-bold text-gray-700 group-hover:text-[#3182F6] transition-colors">
                    <HelpCircle size={20} className="text-[#3182F6]" />
                    AI 제안 질문 보기 ({questions.length})
                </div>
                <ChevronDown 
                    size={16} 
                    className={cn("text-gray-400 transition-transform duration-300", isOpen ? "rotate-180" : "")} 
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-3">
                            {questions.map((q) => (
                                <div key={q.id} className="bg-gray-50 rounded-xl p-4 text-base relative group/question">
                                    <div className="flex items-start gap-2">
                                        <span className="font-bold text-gray-800 mt-2 shrink-0">Q.</span>
                                        <input 
                                            type="text"
                                            value={q.text}
                                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none py-1.5 px-1 font-bold text-gray-800 placeholder:text-gray-400"
                                            placeholder="질문을 입력하세요"
                                        />
                                    </div>
                                    {q.logic && (
                                        <p className="text-gray-500 text-base pl-8 border-l-2 border-primary/20 ml-1 mt-1">
                                            💡 {q.logic}
                                        </p>
                                    )}
                                </div>
                            ))}
                            
                            {/* "Add Question" Button */}
                            <button 
                                onClick={handleAddQuestion}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                직접 추가하기
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function AnalysisMode({ onComplete, sections, onSectionsChange }: AnalysisModeProps) {
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
                        <Plus size={18} />
                        프로젝트 만들기
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
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col"
                            >
                                <div className="flex items-start gap-8">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-baseline gap-3 mb-4">
                                        <span className="text-blue-600 text-2xl font-bold">
                                            0{idx + 1}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#3182F6] transition-colors">
                                            {section.title}
                                        </h3>
                                        <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                            {section.goal}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-500 text-lg leading-relaxed mb-4">
                                        {section.reason.split(',').map((segment, i, arr) => (
                                            <span key={i} className="block">
                                                {segment.trim()}{i < arr.length - 1 ? ',' : ''}
                                            </span>
                                        ))}
                                    </p>
                                </div>

                                {/* Right Side Thumbnail - Square */}
                                {/* Right Side Thumbnails */}
                                <div className="flex gap-3 shrink-0">
                                    {section.images.slice(0, 2).map((img, i) => (
                                        <div key={i} className="w-28 h-28 rounded-2xl overflow-hidden relative bg-gray-100 border-2 border-gray-200">
                                            <img 
                                                src={img} 
                                                alt={`Thumbnail ${i + 1}`} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        </div>
                                    ))}
                                    {section.images.length === 0 && (
                                         <div className="w-28 h-28 rounded-2xl overflow-hidden relative bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                            No Image
                                         </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Accordion Questions - Moved outside flex to span full width */}
                            {section.questions && (
                                <QuestionAccordion 
                                    questions={section.questions} 
                                    onUpdate={(newQs) => {
                                        const updatedSections = sections.map(s => 
                                            s.id === section.id ? { ...s, questions: newQs } : s
                                        );
                                        onSectionsChange(updatedSections);
                                    }}
                                />
                            )}
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
