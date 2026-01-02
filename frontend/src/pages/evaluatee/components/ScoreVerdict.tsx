import React from 'react';
import { motion } from 'framer-motion';

interface ScoreVerdictProps {
  totalScore: number;
  grade: string;
}

const ScoreVerdict: React.FC<ScoreVerdictProps> = ({ totalScore, grade }) => {
  return (
    <div className="text-center py-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        <span className="text-sm font-semibold text-gray-500 tracking-widest uppercase mb-2 block">Total Score</span>
        <h1 className="text-8xl font-black text-gray-900 leading-none">
          {totalScore}
          <span className="text-4xl text-gray-400 font-light">/100</span>
        </h1>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6"
      >
        <div className={`
          inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold
          ${grade === 'S' ? 'bg-purple-100 text-purple-600' : ''}
          ${grade === 'A' ? 'bg-blue-100 text-blue-600' : ''}
          ${grade === 'B' ? 'bg-green-100 text-green-600' : ''}
          ${grade === 'C' ? 'bg-yellow-100 text-yellow-600' : ''}
        `}>
          {grade}
        </div>
        <p className="mt-2 text-gray-500 font-medium">Global Grade</p>
      </motion.div>
    </div>
  );
};

export default ScoreVerdict;
