import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-bg-glow"></div>
            <div className="hero-bg-glow-2"></div>

            <div className="container hero-content">
                <span className="hero-label">Available for new projects</span>
                <h1 className="hero-title">
                    Digital experiences <br />
                    <span className="gradient-text">curated for impact.</span>
                </h1>
                <p className="hero-subtitle">
                    Palett Studios is a creative collective building premium digital products, engaging brands, and immersive web experiences.
                </p>

                <div className="hero-actions">
                    <button className="btn-hero-primary">Our Work</button>
                    <button className="btn-hero-secondary">Contact Us</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
