import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo">Palett Studios</div>
        <div className="nav-links">
          <a href="#work" className="nav-item">Work</a>
          <a href="#services" className="nav-item">Services</a>
          <a href="#about" className="nav-item">About</a>
          <a href="#contact" className="btn-contact">Start a Project</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
