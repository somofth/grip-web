import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreVerdict from './components/ScoreVerdict';
import RadarBalance from './components/RadarBalance';
import { Loader2, ArrowRight } from 'lucide-react';

const EvaluateeReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gate, setGate] = useState(0); // 0: Verdict, 1: Radar, 2: Details...

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        // Mock data for now if API fails or ID is dummy
        // const result = await getAnalysisResult(id);
        // setData(result);
        
        // Use Mock Data for visualization dev
        setTimeout(() => {
            setData({
                total_score: 85,
                grade: 'A',
                details: {
                    persuasion: { score: 85, issues: ['Issue 1'] },
                    design: { score: 70, issues: [] },
                    trust: { score: 90, issues: [] },
                    technical: { score: 95, issues: [] }
                }
            });
            setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
    );
  }

  if (!data) return <div>Data not found</div>;

  const radarData = [
    { subject: 'Persuasion', A: data.details.persuasion.score, fullMark: 100 },
    { subject: 'Design', A: data.details.design.score, fullMark: 100 },
    { subject: 'Trust', A: data.details.trust.score, fullMark: 100 },
    { subject: 'Technical', A: data.details.technical.score, fullMark: 100 },
  ];

  const nextGate = () => {
      setGate((prev: number) => prev + 1);
      // Smooth scroll usually handled by browser if we render new sections, 
      // but here we might want to programmatically scroll.
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">ReelTech Diagnosis</span>
        <span className="text-sm font-medium text-gray-500">Report #{id?.slice(0, 8)}</span>
      </nav>

      <main className="pt-24 max-w-2xl mx-auto px-6">
        {/* Section 1: Verdict */}
        <section className="min-h-[60vh] flex flex-col justify-center">
            <ScoreVerdict totalScore={data.total_score} grade={data.grade} />
        </section>

        {/* Section 2: Radar (Gated) */}
        <AnimatePresence>
            {gate >= 1 && (
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="min-h-[50vh] flex flex-col justify-center border-t border-gray-100 pt-12"
                >
                    <h2 className="text-2xl font-bold mb-8 text-center">Analysis Balance</h2>
                    <RadarBalance data={radarData} />
                    <p className="text-center text-gray-500 mt-4 max-w-md mx-auto">
                        Your page is strong in <strong>Technical</strong> aspects but needs improvement in <strong>Design</strong>.
                    </p>
                </motion.section>
            )}
        </AnimatePresence>

         {/* Detailed breakdown placeholders could go here for gate >= 2 */}
         {gate >= 2 && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 p-8 bg-gray-50 rounded-xl"
             >
                 <h3 className="font-bold text-lg mb-4">Detailed Insights</h3>
                 <p>Persuasion Score: {data.details.persuasion.score}</p>
                 {/* ... details ... */}
             </motion.div>
         )}

      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
            <button className="flex-1 py-4 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                Skip
            </button>
            <button 
                onClick={nextGate}
                className="flex-[2] py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
                Next Insight <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateeReport;
