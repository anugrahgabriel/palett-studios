import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Helper for user to see something else if they scroll */}
        <div className="container" style={{ paddingBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to clean up the web?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>More sections coming soon.</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
