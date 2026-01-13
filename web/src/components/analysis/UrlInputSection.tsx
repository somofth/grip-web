import { motion } from 'framer-motion';
import { Search, ArrowRight, List } from 'lucide-react';

interface UrlInputSectionProps {
    url: string;
    onUrlChange: (value: string) => void;
    onSubmit: () => void;
    onManualSelect: () => void;
    onInteract?: () => void;
}

export function UrlInputSection({ url, onUrlChange, onSubmit, onManualSelect, onInteract }: UrlInputSectionProps) {
    return (
        <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4 w-full"
        >
            <div className="relative group w-full">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all" />
                <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl ring-4 ring-white/10">
                    <Search className="text-gray-400 ml-4 w-6 h-6" />
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                        onFocus={onInteract}
                        placeholder="진단할 상세페이지 URL을 입력하세요" 
                        className="flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-lg px-4 py-3 focus:ring-0 focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                    />
                    <button 
                        onClick={onSubmit}
                        disabled={!url}
                        className="bg-[#191F28] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:hover:bg-[#191F28] flex items-center justify-center gap-2 shadow-lg"
                    >
                            무료 진단하기 <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <button 
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-base font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                onClick={() => {
                    onInteract?.();
                    onManualSelect();
                }}
            >
                <List className="w-5 h-5" />
                <span>URL이 없다면? 이미지로 시작</span>
            </button>
        </motion.div>
    );
}
