import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Review from './pages/Review';
import Status from './pages/Status';

const App: React.FC = () => {
  return (
    <Router>
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </Router>
  );
};

export default App;
