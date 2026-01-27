import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Book.css';
import leftPageImg from '../assets/1.jpg';
import rightPageImg from '../assets/2.jpg';

const ArrowIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '12px', marginRight: '8px' }}>
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#D2D2D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Book = () => {
    const containerRef = useRef(null);
    const leftWrapperRef = useRef(null); // Controls Position & Float
    const rightWrapperRef = useRef(null);
    const leftCardRef = useRef(null); // Controls Hover Interaction
    const rightCardRef = useRef(null);
    const textRef = useRef(null);

    // State for input fields
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        contact: ''
    });

    // State for project type selection
    const [selectedType, setSelectedType] = useState(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

        // Initial setup
        // Wrappers start from bottom, Aligned to FINAL positions directly
        gsap.set(leftWrapperRef.current, {
            x: -148,
            y: 500, // Start closer to bottom edge
            rotation: -35,
            scale: 0.6,
            autoAlpha: 0 // Start hidden
        });
        // Removed isolated opacity tween

        gsap.set(rightWrapperRef.current, {
            x: -260,
            y: 500, // Start closer to bottom edge
            rotation: -25,
            scale: 0.6,
            autoAlpha: 0
        });
        // Removed isolated opacity tween

        // Text Panel - Static/Visible by default
        gsap.set(textRef.current, {
            x: 0,
            opacity: 1,
            autoAlpha: 1
        });

        // 1. Balloon Entrance
        tl.addLabel("entrance")
            .to(leftWrapperRef.current, {
                y: 68,
                x: -122,
                rotation: 4,
                scale: 1,
                // Visibilty handled separately
                duration: 0.8,
                ease: "back.out(0.6)"
            }, "entrance")
            .to(leftWrapperRef.current, {
                autoAlpha: 1,
                duration: 0.3,
                ease: "power1.out"
            }, "entrance+=0.0") // Both cards appear together

            .to(rightWrapperRef.current, {
                y: -108,
                x: -336,
                rotation: -3.4,
                scale: 1,
                // Visibility separate
                duration: 0.8,
                ease: "back.out(0.6)"
            }, "entrance+=0.05") // Start movement 0.05sec after Left
            .to(rightWrapperRef.current, {
                autoAlpha: 1,
                duration: 0.3,
                ease: "power1.out"
            }, "entrance+=0.0") // Right appears immediately on start

    }, { scope: containerRef });

    // Hover Interaction (On Inner Cards)
    const handleHover = (e, cardRef) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 12; // Stronger magnet (was 20)
        const y = (e.clientY - top - height / 2) / 12;

        gsap.to(cardRef.current, {
            x: x,
            y: y,
            rotation: x * 0.6, // Increased tilt
            // scale: 1.05, // Removed scale as requested
            duration: 0.4,
            ease: "back.out(1.7)", // Bubbly elastic feel
            overwrite: "auto"
        });
    };

    const handleLeave = (cardRef) => {
        gsap.to(cardRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto"
        });
    };

    return (
        <div className="main-stage" ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Cards Canvas */}
            <div className="cards-canvas" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                <div className="cards-group" style={{ position: 'relative', width: '419px', height: '559px' }}>

                    {/* Left Card Wrapper (Position/Float) */}
                    <div
                        ref={leftWrapperRef}
                        className="card-wrapper"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '419px', height: '559px', // Match card size
                            zIndex: 10
                        }}
                    >
                        {/* Interactive Inner Card */}
                        <div
                            className="card"
                            ref={leftCardRef}
                            onMouseMove={(e) => handleHover(e, leftCardRef)}
                            onMouseLeave={() => handleLeave(leftCardRef)}
                            style={{ cursor: 'default', width: '100%', height: '100%' }}
                        >
                            <img src={leftPageImg} alt="Left Card" className="card-image" />
                        </div>
                    </div>

                    {/* Right Card Wrapper */}
                    <div
                        ref={rightWrapperRef}
                        className="card-wrapper"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '419px', height: '559px',
                            zIndex: 20
                        }}
                    >
                        <div
                            className="card"  // Removed card-right-inner to be consistent
                            ref={rightCardRef}
                            onMouseMove={(e) => handleHover(e, rightCardRef)}
                            onMouseLeave={() => handleLeave(rightCardRef)}
                            style={{ cursor: 'default', width: '100%', height: '100%' }}
                        >
                            <img src={rightPageImg} alt="Right Card" className="card-image" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Text Panel Container - Flex Column for multiple blocks */}
            <div
                className="text-panel-wrapper"
                ref={textRef}
                style={{
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '190px',
                    marginTop: '-48px',
                    zIndex: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '80px'
                }}
            >
                {/* Block 1 */}
                <div className="book-controls" style={{ width: '300px', position: 'relative', height: 'auto' }}>
                    <div className="controls-header" style={{ transform: 'translateY(-8px)', marginLeft: '-2px' }}>
                        <span className="text-header" style={{ fontSize: '18px', opacity: 0.74, fontFamily: "'SF Pro Rounded', sans-serif" }}>Your Canvas, Our Palett</span>
                    </div>
                    <div className="controls-list" style={{ gap: '5px' }}>
                        <div className="text-list-item" style={{ lineHeight: '8px', display: 'flex', alignItems: 'center', fontSize: '14px', marginBottom: '2px', fontFamily: "'SF Pro Rounded', sans-serif" }}>
                            My name is
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="your name"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(210, 210, 210, 0.12)',
                                    outline: 'none',
                                    color: 'rgba(210, 210, 210, 0.40)',
                                    fontFamily: "'SF Pro Rounded', sans-serif",
                                    fontSize: '14px',
                                    padding: '0 2px',
                                    paddingBottom: '2px',
                                    margin: '0 2px',
                                    width: '80px',
                                    lineHeight: '8px',
                                    textAlign: 'center'
                                }}
                                className="book-input"
                            />
                            from
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="company name"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(210, 210, 210, 0.12)',
                                    outline: 'none',
                                    color: 'rgba(210, 210, 210, 0.40)',
                                    fontFamily: "'SF Pro Rounded', sans-serif",
                                    fontSize: '14px',
                                    padding: '0 2px',
                                    paddingBottom: '2px',
                                    margin: '0 2px',
                                    width: '120px',
                                    lineHeight: '8px',
                                    textAlign: 'center'
                                }}
                                className="book-input"
                            />
                        </div>
                        <div className="text-list-item" style={{ lineHeight: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'SF Pro Rounded', sans-serif" }}>
                            I want to chat about designs for my
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {['Web app', 'Mobile app', 'Website'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`type-button ${selectedType === type ? 'selected' : ''}`}
                                        style={{
                                            background: selectedType === type ? '#7DACF9' : 'rgba(210, 210, 210, 0.08)',
                                            border: '0.4px solid rgba(210, 210, 210, 0.12)',
                                            borderRadius: '6px',
                                            padding: selectedType === type ? '2px 10px 2px 20px' : '2px 8px',
                                            color: selectedType === type ? '#000000' : 'rgba(210, 210, 210, 0.32)',
                                            fontFamily: "'SF Pro Rounded', sans-serif",
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            position: 'relative',
                                            transition: 'background 0.5s cubic-bezier(0.23, 1, 0.32, 1), padding 0.5s cubic-bezier(0.23, 1, 0.32, 1), color 0.5s cubic-bezier(0.23, 1, 0.32, 1), border 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                            whiteSpace: 'nowrap',
                                            outline: 'none'
                                        }}
                                    >
                                        {selectedType === type && (
                                            <span style={{
                                                opacity: selectedType === type ? 1 : 0,
                                                transition: 'opacity 0.4s ease',
                                                position: 'absolute',
                                                left: '10px',
                                                zIndex: 0,
                                                fontSize: '16px',
                                                lineHeight: '0',
                                                animation: selectedType === type ? 'textBounce 0.5s cubic-bezier(0.36, 0, 0.66, -0.56)' : 'none'
                                            }}>*</span>
                                        )}
                                        <span style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            animation: selectedType === type ? 'textBounce 0.5s cubic-bezier(0.36, 0, 0.66, -0.56)' : 'none'
                                        }}>
                                            {type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-list-item" style={{ lineHeight: '8px', display: 'flex', alignItems: 'center', fontSize: '14px', marginTop: '2px', fontFamily: "'SF Pro Rounded', sans-serif" }}>
                            You can reach me at
                            <input
                                type="text"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                placeholder="email or phone"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(210, 210, 210, 0.12)',
                                    outline: 'none',
                                    color: 'rgba(210, 210, 210, 0.40)',
                                    fontFamily: "'SF Pro Rounded', sans-serif",
                                    fontSize: '14px',
                                    padding: '0 2px',
                                    paddingBottom: '2px',
                                    margin: '0 2px',
                                    width: '120px',
                                    lineHeight: '8px',
                                    textAlign: 'center'
                                }}
                                className="book-input"
                            />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Book;
