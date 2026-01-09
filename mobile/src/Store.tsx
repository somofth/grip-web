import { Search, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import coinsImg from './assets/coins.png';

interface StoreItem {
    id: number;
    title: string;
    brand: string;
    cost: number;
    image: string;
    category: string;
}

const DUMMY_STORE_ITEMS: StoreItem[] = [
    {
        id: 1,
        title: "스타벅스 아메리카노 Tall",
        brand: "Starbucks",
        cost: 4500,
        image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&auto=format&fit=crop&q=60",
        category: "Cafe"
    },
    {
        id: 2,
        title: "CU 모바일 금액권 5,000원",
        brand: "CU",
        cost: 5000,
        image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=500&auto=format&fit=crop&q=60",
        category: "Voucher"
    },
    {
        id: 3,
        title: "배스킨라빈스 파인트",
        brand: "Baskin Robbins",
        cost: 9800,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60",
        category: "Cafe"
    },
    {
        id: 4,
        title: "네이버페이 10,000원권",
        brand: "Naver",
        cost: 10000,
        image: "https://images.unsplash.com/photo-1616423666945-99e1732d8856?w=500&auto=format&fit=crop&q=60",
        category: "Voucher"
    }
];

export function Store() {
    return (
        <div className="flex-1 flex flex-col bg-[#F2F4F6] relative h-full">
            {/* Store Header */}
            <div className="bg-white px-6 py-4 pb-6 rounded-b-[2rem] shadow-sm z-10 sticky top-0">
                 <h2 className="text-xl font-bold mb-4">Store</h2>
                 
                 {/* Current Points */}
                 <div className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-2xl mb-4 shadow-lg shadow-gray-200">
                     <div className="flex items-center gap-2">
                         <img src={coinsImg} alt="Coin" className="w-6 h-6" />
                         <span className="font-semibold text-gray-300">내 포인트</span>
                     </div>
                     <span className="text-xl font-bold">3,500 P</span>
                 </div>

                 {/* Search Bar */}
                 <div className="bg-gray-100 rounded-xl flex items-center px-4 py-3 gap-2">
                     <Search className="text-gray-400 w-5 h-5" />
                     <input 
                        type="text" 
                        placeholder="원하는 상품을 검색해보세요" 
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                     />
                 </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                 {/* Featured Grid */}
                 <h3 className="font-bold text-lg mb-4">인기 교환 상품</h3>
                 <div className="grid grid-cols-2 gap-4 pb-24">
                     {DUMMY_STORE_ITEMS.map((item) => (
                         <motion.div
                            key={item.id}
                            whileTap={{ scale: 0.96 }}
                            className="bg-white p-4 rounded-2xl shadow-sm flex flex-col gap-3"
                         >
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-bold block mb-1">{item.brand}</span>
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-2">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-1 text-blue-600 font-bold">
                                    <Coins size={14} className="fill-blue-600" />
                                    <span>{item.cost.toLocaleString()} P</span>
                                </div>
                            </div>
                         </motion.div>
                     ))}
                 </div>
            </div>
        </div>
    );
}
