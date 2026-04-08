import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ThreadButton = ({ children, onClick, extraPadding = 0, extraWidth = 0, status = 'idle', disabled = false }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [threads, setThreads] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const velocitiesRef = useRef([]);

    const isSubmitting = status === 'submitting';
    const isSuccess = status === 'success';

    useEffect(() => {
        const lightColor = { r: 0xB8, g: 0xB6, b: 0xD9 };
        const darkColor = { r: 0x07, g: 0x0F, b: 0x2B };
        const threadCount = 28;
        const newThreads = [];

        const interpolateColor = (start, end, factor) => {
            const r = Math.round(start.r + (end.r - start.r) * factor);
            const g = Math.round(start.g + (end.g - start.g) * factor);
            const b = Math.round(start.b + (end.b - start.b) * factor);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        };

        for (let i = 0; i < threadCount; i++) {
            const xPercent = (i + 1) * (100 / (threadCount + 1));
            const normalizedPosition = i / (threadCount - 1);
            const distanceFromCenter = Math.abs(normalizedPosition - 0.5) * 2;
            const colorFactor = 1 - distanceFromCenter;

            newThreads.push({
                id: i,
                xPercent: xPercent,
                originalXPercent: xPercent,
                color: interpolateColor(lightColor, darkColor, colorFactor),
                offset: 0
            });
        }
        setThreads(newThreads);
        velocitiesRef.current = newThreads.map(() => 0);
    }, []);

    const handleMouseMove = (e) => {
        if (!buttonRef.current || isSubmitting || isSuccess) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // Physics animation for hover and submission sweep
    useEffect(() => {
        if (threads.length === 0) return;
        if (!hovered && !isSubmitting && !isSuccess) {
             // Gradually reset offsets when not active
             const timer = setInterval(() => {
                 setThreads(prev => prev.map((t, i) => {
                     const springStrength = 0.05;
                     const damping = 0.8;
                     const springForce = (0 - t.offset) * springStrength;
                     velocitiesRef.current[i] += springForce;
                     velocitiesRef.current[i] *= damping;
                     return { ...t, offset: t.offset + velocitiesRef.current[i] };
                 }));
             }, 16);
             return () => clearInterval(timer);
        }

        let animationFrameId;
        const startTime = performance.now();

        const animate = (currentTime) => {
            if (!buttonRef.current) return;
            const buttonWidth = buttonRef.current.offsetWidth;
            
            setThreads(prevThreads => {
                return prevThreads.map((thread, index) => {
                    let targetOffset = 0;

                    if (hovered && !isSuccess && !isSubmitting) {
                        // Mouse hover effect
                        const threadX = (thread.xPercent / 100) * buttonWidth;
                        const dx = mousePos.x - threadX;
                        const dist = Math.abs(dx);
                        const repelRadius = 50;
                        if (dist < repelRadius) {
                            const force = (1 - dist / repelRadius) * 25;
                            targetOffset = -(dx / Math.max(dist, 1)) * force;
                        }
                    }

                    const springStrength = 0.1;
                    const damping = 0.9;
                    const springForce = (targetOffset - thread.offset) * springStrength;
                    velocitiesRef.current[index] += springForce;
                    velocitiesRef.current[index] *= damping;
                    return { ...thread, offset: thread.offset + velocitiesRef.current[index] };
                });
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [threads.length, mousePos, hovered, isSubmitting, isSuccess]);


    const dotPositions = React.useMemo(() => {
        const radius = 9;
        const numDots = 11; // Use 11 dots for better tick distribution
        
        // Circle positions
        const circleDots = Array.from({ length: numDots }).map((_, i) => {
            const angle = (i * 360 / numDots) * (Math.PI / 180);
            return {
                x: 12 + radius * Math.cos(angle),
                y: 12 + radius * Math.sin(angle),
            };
        });

        // Dotted Tick positions distribution
        const p1 = { x: 7.2, y: 12.2 };
        const p2 = { x: 10.5, y: 15.5 };
        const p3 = { x: 17.5, y: 8.5 };

        const tickDots = [];
        // 4 dots on first leg
        for (let i = 0; i < 4; i++) {
            const t = i / 3.5;
            tickDots.push({
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t,
            });
        }
        // 7 dots on second leg
        for (let i = 1; i <= 7; i++) {
            const t = i / 7;
            tickDots.push({
                x: p2.x + (p3.x - p2.x) * t,
                y: p2.y + (p3.y - p2.y) * t,
            });
        }

        return circleDots.map((cd, i) => ({
            circleX: cd.x,
            circleY: cd.y,
            tickX: tickDots[i].x,
            tickY: tickDots[i].y,
            duration: 0.1 + Math.random() * 0.3,
            delay: Math.random() * 0.4
        }));
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                ref={buttonRef}
                onClick={onClick}
                disabled={disabled || isSubmitting || isSuccess}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => {
                    setHovered(false);
                }}
                onMouseMove={handleMouseMove}
                style={{
                    position: 'relative',
                    padding: `${7.5 + extraPadding}px ${34 + extraPadding + extraWidth / 2}px`,
                    border: '0.6px solid rgba(38, 38, 91, 0.1)',
                    borderRadius: '4px',
                    fontFamily: '"Rethink Sans", sans-serif',
                    fontSize: '14px',
                    cursor: (disabled || isSubmitting || isSuccess) ? 'default' : 'pointer',
                    overflow: 'hidden',
                    background: 'transparent',
                    boxShadow: hovered ? '0 2px 2px rgba(174, 174, 176, 0.1)' : 'none',
                    transition: 'box-shadow 0.3s ease, padding-right 0.3s ease, transform 0.2s ease',
                    paddingRight: (hovered || isSubmitting || isSuccess) ? `${50 + extraPadding + extraWidth / 2}px` : `${34 + extraPadding + extraWidth / 2}px`,
                    transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
                }}
            >
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(233, 233, 233, 1)', borderRadius: '3px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                    opacity: hovered ? 0.9 : 1, transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                    zIndex: 1, overflow: 'hidden'
                }} />
                
                {/* Threads Layer */}
                <svg style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 2, pointerEvents: 'none', 
                    filter: (hovered || isSubmitting) ? (isSubmitting ? 'blur(2px)' : 'blur(6px)') : 'none',
                    opacity: (hovered || isSubmitting) ? 1 : 0, 
                    transition: 'filter 0.3s ease, opacity 0.3s ease',
                    overflow: 'hidden'
                }}>
                    {threads.map(thread => (
                        <line 
                            key={thread.id} 
                            x1={`${thread.xPercent + thread.offset}%`} 
                            y1="0" 
                            x2={`${thread.xPercent + thread.offset}%`} 
                            y2="100%" 
                            stroke={thread.color} 
                            strokeWidth="2.4" 
                        />
                    ))}
                </svg>

                <span style={{ 
                    position: 'relative', 
                    zIndex: 3, 
                    fontWeight: 500, 
                    color: '#373434ff',
                    opacity: isSuccess ? 0 : 1,
                    transition: 'opacity 0.2s ease'
                }}>
                    {children}
                </span>

                {isSuccess && (
                   <span style={{ 
                       position: 'absolute', 
                       left: '50%', 
                       top: '50%', 
                       transform: 'translate(-50%, -50%)', 
                       zIndex: 3, 
                       fontFamily: '"Rethink Sans", sans-serif',
                       fontSize: '14px',
                       fontWeight: 500,
                       color: '#00C853'
                   }}>
                       Sent
                   </span>
                )}
            </button>

            {/* Morphing Dotted Status Indicator */}
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '-34px',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                pointerEvents: 'none'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <style>
                        {`
                            @keyframes individual-flicker {
                                0% { opacity: 1; }
                                100% { opacity: 0.1; }
                            }
                            @keyframes dots-rotate {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                    <g style={{
                        opacity: (isSubmitting || isSuccess) ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                        animation: isSubmitting ? 'dots-rotate 2s infinite linear' : 'none',
                        transformOrigin: 'center'
                    }}>
                        {dotPositions.map((dot, i) => (
                            <circle 
                                key={i}
                                cx={isSuccess ? dot.tickX : dot.circleX}
                                cy={isSuccess ? dot.tickY : dot.circleY}
                                r={isSuccess ? "1.2" : "1.1"}
                                fill={isSuccess ? "#00C853" : "#1E06D5"}
                                style={{
                                    transition: 'cx 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), cy 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.4s ease',
                                    animation: `individual-flicker ${dot.duration}s infinite alternate ${dot.delay}s`
                                }}
                            />
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default ThreadButton;
