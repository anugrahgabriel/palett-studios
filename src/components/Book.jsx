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

// Rotating Text Component with Blur Transitions
const RotatingText = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const words = ['Brand', 'Product', 'Website'];
    const allWords = ['Brand', 'Product', 'Website', 'App', 'Platform', 'Service', 'System']; // Extended list for scroll effect
    // Fixed widths for each word to enable smooth transitions
    const widths = ['77px', '100px', '102px'];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            window.dispatchEvent(new CustomEvent('rotating-text-scroll'));
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
                setIsTransitioning(false);
            }, 400); // Transition happens midway through animation
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span style={{
            position: 'relative',
            top: '-0.027em', // Relative unit for responsiveness
            display: 'inline-block',
            width: widths[currentIndex],
            height: '30px',
            overflow: 'hidden',
            transition: 'width 0.5s cubic-bezier(0.16, 1.25, 0.4, 1)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}>
            {/* Show scrolling words during transition */}
            {isTransitioning && allWords.map((word, idx) => (
                <span
                    key={`scroll-${idx}`}
                    style={{
                        opacity: 0.15,
                        filter: 'blur(4px)',
                        transform: `translateY(${-70 + (idx * 34)}px)`,
                        transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        whiteSpace: 'nowrap',
                        animation: 'scrollUp 0.6s ease-out'
                    }}
                >
                    {word}
                </span>
            ))}

            {/* Main target word */}
            <span
                style={{
                    opacity: isTransitioning ? 0 : 0.6,
                    filter: isTransitioning ? 'blur(4px)' : 'blur(0px)',
                    transform: isTransitioning ? 'translateY(34px)' : 'translateY(0px)',
                    transition: 'opacity 0.4s ease-in-out, filter 0.4s ease-in-out, transform 0.4s ease-in-out',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    whiteSpace: 'nowrap'
                }}
            >
                {words[currentIndex]}
            </span>

            <style>{`
                @keyframes scrollUp {
                    from { transform: translateY(100px); }
                    to { transform: translateY(-100px); }
                }
            `}</style>
        </span>
    );
};

