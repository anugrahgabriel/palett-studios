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

    // Grid configuration
    const circleSize = 2; // Decreased slightly more
    const gap = 48; // Fixed gap
    const padding = 20;
    const cellSize = circleSize + gap;

    useEffect(() => {
        // Generate dots
        const generatedDots = [];
        const colors = ['#D9D9D9', '#9B9494'];

        // Use window dimensions but ensure we overshoot a bit to avoid edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Add extra rows/cols to ensure full coverage
        const cols = Math.ceil(viewportWidth / cellSize) + 2;
        const rows = Math.ceil(viewportHeight / cellSize) + 2;

        // Center calculation or just start from 0 with slight offset to center?
        // Let's just start slightly off-screen to cover edges.
        const startX = (viewportWidth - (cols * cellSize)) / 2;
        const startY = (viewportHeight - (rows * cellSize)) / 2;

        let dotIndex = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const color = colors[Math.floor(Math.random() * 2)];

                generatedDots.push({
                    id: dotIndex++,
                    x: startX + col * cellSize + circleSize / 2,
                    y: startY + row * cellSize + circleSize / 2,
                    col,
                    row,
                    color,
                    size: circleSize
                });
            }
        }



        // Create threads connections between:
        // 1. Bottom edge of LEFT grid box (original, shifted left)
        // 2. Left edge of RIGHT grid box (duplicate, shifted right)

        const generatedConnections = [];
        const threadColors = ['#E2C6AB', '#274DF5', '#802F64', '#802F64', '#555789'];
        let connectionId = 0;

        // --- Define Grid Box Areas ---
        // Left Box (Original): startCol = center - width/2 - 6, targetRow = 5 - 2 (row 3)
        // Width = textWidthCols (7), Height = textHeightRows (4)
        // Bottom Edge: row = targetRow + textHeightRows, cols = startCol to startCol + textWidthCols

        const textWidthCols = 7;
        const textHeightRows = 4;
        const totalCols = Math.floor((window.innerWidth - 2 * padding) / cellSize);
        const centerCol = Math.floor(totalCols / 2);

        const leftBoxStartCol = centerCol - Math.floor(textWidthCols / 2) + 1; // Center aligned + 1 col right
        const leftBoxStartRow = 5;
        const leftBoxHeight = 1; // Top grid height is 1 row
        const leftBoxBottomRow = leftBoxStartRow + leftBoxHeight;

        // Left Box Width increased by 1 from right edge -> effective width is textWidthCols + 1

        // Right Box (Duplicate): startCol = center - width/2 + 5, targetRow = 5 + 0 (row 5)
        // Width = textWidthCols (7), Height = dupHeightRows (textHeightRows + 5 = 9)
        // Left Edge: col = dupStartCol, rows = dupStartRow to dupStartRow + dupHeightRows

        const rightBoxStartCol = leftBoxStartCol; // Align with left box (vertically stacked)
        const rightBoxStartRow = leftBoxStartRow + leftBoxHeight + 2; // Position below first box with 2 row gap
        const rightBoxHeight = textHeightRows; // Decreased by 5 rows (was textHeightRows + 5)
        // row range: 5 to 14

        // Identify candidate dots
        // Source Dots: Bottom edge of Left Box (Width increased by 1)
        const effectiveLeftBoxWidth = textWidthCols + 1;
        const sourceDots = generatedDots.filter(d =>
            d.row === leftBoxBottomRow &&
            d.col >= leftBoxStartCol &&
            d.col <= leftBoxStartCol + effectiveLeftBoxWidth
        );

        // Target Dots: Top edge of Right/Second Box (Width increased by 1)
        const effectiveRightBoxWidth = textWidthCols + 1;

        // Filter and set dots (exclude inside of bottom box)
        const finalDots = generatedDots.filter(d => {
            const isInsideBottomBox =
                d.col > rightBoxStartCol &&
                d.col < rightBoxStartCol + effectiveRightBoxWidth &&
                d.row > rightBoxStartRow &&
                d.row < rightBoxStartRow + rightBoxHeight;
            return !isInsideBottomBox;
        });
        setDots(finalDots);
        const targetDots = generatedDots.filter(d =>
            d.row === rightBoxStartRow &&
            d.col >= rightBoxStartCol &&
            d.col <= rightBoxStartCol + effectiveRightBoxWidth
        );

        // Create connections
        // We want randomized threads count from sources to targets.
        // Let's iterate through sources and try to connect to a random target?
        // Or create X amount of random connections between these sets.

        // Ensure connectivity for every edge dot + add density

        if (sourceDots.length > 0 && targetDots.length > 0) {
            // "just have one thread between every dot to dot, in our pattern"
            // Assuming this means 1-to-1 connection sequentially or cross-connected?
            // "every dot to dot" between the two edges.
            // If sizes differ, we can iterate through the smaller or larger set?
            // Let's connect each source dot to a corresponding target dot.

            // Or does "every dot to dot" mean a full mesh? (Every source to EVERY target?)
            // "just have one thread between every dot to dot" -> likely implies 1-to-1 mapping.

            // "now of every edge dot in thsi connection pattern, set in-out 6 threads"
            // Start with 3 threads from each source dot to 3 spread-out targets
            const colors = ['#FFDEB9', '#FE6244', '#DC0E0E', '#62109F'];
            // NEW LOGIC: Drop straight threads from bottom edge of top grid box with high density
            // Interpolate 8 dots between every 2 dots on the bottom edge
            const dropHeight = 2 * cellSize; // 2 rows height

            // Sort sourceDots by column to ensure sequential interpolation
            sourceDots.sort((a, b) => a.col - b.col);

            for (let i = 0; i < sourceDots.length - 1; i++) {
                const startDot = sourceDots[i];
                const endDot = sourceDots[i + 1];

                // Ensure they are adjacent horizontally
                if (endDot.col === startDot.col + 1 && endDot.row === startDot.row) {
                    const steps = 9; // 1 start + 8 interpolated = 9 intervals to next dot
                    const stepX = (endDot.x - startDot.x) / steps;

                    for (let k = 0; k < steps; k++) {
                        const x = startDot.x + k * stepX;
                        const y = startDot.y;

                        const sourcePoint = { x, y, col: startDot.col, row: startDot.row }; // Mock dot object
                        const targetPoint = { x, y: y + dropHeight };

                        // Vertical Drop Thread
                        const baseSag = Math.random() * 20 - 10; // Minimal sag for straight drop, or variance

                        // For animation: Start control point at top (y), target is mid (y + dropHeight/2) + gravity
                        // Actually, existing physics uses mid + offset.
                        // To start at top: offset.y should make the curve flat at top.
                        // midY = y + dropHeight/2.
                        // We want control point at y.
                        // So offset.y = y - midY = y - (y + dropHeight/2) = -dropHeight/2.
                        const midY = (sourcePoint.y + targetPoint.y) / 2;

                        generatedConnections.push({
                            id: connectionId++,
                            start: sourcePoint,
                            end: targetPoint, // Fixed point in space
                            baseSag: baseSag,
                            controlOffset: { x: 0, y: sourcePoint.y - midY }, // Start high
                            isHovered: false,
                            color: colors[Math.floor(Math.random() * colors.length)]
                        });
                    }
                }
            }

            // Handle the very last dot (not covered by loop intervals)
            if (sourceDots.length > 0) {
                const lastDot = sourceDots[sourceDots.length - 1];
                const sourcePoint = { x: lastDot.x, y: lastDot.y, col: lastDot.col, row: lastDot.row };
                const targetPoint = { x: lastDot.x, y: lastDot.y + dropHeight };
                const midY = (sourcePoint.y + targetPoint.y) / 2;

                generatedConnections.push({
                    id: connectionId++,
                    start: sourcePoint,
                    end: targetPoint,
                    baseSag: 0,
                    controlOffset: { x: 0, y: sourcePoint.y - midY },
                    isHovered: false,
                    color: colors[Math.floor(Math.random() * colors.length)]
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
                    const gravity = 120; // Base downward pull
                    let targetOffsetY = gravity + (conn.baseSag || 0); // Gravity + unique variance

                    // Calculate distance from mouse to thread midpoint
                    const midX = (conn.start.x + conn.end.x) / 2;
                    const midY = (conn.start.y + conn.end.y) / 2 + (gravity / 2); // Approximation of thread center with gravity
                    const dx = mousePos.x - midX;
                    const dy = mousePos.y - midY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const repelRadius = 200; // Area of effect

                    if (dist < repelRadius) {
                        const force = (1 - dist / repelRadius) * 120; // Modified repulsion force
                        targetOffsetX = -(dx / dist) * force;
                        targetOffsetY += -(dy / dist) * force;
                    }

                    // Current position
                    const currentOffsetX = conn.controlOffset?.x || 0;
                    const currentOffsetY = conn.controlOffset?.y || 0;

                    // Calculate spring force (like a rubber band)
                    // Softer spring for more floaty feel
                    const springStrength = 0.05; // Reduced for smoother movement
                    const damping = 0.95; // Higher damping = more momentum/oscillation

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
    }, [mousePos, connections.length]);

    // Calculate position for text container relative to grid
    // Center column, row ~25% down

    // We want the text box edges to align with dots.
    // Let's define a width in "grid columns"
    // And a start position centered horizontally.

    const textWidthCols = 7; // Estimated width in columns
    const textHeightRows = 4; // Estimated height in rows (roughly based on visual content)

    const textStyle = {
        position: 'absolute',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        alignItems: 'flex-start', // Left align content
        justifyContent: 'center', // Default to center vertically
        opacity: dots.length > 0 ? 1 : 0, // Hide until grid is calculated
        width: `${textWidthCols * cellSize}px`, // Align width to grid
        height: `${textHeightRows * cellSize}px`, // Align height to grid
    };

    let textPosition = {};
    let secondTextPosition = {};
    let dashedLines = [];

    if (dots.length > 0) {
        // Find center column
        const viewportWidth = window.innerWidth;
        const totalCols = Math.floor((viewportWidth - 2 * padding) / cellSize);
        const centerCol = Math.floor(totalCols / 2);

        // Target row around 20-25% height
        const targetRow = 5; // Reverted to 5 (was 5-2)

        // Start col to center the box
        const startCol = centerCol - Math.floor(textWidthCols / 2) + 1; // Center aligned + 1 col right

        // Find specific dot
        const anchorDot = dots.find(d => d.col === startCol && d.row === targetRow);

        const effectiveLeftBoxWidth = textWidthCols + 1; // Width increased by 1 col

        if (anchorDot) {
            textPosition = {
                left: `${anchorDot.x}px`,
                top: `${anchorDot.y}px`,
                width: `${effectiveLeftBoxWidth * cellSize}px`, // Override width for wider box
                height: `${1 * cellSize}px` // Override height for 1-row top box
            };

            // Generate Dashed Lines for the grid area covered by text - EDGES ONLY

            // Horizontal lines (Top and Bottom edges)
            const horizontalRows = [0, 1]; // Top box is 1 row tall
            horizontalRows.forEach(r => {
                for (let c = 0; c < effectiveLeftBoxWidth; c++) {
                    const d1 = dots.find(d => d.col === startCol + c && d.row === targetRow + r);
                    const d2 = dots.find(d => d.col === startCol + c + 1 && d.row === targetRow + r);
                    if (d1 && d2) {
                        dashedLines.push({
                            id: `h-edge-${r}-${c}`,
                            x1: d1.x,
                            y1: d1.y,
                            x2: d2.x,
                            y2: d2.y
                        });
                    }
                }
            });

            // Vertical lines (Left and Right edges)
            const verticalCols = [0, effectiveLeftBoxWidth];
            verticalCols.forEach(c => {
                for (let r = 0; r < 1; r++) { // Top box is 1 row tall
                    const d1 = dots.find(d => d.col === startCol + c && d.row === targetRow + r);
                    const d2 = dots.find(d => d.col === startCol + c && d.row === targetRow + r + 1);
                    if (d1 && d2) {
                        dashedLines.push({
                            id: `v-edge-${c}-${r}`,
                            x1: d1.x,
                            y1: d1.y,
                            x2: d2.x,
                            y2: d2.y
                        });
                    }
                }
            });

            // Duplicate Grid Box (Right 5 cols, Down 2 rows from CENTER origin)
            // original box top-left = (startCol, targetRow)
            // "duplicate grid box, to right by 5 columns and dowm by 2 rows"
            // Usually this means relative to the ORIGINAL center start position.

            const centerStartCol = centerCol - Math.floor(textWidthCols / 2);
            const centerTargetRow = 5;

            const dupStartCol = startCol; // Align with first box (vertically stacked)
            const dupTargetRow = targetRow + 1 + 2; // Position below first box (1 row tall) with 2 row gap

            const effectiveDupWidth = textWidthCols + 1; // Width + 1
            // Or if user meant "start from center + 2 rows up", then it's centerTargetRow - 2.
            // "move 2 row up" -> relative to current position (+2) -> becomes (+0).
            // "increase this grid box height by moving its bottom edge down by 5 rows" -> height increases by 5.

            const dupHeightRows = textHeightRows; // Decreased by 5 rows
            const dupHorizontalRows = [0, dupHeightRows]; // Top and Bottom edges

            // Horizontal lines (Top and Bottom edges) for DUPLICATE
            dupHorizontalRows.forEach(r => {
                for (let c = 0; c < effectiveDupWidth; c++) {
                    const d1 = dots.find(d => d.col === dupStartCol + c && d.row === dupTargetRow + r);
                    const d2 = dots.find(d => d.col === dupStartCol + c + 1 && d.row === dupTargetRow + r);
                    if (d1 && d2) {
                        dashedLines.push({
                            id: `dup-h-edge-${r}-${c}`,
                            x1: d1.x,
                            y1: d1.y,
                            x2: d2.x,
                            y2: d2.y
                        });
                    }
                }
            });

            // Vertical lines (Left and Right edges) for DUPLICATE
            const dupVerticalCols = [0, effectiveDupWidth];
            dupVerticalCols.forEach(c => {
                for (let r = 0; r < dupHeightRows; r++) { // Iterate up to new height
                    const d1 = dots.find(d => d.col === dupStartCol + c && d.row === dupTargetRow + r);
                    const d2 = dots.find(d => d.col === dupStartCol + c && d.row === dupTargetRow + r + 1);
                    if (d1 && d2) {
                        dashedLines.push({
                            id: `dup-v-edge-${c}-${r}`,
                            x1: d1.x,
                            y1: d1.y,
                            x2: d2.x,
                            y2: d2.y
                        });
                    }
                }
            });

            // Calculate position for second text container (in duplicate/second box)
            const secondAnchorDot = dots.find(d => d.col === dupStartCol && d.row === dupTargetRow);
            if (secondAnchorDot) {
                secondTextPosition = {
                    left: `${secondAnchorDot.x}px`,
                    top: `${secondAnchorDot.y}px`,
                    width: `${effectiveDupWidth * cellSize}px`
                };
            }
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                background: '#FFF9F9',
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
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            style={{
                                cursor: 'default',
                                pointerEvents: 'stroke',
                                opacity: 0.6
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

            {/* Bottom Grid Background Layer */}
            <div
                style={{
                    ...textStyle,
                    ...secondTextPosition,
                    zIndex: 5,
                    backgroundColor: '#FFF9F9',
                    pointerEvents: 'none'
                }}
            />

            {/* Grid Lines Layer */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 6
                }}
            >
                {dashedLines.map(line => (
                    <line
                        key={line.id}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#B0B0B0"
                        strokeWidth="1"
                        strokeDasharray="4 4" // Dashed pattern
                        strokeOpacity="0.64"
                    />
                ))}
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
                        zIndex: 6
                    }}
                />
            ))}

            {/* First Text Container - With "Hello" */}
            <div style={{ ...textStyle, ...textPosition }}>
                <div style={{
                    padding: '0 20px',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    textAlign: 'left'
                }}>
                    <h2 style={{
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontSize: '20px',
                        letterSpacing: '-0.8px',
                        lineHeight: '18px',
                        fontWeight: 400,
                        color: '#373434ff',
                        margin: 0
                    }}>
                        Hello
                    </h2>
                </div>
            </div>

            {/* Second Text Container - With Content */}
            <div style={{ ...textStyle, ...secondTextPosition, justifyContent: 'flex-start', paddingTop: '16px' }}>
                <div style={{
                    padding: '0 20px 4px 20px',
                    textAlign: 'left'
                }}>
                    <h2 style={{
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontSize: '20px',
                        letterSpacing: '-0.8px',
                        lineHeight: '22px',
                        fontWeight: 400,
                        color: '#373434ff',
                        margin: 0
                    }}>
                        Creative team for<br />
                        startups & scaleups
                    </h2>
                </div>

                <div style={{
                    padding: '4px 20px 0 20px',
                    textAlign: 'left',
                    marginLeft: '2px'
                }}>
                    <p style={{
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontSize: '13px',
                        lineHeight: '16px',
                        fontWeight: 400,
                        color: '#878585ff',
                        margin: 0
                    }}>
                        With senior designers, developers and managers;<br />
                        embedded in your team. Ship in weeks.
                    </p>
                </div>
            </div>
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
        <div className="book-wrapper" style={{ width: '100%', position: 'relative' }}>
            {/* Thread Grid with Physics */}
            <ThreadGrid />


        </div>
    );
};

export default Book;
