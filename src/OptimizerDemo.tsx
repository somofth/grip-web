import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Sparkles,
  Eye,
  MousePointerClick
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Legend
} from 'recharts';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility for Tailwind ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Mode = 1 | 2 | 3;
type AnalysisState = 'idle' | 'crawling' | 'analyzing' | 'segmenting' | 'complete';


// --- Mock Data & Constants ---
const LOADING_MESSAGES = {
  crawling: "상세페이지 크롤링 중...",
  analyzing: "이미지 구조 분석 및 진단 중...",
  segmenting: "문맥별 섹션 분리 중...",
};

const MODE_LABELS = {
  1: "분석 시뮬레이션",
  2: "소비자 반응 테스트 (모바일)",
  3: "판매자 대시보드 (AI 리포트)",
};

const DUMMY_SECTIONS = [
  { 
    id: 1, 
    title: "도입 및 필요성 인식", 
    goal: "공간 활용 문제 공감 유도",
    reason: "고객이 현재 겪는 불편함(좁은 공간 등)을 시각적으로 자극하여, 제품이 '나에게 필요한 솔루션'임을 인식하게 만드는 도입부입니다.",
    images: ["/detailshots/01.jpg", "/detailshots/03.jpg"],
    color: "from-blue-50 to-white",
    questions: [
      { id: "q1_1", text: "메인 이미지가 시선을 끌고 호기심을 자극하나요?" },
      { id: "q1_2", text: "지저분한 책상 상황이 당신의 상황과 공감이 가나요?" }
    ]
  },
  { 
    id: 2, 
    title: "핵심 내구성 및 신뢰도", 
    goal: "튼튼한 내구성 입증",
    reason: "온라인 가구 구매의 최대 장벽인 '내구성 불신'을 해소하기 위해, 두꺼운 상판과 하중 테스트 등 객관적 증거를 제시하는 신뢰 구축 단계입니다.",
    images: ["/detailshots/06.jpg", "/detailshots/07.jpg", "/detailshots/08.jpg"],
    color: "from-gray-50 to-white",
    questions: [
      { id: "q2_1", text: "두꺼운 상판과 프레임이 튼튼할 것이라는 확신을 주나요?" },
      { id: "q2_2", text: "하중 테스트가 내구성을 증명하기에 충분한가요?" }
    ]
  },
  { 
    id: 3, 
    title: "사용성 및 안전성 디테일", 
    goal: "실사용 이점과 안전 소재 강조",
    reason: "실제 사용 환경에서의 이점(넓은 작업공간)과 소재의 안전성(E0 등급)을 보여주어, 실용적인 구매 동기를 강화하는 단계입니다.",
    images: ["/detailshots/04.jpg", "/detailshots/05.jpg"],
    color: "from-emerald-50 to-white",
    questions: [
      { id: "q3_1", text: "넓은 상판이 당신의 생활 패턴에 유용해 보이나요?" },
      { id: "q3_2", text: "E0 친환경 등급 정보가 안심을 주나요?" }
    ]
  },
  { 
    id: 4, 
    title: "정보 요약 및 최종 확인", 
    goal: "스펙 확인 및 구매 유도",
    reason: "앞서 소구한 핵심 포인트를 요약하고, 사이즈/소재 등 필수 정보를 명확히 전달하여 최종 구매 결정을 돕는 마무리 단계입니다.",
    images: ["/detailshots/02.jpg", "/detailshots/09.jpg"],
    color: "from-indigo-50 to-white",
    questions: [
      { id: "q4_1", text: "핵심 장점들이 한눈에 잘 들어오나요?" },
      { id: "q4_2", text: "구매에 필요한 사이즈/소재 정보가 명확한가요?" }
    ]
  },
];

const METRICS_DATA = [
  { name: '1주차', bounceRate: 65, optimized: 64 },
  { name: '2주차', bounceRate: 62, optimized: 60 },
  { name: '3주차', bounceRate: 58, optimized: 45 }, // Drop after optimization
  { name: '4주차', bounceRate: 55, optimized: 35 },
];

const DWELL_TIME_DATA = [
  { section: '도입부', before: 5, after: 8 },
  { section: '특징', before: 12, after: 18 },
  { section: '신뢰도', before: 3, after: 12 }, // Big jump
  { section: '가이드', before: 8, after: 10 },
];

