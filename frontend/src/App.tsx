import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EvaluatorDashboard from './pages/evaluator/Dashboard';
import EvaluateeReport from './pages/evaluatee/Report';

import LandingPage from './pages/landing/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<EvaluatorDashboard />} />
          <Route path="/report/:id" element={<EvaluateeReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
