import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ArrowRight, ChevronDown, Plus, Sparkles } from 'lucide-react';
import { cn } from "../../lib/utils";
import { LOADING_MESSAGES, DUMMY_SECTIONS } from "../../data/optimizerData";
import type { AnalysisState } from "../../types";
import { Button } from "../ui/Button";

const SPRING_TRANSITION = { type: "spring", stiffness: 200, damping: 25, mass: 1 };

export function AnalysisMode({ onComplete }: { onComplete: () => void }) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AnalysisState>('idle');
  const [loadingText, setLoadingText] = useState("");
  const [activeSections, setActiveSections] = useState<number[]>(DUMMY_SECTIONS.map((_, i) => i));

  const toggleSection = (idx: number) => {
    setActiveSections(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const [sections, setSections] = useState(DUMMY_SECTIONS.map(s => ({
    ...s,
    questions: s.questions.map(q => ({ ...q, type: 'objective' }))
  })));

  const toggleQuestionType = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    const q = newSections[sectionIndex].questions[questionIndex];
    // @ts-ignore
    q.type = q.type === 'objective' ? 'subjective' : 'objective';
    setSections(newSections);
  };
  
  const [targetGender, setTargetGender] = useState<string[]>(['여성']);
  const [targetAge, setTargetAge] = useState<string[]>(['20대', '30대']);
  const [targetInterests, setTargetInterests] = useState<string[]>(['메이크업', '패션', '자기관리']);
  const [targetCount, setTargetCount] = useState(50);

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
        "flex min-h-screen p-6",
        state === 'complete' || state === 'setting_target' ? "items-center justify-between gap-12 max-w-[95vw] mx-auto" : "items-center justify-center"
    )}>
      <AnimatePresence mode="popLayout">
      {(state !== 'refining_questions') && (
      <motion.div 
        layout="position"
        key="left-panel"
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        transition={SPRING_TRANSITION}
        className={cn(
            "flex flex-col items-center justify-center space-y-8",
            state === 'complete' || state === 'setting_target' ? "w-[20%] min-w-[320px] items-start text-left" : "w-full max-w-2xl text-center"
        )}
      >
        <div className={cn("space-y-2", state === 'complete' && "w-full")}>
           <motion.div 
            layout
            transition={SPRING_TRANSITION}
            className={cn(
                "flex items-center justify-center",
                state === 'complete' || state === 'setting_target' ? "w-24 mb-4" : "w-80 mx-auto mb-8"
            )}
          >
            <img src="/grip-logo-w.png" alt="Logo" className="w-full object-contain" />
          </motion.div>
          {/* H1 Removed */}
          <motion.p layout transition={SPRING_TRANSITION} className="text-xl text-white/80">
             진짜 고객의 눈으로 보는 데이터로,<br/> 최적화 솔루션을 제안합니다.
          </motion.p>
        </div>

        {/* Input Area */}
        <div className="w-full space-y-4">
          <motion.div layout transition={SPRING_TRANSITION} className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="https://smartstore.naver.com/..."
              className="block w-full pl-11 pr-32 py-4 bg-white border-2 border-transparent focus:border-primary/20 rounded-3xl text-lg focus:ring-0 focus:outline-none transition-all placeholder:text-gray-300"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={state !== 'idle'}
              onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
            />
            <button
              onClick={startAnalysis}
              disabled={state !== 'idle' || !url}
              className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-600 text-white px-6 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:hover:bg-primary"
            >
              {state === 'idle' ? '분석 시작' : '분석 중...'}
            </button>
          </motion.div>

          <AnimatePresence>
            {!url && (
              <motion.button 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  disabled={state !== 'idle'}
                  className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-3xl text-lg font-medium backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                  또는, 이미지 파일 직접 등록하기
              </motion.button>
            )}
          </AnimatePresence>
        </div>

         {/* Loading State Only (Centered) */}
         {state !== 'idle' && state !== 'complete' && state !== 'setting_target' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 pt-8"
              >
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium text-white"
                  >
                    {loadingText}
                  </motion.p>
              </motion.div>
        )}

        {/* Proceed Button Removed per request */}
      </motion.div>
      )}
      </AnimatePresence>

      {/* Right Result Panel */}
      <AnimatePresence mode='popLayout'>
        {(state === 'complete' || state === 'refining_questions') && (
            <motion.div 
                layout="position"
                key="results-panel"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={SPRING_TRANSITION}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-[80vh] overflow-y-auto no-scrollbar flex-1"
            >
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <motion.h2 layout="position" className="text-xl font-bold text-gray-900">
                            AI가 사장님의 상세페이지를 분할했어요!
                        </motion.h2>
                        <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-gray-500">
                            소비자가 이해하기 쉽도록 내용을 나누어 정리했습니다.
                        </motion.p>
                    </div>
                </div>

                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <motion.div 
                            layout="position"
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...SPRING_TRANSITION, delay: 0.3 + (idx * 0.1) }}
                            className="bg-gray-50 rounded-2xl border border-gray-300 hover:border-primary/30 transition-colors group overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-xl font-bold text-primary">0{idx + 1}</span>
                                    <h3 className="font-bold text-gray-900 text-xl">
                                        {section.title}
                                    </h3>
                                    <span className="px-3 py-1 rounded-full text-base font-medium bg-slate-100 text-gray-900 border border-slate-200">
                                        {section.goal}
                                    </span>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <div className="text-xl text-gray-800 font-semibold leading-relaxed bg-white p-4 rounded-xl border border-gray-100 text-justify h-full flex flex-col justify-center">
                                            {/* @ts-ignore */}
                                            {section.reason.split(',').map((text, i) => (
                                                <span key={i} className="block">
                                                    {text.trim()}{i < section.reason.split(',').length - 1 ? ',' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Thumbnails */}
                                    <div className="flex gap-2">
                                        {section.images.map((img, imgIdx) => (
                                            <motion.div layout="position" key={imgIdx} className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 relative group/img">
                                                <img 
                                                    src={img} 
                                                    alt="thumbnail" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                      (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=${idx+1}-${imgIdx+1}`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Trigger area */}
                            <button
                                onClick={() => toggleSection(idx)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 hover:bg-gray-50 transition-colors",
                                    activeSections.includes(idx) && "bg-blue-50/50"
                                )}
                            >
                                <span className="font-medium text-gray-700 text-base flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary p-1 rounded-md"><Sparkles size={14}/></span>
                                    AI 추천 질문 리스트 확인하기
                                </span>
                                <ChevronDown 
                                    className={cn(
                                        "text-gray-400 transition-transform duration-300",
                                        activeSections.includes(idx) && "transform rotate-180 text-primary"
                                    )} 
                                    size={20} 
                                />
                            </button>

                             {/* Accordion Content */}
                             <AnimatePresence>
                                {activeSections.includes(idx) && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-white border-t border-gray-100"
                                    >
                                        <div className="p-6 space-y-3 bg-gray-50/30">
                                            {section.questions.map((q, qIdx) => (
                                                <div key={q.id} className="group relative flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="px-1">
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-primary cursor-pointer flex items-center justify-center transition-colors">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </div>
                                                        <div 
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            className="flex-1 p-4 bg-white border border-gray-200 rounded-xl text-gray-700 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium leading-relaxed flex items-center min-h-[4rem] outline-none"
                                                        >
                                                            {q.text}
                                                        </div>

                                                        {/* Toggle Button */}
                                                        {/* @ts-ignore */}
                                                        <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                                                            {/* @ts-ignore */}
                                                            <button 
                                                                onClick={() => toggleQuestionType(idx, qIdx)}
                                                                className={cn(
                                                                    "px-3 py-1.5 rounded-md text-base font-bold transition-all",
                                                                    // @ts-ignore
                                                                    q.type === 'objective' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                                                )}
                                                            >
                                                                객관식
                                                            </button>
                                                            {/* @ts-ignore */}
                                                            <button 
                                                                onClick={() => toggleQuestionType(idx, qIdx)}
                                                                className={cn(
                                                                    "px-3 py-1.5 rounded-md text-base font-bold transition-all",
                                                                    // @ts-ignore
                                                                    q.type === 'subjective' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                                                )}
                                                            >
                                                                주관식
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* @ts-ignore */}
                                                    {q.logic && (
                                                        <div className="ml-9 bg-blue-50 p-3 rounded-lg text-base text-blue-600 font-medium leading-relaxed flex items-start gap-2">
                                                            <Sparkles size={14} className="mt-0.5 shrink-0" />
                                                            <span>{q.logic}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            <button className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/30 transition-all font-medium text-base bg-white">
                                                <Plus size={16} /> 직접 질문 추가하기
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </motion.div>
                    ))}

                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex justify-end pt-8">
                        <Button 
                            variant="black" 
                            onClick={() => setState('setting_target')}
                            className="bg-[#000000CC] hover:bg-black text-white px-8 py-4 rounded-3xl"
                        >
                            타깃 구체화하기 <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        )}

        {/* Target Setting Panel */}
        {state === 'setting_target' && (
            <motion.div 
                layout="position"
                key="target-panel"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING_TRANSITION}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-[80vh] overflow-y-auto no-scrollbar flex-1 flex flex-col"
            >
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                     <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">상세 설정을 완료해주세요</h2>
                         <p className="text-gray-500">보다 정확한 소비자 반응을 위해 타깃을 설정합니다.</p>
                    </div>
                </div>

                <div className="space-y-10 flex-1">
                    {/* 1. Target Audience */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">타깃층 설정</h3>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                            
                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-500">성별</label>
                                <div className="flex gap-2">
                                    {['남성', '여성', '무관'].map(gender => (
                                        <button
                                            key={gender}
                                            onClick={() => setTargetGender(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender])}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-base font-medium transition-all border",
                                                targetGender.includes(gender) 
                                                    ? "bg-primary text-white border-primary shadow-md" 
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
                                            )}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Age */}
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-500">나이대 (복수 선택 가능)</label>
                                <div className="flex flex-wrap gap-2">
                                    {['10대', '20대', '30대', '40대', '50대', '60대 이상'].map(age => (
                                        <button
                                            key={age}
                                            onClick={() => setTargetAge(prev => prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age])}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-base font-medium transition-all border",
                                                targetAge.includes(age) 
                                                    ? "bg-primary text-white border-primary shadow-md" 
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
                                            )}
                                        >
                                            {age}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interests */}
                             <div className="space-y-2">
                                <label className="text-base font-medium text-gray-500">관심 카테고리</label>
                                <div className="flex flex-wrap gap-2">
                                    {['패션', '뷰티', '메이크업', '자기관리', '인테리어', 'IT/테크', '요리', '여행', '운동'].map(interest => (
                                        <button
                                            key={interest}
                                            onClick={() => setTargetInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest])}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-base font-medium transition-all border",
                                                targetInterests.includes(interest)  
                                                    ? "bg-blue-50 text-blue-600 border-blue-200" 
                                                    : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            #{interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 2. Target Count */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <h3 className="text-lg font-bold text-gray-800">목표 답변 수 설정</h3>
                             <span className="text-2xl font-bold text-primary">{targetCount}명</span>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                             <input 
                                type="range" 
                                min="10" 
                                max="200" 
                                step="10" 
                                value={targetCount}
                                onChange={(e) => setTargetCount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                             <div className="flex justify-between text-base text-gray-400 mt-2 font-medium">
                                 <span>10명</span>
                                 <span>200명</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-4 border-t border-gray-100">
                     <Button 
                        variant="black" 
                        onClick={onComplete}
                        className="w-full bg-[#000000CC] hover:bg-black text-white px-8 py-5 rounded-3xl text-lg shadow-xl translate-y-0 hover:-translate-y-1 transition-transform duration-300"
                    >
                        소비자 반응 테스트 시작하기 <ArrowRight size={20} />
                    </Button>
                </div>

            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
