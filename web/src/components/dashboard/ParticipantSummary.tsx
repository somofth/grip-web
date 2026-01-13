import { motion } from 'framer-motion';
import { Users, MapPin, User, Home } from 'lucide-react';

export const ParticipantSummary = () => {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8"
        >
            <div className="flex items-center gap-2 mb-6">
                <Users className="text-blue-500" size={24} />
                <h3 className="text-lg font-bold text-gray-900">참여 유저 프로필 요약</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">N = 50명</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Location */}
                <div className="flex items-start gap-4 pt-4 md:pt-0 pl-0 md:pl-4 first:pl-0">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl shrink-0">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">주요 거주지</div>
                        <div className="text-xl font-bold text-gray-900">서울/경기 <span className="text-blue-500 text-base">(62%)</span></div>
                        <div className="text-xs text-gray-400 mt-1">부산(15%), 대구(8%)</div>
                    </div>
                </div>

                {/* Gender & Age */}
                <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-8">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
                        <User size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">성별 / 연령</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">여성 58%</span>
                            <div className="h-4 w-[1px] bg-gray-300"></div>
                            <span className="text-xl font-bold text-gray-900">2030</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">구매력 높은 직장인 비중 높음</div>
                    </div>
                </div>

                {/* Persona / Household */}
                <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-8">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl shrink-0">
                        <Home size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">가구 형태 (Persona)</div>
                        <div className="text-xl font-bold text-gray-900">1인 가구 <span className="text-emerald-500 text-base">(45%)</span></div>
                        <div className="text-xs text-gray-400 mt-1">"좁은 공간 활용"에 관심 높음</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
