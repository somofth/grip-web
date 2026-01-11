import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Users, CreditCard, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from "./lib/utils";

// --- Options Data ---
const CATEGORIES = ["👗 패션/잡화", "🍎 식품/건강", "💄 뷰티", "🏠 리빙/가전", "🍼 육아", "🐶 반려동물", "기타"];
const AGES = ["10대", "20대", "30대", "40대", "50대+"];
const VOLUMES = [
    { value: 30, label: "가볍게 (MVP)", desc: "초기 반응 확인용" },
    { value: 50, label: "추천 (Standard)", desc: "가장 일반적인 규모" },
    { value: 100, label: "확실하게 (Pro)", desc: "정밀 데이터 확보" }
];

export function TargetingMode({ onBack }: { onBack: () => void }) {
    // --- State ---
    const [category, setCategory] = useState<string | null>(null);
    const [targetGender, setTargetGender] = useState<'male' | 'female' | 'all' | null>(null);
    const [targetAge, setTargetAge] = useState<string[]>([]);
    const [targetVolume, setTargetVolume] = useState<number>(50);
    const [isExpress, setIsExpress] = useState<boolean>(false);

    // --- Calculation ---
    const rewardPerPanel = isExpress ? 200 : 100;
    const totalCost = useMemo(() => {
        let base = 0;
        if (targetVolume === 30) base = 19900;
        else if (targetVolume === 50) base = 29900;
        else if (targetVolume === 100) base = 49900;
        
        return isExpress ? base * 2 : base;
    }, [targetVolume, isExpress]);

    const isValid = category && targetGender && targetAge.length > 0;

    // --- Handlers ---
    const toggleAge = (age: string) => {
        setTargetAge(prev => 
            prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#F2F4F6] overflow-hidden">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ← 뒤로가기
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">프로젝트 통합 설정</h2>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                    설정 중
                </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Settings Form */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Section 1: Category */}
                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                                상품 범주 설정
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                                            category === cat 
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105" 
                                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Section 2: Target Persona */}
                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                                타겟 페르소나 설정
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">성별</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        {[
                                            { val: 'all', label: '무관' },
                                            { val: 'male', label: '남성' },
                                            { val: 'female', label: '여성' }
                                        ].map(opt => (
                                            <button
                                                key={opt.val}
                                                onClick={() => setTargetGender(opt.val as any)}
                                                className={cn(
                                                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                                                    targetGender === opt.val 
                                                        ? "bg-white text-blue-600 shadow-sm" 
                                                        : "text-gray-400 hover:text-gray-600"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">연령 (복수 선택 가능)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AGES.map(age => (
                                            <button
                                                key={age}
                                                onClick={() => toggleAge(age)}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                                    targetAge.includes(age)
                                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                                        : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                                                )}
                                            >
                                                {age}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Volume */}
                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
                                모집 규모 (N수)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {VOLUMES.map(vol => (
                                    <button
                                        key={vol.value}
                                        onClick={() => setTargetVolume(vol.value)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden",
                                            targetVolume === vol.value
                                                ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                                                : "border-gray-100 hover:border-gray-200 bg-white"
                                        )}
                                    >
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{vol.value}명</div>
                                        <div className="text-sm font-bold text-gray-800">{vol.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">{vol.desc}</div>
                                        {targetVolume === vol.value && (
                                            <div className="absolute top-2 right-2 text-blue-500">
                                                <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                         {/* Section 4: Budget & Speed */}
                         <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">4</span>
                                예산 및 속도
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Standard Option */}
                                <button
                                    onClick={() => setIsExpress(false)}
                                    className={cn(
                                        "p-5 rounded-2xl border-2 text-left transition-all relative",
                                        !isExpress 
                                            ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" 
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                            !isExpress ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                        )}>
                                            <Users size={20} />
                                        </div>
                                        {!isExpress && (
                                            <CheckCircle2 size={20} className="text-blue-500" fill="currentColor" color="white" />
                                        )}
                                    </div>
                                    <h4 className={cn("text-lg font-bold mb-1", !isExpress ? "text-blue-900" : "text-gray-900")}>
                                        일반 모집
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-4">평균 24시간 내 완료됩니다.</p>
                                    <div className="font-bold text-lg text-gray-900">
                                        100P <span className="text-sm font-normal text-gray-400">/ 1인</span>
                                    </div>
                                </button>

                                {/* Express Option */}
                                <button
                                    onClick={() => setIsExpress(true)}
                                    className={cn(
                                        "p-5 rounded-2xl border-2 text-left transition-all relative",
                                        isExpress 
                                            ? "border-purple-500 bg-purple-50/50 ring-1 ring-purple-500" 
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                            isExpress ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"
                                        )}>
                                            <Zap size={20} className={isExpress ? "fill-current" : ""} />
                                        </div>
                                        {isExpress && (
                                            <CheckCircle2 size={20} className="text-purple-500" fill="currentColor" color="white" />
                                        )}
                                    </div>
                                    <h4 className={cn("text-lg font-bold mb-1", isExpress ? "text-purple-900" : "text-gray-900")}>
                                        🚀 급행 모집
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-4">2배 보상으로 3시간 내 완료</p>
                                    <div className="font-bold text-lg text-gray-900">
                                        200P <span className="text-sm font-normal text-gray-400">/ 1인</span>
                                    </div>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Estimate Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-4">
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard size={20} className="text-gray-400" />
                                    예상 견적서
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">모집 인원</span>
                                        <span className="font-bold text-gray-900">{targetVolume}명</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">1인당 리워드</span>
                                        <span className="font-bold text-gray-900">{rewardPerPanel}P</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-500">총 결제 금액</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {totalCost.toLocaleString()}
                                            <span className="text-base font-normal text-gray-400 ml-1">원</span>
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#3182F6] hover:bg-[#1B64DA] shadow-lg shadow-blue-500/20 active:scale-95"
                                    disabled={!isValid}
                                >
                                    {isValid ? (
                                        <span className="flex items-center justify-center gap-2">
                                            {totalCost.toLocaleString()}원으로 시작하기
                                            <ChevronRight size={18} />
                                        </span>
                                    ) : (
                                        "필수 정보를 입력해주세요"
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-3">
                                    위 금액은 VAT 별도입니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
