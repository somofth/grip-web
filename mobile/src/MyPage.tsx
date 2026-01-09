import { useState } from 'react';
import { Settings, Ticket, ChevronRight, User as UserIcon, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export function MyPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "김나현",
        email: "nahyun@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
    });

    const MY_COUPONS = [
        {
            id: 1,
            brand: "Starbucks",
            name: "아이스 아메리카노 T",
            expiry: "2024.12.31",
            image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=200&q=80",
            used: false
        },
        {
            id: 2,
            brand: "Baskin Robbins",
            name: "싱글 레귤러 아이스크림",
            expiry: "2024.11.30",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&q=80",
            used: true
        }
    ];

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, we would save to backend here
    };

    return (
        <div className="w-full h-full bg-[#F2F4F6] flex flex-col">
            {/* Header */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <Settings size={24} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto pb-24">
                {/* Profile Section */}
                <div className="bg-white p-6 mb-2">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                                    <Camera size={24} />
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="w-full space-y-3 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">닉네임</label>
                                    <input 
                                        type="text" 
                                        value={profile.name}
                                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                                        className="w-full p-2 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">이메일</label>
                                    <input 
                                        type="email" 
                                        value={profile.email}
                                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                                        className="w-full p-2 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none text-center"
                                    />
                                </div>
                                <button 
                                    onClick={handleSave}
                                    className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> 저장하기
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                                <p className="text-gray-500 text-sm mb-4">{profile.email}</p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-1.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    프로필 수정
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
                        <div className="flex-1 text-center border-r border-gray-100">
                            <span className="block text-gray-500 text-xs mb-1">보유 포인트</span>
                            <span className="block text-lg font-bold text-purple-600">5,800 P</span>
                        </div>
                        <div className="flex-1 text-center">
                            <span className="block text-gray-500 text-xs mb-1">나의 리뷰</span>
                            <span className="block text-lg font-bold text-gray-900">12</span>
                        </div>
                    </div>
                </div>

                {/* My Coupons */}
                <div className="bg-white p-6 mb-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Ticket className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-lg text-gray-900">내 보관함</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {MY_COUPONS.map(coupon => (
                            <div key={coupon.id} className={`flex gap-4 p-4 rounded-xl border ${coupon.used ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-purple-100 shadow-sm'}`}>
                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                    <img src={coupon.image} alt={coupon.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-gray-500">{coupon.brand}</span>
                                        {coupon.used && <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-bold">사용완료</span>}
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">{coupon.name}</h4>
                                    <p className="text-xs text-gray-400">유효기간: {coupon.expiry}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Menu List */}
                <div className="bg-white p-6">
                    <div className="space-y-1">
                        {['공지사항', '자주 묻는 질문', '고객센터', '설정'].map((item, idx) => (
                            <button key={idx} className="w-full flex items-center justify-between py-3 text-gray-700 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                                <span className="font-medium">{item}</span>
                                <ChevronRight size={18} className="text-gray-300" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
