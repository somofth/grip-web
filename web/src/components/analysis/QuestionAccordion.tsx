import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Star, List, Pencil, Plus } from 'lucide-react';
import { cn } from "../../lib/utils";
import { AI_QUESTION_SUGGESTIONS } from "../../data/optimizerData";
import type { Section } from "../../types";

export function QuestionAccordion({ 
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
