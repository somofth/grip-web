import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Wand2, Eraser, Palette, ZoomIn, Type, Loader2, X, Store, ShoppingBag, Rocket, Info } from 'lucide-react';
import { cn } from "../../lib/utils";

interface Thumbnail {
    id: string;
    src: string | null;
    label: string;
}

export function ThumbnailArena() {
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([
        { id: 'A', src: null, label: 'A안 (기존)' }, 
        { id: 'B', src: null, label: 'B안 (비교군)' }
    ]);
    const [selectedId, setSelectedId] = useState<string>('A'); // Start with A selected
    const [isGenerating, setIsGenerating] = useState(false);
    const [dragActiveId, setDragActiveId] = useState<string | null>(null);
    const [platform, setPlatform] = useState<'own' | 'naver' | 'coupang'>('own');

    const handleDrag = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActiveId(id);
        } else if (e.type === "dragleave") {
            setDragActiveId(null);
        }
    };

    const handleDrop = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveId(null);
        setSelectedId(id); // Select the dropped item

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setThumbnails(prev => prev.map(t => t.id === id ? { ...t, src: event.target?.result as string } : t));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnails(prev => prev.map(t => t.id === selectedId ? { ...t, src: e.target?.result as string } : t));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAiPresetSelect = (preset: string) => {
        setIsGenerating(true);

        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            let dummySrc = "/thumbnail.jpg"; // Fallback
            if (preset === 'remove_bg') dummySrc = "https://placehold.co/400x400/png?text=No+Background";
            if (preset === 'mood') dummySrc = "https://placehold.co/400x400/F5F5DC/333?text=Warm+Mood";
            if (preset === 'zoom') dummySrc = "https://placehold.co/400x400/png?text=Zoomed+In";
            if (preset === 'text') dummySrc = "https://placehold.co/400x400/png?text=With+Text+Overlay";

            setThumbnails(prev => prev.map(t => t.id === selectedId ? { ...t, src: dummySrc } : t));
        }, 3000);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setThumbnails(prev => prev.map(t => t.id === id ? { ...t, src: null } : t));
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4"> {/* Reduced max-width and padding */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"> {/* Smaller title */}
                <Wand2 className="text-purple-600" size={20} />
                썸네일 A/B 테스트 생성
            </h2>

            {/* Main Arena Grid - Scaled Down */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {thumbnails.map((thumb) => (
                    <div key={thumb.id} className="flex flex-col gap-3">
                        <div 
                            onClick={() => setSelectedId(thumb.id)}
                            onDragEnter={(e) => handleDrag(e, thumb.id)}
                            onDragLeave={(e) => handleDrag(e, thumb.id)}
                            onDragOver={(e) => handleDrag(e, thumb.id)}
                            onDrop={(e) => handleDrop(e, thumb.id)}
                            className={cn(
                                "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group cursor-pointer",
                                thumb.id === selectedId 
                                    ? "border-blue-500 ring-4 ring-blue-50 shadow-lg scale-[1.02]" 
                                    : "border-transparent hover:border-blue-200",
                                !thumb.src && thumb.id !== selectedId && "border-dashed border-gray-300 bg-gray-50",
                                !thumb.src && thumb.id === selectedId && "border-dashed border-blue-500 bg-blue-50/50",
                                thumb.id === 'B' && !thumb.src && "animate-pulse",
                                dragActiveId === thumb.id && "border-blue-500 bg-blue-100 scale-105 ring-4 ring-blue-200"
                            )}
                        >
                            {thumb.src ? (
                                <>
                                    <img src={thumb.src} alt={thumb.label} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={(e) => handleDelete(thumb.id, e)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors z-20 opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                                    {isGenerating && thumb.id !== 'A' ? (
                                        <div className="text-center space-y-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                                            <p className="font-medium text-purple-600 text-sm">AI 생성중...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {thumb.id === 'A' ? (
                                                <>
                                                    <Upload className="w-8 h-8 mb-2 text-gray-300" />
                                                    <span className="font-bold text-base text-gray-500">원본 이미지 등록</span>
                                                    <span className="text-xs text-gray-400 mt-1">클릭하여 업로드</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-8 h-8 mb-1" />
                                                    <span className="font-bold text-base">비교군 생성 대기</span>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <span className={cn(
                                "px-3 py-1 rounded-full font-bold text-base",
                                thumb.id === 'A' ? "bg-gray-200 text-gray-700" : "bg-purple-100 text-purple-700"
                            )}>
                                {thumb.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Creation Panel (Inline) - Horizontal Layout */}
            <div className="mt-12">
                 <h3 className="text-lg font-bold text-gray-500 mb-6 uppercase tracking-wider">비교군 썸네일 만들기</h3>

                 {/* Platform Selection */}
                 <div className="mb-6">
                    <div className="flex gap-3 mb-3">
                        {[
                            { id: 'own', label: '자사몰', icon: Store, color: 'text-gray-600', activeBg: 'bg-gray-100', borderColor: 'border-gray-200' },
                            { id: 'naver', label: '스마트스토어', img: '/naver-logo.png', color: 'text-green-500', activeBg: 'bg-green-50', borderColor: 'border-green-200' },
                            { id: 'coupang', label: '쿠팡', img: '/coupang-logo.png', color: 'text-orange-500', activeBg: 'bg-orange-50', borderColor: 'border-orange-200' }
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPlatform(p.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                                    platform === p.id 
                                        ? `${p.borderColor} ${p.activeBg} ring-1 ring-offset-0 ${p.borderColor.replace('border', 'ring')}` 
                                        : "border-gray-100 bg-white hover:bg-gray-50 text-gray-400 grayscale"
                                )}
                            >
                                {p.img ? (
                                    <img 
                                        src={p.img} 
                                        alt={p.label} 
                                        className={cn(
                                            "w-6 h-6 object-contain",
                                            p.id === 'coupang' && "rounded-md"
                                        )} 
                                    />
                                ) : (
                                    p.icon && <p.icon size={18} className={cn(platform === p.id ? p.color : "text-gray-400")} />
                                )}
                                    <span className={cn("font-bold text-lg", platform === p.id ? "text-gray-900" : "text-gray-400")}>{p.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-base text-gray-500 flex items-start gap-2">
                            <Info size={18} className="mt-0.5 shrink-0 text-gray-400" />
                            <div>
                                {platform === 'own' && "자유로운 형식의 썸네일이 가능합니다. 브랜드 아이덴티티를 강조해보세요."}
                                {platform === 'naver' && "텍스트 20% 미만, 흰 배경 권장. 검색 노출에 최적화된 이미지를 생성합니다."}
                                {platform === 'coupang' && "1000px 이상 정방형, 누끼(흰 배경) 필수. 로켓배송 승인을 위한 규격을 준수합니다."}
                            </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-5 gap-4">
                        {/* Item 1: Upload */}
                        <div className="col-span-1">
                            <label className="block h-full min-h-[140px] rounded-xl border-2 border-dashed border-blue-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group relative overflow-hidden flex flex-col items-center justify-center gap-2 text-center p-2">
                                 <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                 </div>
                                 <div>
                                    <span className="block font-bold text-gray-900 text-lg group-hover:text-blue-600">내 파일</span>
                                    <span className="block text-base text-gray-400 group-hover:text-blue-400">업로드</span>
                                 </div>
                            </label>
                        </div>
    
                        {/* Items 2-5: AI Presets */}
                        {[
                            { id: 'remove_bg', icon: Eraser, label: '배경 제거', color: 'text-rose-500', img: 'https://placehold.co/150x150/ffe4e6/be123c?text=No+BG' },
                            { id: 'mood', icon: Palette, label: '감성 무드', color: 'text-amber-500', img: 'https://placehold.co/150x150/fef3c7/b45309?text=Mood' },
                            { id: 'zoom', icon: ZoomIn, label: '확대 강조', color: 'text-emerald-500', img: 'https://placehold.co/150x150/d1fae5/047857?text=Zoom' },
                            { id: 'text', icon: Type, label: '오버레이', color: 'text-blue-500', img: 'https://placehold.co/150x150/dbeafe/1d4ed8?text=Text' },
                        ].map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handleAiPresetSelect(preset.id)}
                                className="relative col-span-1 h-full min-h-[140px] rounded-xl overflow-hidden group border border-gray-100 hover:border-purple-500 transition-all text-left"
                            >
                                <img src={preset.img} alt={preset.label} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
                                    <div className="flex items-center gap-1.5 text-white">
                                        <preset.icon size={18} className={preset.color.replace('text-', 'text-white ')} />
                                        <span className="font-bold text-base whitespace-nowrap">{preset.label}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                  </div>
            </div>
        </div>
    );
}