// Thread Grid Component with Physics
const ThreadGrid = () => {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dots, setDots] = useState([]);
    const [connections, setConnections] = useState([]);
    const threadRefs = useRef([]);
    const virtualMouseRef = useRef({ x: -1000, y: -1000 }); // Off-screen initially

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
        const startY = (viewportHeight - (rows * cellSize)) / 2 + 8; // Add 8px top visual padding

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

        const textWidthCols = 25;
        const textHeightRows = 4;
        // Use the same column count as dot generation for consistent centering
        const centerCol = Math.round((cols - 1) / 2);

        const leftBoxStartCol = centerCol - Math.floor(textWidthCols / 2) - 1; // Adjusted to keep left edge fixed while shrinking right
        const leftBoxStartRow = 1;
        const leftBoxHeight = 1; // Top grid height is 1 row
        const leftBoxBottomRow = leftBoxStartRow + leftBoxHeight;

        // Left Box Width increased by 1 from right edge -> effective width is textWidthCols + 1

        // Right Box (Duplicate): startCol = center - width/2 + 5, targetRow = 5 + 0 (row 5)
        // Width = textWidthCols (7), Height = dupHeightRows (textHeightRows + 5 = 9)
        // Left Edge: col = dupStartCol, rows = dupStartRow to dupStartRow + dupHeightRows

        const rightBoxStartCol = leftBoxStartCol; // Align with left box (vertically stacked)
        const rightBoxStartRow = leftBoxStartRow + leftBoxHeight + 2; // Position below first box with 2 row gap
        const rightBoxHeight = textHeightRows + 1; // Increased by 1 row
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

        // Filter and set dots (exclude inside of bottom box AND triplicate box)

        // Calculate params for triplicate box (same logic as later used for drawing)
        // We need to pre-calculate these to filter dots during initialization
        // But 'dupStartRow' etc are defined later inside the component logic.
        // We need to replicate that logic here or move variables up.

        // Re-defining logic here for filtering:
        const centerStartCol = centerCol - Math.floor(textWidthCols / 2);
        // const leftBoxStartCol used above

        // Duplicate Box Params
        const dupStartCol = leftBoxStartCol;
        const dupStartRow = leftBoxStartRow + leftBoxHeight + 2; // targetRow + 1 + 2 = 2 + 1 + 2 = 5
        const dupHeightRows_Filter = textHeightRows + 1; // 5

        // Triplicate Box Params (Bottom of Duplicate)
        const tripStartCol = dupStartCol;
        const tripStartRow = dupStartRow + dupHeightRows_Filter; // 5 + 5 = 10
        const tripHeightRows_Filter = dupHeightRows_Filter + 7; // 5 + 7 = 12 (Increased by 2)

        // Width is standardized
        const filterBoxWidth = textWidthCols + 1;

        const finalDots = generatedDots.filter(d => {
            // Check Duplicate Box
            const isInsideDupBox =
                d.col > dupStartCol &&
                d.col < dupStartCol + filterBoxWidth &&
                d.row > dupStartRow &&
                d.row < dupStartRow + dupHeightRows_Filter;

            // Check Triplicate Box
            const isInsideTripBox =
                d.col > tripStartCol &&
                d.col < tripStartCol + filterBoxWidth &&
                d.row > tripStartRow && // > 10
                d.row < tripStartRow + tripHeightRows_Filter; // < 20

            return !isInsideDupBox && !isInsideTripBox;
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
            return () => {
                if (container) {
                    container.removeEventListener('mousemove', handleMouseMove);
                }
            };
        }
    }, []);

    // Listen for rotating text scroll event
    useEffect(() => {
        const handleTextScroll = () => {
            // Animate virtual mouse from bottom-left to top-left of the text area
            // Approximate text position based on grid (calculated below, but hardcoded estimates for effect are fine)
            // Text starts around center-left.
            // Let's sweep "from left up".

            const startX = window.innerWidth / 2 - 675; // Start at left edge of centered content
            const startY = window.innerHeight * 0.4; // 40% down
            const endY = window.innerHeight * 0.2; // Move up to 20%

            // Reset to start
            virtualMouseRef.current = { x: startX, y: startY };

            // Animate with delay
            setTimeout(() => {
                const startTime = Date.now();
                const duration = 500; // ms (Even faster speed)

                const animateVirtualMouse = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Use Quartic ease out for sharper "fast start, slow mid/end"
                    const ease = 1 - Math.pow(1 - progress, 4);

                    virtualMouseRef.current = {
                        x: startX + (progress * 50), // Slight right movement
                        y: startY - (ease * (startY - endY)) // Move up
                    };

                    if (progress < 1) {
                        requestAnimationFrame(animateVirtualMouse);
                    } else {
                        // Reset off-screen after animation
                        virtualMouseRef.current = { x: -1000, y: -1000 };
                    }
                };

                requestAnimationFrame(animateVirtualMouse);
            }, 250);
        };

        window.addEventListener('rotating-text-scroll', handleTextScroll);
        return () => window.removeEventListener('rotating-text-scroll', handleTextScroll);
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
                        targetOffsetX += -(dx / dist) * force; // Changed to += to accumulate forces
                        targetOffsetY += -(dy / dist) * force;
                    }

                    // Virtual Mouse Force (from text scroll)
                    const vDx = virtualMouseRef.current.x - midX;
                    const vDy = virtualMouseRef.current.y - midY;
                    const vDist = Math.sqrt(vDx * vDx + vDy * vDy);

                    if (vDist < repelRadius) {
                        const vForce = (1 - vDist / repelRadius) * 30; // Reduced force for subtler effect
                        targetOffsetX += -(vDx / vDist) * vForce;
                        targetOffsetY += -(vDy / vDist) * vForce;
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

    const textWidthCols = 25; // Estimated width in columns
    const textHeightRows = 4; // Estimated height in rows (roughly based on visual content)
    const leftBoxStartRow = 1; // Top grid row index

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
    let navBoxStyle = {};
    let dashedLines = [];
    let targetRow = 1; // Move to higher scope for JSX access

    if (dots.length > 0) {
        // Find center column
        // Calculate center column from generated dots to ensure alignment
        const maxCol = dots.reduce((max, d) => Math.max(max, d.col), 0);
        const centerCol = Math.round(maxCol / 2);

        // Target row around 20-25% height
        targetRow = 1; // Reverted to 5 (was 5-2)

        // Start col to center the box
        const startCol = centerCol - Math.floor(textWidthCols / 2) - 1; // Adjusted to keep left edge fixed while shrinking right

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

            navBoxStyle = {
                position: 'fixed',
                top: 0, // Align to very top of screen
                left: 0, // Stretch to left edge
                width: '100%', // Full screen width
                height: `${anchorDot.y + cellSize}px`, // Cover from top to bottom of first row
                zIndex: 50,
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${anchorDot.y}px 30px 0 30px`, // Horizontal padding 32 (20 + 12)
                backgroundColor: '#FFF9F9', // Site background color
                boxSizing: 'border-box' // Ensure border is included in height/layout
            };

            // Generate Dashed Lines for the grid area covered by text - EDGES ONLY






            // Vertical lines - REMOVED for top box
            // const verticalCols = [0, effectiveLeftBoxWidth];

            // Duplicate Grid Box (Right 5 cols, Down 2 rows from CENTER origin)
            // original box top-left = (startCol, targetRow)
            // "duplicate grid box, to right by 5 columns and dowm by 2 rows"
            // Usually this means relative to the ORIGINAL center start position.

            const centerStartCol = centerCol - Math.floor(textWidthCols / 2);
            // const centerTargetRow = 5; // Unused variable remove

            const dupStartCol = startCol; // Align with first box (vertically stacked)
            // Fix dupStartRow to be relative to the first box
            const firstBoxBottomRow = targetRow + 1; // Row 2 (if targetRow is 1)
            const gapRows = 2;
            const dupStartRow = firstBoxBottomRow + gapRows; // 2 + 2 = 4

            const dupTargetRow = dupStartRow; // Rename for clarity or keep consistent

            const effectiveDupWidth = textWidthCols + 1; // Width + 1 

            // Or if user meant "start from center + 2 rows up", then it's centerTargetRow - 2.
            // "move 2 row up" -> relative to current position (+2) -> becomes (+0).
            // "increase this grid box height by moving its bottom edge down by 5 rows" -> height increases by 5.

            const dupHeightRows = textHeightRows + 1; // Increased by 1 row
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



            // --- TRIPLICATE Grid Box (Bottom of Duplicate) ---
            const tripStartCol = dupStartCol;
            const tripTargetRow = dupTargetRow + dupHeightRows; // Start exactly at bottom of previous box
            const tripHeightRows = dupHeightRows + 7; // Height increased by 7 rows (was 5)
            const effectiveTripWidth = effectiveDupWidth;

            // Find columns that are comfortably within the visible screen area (for line extensions and markers)
            const visibleDots = dots.filter(d => d.x > 40 && d.x < window.innerWidth - 40);
            const screenVisibleMinCol = visibleDots.reduce((min, d) => Math.min(min, d.col), Infinity);
            const screenVisibleMaxCol = visibleDots.reduce((max, d) => Math.max(max, d.col), 0);


            const tripHorizontalRows = [tripHeightRows]; // Only Bottom edge (Top edge removed)

            // Horizontal lines for TRIPLICATE
            tripHorizontalRows.forEach(r => {
                const fullMin = screenVisibleMinCol;
                const fullMax = screenVisibleMaxCol;


                for (let c = fullMin; c < fullMax; c++) {
                    const currentRow = tripTargetRow + r;
                    const d1 = dots.find(d => d.col === c && d.row === currentRow);
                    const d2 = dots.find(d => d.col === c + 1 && d.row === currentRow);

                    if (d1 && d2) {
                        dashedLines.push({
                            id: `trip-h-full-${r}-${c}`,
                            x1: d1.x,
                            y1: d1.y,
                            x2: d2.x,
                            y2: d2.y
                        });
                    }
                }
            });

            // --- Corner Plus Icons for 3rd Grid Box ---
            // Top-Left: (tripStartCol, tripTargetRow)
            // Top-Right: (tripStartCol + effectiveTripWidth, tripTargetRow)
            // Bottom-Left: (tripStartCol, tripTargetRow + tripHeightRows)
            // Bottom-Right: (tripStartCol + effectiveTripWidth, tripTargetRow + tripHeightRows)

            const cornerCoords = [
                { col: tripStartCol, row: tripTargetRow },
                { col: tripStartCol + effectiveTripWidth, row: tripTargetRow },
                { col: tripStartCol, row: tripTargetRow + tripHeightRows },
                { col: tripStartCol + effectiveTripWidth, row: tripTargetRow + tripHeightRows }
            ];

            cornerCoords.forEach((coord, idx) => {
                const dot = dots.find(d => d.col === coord.col && d.row === coord.row);
                if (dot) {
                    dashedLines.push({
                        id: `corner-plus-${idx}`,
                        x1: dot.x,
                        y1: dot.y,
                        type: 'corner-plus'
                    });
                }
            });

            // --- Continuous Vertical Lines (Left and Right edges) ---
            // Extend from top of SECOND box (dupTargetRow) to very bottom of screen
            // Find max row in dots matching our column to be safe, or just max row overall
            const maxRow = dots.reduce((max, d) => Math.max(max, d.row), 0);

            const globalStartRow = dupTargetRow; // Start from duplicate box top
            const globalEndRow = maxRow + 1; // Extend to bottom of screen (last row + 1)
            const totalVerticalHeight = globalEndRow - globalStartRow;

            const verticalEdgeCols = [0, effectiveLeftBoxWidth];

            verticalEdgeCols.forEach(c => {
                for (let r = 0; r < totalVerticalHeight; r++) {
                    const currentRow = globalStartRow + r;
                    const d1 = dots.find(d => d.col === startCol + c && d.row === currentRow);
                    const d2 = dots.find(d => d.col === startCol + c && d.row === currentRow + 1);

                    if (d1 && d2) {
                        dashedLines.push({
                            id: `vert-edge-${c}-${currentRow}`,
                            x1: d1.x,
                            y1: d1.y,
                            x2: d2.x,
                            y2: d2.y,
                            opacity: 0.60 // 0.04 lesser than default 0.64
                        });
                    }
                }
            });

            // Graph Markers (Timestamps/Numbers)
            // "put the numbers pattern on the screen left edge from below the navbar area to the row before 3rd grid bottom edge."

            // Navbar is at `targetRow`. Below navbar is `targetRow + 1`.
            // Bottom edge of 3rd grid is `tripTargetRow + tripHeightRows`.
            // User said "to the row before 3rd grid bottom edge." -> tripTargetRow + tripHeightRows - 1.

            const markerStartRow = targetRow + 1;
            const markerEndRow = tripTargetRow + tripHeightRows;

            // Aligned with the screen left and right edges
            // Use the same visible bounds calculated earlier
            const markerLCol = screenVisibleMinCol;
            const markerRCol = screenVisibleMaxCol;


            let rowNumber = 1;

            for (let r = markerStartRow; r <= markerEndRow; r++) {
                const dotL = dots.find(d => d.col === markerLCol && d.row === r);
                const dotR = dots.find(d => d.col === markerRCol && d.row === r);

                if (dotL || dotR) {
                    const num = rowNumber.toString().padStart(2, '0');

                    if (dotL) {
                        dashedLines.push({
                            id: `marker-left-${r}`,
                            x1: dotL.x,
                            y1: dotL.y,
                            type: 'marker',
                            label: `${num} "`,
                            isLeft: true
                        });
                    }

                    if (dotR) {
                        dashedLines.push({
                            id: `marker-right-${r}`,
                            x1: dotR.x,
                            y1: dotR.y,
                            type: 'marker',
                            label: `" ${num}`,
                            isLeft: false
                        });
                    }

                    rowNumber++;
                }
            }

            // Calculate position for second text container (in duplicate/second box)
            const secondAnchorDot = dots.find(d => d.col === dupStartCol && d.row === dupTargetRow);
            if (secondAnchorDot) {
                secondTextPosition = {
                    left: `${secondAnchorDot.x}px`,
                    top: `${secondAnchorDot.y}px`,
                    width: `${effectiveDupWidth * cellSize}px`,
                    height: `${(textHeightRows + 1) * cellSize}px`
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
                overflow: 'auto',
                overflowX: 'hidden', // Prevent horizontal scroll if not needed
                scrollBehavior: 'smooth'
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
                {dashedLines.filter(l => !l.type).map(line => (
                    <line
                        key={line.id}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#B0B0B0"
                        strokeWidth="1"
                        strokeDasharray="4 4" // Dashed pattern
                        strokeOpacity={line.opacity || 0.64}
                    />
                ))}

                {/* Graph Markers */}
                {dashedLines.filter(l => l.type === 'marker').map(marker => (
                    <g key={marker.id}>
                        {/* Dot - REMOVED as requested */}
                        {/* <circle 
                            cx={marker.x1} 
                            cy={marker.y1} 
                            r="2" 
                            fill="#373434"
                        /> */}
                        {/* Label */}
                        <text
                            x={marker.isLeft ? marker.x1 - 12 : marker.x1 + 12}
                            y={marker.y1}
                            dy="0.3em"
                            textAnchor={marker.isLeft ? "end" : "start"}
                            style={{
                                fontFamily: '"Rethink Sans", sans-serif',
                                fontSize: '8px',
                                fill: '#8b8a8aff', // Fixed color
                                fontWeight: 400
                            }}
                        >
                            {marker.label}
                        </text>
                    </g>
                ))}

                {/* Corner Plus Icons */}
                {dashedLines.filter(l => l.type === 'corner-plus').map(plus => (
                    <g key={plus.id}>
                        {/* Horizontal Line */}
                        <line
                            x1={plus.x1 - 3}
                            y1={plus.y1}
                            x2={plus.x1 + 3}
                            y2={plus.y1}
                            stroke="#373434"
                            strokeWidth="1"
                        />
                        {/* Vertical Line */}
                        <line
                            x1={plus.x1}
                            y1={plus.y1 - 3}
                            x2={plus.x1}
                            y2={plus.y1 + 3}
                            stroke="#373434"
                            strokeWidth="1"
                        />
                    </g>
                ))}
            </svg>

            {/* Dots */}
            {
                dots.map(dot => {
                    // Hide dots for the top rows (covering row 0 and the top box row 1)
                    if (dot.row <= leftBoxStartRow) return null;

                    return (
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
                    );
                })
            }



            {/* Navigation Box Container */}
            <div style={navBoxStyle}>
                {/* Inner Child 1: Text (Logo Part 1) */}
                <span style={{
                    fontFamily: '"Cocosharp Trial", sans-serif',
                    fontSize: '18px',
                    letterSpacing: '-1px',
                    fontWeight: 510,
                    color: '#373434',
                    width: '100px' // Give fixed width to balance left/right
                }}>
                    Pallet
                </span>

                {/* Inner Child 2: 4 Menu Options (Middle Aligned) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    {['Work', 'Services', 'About', 'Contact'].map((item) => (
                        <span key={item} style={{
                            fontFamily: '"Rethink Sans", sans-serif',
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#605a5aff'
                        }}>
                            {item}
                        </span>
                    ))}
                </div>

                {/* Inner Child 3: Text (Logo Part 2) */}
                <span style={{
                    fontFamily: '"Cocosharp Trial", sans-serif',
                    fontSize: '18px',
                    letterSpacing: '-1px',
                    fontWeight: 510,
                    color: '#373434',
                    width: '100px',
                    textAlign: 'right'
                }}>
                    Studio
                </span>

                {/* Bottom Stroke with Dots and Connecting Line */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    pointerEvents: 'none'
                }}>
                    <svg style={{ position: 'absolute', width: '100%', height: '1px', bottom: 0 }}>
                        <line
                            x1="0"
                            y1="0.5"
                            x2="100%"
                            y2="0.5"
                            stroke="#B0B0B0"
                            strokeDasharray="4 4"
                            strokeOpacity="0.6"
                        />
                    </svg>
                    {dots.filter(d => d.row === targetRow + 1).map(dot => (
                        <div
                            key={`nav-dot-${dot.id}`}
                            style={{
                                position: 'absolute',
                                left: `${dot.x}px`,
                                top: '0.5px', // Center on the line
                                width: `${dot.size}px`,
                                height: `${dot.size}px`,
                                borderRadius: '50%',
                                backgroundColor: dot.color,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    ))}
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
                        fontSize: '26px',
                        letterSpacing: '-0.2px',
                        lineHeight: '30px',
                        fontWeight: 460,
                        color: '#373434ff',
                        margin: 0
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.04em', transition: 'all 0.5s cubic-bezier(0.16, 1.25, 0.4, 1)' }}>
                            <RotatingText /> Design and Development for
                        </span>
                        startups and scaleups
                    </h2>
                </div>

                <div style={{
                    padding: '2px 20px 0 20px',
                    textAlign: 'left',
                    marginLeft: '2px'
                }}>
                    <p style={{
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontSize: '14px',
                        lineHeight: '18px',
                        fontWeight: 400,
                        color: '#8b8a8aff',
                        margin: 0
                    }}>

                        Skip hiring and ship in weeks with senior PMs, PDs<br />
                        and Developers embedded in your team.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    width: '100%',
                    padding: '0 20px',
                    marginTop: 'auto',
                    marginBottom: '20px',
                    pointerEvents: 'auto'
                }}>
                    <ThreadButton>
                        Get in touch
                    </ThreadButton>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px'
                    }}>
                        <h2 style={{
                            fontFamily: '"Rethink Sans", sans-serif',
                            fontSize: '13px',
                            letterSpacing: '-0.02px',
                            lineHeight: '18px',
                            fontWeight: 340,
                            color: '#3fac55ff',
                            margin: 0,
                            whiteSpace: 'nowrap'
                        }}>
                            2 spots left in February
                        </h2>
                    </div>
                    <button style={{
                        padding: '8px 11px',
                        background: 'transparent',
                        color: '#373434',
                        border: 'none',
                        borderRadius: '8px',
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontSize: '13px',
                        cursor: 'pointer',
                        marginLeft: 'auto'
                    }}>
                        See our work
                    </button>
                </div>
            </div>

            {/* Scroll Spacer */}
            <div style={{ height: '150vh', width: '100%', pointerEvents: 'none' }} />
        </div >
    );
};

