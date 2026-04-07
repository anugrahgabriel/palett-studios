import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ThreadButton = ({ children, onClick, extraPadding = 0, extraWidth = 0 }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [threads, setThreads] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const velocitiesRef = useRef([]);

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
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    useEffect(() => {
        if (threads.length === 0 || !hovered) return;
        let animationFrameId;
        const animate = () => {
            if (!buttonRef.current) return;
            const buttonWidth = buttonRef.current.offsetWidth;
            setThreads(prevThreads => {
                return prevThreads.map((thread, index) => {
                    const threadX = (thread.xPercent / 100) * buttonWidth;
                    const dx = mousePos.x - threadX;
                    const dist = Math.abs(dx);
                    const repelRadius = 50;
                    let targetOffset = 0;
                    if (dist < repelRadius) {
                        const force = (1 - dist / repelRadius) * 25;
                        targetOffset = -(dx / Math.max(dist, 1)) * force;
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
    }, [threads.length, mousePos, hovered]);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setThreads(prev => prev.map(t => ({ ...t, offset: 0 })));
                velocitiesRef.current = velocitiesRef.current.map(() => 0);
            }}
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                padding: `${7.5 + extraPadding}px ${34 + extraPadding + extraWidth / 2}px`,
                border: '0.6px solid rgba(38, 38, 91, 0.1)',
                borderRadius: '4px',
                fontFamily: '"Rethink Sans", sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'transparent',
                boxShadow: hovered ? '0 2px 2px rgba(174, 174, 176, 0.1)' : 'none',
                transition: 'box-shadow 0.3s ease, padding-right 0.3s ease',
                paddingRight: hovered ? `${50 + extraPadding + extraWidth / 2}px` : `${34 + extraPadding + extraWidth / 2}px`
            }}
        >
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(233, 233, 233, 1)', borderRadius: '3px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                opacity: hovered ? 0.9 : 1, transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                zIndex: 1, overflow: 'hidden'
            }} />
            <svg style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 2, pointerEvents: 'none', filter: hovered ? 'blur(6px)' : 'none',
                opacity: hovered ? 1 : 0, transition: 'filter 0.3s ease, opacity 0.3s ease',
                overflow: 'hidden'
            }}>
                {threads.map(thread => (
                    <line key={thread.id} x1={`${thread.xPercent + thread.offset}%`} y1="0" x2={`${thread.xPercent + thread.offset}%`} y2="100%" stroke={thread.color} strokeWidth="2.4" />
                ))}
            </svg>
            <span style={{ position: 'relative', zIndex: 3, fontWeight: 500, color: '#373434ff' }}>
                {children}
            </span>
        </button>
    );
};

export default ThreadButton;
