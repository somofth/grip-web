import { useState, useEffect, Fragment } from 'react';
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

export const DUMMY_PRODUCTS: Product[] = [
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
    onSelectABTest?: (option: 'A' | 'B') => void;
}

const BANNER_SLIDES = [
    {
        id: 1,
        tag: "Beta Tester 모집",
        title: <>신제품 평가하고<br/>포인트 받아가세요</>,
        desc: <>상세페이지에 대한 솔직한 의견을 남겨주시면<br/>건당 최대 <span className="text-yellow-400 font-bold">1,000P</span>를 드립니다.</>,
        image: "/banners/banner01.jpg",
        color: "bg-blue-600"
    },
    {
        id: 2,
        tag: "매일매일 이벤트",
        title: <>룰렛 돌리고<br/>추가 포인트 팡팡</>,
        desc: <>꽝 없는 100% 당첨 룰렛!<br/>지금 바로 참여해보세요.</>,
        image: "/banners/banner02.jpg",
        color: "bg-purple-600"
    },
    {
        id: 3,
        tag: "우수 리뷰어",
        title: <>우수 리포트로 선정되면<br/>추가 포인트를 드려요</>,
        desc: <>꼼꼼한 피드백을 남겨주신 분께<br/>보너스 <span className="text-yellow-400 font-bold">5,000P</span> 지급!</>,
        image: "/banners/banner03.jpg",
        color: "bg-orange-600"
    }
];

import { MyPage } from './MyPage';

export function Feed({ onSelectProduct, onSelectABTest }: FeedProps) {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [activeTab, setActiveTab] = useState<'home' | 'store' | 'wishlist' | 'my'>('home');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentSlide((prev) => (prev + newDirection + BANNER_SLIDES.length) % BANNER_SLIDES.length);
    };

    // Auto-swipe banner
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="w-full h-full bg-[#F2F4F6] relative flex flex-col text-gray-900">
            {activeTab === 'store' ? (
                <Store />
            ) : activeTab === 'my' ? (
                <MyPage />
            ) : (
                <>
                    <header className="px-6 py-6 bg-white flex items-center justify-between shadow-sm z-10">
                        <img src="/grip-logo.png" alt="Grip" className="h-10 object-contain" />
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
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "tween", duration: 0.7, ease: "easeInOut" },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);
                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <img 
                                        src={BANNER_SLIDES[currentSlide].image} 
                                        alt="Banner" 
                                        className={cn(
                                            "w-full h-full object-cover opacity-100"
                                        )}
                                        draggable="false"
                                    />
                                    {/* Text Overlay Removed for full image banners */}
                                    {/* {currentSlide !== 0 && currentSlide !== 1 && (
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
                                    )} */}
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Dots */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                {BANNER_SLIDES.map((_, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => {
                                            setDirection(idx > currentSlide ? 1 : -1);
                                            setCurrentSlide(idx);
                                        }}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all", 
                                            idx === currentSlide ? "bg-white w-6" : "bg-white/40"
                                        )} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white py-4 sticky top-0 z-50 shadow-sm border-b border-gray-100">
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

                        <div className="p-6 grid grid-cols-2 gap-4 pb-24">
                            {DUMMY_PRODUCTS.map((product, index) => (
                                <Fragment key={product.id}>
                                    <motion.div
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
                                    {index === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="col-span-2 bg-white rounded-3xl p-6 flex flex-col gap-6 border border-gray-100 shadow-lg relative overflow-hidden mb-4"
                                        >
                                            {/* Header */}
                                            <div className="z-10 flex flex-col items-center text-center">
                                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 inline-block">
                                                    🎁 참여하면 포인트 지급
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2">
                                                    어떤 썸네일이 더 끌리나요?
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    더 사고 싶은 상품을 골라주세요.<br/>
                                                    당신의 선택이 제품 출시에 반영됩니다!
                                                </p>
                                            </div>

                                            {/* Image Comparison */}
                                            <div className="flex gap-2 z-10 justify-center items-center px-0 w-full">
                                                <div 
                                                    className="flex-1 aspect-[4/5] rounded-xl overflow-hidden border border-gray-100 shadow-md relative group cursor-pointer active:scale-95 transition-transform"
                                                    onClick={() => onSelectABTest?.('A')}
                                                >
                                                    <div className="absolute top-2 left-2 w-7 h-7 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white text-sm font-bold z-10 transition-colors group-hover:bg-purple-600">A</div>
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20" />
                                                    <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400" className="w-full h-full object-cover" alt="A" />
                                                </div>
                                                
                                                <div className="text-xl font-bold text-gray-300 italic px-1">VS</div>

                                                <div 
                                                    className="flex-1 aspect-[4/5] rounded-xl overflow-hidden border border-gray-100 shadow-md relative group cursor-pointer active:scale-95 transition-transform"
                                                    onClick={() => onSelectABTest?.('B')}
                                                >
                                                    <div className="absolute top-2 left-2 w-7 h-7 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white text-sm font-bold z-10 transition-colors group-hover:bg-purple-600">B</div>
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20" />
                                                    <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=400&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="B" />
                                                </div>
                                            </div>

                                            {/* Footer Text */}
                                            <div className="w-full bg-gray-50 py-3 rounded-xl text-center text-sm font-bold text-gray-400">
                                                현재 <span className="text-purple-600">48명</span> 투표 중
                                            </div>
                                        </motion.div>
                                    )}
                                </Fragment>
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