// Thread Button Component
const ThreadButton = ({ children, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const [threads, setThreads] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const velocitiesRef = useRef([]);

    useEffect(() => {
        // Generate threads when component mounts
        // Gradient: light on edges, dark in center (left to right: light → dark → light)
        const lightColor = { r: 0xB8, g: 0xB6, b: 0xD9 }; // #B8B6D9 (light edges)
        const darkColor = { r: 0x07, g: 0x0F, b: 0x2B };   // #070F2B (dark center)

        const threadCount = 28;
        const newThreads = [];

        // Helper function to interpolate between two colors
        const interpolateColor = (start, end, factor) => {
            const r = Math.round(start.r + (end.r - start.r) * factor);
            const g = Math.round(start.g + (end.g - start.g) * factor);
            const b = Math.round(start.b + (end.b - start.b) * factor);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        };

        for (let i = 0; i < threadCount; i++) {
            const xPercent = (i + 1) * (100 / (threadCount + 1));

            // Calculate distance from center (0 at edges, 1 at center)
            const normalizedPosition = i / (threadCount - 1); // 0 to 1
            const distanceFromCenter = Math.abs(normalizedPosition - 0.5) * 2; // 0 at center, 1 at edges
            const colorFactor = 1 - distanceFromCenter; // 1 at center (dark), 0 at edges (light)

            newThreads.push({
                id: i,
                xPercent: xPercent,
                originalXPercent: xPercent,
                color: interpolateColor(lightColor, darkColor, colorFactor),
                offset: 0 // Start at original position
            });
        }
        setThreads(newThreads);
        velocitiesRef.current = newThreads.map(() => 0);
    }, []);

    // Track mouse position relative to button
    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Physics animation loop for repulsion
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

                    // Spring physics
                    const springStrength = 0.1;
                    const damping = 0.9;

                    const springForce = (targetOffset - thread.offset) * springStrength;
                    velocitiesRef.current[index] += springForce;
                    velocitiesRef.current[index] *= damping;

                    const newOffset = thread.offset + velocitiesRef.current[index];

                    return {
                        ...thread,
                        offset: newOffset
                    };
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
                // Reset offsets when mouse leaves
                setThreads(prev => prev.map(t => ({ ...t, offset: 0 })));
                velocitiesRef.current = velocitiesRef.current.map(() => 0);
            }}
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                padding: '8px 18px',
                border: '0.6px solid rgba(38, 38, 91, 0.35)',
                borderRadius: '9px',
                fontFamily: '"Rethink Sans", sans-serif',
                fontSize: '13px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'transparent',
                boxShadow: hovered ? '0 2px 2px rgba(38, 38, 91, 0.1)' : 'none',
                transition: 'box-shadow 0.3s ease, padding-right 0.3s ease',
                paddingRight: hovered ? '46px' : '18px'
            }}
        >
            {/* Background Layer - z-index 1 */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#070F2B',
                    borderRadius: '8px',
                    boxShadow: 'inset 0 3px 6px rgba(6, 25, 122, 0.53), inset 0 -3px 6px rgba(135, 135, 224, 0.4)',
                    opacity: hovered ? 0.9 : 1,
                    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                    zIndex: 1,
                    overflow: 'hidden'
                }}
            />

            {/* Threads Layer - z-index 2 */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    pointerEvents: 'none',
                    filter: hovered ? 'blur(6px)' : 'none',
                    opacity: hovered ? 1 : 0,
                    transition: 'filter 0.3s ease, opacity 0.3s ease',
                    overflow: 'hidden'
                }}
            >
                {threads.map(thread => {
                    const x = `${thread.xPercent + (thread.offset || 0)}%`;
                    return (
                        <line
                            key={thread.id}
                            x1={x}
                            y1="0"
                            x2={x}
                            y2="100%"
                            stroke={thread.color}
                            strokeWidth="2"
                            strokeOpacity="0.7"
                        />
                    );
                })}
            </svg>

            {/* Text Layer - z-index 3 */}
            <span
                style={{
                    position: 'relative',
                    zIndex: 3,
                    color: '#FFF',
                    pointerEvents: 'none'
                }}
            >
                {children}
            </span>

            {/* Arrow Dots Layer - z-index 4 */}
            {hovered && (
                <div
                    style={{
                        position: 'absolute',
                        right: '30px',
                        top: '50%',
                        transform: 'translateY(calc(-50% - 1px))',
                        zIndex: 4,
                        pointerEvents: 'none',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.3s ease 0.2s'
                    }}
                >
                    {/* Right-pointing arrow made of dots with more dots */}
                    {[
                        // Arrow shape coordinates (x, y) - fuller right-pointing arrow
                        [0, 2], [1, 2], [2, 2], [3, 2],  // Horizontal line (4 dots)
                        [3, 1], [4, 0],                   // Upper diagonal (2 dots)
                        [3, 3], [4, 4],                   // Lower diagonal (2 dots)
                        [1, 1], [1, 3],                   // Additional vertical dots
                        [2, 1]                            // Additional dot for fullness
                    ].map((pos, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `${pos[0] * 3}px`,
                                top: `${pos[1] * 3 - 6}px`,
                                width: '1.5px',
                                height: '1.5px',
                                borderRadius: '50%',
                                backgroundColor: '#9290C3',
                                opacity: 0.8,
                                animation: `blink ${2 + Math.random() * 2.5}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                    <style>
                        {`
                            @keyframes blink {
                                0%, 100% { opacity: 0.95; }
                                50% { opacity: 0.2; }
                            }
                        `}
                    </style>
                </div>
            )}
        </button>
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
