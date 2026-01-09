import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Bell, Star, Home, Heart, User, Store as StoreIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { Store } from './Store';
import coinsImg from './assets/coins.png'; // Reusing the coins image for points
import thumbnailImg from './assets/thumbnail.jpg'; // Reusing existing thumbnail

export interface Product {
    id: number;
    title: string;
    brand: string;
    price: string;
    points: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
}

const DUMMY_PRODUCTS: Product[] = [
    {
        id: 1,
        title: "프리미엄 노이즈 캔슬링 헤드폰 Pro",
        brand: "SoundMaster",
        price: "329,000",
        points: 500,
        rating: 4.8,
        reviews: 1240,
        image: thumbnailImg,
        category: "Tech"
    },
    {
        id: 2,
        title: "데일리 모이스처 히알루론 수분 크림",
        brand: "PureSkin",
        price: "28,000",
        points: 300,
        rating: 4.6,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JlYW18ZW58MHx8MHx8fDA%3D", // Fallback to external for demo
        category: "Beauty"
    },
    {
        id: 3,
        title: "초경량 알루미늄 캠핑 체어",
        brand: "NatureHike",
        price: "45,000",
        points: 400,
        rating: 4.9,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1595461135849-bf08dc936ba9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hhaXJ8ZW58MHx8MHx8fDA%3D",
        category: "Life"
    },
    {
        id: 4,
        title: "유기농 비건 프로틴 파우더 초코맛",
        brand: "HealthyEarth",
        price: "52,000",
        points: 600,
        rating: 4.5,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvdGVpbnxlbnwwfHwwfHx8MA%3D%3D",
        category: "Food"
    },
    {
        id: 5,
        title: "스마트 워치 시리즈 7 Midnight",
        brand: "TechGiant",
        price: "499,000",
        points: 1000,
        rating: 4.7,
        reviews: 2100,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdhdGNofGVufDB8fDB8fHww",
        category: "Tech"
    },
    {
        id: 6,
        title: "빈티지 레더 크로스백 Brown",
        brand: "LeatherArt",
        price: "158,000",
        points: 450,
        rating: 4.4,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmFZfGVufDB8fDB8fHww",
        category: "Fashion"
    }
];

const CATEGORIES = ["전체", "테크/가전", "패션/잡화", "뷰티", "푸드", "인테리어", "생활용품"];

interface FeedProps {
    onSelectProduct: (productId: number) => void;
}

const BANNER_SLIDES = [
    {
        id: 1,
        tag: "Beta Tester 모집",
        title: <>신제품 평가하고<br/>포인트 받아가세요</>,
        desc: <>상세페이지에 대한 솔직한 의견을 남겨주시면<br/>건당 최대 <span className="text-yellow-400 font-bold">1,000P</span>를 드립니다.</>,
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60",
        color: "bg-blue-600"
    },
    {
        id: 2,
        tag: "매일매일 이벤트",
        title: <>룰렛 돌리고<br/>추가 포인트 팡팡</>,
        desc: <>꽝 없는 100% 당첨 룰렛!<br/>지금 바로 참여해보세요.</>,
        image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800&auto=format&fit=crop&q=60",
        color: "bg-purple-600"
    },
    {
        id: 3,
        tag: "우수 리뷰어",
        title: <>우수 리포트로 선정되면<br/>추가 포인트를 드려요</>,
        desc: <>꼼꼼한 피드백을 남겨주신 분께<br/>보너스 <span className="text-yellow-400 font-bold">5,000P</span> 지급!</>,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
        color: "bg-orange-600"
    }
];

export function Feed({ onSelectProduct }: FeedProps) {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [activeTab, setActiveTab] = useState<'home' | 'store' | 'wishlist' | 'my'>('home');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-swipe banner
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-full bg-[#F2F4F6] relative flex flex-col text-gray-900">
            {activeTab === 'store' ? (
                <Store />
            ) : (
                <>
                    {/* Header */}
                    <header className="px-6 py-4 bg-white flex items-center justify-between shadow-sm z-10">
                        <h1 className="text-xl font-bold font-sans tracking-tight text-blue-600">ReelMall</h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <Search className="w-6 h-6" />
                            <ShoppingBag className="w-6 h-6" />
                            <Bell className="w-6 h-6" />
                        </div>
                    </header>

                    {/* Scroll Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {/* Banner Carousel */}
                        <div className="relative w-full h-64 bg-gray-900 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <img 
                                        src={BANNER_SLIDES[currentSlide].image} 
                                        alt="Banner" 
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-center px-8">
                                        <span className={cn("inline-block px-3 py-1 text-white text-xs font-bold rounded-full w-fit mb-3", BANNER_SLIDES[currentSlide].color)}>
                                            {BANNER_SLIDES[currentSlide].tag}
                                        </span>
                                        <h2 className="text-3xl font-bold text-white leading-tight mb-2">
                                            {BANNER_SLIDES[currentSlide].title}
                                        </h2>
                                        <p className="text-gray-200 text-sm mb-6">
                                            {BANNER_SLIDES[currentSlide].desc}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Dots */}
                            <div className="absolute bottom-4 left-8 flex gap-2 z-10">
                                {BANNER_SLIDES.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all", 
                                            idx === currentSlide ? "bg-white w-6" : "bg-white/40"
                                        )} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
                            <div className="flex gap-2 px-6 overflow-x-auto no-scrollbar pb-1">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                                            selectedCategory === cat 
                                                ? "bg-gray-900 text-white" 
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="p-6 grid grid-cols-2 gap-4 pb-24">
                            {DUMMY_PRODUCTS.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => onSelectProduct(product.id)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
                                >
                                    <div className="aspect-[4/5] relative bg-gray-100">
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                            <img src={coinsImg} alt="P" className="w-3 h-3" />
                                            +{product.points}P
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <span className="text-xs text-gray-400 font-bold mb-1">{product.brand}</span>
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                                            {product.title}
                                        </h3>
                                        <div className="mt-auto pt-2 flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-gray-900">{product.price}</span>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-gray-600 font-semibold">{product.rating}</span>
                                                    <span>({product.reviews})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Nav */}
            <div className="h-[80px] bg-white border-t border-gray-100 flex items-center justify-between px-8 pb-4 absolute bottom-0 w-full z-20">
                <NavButton 
                    icon={<Home size={24} />} 
                    label="홈" 
                    active={activeTab === 'home'} 
                    onClick={() => setActiveTab('home')}
                />
                <NavButton 
                    icon={<Heart size={24} />} 
                    label="찜" 
                    active={activeTab === 'wishlist'} 
                    onClick={() => setActiveTab('wishlist')}
                />
                <NavButton 
                    icon={<StoreIcon size={24} />} 
                    label="스토어" 
                    active={activeTab === 'store'} 
                    onClick={() => setActiveTab('store')}
                />
                <NavButton 
                    icon={<User size={24} />} 
                    label="마이" 
                    active={activeTab === 'my'} 
                    onClick={() => setActiveTab('my')}
                />
            </div>
        </div>
    );
}

function NavButton({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-gray-900" : "text-gray-300")}
        >
            {icon}
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );
}
