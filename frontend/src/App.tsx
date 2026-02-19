import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Travel from './pages/Travel';
import MapComponent from './components/MapComponent';

// Loading Fallback
const Loading = () => <div className="h-screen w-full flex items-center justify-center bg-gray-100 text-gray-500">Loading PortPulse...</div>;

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
