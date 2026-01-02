import React from 'react';
import HeroSection from './components/HeroSection';
import ImportanceSection from './components/ImportanceSection';
import AnalysisSection from './components/AnalysisSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <HeroSection />
      <ImportanceSection />
      <AnalysisSection />
      
      <footer className="py-12 border-t border-gray-200 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ReelTech Diagnosis. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
