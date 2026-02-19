import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Travel from './pages/Travel';
import MapLoading from './pages/MapLoading';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/travel" element={<Travel />} />
        {/* For demonstration purposes, also accessible directly */}
        <Route path="/loading" element={<MapLoading />} />
      </Routes>
    </Router>
  );
}

export default App;
