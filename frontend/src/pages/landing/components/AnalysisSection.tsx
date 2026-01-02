import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnalysisSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-20%" });

  return (
    <section className="min-h-screen bg-gray-900 text-white relative flex flex-col items-center justify-center py-20" ref={ref}>
        <div className="max-w-6xl w-full px-4 flex flex-col items-center">
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-4xl md:text-5xl font-bold mb-16 text-center"
            >
                AI that sees what humans feel.
            </motion.h2>

            <div className="relative w-full max-w-4xl aspect-[16/9] bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                {/* Browser Mockup Header */}
                <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                </div>
                
                {/* Content Area */}
                <div className="p-8 relative h-full">
                    {/* Abstract Product Content */}
                    <div className="flex gap-8">
                        <div className="w-1/2 h-64 bg-gray-700 rounded-lg animate-pulse"/>
                        <div className="w-1/2 space-y-4">
                            <div className="h-8 bg-gray-700 rounded w-3/4"/>
                            <div className="h-4 bg-gray-700 rounded w-full"/>
                            <div className="h-4 bg-gray-700 rounded w-5/6"/>
                            <div className="h-12 bg-gray-600 rounded w-1/3 mt-8"/>
                        </div>
                    </div>

                    {/* Laser Scanner */}
                    <motion.div 
                        initial={{ top: 0 }}
                        animate={isInView ? { top: "100%" } : { top: 0 }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                        className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(204,255,0,0.8)] z-20"
                    />
                </div>

                {/* Score Cards Popups */}
                {isInView && (
                    <>
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.0 }}
                            className="absolute top-20 right-20 bg-white text-black p-4 rounded-xl shadow-brutal border-2 border-black z-30"
                        >
                            <div className="text-xs font-bold text-gray-500 uppercase">Trust Score</div>
                            <div className="text-2xl font-black">98/100</div>
                        </motion.div>

                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="absolute bottom-20 left-20 bg-primary text-black p-4 rounded-xl shadow-brutal border-2 border-black z-30"
                        >
                            <div className="text-xs font-bold text-gray-800 uppercase">Persuasion</div>
                            <div className="text-2xl font-black">A+</div>
                        </motion.div>
                    </>
                )}
            </div>

        </div>
    </section>
  );
};

export default AnalysisSection;
