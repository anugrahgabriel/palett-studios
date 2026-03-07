import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import GetInTouch from './components/GetInTouch';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{
          duration: 0.2,
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1]
        }}
        // Separate exit transition for faster fade out with blur
        variants={{
          exit: {
            opacity: 0,
            filter: 'blur(10px)',
            transition: { duration: 0.1, ease: 'easeIn', delay: 0 }
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Hero />} />
          <Route path="/get-in-touch" element={<GetInTouch />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <main style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AnimatedRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
