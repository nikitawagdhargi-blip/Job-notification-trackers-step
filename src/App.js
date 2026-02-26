import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ToastProvider from './components/ToastProvider';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Saved from './pages/Saved';
import Digest from './pages/Digest';
import Proof from './pages/Proof';
import NotFound from './pages/NotFound';
import './css/design-system.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/digest" element={<Digest />} />
              <Route path="/proof" element={<Proof />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;