import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, Check, HelpCircle, Plus, Sparkles, AlertCircle, Play, Star, List, Pencil, CheckCircle2, ArrowRight, Eye } from 'lucide-react';
import { cn } from "./lib/utils";
import { LOADING_MESSAGES, AI_QUESTION_SUGGESTIONS } from "./data/optimizerData";
import { TargetingMode } from "./TargetingMode";
import type { AnalysisState, Section } from "./types";
import gripLogo from './assets/grip-logo-w.png';

const CATEGORIES = ["👗 패션/잡화", "🍎 식품/건강", "💄 뷰티", "🏠 리빙/가전", "🍼 육아", "🐶 반려동물", "기타"];
const TARGET_GENDERS = ["남성", "여성", "무관"];
const TARGET_AGES = ["10대", "2030", "4050", "60대 이상"];
const SELLING_POINTS = ["💸 가성비", "✨ 감성/디자인", "🏆 기능/스펙", "trust 신뢰/인증", "🚀 빠른배송"];

type TargetData = {
    category: string;
    gender: string;
    ages: string[];
    sellingPoint: string;
};

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

    const handleTypeChange = (id: string, newType: 'rating' | 'choice' | 'text') => {
        let updatedQuestions = questions.map(q => {
            if (q.id === id) {
                const updatedQ = { ...q, type: newType };
                // Generate options if switching to choice and no options exist
                if (newType === 'choice' && (!q.options || q.options.length === 0)) {
                    const suggestion = AI_QUESTION_SUGGESTIONS[q.id];
                    if (suggestion) {
                        updatedQ.options = suggestion.options;
                        updatedQ.text = suggestion.rephrased; // Update text for better context
                    } else {
                        // Fallback for custom added questions
                        updatedQ.options = [
                            { emoji: "💪", text: "완전 강력 추천! (매우 긍정)" },
                            { emoji: "🙂", text: "대체로 만족해요 (긍정)" },
                            { emoji: "🤔", text: "보통이에요 (중립)" },
                            { emoji: "😤", text: "별로예요 (부정)" }
                        ];
                    }
                }
                return updatedQ;
            }
            return q;
        });
        onUpdate(updatedQuestions);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: `manual_${Date.now()}`,
            text: "",
            type: 'rating' as const,
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
                                <div key={q.id} className="bg-gray-50 rounded-xl p-4 text-base relative group/question border border-gray-300">
                                    <div className="flex items-start gap-3 w-full">
                                        <span className="font-bold text-gray-800 mt-2 shrink-0">Q.</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="text"
                                                    value={q.text}
                                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                    className="flex-1 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none py-1.5 px-1 font-bold text-gray-800 placeholder:text-gray-400"
                                                    placeholder="질문을 입력하세요"
                                                />
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleTypeChange(q.id, 'rating')}
                                                        className={cn(
                                                            "px-2 py-1 rounded-md text-[10px] font-bold transition-colors flex items-center gap-1",
                                                            q.type === 'rating' ? "bg-blue-100 text-blue-600 ring-1 ring-blue-500" : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-100"
                                                        )}
                                                        title="별점"
                                                    >
                                                        <Star size={16} className={q.type === 'rating' ? "fill-blue-600" : ""} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTypeChange(q.id, 'choice')}
                                                        className={cn(
                                                            "px-2 py-1 rounded-md text-[10px] font-bold transition-colors flex items-center gap-1",
                                                            q.type === 'choice' ? "bg-blue-100 text-blue-600 ring-1 ring-blue-500" : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-100"
                                                        )}
                                                        title="보기"
                                                    >
                                                        <List size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTypeChange(q.id, 'text')}
                                                        className={cn(
                                                            "px-2 py-1 rounded-md text-[10px] font-bold transition-colors flex items-center gap-1",
                                                            q.type === 'text' ? "bg-blue-100 text-blue-600 ring-1 ring-blue-500" : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-100"
                                                        )}
                                                        title="서술"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options Display for Choice Type */}
                                    {q.type === 'choice' && q.options && (
                                        <div className="mt-4 pl-8 grid grid-cols-1 gap-2">
                                            {q.options.map((opt, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 text-sm text-gray-700">
                                                    <span className="text-xl">{opt.emoji}</span>
                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={(e) => {
                                                            const newOptions = [...(q.options || [])];
                                                            newOptions[idx] = { ...opt, text: e.target.value };
                                                            onUpdate(questions.map(qt => qt.id === q.id ? { ...qt, options: newOptions } : qt));
                                                        }}
                                                        className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-600 font-medium"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {q.logic && (
                                        <p className="text-gray-500 text-sm pl-8 border-l-2 border-primary/20 ml-1 mt-3">
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
  // START: Modified status type to include 'selection'
  const [status, setStatus] = useState<AnalysisState | 'selection'>('idle'); 
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES.crawling);
  const [view, setView] = useState<'analysis' | 'targeting'>('analysis');
  
  // Target Form State
  const [targetData, setTargetData] = useState<TargetData>({
      category: "",
      gender: "",
      ages: [],
      sellingPoint: ""
  });

  const isFormValid = targetData.category && targetData.gender && targetData.ages.length > 0 && targetData.sellingPoint;

  // Multi-select state
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['detail']);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - clientHeight > 0) {
        setScrollProgress(scrollTop / (scrollHeight - clientHeight));
    }
  };

  const handleSelection = (type: string) => {
      setSelectedTypes(prev => 
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
  };



  const handleProceed = () => {
    if (selectedTypes.length === 0) return;
    setStatus('complete');
  };

  const handleAgeToggle = (age: string) => {
      setTargetData(prev => ({
          ...prev,
          ages: prev.ages.includes(age) 
              ? prev.ages.filter(a => a !== age)
              : [...prev.ages, age]
      }));
  };

  const handleUrlSubmit = () => {
    if (!url) return;
    setStatus('crawling');

    // Simulate Process: Loading first
    setTimeout(() => {
        setStatus('analyzing');
        setLoadingMsg(LOADING_MESSAGES.analyzing);
    }, 1500);

    setTimeout(() => {
        setStatus('segmenting');
        setLoadingMsg(LOADING_MESSAGES.segmenting);
    }, 3000);

    // After loading, go to selection
    setTimeout(() => {
        setStatus('selection');
    }, 4500);
  };



  const isComplete = status === 'complete';

  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5387FF] to-[#3182F6] opacity-100 z-0" />
      
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
          {/* Logo & Header */}
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

           {/* Input Section - Only visible in 'idle' */}
          <AnimatePresence mode="wait">
            {status === 'idle' && (
                <motion.div 
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative group w-full"
                >
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all" />
                    <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl ring-4 ring-white/10">
                        <Search className="text-gray-400 ml-4 w-6 h-6" />
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="진단할 상세페이지 URL을 입력하세요" 
                            className="flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-lg px-4 py-3 focus:ring-0 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                        <button 
                            onClick={handleUrlSubmit}
                            disabled={!url}
                            className="bg-[#191F28] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:hover:bg-[#191F28] flex items-center justify-center gap-2 shadow-lg"
                        >
                             무료 진단하기 <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Selection Section - Visible in 'selection' */}
            {status === 'selection' && (
                <motion.div
                    key="selection"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full space-y-8"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-10 leading-tight">
                        어떤 분석을 진행할까요?
                    </h2>
                    <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
                        <button
                            onClick={() => handleSelection('thumbnail')}
                            className={cn(
                                "relative rounded-[2.5rem] p-0 text-left transition-all duration-300 hover:scale-[1.03] group overflow-hidden border-4 flex flex-col h-[28rem] aspect-[5/6] justify-self-end",
                                selectedTypes.includes('thumbnail') 
                                    ? "bg-white border-blue-200 ring-8 ring-white/10 shadow-2xl" 
                                    : "bg-white/90 border-transparent hover:bg-white"
                            )}
                        >
                            <div className="h-[70%] w-full relative bg-gray-900 border-b border-gray-100">
                                <img 
                                    src="/thumbnail.jpg" 
                                    alt="Thumbnail Analysis" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                                />
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent" />
                                {selectedTypes.includes('thumbnail') && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg border-2 border-white"
                                    >
                                        <CheckCircle2 size={32} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </div>
                            <div className="h-[30%] w-full p-8 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">썸네일 분석</h3>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    클릭률을 높이는<br/>매력적인 썸네일 진단
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleSelection('detail')}
                            className={cn(
                                "relative rounded-[2.5rem] p-0 text-left transition-all duration-300 hover:scale-[1.03] group overflow-hidden border-4 flex flex-col h-[28rem] aspect-[5/6]",
                                selectedTypes.includes('detail') 
                                    ? "bg-white border-blue-200 ring-8 ring-white/10 shadow-2xl" 
                                    : "bg-white/90 border-transparent hover:bg-white"
                            )}
                        >
                             <div className="h-[70%] w-full relative bg-gray-50 border-b border-gray-100 grid grid-cols-2 gap-1.5 p-1.5 overflow-hidden">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="relative overflow-hidden rounded-xl h-full">
                                        <img 
                                            src={`/detailshots/0${i}.jpg`} 
                                            alt={`Detail ${i}`} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                ))}
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent" />
                                {selectedTypes.includes('detail') && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg border-2 border-white"
                                    >
                                        <CheckCircle2 size={32} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </div>
                            <div className="h-[30%] w-full p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900">상세페이지 분석</h3>
                                    <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-md">
                                        👍 추천
                                    </span>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    구매 전환율을 높이는<br/>최적의 논리 구조 설계
                                </p>
                            </div>
                        </button>
                    </div>
                    
                    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
                         <motion.button 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleProceed}
                            disabled={selectedTypes.length === 0}
                            className="pointer-events-auto w-full max-w-lg bg-[#191F28] hover:bg-black text-white py-6 rounded-3xl font-bold text-2xl transition-all disabled:opacity-0 disabled:translate-y-10 shadow-2xl shadow-black/20 flex items-center justify-center gap-4 group"
                        >
                            질문지 구성하기 
                            <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </motion.button>
                    </div>
                   
                    <button 
                        onClick={() => setStatus('idle')}
                        className="mx-auto block text-white/50 hover:text-white text-base font-medium transition-colors mt-8 underline decoration-white/30 hover:decoration-white pb-32"
                    >
                        URL 다시 입력하기
                    </button>


                </motion.div>
            )}

            {/* Loading Section */}
            {status !== 'idle' && status !== 'selection' && status !== 'complete' && (
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
                </motion.div>
            )}
           </AnimatePresence>
        </div>
      </motion.div>


      {/* Right Panel (Results) */}
      {/* Right Panel (Results) */}
      <AnimatePresence>
        {isComplete && (
            <motion.div 
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
                className="flex-1 h-full bg-[#F2F4F6] relative z-20 flex flex-col overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {view === 'targeting' && (
                        <motion.div
                            key="targeting"
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="bg-white absolute inset-0 z-30"
                        >
                            <TargetingMode onBack={() => setView('analysis')} />
                        </motion.div>
                    )}
                    {view === 'analysis' && (
                        <motion.div 
                            key="analysis"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full relative"
                        >
                            {/* Header */}
                            <div className="bg-white px-8 py-6 shadow-sm z-10 flex justify-between items-center relative">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500 fill-emerald-50" />
                                        진단 완료: 4개 섹션으로 구조화 성공
                                    </h2>
                                    <p className="text-gray-500 mt-1">AI가 맥락에 따라 상세페이지를 재구성했습니다.</p>
                                </div>
                                <button 
                                    className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
                                >
                                    <Eye size={18} />
                                    모바일 미리보기
                                </button>
                                {/* Scroll Progress Bar */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                                    <motion.div 
                                        className="h-full bg-[#3182F6]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scrollProgress * 100}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="flex-1 overflow-y-auto p-8" onScroll={handleScroll}>
                                <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                                    {sections.map((section, idx) => (
                                        <motion.div
                                            key={section.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 + 0.5 }}
                                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-300 hover:shadow-md transition-shadow group flex flex-col"
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
                                            
                                            {/* Accordion Questions */}
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
                                <div className="max-w-4xl mx-auto mt-12 flex justify-end pb-12">
                                     <button 
                                        onClick={() => setView('targeting')}
                                        className="bg-[#3182F6] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 text-lg hover:scale-105 active:scale-95 duration-200"
                                    >
                                        <Plus size={24} />
                                        프로젝트 만들기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
