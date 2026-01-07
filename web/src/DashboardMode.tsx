import { motion } from 'framer-motion';
import { TrendingUp, Eye, MousePointerClick, Clock, Sparkles, AlertCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { METRICS_DATA, DWELL_TIME_DATA } from "./data/optimizerData";

export function DashboardMode() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-7xl mx-auto h-screen overflow-y-auto bg-[#F2F4F6]"
    >
      <header className="mb-8 flex justify-between items-start">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">AI 최적화 리포트</h1>
            <p className="text-gray-500 mt-1">분석 대상: https://smartstore.naver.com/reeltech/product/3...</p>
         </div>
         <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
            <TrendingUp size={18} />
            예상 전환율 상승폭 +18.5%
         </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">

         {/* Metric Cards */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
            <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2">
               <Eye size={16}/> 총 조회수
            </h3>
            <div className="flex items-end gap-3">  
               <span className="text-4xl font-bold text-gray-900">12,450</span>
               <span className="text-emerald-500 text-sm font-medium mb-1">+12%</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
             <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2">
               <MousePointerClick size={16}/> 예상 구매 전환율
            </h3>
            <div className="flex items-end gap-3">  
               <span className="text-4xl font-bold text-gray-900">3.2%</span>
               <span className="text-gray-400 text-sm font-normal mb-1">평균 대비 2.1% 우수</span>    
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
             <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2">
               <Clock size={16}/> 평균 체류 시간
            </h3>
            <div className="flex items-end gap-3">  
               <span className="text-4xl font-bold text-gray-900">4m 12s</span>
               <span className="text-emerald-500 text-sm font-medium mb-1">+45s</span>
            </div>
         </div>

         {/* Charts */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">      
            <h3 className="text-lg font-bold mb-6 text-gray-900">최적화 후 이탈률 감소 추이</h3>
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
                        name="최적화 후"
                        stroke="#3182F6"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#3182F6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}        
                     />
                     <Line
                        type="monotone"
                        dataKey="bounceRate" 
                        name="기존"
                        stroke="#E5E7EB"
                        strokeWidth={2}
                        strokeDasharray="5 5"       
                     />
                     <Legend />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 text-gray-900">섹션별 체류 시간 (초)</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DWELL_TIME_DATA}> 
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="section" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Legend iconType="circle" />   
                     <Bar dataKey="before" name="기존" fill="#F2F4F6" radius={[4,4,0,0]} />       
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
               <p className="text-blue-800 leading-relaxed text-sm lg:text-base">
                  사용자들은 <span className="font-bold">3번 섹션 (신뢰도 & 인증)</span>에서 가장 많이 이탈(60%)했습니다. 히트맵 분석 결과, 인증 마크와 고객 후기를 찾으려다 이탈한 것으로 보입니다.
               </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={100} />
               </div>
               <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-2">
                  <Sparkles size={20} /> 추천 최적화 액션
               </h4>
               <p className="text-emerald-800 leading-relaxed text-sm lg:text-base">
                  <strong>Action:</strong> 2번 섹션 직후에 '공식 인증 배너'와 '베스트 리뷰 캐러셀'을 배치하여 신뢰도를 보강하세요.
                  <br/>
                  <span className="text-sm mt-2 block opacity-80 font-semibold">예상 효과: 신뢰도 점수 +15% 상승</span>
               </p>
            </div>
         </div>

      </div>
    </motion.div>
  );
}
