import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);

  const [url, setUrl] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
        // Ideally pass URL state or just navigate
      navigate('/workspace'); 
    }
  };

  return (
    <motion.section 
        style={{ opacity, scale }}
        className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden"
    >
        {/* Background Grids or Decoration could go here */}
        
        <div className="max-w-4xl w-full text-center z-10">
            <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
                Optimize Your Detail Page<br/>
                <span className="text-gray-400">with human insights.</span>
            </motion.h1>

            <motion.p 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
                 className="text-xl text-gray-500 mb-12"
            >
                Data-driven insights to boost your conversion rate.
            </motion.p>

            <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
            >
                <input 
                    type="url" 
                    placeholder="Enter your product URL..."
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-secondary bg-white text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-brutal transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <motion.button 
                    whileHover={{ scale: 1.05, x: 2, y: -2, boxShadow: '6px 6px 0px 0px #000000' }}
                    whileTap={{ scale: 0.95, x: 0, y: 0, boxShadow: '2px 2px 0px 0px #000000' }}
                    className="px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl border-2 border-secondary shadow-brutal"
                >
                    Analyze
                </motion.button>
            </motion.form>
        </div>
    </motion.section>
  );
};

export default HeroSection;
