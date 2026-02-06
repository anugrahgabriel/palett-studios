import React, { useRef, useState, useEffect } from 'react';
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

// Thread Grid Component with Physics
const ThreadGrid = () => {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dots, setDots] = useState([]);
    const [connections, setConnections] = useState([]);
    const threadRefs = useRef([]);

    useEffect(() => {
        // Generate dots
        const generatedDots = [];
        const circleSize = 4;
        const minGap = 44;
        const maxGap = 52;
        const colors = ['#D9D9D9', '#9B9494'];
        const padding = 20;
        const viewportWidth = 1920;
        const viewportHeight = 1080;
        const avgGap = (minGap + maxGap) / 2;
        const cols = Math.floor((viewportWidth - 2 * padding) / (circleSize + avgGap));
        const rows = Math.floor((viewportHeight - 2 * padding) / (circleSize + avgGap));

        let currentY = padding;
        let dotIndex = 0;

        for (let row = 0; row < rows; row++) {
            let currentX = padding;
            for (let col = 0; col < cols; col++) {
                const color = colors[Math.floor(Math.random() * 2)];
                const gapX = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
                const gapY = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;

                generatedDots.push({
                    id: dotIndex++,
                    x: currentX + circleSize / 2,
                    y: currentY + circleSize / 2,
                    color,
                    size: circleSize
                });

                currentX += circleSize + gapX;
            }
            const gapY = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
            currentY += circleSize + gapY;
        }

        setDots(generatedDots);

        // Create random connections (15-25 threads) with 4-8 dot distance
        const numConnections = Math.floor(Math.random() * 11) + 15;
        const generatedConnections = [];

        // Thread color palette
        const threadColors = ['#E2C6AB', '#274DF5', '#802F64', '#802F64', '#555789'];

        for (let i = 0; i < numConnections; i++) {
            const dot1 = generatedDots[Math.floor(Math.random() * generatedDots.length)];

            // Find dots that are 4-8 dots away
            const minDistance = 4;
            const maxDistance = 8;
            const nearbyDots = generatedDots.filter(d => {
                if (d.id === dot1.id) return false;
                const dx = d.x - dot1.x;
                const dy = d.y - dot1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const avgGap = 48; // Average gap between dots
                const dotDistance = distance / avgGap;
                return dotDistance >= minDistance && dotDistance <= maxDistance;
            });

            if (nearbyDots.length > 0) {
                const dot2 = nearbyDots[Math.floor(Math.random() * nearbyDots.length)];
                const threadColor = threadColors[Math.floor(Math.random() * threadColors.length)];
                generatedConnections.push({
                    id: i,
                    start: dot1,
                    end: dot2,
                    controlOffset: { x: 0, y: 0 },
                    isHovered: false,
                    color: threadColor
                });
            }
        }

        setConnections(generatedConnections);
    }, []);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    // Physics animation for threads with momentum
    const velocitiesRef = useRef([]);

    useEffect(() => {
        if (connections.length === 0) return;

        // Initialize velocities if needed
        if (velocitiesRef.current.length !== connections.length) {
            velocitiesRef.current = connections.map(() => ({ x: 0, y: 0 }));
        }

        let animationFrameId;

        const animate = () => {
            setConnections(prevConnections => {
                return prevConnections.map((conn, index) => {
                    let targetOffsetX = 0;
                    let targetOffsetY = 180; // Gravity sag (always applied)

                    // Only apply repulsion if this thread is hovered
                    if (conn.isHovered) {
                        const midX = (conn.start.x + conn.end.x) / 2;
                        const midY = (conn.start.y + conn.end.y) / 2;
                        const dx = mousePos.x - midX;
                        const dy = mousePos.y - midY;

                        // Apply smooth, floaty repulsion that adds to the sag
                        // Instead of replacing, we add the repulsion to maintain the curve
                        targetOffsetX = -dx * 0.9; // Increased repulsion power
                        targetOffsetY = 180 + (-dy * 0.9); // Maintain sag + add vertical repulsion
                    }

                    // Current position
                    const currentOffsetX = conn.controlOffset?.x || 0;
                    const currentOffsetY = conn.controlOffset?.y || 0;

                    // Calculate spring force (like a rubber band)
                    // Softer spring for more floaty feel
                    const springStrength = 0.08; // Reduced for smoother movement
                    const damping = 0.85; // Lower damping = more float and oscillation

                    const forceX = (targetOffsetX - currentOffsetX) * springStrength;
                    const forceY = (targetOffsetY - currentOffsetY) * springStrength;

                    // Update velocity with force
                    velocitiesRef.current[index].x += forceX;
                    velocitiesRef.current[index].y += forceY;

                    // Apply damping (slow down over time)
                    velocitiesRef.current[index].x *= damping;
                    velocitiesRef.current[index].y *= damping;

                    // Update position with velocity
                    const newOffsetX = currentOffsetX + velocitiesRef.current[index].x;
                    const newOffsetY = currentOffsetY + velocitiesRef.current[index].y;

                    return {
                        ...conn,
                        controlOffset: {
                            x: newOffsetX,
                            y: newOffsetY
                        }
                    };
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [mousePos]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                background: '#F3E9E9',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* SVG for threads */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                    zIndex: 1
                }}
            >
                {connections.map((conn, index) => {
                    const midX = (conn.start.x + conn.end.x) / 2 + (conn.controlOffset?.x || 0);
                    const midY = (conn.start.y + conn.end.y) / 2 + (conn.controlOffset?.y || 0);

                    return (
                        <path
                            key={conn.id}
                            ref={el => threadRefs.current[index] = el}
                            d={`M ${conn.start.x} ${conn.start.y} Q ${midX} ${midY} ${conn.end.x} ${conn.end.y}`}
                            stroke={conn.color || 'rgba(155, 148, 148, 0.3)'}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            style={{
                                cursor: 'default',
                                pointerEvents: 'stroke',
                                opacity: 1.0
                            }}
                            onMouseEnter={() => {
                                setConnections(prev => prev.map(c =>
                                    c.id === conn.id ? { ...c, isHovered: true } : c
                                ));
                            }}
                            onMouseLeave={() => {
                                setConnections(prev => prev.map(c =>
                                    c.id === conn.id ? { ...c, isHovered: false } : c
                                ));
                            }}
                        />
                    );
                })}
            </svg>

            {/* Dots */}
            {dots.map(dot => (
                <div
                    key={dot.id}
                    style={{
                        position: 'absolute',
                        left: `${dot.x - dot.size / 2}px`,
                        top: `${dot.y - dot.size / 2}px`,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        borderRadius: '50%',
                        backgroundColor: dot.color,
                        zIndex: 2
                    }}
                />
            ))}
        </div>
    );
};

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
        <div className="book-wrapper" style={{ width: '100%' }}>
            {/* Thread Grid with Physics */}
            <ThreadGrid />


        </div>
    );
};

export default Book;
