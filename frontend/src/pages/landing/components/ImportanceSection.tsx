import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ImportanceSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Chaos to Order Transforms
    // 5 Blocks
    const x1 = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
    const y1 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
    const r1 = useTransform(scrollYProgress, [0, 1], [45, 0]);
    
    const x2 = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["-80%", "0%"]);
    const r2 = useTransform(scrollYProgress, [0, 1], [-30, 0]);

    const opacity = useTransform(scrollYProgress, [0, 0.8], [0.5, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

    const titleOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 0, 0, 1]);
    const titleY = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, -20, 20, 0]);

  return (
    <div ref={containerRef} className="h-[250vh] relative bg-background">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {/* The Grid / Blocks */}
                 <div className="relative w-[300px] h-[400px] md:w-[600px] md:h-[500px]">
                    {/* Block 1: Header */}
                    <motion.div 
                        style={{ x: x1, y: y1, rotate: r1, opacity, scale }}
                        className="absolute top-0 left-0 w-full h-[80px] bg-secondary rounded-lg shadow-brutal"
                    />
                    {/* Block 2: Image Left */}
                    <motion.div 
                         style={{ x: x2, y: y2, rotate: r2, opacity, scale }}
                        className="absolute top-[100px] left-0 w-[48%] h-[200px] bg-white border-2 border-secondary rounded-lg shadow-brutal"
                    />
                     {/* Block 3: Text Right */}
                    <motion.div 
                         style={{ x: useTransform(scrollYProgress, [0, 1], ["50%", "0%"]), y: useTransform(scrollYProgress, [0, 1], ["50%", "0%"]), rotate: useTransform(scrollYProgress, [0, 1], [90, 0]) }}
                        className="absolute top-[100px] right-0 w-[48%] h-[200px] bg-primary border-2 border-secondary rounded-lg shadow-brutal"
                    />
                    {/* Block 4: Footer */}
                    <motion.div 
                         style={{ y: useTransform(scrollYProgress, [0, 1], ["100vh", "0%"]) }}
                        className="absolute bottom-0 w-full h-[150px] bg-gray-100 border-2 border-secondary rounded-lg dashed-border"
                    />
                 </div>
            </div>

            <motion.h2 
                style={{ opacity: titleOpacity, y: titleY }}
                className="relative z-10 text-4xl md:text-6xl font-bold text-center mt-[40vh] md:mt-[35vh] px-4"
            >
                {/* We can swap content based on scroll using a simpler conditional if we tracked state, 
                    but with pure CSS variables / transforms it's harder to swap DOM. 
                    Let's just stack them and crossfade. */}
                <span className="block absolute inset-0 flex items-center justify-center" style={{ opacity: 1}}>
                     {/* Placeholder for swapping logic or just keep one generic */}
                     Structured Design drives sales.
                </span>
            </motion.h2>
            
            <motion.div 
                style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl font-bold text-gray-300 pointer-events-none"
            >
                Messy Layout loses customers.
            </motion.div>

        </div>
    </div>
  );
};

export default ImportanceSection;
