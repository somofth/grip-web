import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ABTestModeProps {
    onComplete: () => void;
    onBack: () => void;
    selectedOption: 'A' | 'B';
}

const DUMMY_COMMENTS = [
    { id: 1, name: "써니", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", option: "A", text: "색감이 훨씬 쨍하고 눈에 확 들어와요!" },
    { id: 2, name: "제로", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", option: "B", text: "B가 좀 더 차분하고 고급스러운 느낌이라 클릭할 것 같네요." },
    { id: 3, name: "디자이너L", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100", option: "A", text: "A안의 구도가 제품을 더 잘 보여주는 것 같습니다." },
    { id: 4, name: "쇼핑왕", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", option: "A", text: "그냥 딱 봤을 때 A가 더 사고싶게 생김 ㅋㅋ" },
    { id: 5, name: "미니멀리스트", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100", option: "B", text: "여백이 있어서 B가 더 깔끔해보여요." },
];

export function ABTestMode({ onComplete, onBack, selectedOption }: ABTestModeProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
        
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1000);
    };

    const getImageSrc = (option: 'A' | 'B') => {
        // Using the same URLs from Feed.tsx
        return option === 'A' 
            ? "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
            : "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=400&auto=format&fit=crop&q=60";
    };

    if (isSubmitted) {
        return (
            <div className="w-full h-full bg-white relative flex flex-col">
                {/* Header */}
                <div className="h-[4.2rem] border-b flex items-center justify-between px-4 bg-white z-10 sticky top-0 shrink-0">
                    <button onClick={onComplete} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="font-semibold text-sm">다른 사용자들의 의견</span>
                    <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
                    <div className="bg-purple-50 rounded-2xl p-6 mb-8 text-center">
                        <h3 className="text-purple-800 font-bold mb-1">투표 참여 완료!</h3>
                        <p className="text-sm text-purple-600 mb-4">500P가 지급되었습니다.</p>
                        <div className="flex items-center justify-center gap-4">
                             <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500 mb-1">내 선택</span>
                                <div className="w-16 aspect-[4/5] rounded-lg overflow-hidden border border-purple-200 relative">
                                    <div className="absolute top-1 left-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold z-10">
                                        {selectedOption}
                                    </div>
                                    <img src={getImageSrc(selectedOption)} className="w-full h-full object-cover" alt="My Choice" />
                                </div>
                             </div>
                        </div>
                    </div>

                    <h3 className="font-bold text-lg mb-4 text-gray-900">실시간 유저 리액션</h3>
                    <div className="space-y-4">
                        {/* My Comment */}
                        <div className="flex gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-full h-full object-cover" alt="Me" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-gray-900">나 (방금 전)</span>
                                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">{selectedOption}안 선택</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {reason}
                                </p>
                            </div>
                        </div>

                        {/* Dummy Comments */}
                        {DUMMY_COMMENTS.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    <img src={comment.avatar} className="w-full h-full object-cover" alt={comment.name} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-900">{comment.name}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${comment.option === 'A' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {comment.option}안 선택
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-20">
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-transform"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white relative flex flex-col">
            {/* Header */}
            <div className="h-[4.2rem] border-b flex items-center justify-between px-4 bg-white z-10 sticky top-0 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <span className="font-semibold text-sm">썸네일 상세 평가</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
                <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-4">
                        선택한 썸네일: {selectedOption}안
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                        이 썸네일을<br/>선택한 이유는 무엇인가요?
                    </h2>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="w-48 aspect-[4/5] rounded-2xl overflow-hidden border-4 border-purple-100 shadow-xl relative">
                        <div className="absolute top-3 left-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold z-10 shadow-lg">
                            {selectedOption}
                        </div>
                        <img 
                            src={getImageSrc(selectedOption)} 
                            alt={`Thumbnail ${selectedOption}`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">
                        선택 이유 (20자 이상)
                    </label>
                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="이 썸네일이 더 끌린 구체적인 이유를 적어주세요. (예: 상품이 더 잘 보이고 색감이 마음에 들어요)"
                        className="w-full h-40 p-4 bg-gray-50 rounded-2xl border-none resize-none focus:ring-2 focus:ring-purple-500 text-base"
                    />
                    <div className="text-right text-xs text-gray-400">
                        {reason.length} / 20자
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-20">
                <button 
                    onClick={handleSubmit}
                    disabled={reason.length < 20 || isSubmitting}
                    className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isSubmitting ? '제출 중...' : '투표 완료하고 포인트 받기'}
                </button>
            </div>
        </div>
    );
}