// --- Main Component ---
export default function OptimizerDemo() {
  const [mode, setMode] = useState<Mode>(1);

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
    <div className="min-h-screen bg-[#F2F4F6] font-sans text-text transition-colors duration-500 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {mode === 1 && <AnalysisMode key="mode1" onComplete={() => setMode(2)} />}
        {mode === 2 && <ConsumerMode key="mode2" onComplete={() => setMode(3)} />}
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

// --- Mode 1: Analysis Simulation ---
function AnalysisMode({ onComplete }: { onComplete: () => void }) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AnalysisState>('idle');
  const [loadingText, setLoadingText] = useState("");
  
  const startAnalysis = () => {
    if (!url) return;
    setState('crawling');
    
    // Simulation Sequence

    const steps = [
      { state: 'crawling', text: LOADING_MESSAGES.crawling, time: 0 },
      { state: 'analyzing', text: LOADING_MESSAGES.analyzing, time: 1500 },
      { state: 'segmenting', text: LOADING_MESSAGES.segmenting, time: 3000 },
      { state: 'complete', text: "분석 완료!", time: 4500 },
    ];

    steps.forEach(({ state: s, text, time }) => {
      setTimeout(() => {
        setState(s as AnalysisState);
        setLoadingText(text);
      }, time);
    });
  };

  return (
    <div className={cn(
        "flex min-h-screen p-6 transition-all duration-700 ease-in-out",
        state === 'complete' ? "items-center justify-between gap-12 max-w-7xl mx-auto" : "items-center justify-center"
    )}>
      <motion.div 
        layout
        className={cn(
            "transition-all duration-700 flex flex-col items-center justify-center space-y-8",
            state === 'complete' ? "w-1/3 items-start text-left" : "w-full max-w-2xl text-center"
        )}
      >
        <div className={cn("space-y-2", state === 'complete' && "w-full")}>
           <motion.div 
            layout
            className={cn(
                "rounded-2xl flex items-center justify-center text-primary bg-primary/10 transition-all",
                state === 'complete' ? "w-12 h-12 mb-4" : "w-16 h-16 mx-auto mb-6"
            )}
          >
            <Sparkles size={state === 'complete' ? 24 : 32} />
          </motion.div>
          <motion.h1 layout className={cn("font-bold tracking-tight text-gray-900 transition-all", state === 'complete' ? "text-3xl" : "text-4xl")}>
            AI로 상세페이지 최적화하기
          </motion.h1>
          <motion.p layout className="text-xl text-text-muted">
             상품 URL을 입력하면 AI가 구조를 분석하고<br/> 최적화 솔루션을 제안합니다.
          </motion.p>
        </div>

        {/* Input Area */}
        <motion.div layout className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="https://smartstore.naver.com/..."
            className="block w-full pl-11 pr-32 py-4 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl text-lg shadow-xl shadow-blue-900/5 focus:ring-0 focus:outline-none transition-all placeholder:text-gray-300"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={state !== 'idle'}
            onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
          />
          <button
            onClick={startAnalysis}
            disabled={state !== 'idle' || !url}
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-600 text-white px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:hover:bg-primary"
          >
            {state === 'idle' ? '분석 시작' : '분석 중...'}
          </button>
        </motion.div>

         {/* Loading State Only (Centered) */}
         {state !== 'idle' && state !== 'complete' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 pt-8"
              >
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium text-primary"
                  >
                    {loadingText}
                  </motion.p>
              </motion.div>
        )}

        {/* Proceed Button (Moves here after complete) */}
        {state === 'complete' && (
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="w-full pt-4"
             >
                 <button
                    onClick={onComplete}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-800 transition-colors"
                 >
                    소비자 반응 테스트 시작하기 <ArrowRight size={20} />
                 </button>
             </motion.div>
        )}
      </motion.div>

      {/* Right Result Panel */}
      <AnimatePresence>
        {state === 'complete' && (
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 w-2/3 max-w-3xl h-[80vh] overflow-y-auto no-scrollbar bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">4개의 논리적 섹션 클러스터링</h2>
                        <p className="text-gray-500">AI가 소비자의 구매 결정 과정(Journey)에 맞춰 이미지를 재구성했습니다.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {DUMMY_SECTIONS.map((section, idx) => (
                        <motion.div 
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1 block">Cluster 0{idx + 1}</span>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        {section.title}
                                    </h3>
                                </div>
                                <span className={cn("px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r text-gray-600 border", section.color)}>
                                    {section.goal}
                                </span>
                            </div>

                            <div className="flex gap-6">
                                {/* Reason Text */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 text-justify">
                                        <span className="font-bold text-gray-800 block mb-1">Why this cluster?</span>
                                        {/* @ts-ignore */}
                                        {section.reason}
                                    </p>
                                </div>
                                
                                {/* Thumbnails */}
                                <div className="flex gap-2">
                                    {section.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative group/img">
                                            <img 
                                                src={img} 
                                                alt="thumbnail" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=${idx+1}-${imgIdx+1}`;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Mode 2: Consumer Simulation (Mobile) ---
function ConsumerMode({ onComplete }: { onComplete: () => void }) {
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  /* New: track if scrolled to bottom */
  const [canEvaluate, dpSetCanEvaluate] = useState(false);
  
  // Ref for auto-scrolling
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [feedbackValues, setFeedbackValues] = useState<Record<string, number>>({});

  const handleNext = () => {
    if (unlockedIndex < DUMMY_SECTIONS.length - 1) {
      setUnlockedIndex(prev => prev + 1);
      setShowEvaluation(false);
      setFeedbackValues({}); 
      dpSetCanEvaluate(false); // Reset for new section
      setTimeout(() => {
        sectionRefs.current[unlockedIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setIsFinished(true);
    }
  };

  const handleRating = (questionId: string, score: number) => {
    setFeedbackValues(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Check if near bottom (< 50px remaining)
    if (scrollHeight - scrollTop - clientHeight < 50) {
       dpSetCanEvaluate(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 flex items-center justify-center bg-gray-100"
    >
      <div className="w-[390px] h-[844px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col">
        {/* Mobile Header */}
        <div className="h-12 bg-white/80 backdrop-blur border-b flex items-center justify-center sticky top-0 z-10">
          <span className="font-semibold text-sm">공식 브랜드 스토어</span>
        </div>

        {/* Scrollable Content */}
        {!isFinished ? (
           <div 
             className="flex-1 overflow-y-auto no-scrollbar pb-32"
             onScroll={onScroll}
           >
             {DUMMY_SECTIONS.slice(0, unlockedIndex + 1).map((section, index) => {
               
               return (
                 <div 
                   key={section.id} 
                   ref={el => { sectionRefs.current[index] = el; }}
                   className="relative"
                 >
                   {/* Content Block */}
                   <div 
                     className="w-full flex flex-col items-center justify-start text-center p-0 transition-all duration-500 bg-white"
                   >
                     {/* Section Header */}
                     <div className="w-full py-6 px-4 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Section 0{index + 1}</span>
                        <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{section.goal}</p>
                     </div>

                     {/* Images Stack */}
                     <div className="w-full">
                        {section.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="w-full border-b last:border-0 relative">
                             {/* Fallback for missing images using placeholder style if typical 404 behavior occurs, but simpler to just try render */}
                             <img 
                                src={img} 
                                alt={`${section.title}-${imgIdx}`} 
                                className="w-full h-auto object-cover block"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=Scan+Placeholder+${index+1}-${imgIdx+1}`;
                                }}
                             />
                          </div>
                        ))}
                     </div>
                   </div>
                 </div>
               );
             })}
           </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
               <CheckCircle2 size={40} />
             </div>
             <h2 className="text-2xl font-bold text-center">평가 완료!</h2>
             <p className="text-center text-gray-600">소중한 피드백 감사합니다. <br/> 이 데이터는 페이지 최적화에 사용됩니다.</p>
             <button 
                onClick={onComplete}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20"
             >
                최적화 리포트 확인하기
             </button>
          </div>
        )}

        {/* Fixed Bottom Evaluation Bar */}
        {!isFinished && (
            <AnimatePresence>
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl p-6 z-20"
                >
                  {!showEvaluation ? (
                    <div className="space-y-4">
                      <p className="text-center font-semibold text-gray-800">
                        <span className="text-primary">"{DUMMY_SECTIONS[unlockedIndex].title}"</span> 섹션은 어떠셨나요?
                      </p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setShowEvaluation(true)}
                          disabled={!canEvaluate}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ThumbsDown size={20} /> 별로예요
                        </button>
                        <button 
                          onClick={() => setShowEvaluation(true)}
                          disabled={!canEvaluate}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ThumbsUp size={20} /> 좋아요
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                      {/* <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">상세 피드백</p> */ }
                      
                      <div className="space-y-3">
                      <div className="space-y-4">
                         {DUMMY_SECTIONS[unlockedIndex].questions.map(q => (
                            <div key={q.id} className="space-y-2">
                               <p className="text-sm text-gray-700 font-medium text-center">{q.text}</p>
                               <div className="flex items-center justify-between px-2 pt-2">
                                  <span className="text-xs text-gray-400 font-medium">낮음</span>
                                  <div className="flex gap-2">
                                     {[1,2,3,4,5].map(score => {
                                       const isSelected = feedbackValues[q.id] === score;
                                       const opacity = 0.15 + (score - 1) * 0.2; // 0.15, 0.35, 0.55, 0.75, 0.95
                                       const isTextWhite = score > 3;
                                       
                                       return (
                                         <button 
                                           key={score}
                                           onClick={() => handleRating(q.id, score)}
                                           style={isSelected ? { backgroundColor: `rgba(49, 130, 246, ${opacity})` } : {}}
                                           className={cn(
                                             "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm",
                                             isSelected 
                                               ? (isTextWhite ? "text-white scale-110" : "text-[#3182F6] scale-110")
                                               : "bg-white border border-gray-200 text-gray-400 hover:border-primary/50"
                                           )}
                                         >
                                           {score}
                                         </button>
                                       );
                                     })}
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium">높음</span>
                               </div>
                            </div>
                         ))}
                      </div>
                      </div>

                      <button 
                         onClick={handleNext}
                         className="w-full bg-black text-white py-3 rounded-xl font-medium mt-2"
                      >
                         제출하고 다음 보기
                      </button>
                    </motion.div>
                  )}
                </motion.div>
            </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// --- Mode 3: Dashboard (Seller View) ---
function DashboardMode() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-7xl mx-auto h-screen overflow-y-auto"
    >
      <header className="mb-8 flex justify-between items-start">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">AI 최적화 리포트</h1>
            <p className="text-gray-500 mt-1">분석 대상: https://smartstore.naver.com/reeltech/product/3...</p>
         </div>
         <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <TrendingUp size={18} />
            예상 전환 상승률: +18.5%
         </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
         {/* Metric Cards */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
            <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2">
               <Eye size={16}/> 총 조회수
            </h3>
            <div className="flex items-end gap-3">
               <span className="text-4xl font-bold">12,450</span>
               <span className="text-emerald-500 text-sm font-medium mb-1">+12%</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
             <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2">
               <MousePointerClick size={16}/> 예상 구매 전환율
            </h3>
            <div className="flex items-end gap-3">
               <span className="text-4xl font-bold">3.2%</span>
               <span className="text-gray-400 text-sm font-normal mb-1">평균 대비 2.1% 우수</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
             <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2">
               <Clock size={16}/> 평균 체류 시간
            </h3>
            <div className="flex items-end gap-3">
               <span className="text-4xl font-bold">4m 12s</span>
               <span className="text-emerald-500 text-sm font-medium mb-1">+45s</span>
            </div>
         </div>

         {/* Charts */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold mb-6">최적화 후 이탈률 감소 추이</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={METRICS_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#9CA3AF'}} />
                     <YAxis tickLine={false} axisLine={false} tick={{fill: '#9CA3AF'}} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                     />
                     <Line 
                        type="monotone" 
                        dataKey="optimized" 
                        stroke="#3182F6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3182F6', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6 }} 
                     />
                     <Line 
                        type="monotone" 
                        dataKey="bounceRate" 
                        stroke="#E5E7EB" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6">섹션별 체류 시간 (초)</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DWELL_TIME_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="section" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Legend iconType="circle" />
                     <Bar dataKey="before" name="최적화 전" fill="#F2F4F6" radius={[4,4,0,0]} />
                     <Bar dataKey="after" name="최적화 후" fill="#3182F6" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* AI Insights - Full Width Row */}
         <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
               <h4 className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                  <AlertCircle size={20} /> AI 핵심 진단
               </h4>
               <p className="text-blue-800 leading-relaxed">
                  사용자들이 <span className="font-bold">3번 섹션 (신뢰도 & 인증)</span>에서 가장 많이 이탈(60%)했습니다. 히트맵 분석 결과, 인증 마크나 고객 후기를 찾으려다 이탈한 것으로 보입니다.
               </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={100} />
               </div>
               <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-2">
                  <Sparkles size={20} /> 추천 최적화 액션
               </h4>
               <p className="text-emerald-800 leading-relaxed">
                  <strong>Action:</strong> 2번 섹션 직후에 '공식 인증' 배지와 '베스트 리뷰' 캐러셀을 배치하여 신뢰도를 보강하세요.
                  <br/>
                  <span className="text-sm mt-2 block opacity-80">예상 효과: 신뢰도 점수 +15% 상승</span>
               </p>
            </div>
         </div>

      </div>
    </motion.div>
  );
}
