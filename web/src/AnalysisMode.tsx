import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ArrowRight, ChevronDown, HelpCircle, Plus } from 'lucide-react';
import { cn } from "./lib/utils";
import { LOADING_MESSAGES } from "./data/optimizerData";
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
  const [thumbnailOptionStep, setThumbnailOptionStep] = useState(false);

  const handleSelection = (type: string) => {
      if (type === 'thumbnail') {
          setThumbnailOptionStep(true);
          return;
      }
      setSelectedTypes(prev => 
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
  };

  const handleThumbnailOptionSelect = (option: string) => {
      setSelectedTypes(['thumbnail']); // Ensure only thumbnail is selected or handle distinct logic
      setStatus('complete'); // Proceed to next step
      setThumbnailOptionStep(false);
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
                                "relative rounded-[2.5rem] p-0 text-left transition-all duration-300 hover:scale-[1.03] group overflow-hidden border-4 flex flex-col h-[28rem]",
                                selectedTypes.includes('thumbnail') 
                                    ? "bg-white/20 border-white ring-8 ring-white/10 shadow-2xl" 
                                    : "bg-white/10 border-transparent hover:bg-white/15"
                            )}
                        >
                            <div className="h-[70%] w-full relative bg-gray-900 border-b border-white/10">
                                <img 
                                    src="/thumbnail.jpg" 
                                    alt="Thumbnail Analysis" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full text-base font-bold text-white flex items-center gap-2 border border-white/10">
                                    <span className="text-xl">🖼️</span> 썸네일
                                </div>
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
                                <h3 className="text-2xl font-bold text-white mb-2">썸네일 분석</h3>
                                <p className="text-blue-100 text-lg leading-relaxed opacity-90 font-medium">
                                    클릭률을 높이는<br/>매력적인 썸네일 진단
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleSelection('detail')}
                            className={cn(
                                "relative rounded-[2.5rem] p-0 text-left transition-all duration-300 hover:scale-[1.03] group overflow-hidden border-4 flex flex-col h-[28rem]",
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
                                <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full text-base font-bold text-gray-900 flex items-center gap-2 shadow-sm border border-gray-200">
                                    <span className="text-xl">📱</span> 상세페이지
                                </div>
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
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">상세페이지 분석</h3>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    구매 전환율을 높이는<br/>최적의 논리 구조 설계
                                </p>
                            </div>
                        </button>
                    </div>
                    
                    <div className="fixed bottom-12 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
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

                    {/* Thumbnail Option Modal */}
                    <AnimatePresence>
                        {thumbnailOptionStep && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setThumbnailOptionStep(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                />
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="bg-white rounded-[2.5rem] p-10 max-w-4xl w-full relative z-10 shadow-2xl space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h3 className="text-3xl font-bold text-gray-900">썸네일 정밀 분석</h3>
                                        <p className="text-gray-500 text-lg">원하는 분석 방식을 선택해주세요.</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { 
                                                title: "경쟁사 대결", 
                                                desc: "이기는 썸네일 찾기", 
                                                icon: "⚔️", 
                                                color: "bg-red-50 hover:bg-red-100 text-red-600 border-red-100" 
                                            },
                                            { 
                                                title: "내 편집본 대결", 
                                                desc: "A/B 테스트 시뮬레이션", 
                                                icon: "👥", 
                                                color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100" 
                                            },
                                            { 
                                                title: "단독 평가", 
                                                desc: "절대적 매력도 진단", 
                                                icon: "📊", 
                                                color: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-100" 
                                            }
                                        ].map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleThumbnailOptionSelect(opt.title)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1",
                                                    opt.color
                                                )}
                                            >
                                                <span className="text-6xl mb-6 filter drop-shadow-lg">{opt.icon}</span>
                                                <h4 className="text-xl font-bold mb-2">{opt.title}</h4>
                                                <p className="text-sm opacity-80 font-medium">{opt.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => setThumbnailOptionStep(false)}
                                        className="w-full text-center text-gray-400 font-medium hover:text-gray-600 mt-4"
                                    >
                                        취소하고 돌아가기
                                    </button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
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
                    {view === 'analysis' ? (
                        <motion.div 
                            key="analysis"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full relative"
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
                                    onClick={() => setView('targeting')}
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
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="targeting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full relative"
                        >
                            <div className="bg-white px-8 py-6 shadow-sm z-10">
                                <h2 className="text-2xl font-bold text-gray-900">프로젝트 설정</h2>
                                <p className="text-gray-500 mt-1">최적화된 분석 결과를 위해 타깃 정보를 입력해주세요.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-2xl mx-auto space-y-8 pb-24">
                                    {/* Category */}
                                    <section className="bg-white rounded-3xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">A. 어떤 상품인가요?</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setTargetData({...targetData, category: cat})}
                                                    className={cn(
                                                        "px-4 py-3 rounded-xl font-medium transition-all text-sm",
                                                        targetData.category === cat 
                                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Target Audience */}
                                    <section className="bg-white rounded-3xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">B. 누가 주 고객인가요?</h3>
                                        
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 mb-3 font-medium">성별</p>
                                            <div className="flex gap-2">
                                                {TARGET_GENDERS.map(gender => (
                                                    <button
                                                        key={gender}
                                                        onClick={() => setTargetData({...targetData, gender})}
                                                        className={cn(
                                                            "flex-1 py-3 rounded-xl font-medium transition-all text-sm",
                                                            targetData.gender === gender
                                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                        )}
                                                    >
                                                        {gender}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-3 font-medium">연령대 (중복 가능)</p>
                                            <div className="flex gap-2">
                                                {TARGET_AGES.map(age => (
                                                    <button
                                                        key={age}
                                                        onClick={() => handleAgeToggle(age)}
                                                        className={cn(
                                                            "flex-1 py-3 rounded-xl font-medium transition-all text-sm border-2",
                                                            targetData.ages.includes(age)
                                                                ? "border-blue-600 bg-blue-50 text-blue-700" 
                                                                : "border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                        )}
                                                    >
                                                        {age}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Selling Point */}
                                    <section className="bg-white rounded-3xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">C. 가장 강조하고 싶은 강점은?</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {SELLING_POINTS.map(point => (
                                                <button
                                                    key={point}
                                                    onClick={() => setTargetData({...targetData, sellingPoint: point})}
                                                    className={cn(
                                                        "px-4 py-3 rounded-xl font-medium transition-all text-sm",
                                                        targetData.sellingPoint === point
                                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
                                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {point}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-20">
                                <button
                                    onClick={onComplete}
                                    disabled={!isFormValid}
                                    className="w-full max-w-2xl mx-auto block py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed bg-[#3182F6] text-white shadow-blue-500/20"
                                >
                                    분석 시작하기
                                </button>
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
