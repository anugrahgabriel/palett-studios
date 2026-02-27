import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import GetInTouch from './components/GetInTouch';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/get-in-touch" element={<GetInTouch />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
