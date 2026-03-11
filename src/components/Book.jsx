import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);
import './Book.css';
// Page images removed because files were deleted
const leftPageImg = "";
const rightPageImg = "";
import slide1 from '../../pics/1-slide-small.png';
import slide2 from '../../pics/2-slide.png';
import slide3 from '../../pics/3-slide.png';
import slide5 from '../../pics/5-slide-small.webp';
import slide6 from '../../pics/6-slide-small.webp';
import slide7 from '../../pics/7-slide.webp';
import slide8 from '../../pics/8-slide-small.png';
import slide9 from '../../pics/9-slide-small.png';
import slide10 from '../../pics/10-slide-small.webp';
import slide11 from '../../pics/11-slide.webp';
import picImg from '../../pics/pic-small.JPG';
import client1 from '../../pics/client 1.png';

const ArrowIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '12px', marginRight: '8px' }}>
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#D2D2D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);



// Image Carousel Component for the 3rd Grid Box
const ImageCarousel = React.memo(({ images, width, height }) => {
    const scrollRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const tweenRef = useRef(null);

    useGSAP(() => {
        if (!scrollRef.current || imagesLoaded < images.length) return;

        // Force a recount
        const el = scrollRef.current;
        const totalWidth = el.scrollWidth / 2;

        // Clear any previous animations
        if (tweenRef.current) tweenRef.current.kill();
        gsap.killTweensOf(el);

        // Reset position to start
        gsap.set(el, { x: 0 });

        // Continuously extend x so modifiers can wrap it — no hard reset
        tweenRef.current = gsap.to(el, {
            x: `-=${totalWidth}`,
            duration: 75,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
    }, [imagesLoaded, width, images.length]);

    const handleImageLoad = () => {
        setImagesLoaded(prev => prev + 1);
    };

    const handleMouseEnter = (e) => {
        gsap.to(e.currentTarget, {
            y: -4, // More subtle push up
            duration: 0.6,
            ease: "power2.out"
        });
        if (tweenRef.current) {
            gsap.to(tweenRef.current, {
                timeScale: 0.7, // Subtle slow down
                duration: 0.6
            });
        }
    };

    const handleMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        });
        if (tweenRef.current) {
            gsap.to(tweenRef.current, {
                timeScale: 1,
                duration: 0.6
            });
        }
    };

    return (
        <div
            role="region"
            aria-label="Project showcase carousel"
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: width,
                height: height,
                overflow: 'hidden',
                pointerEvents: 'auto',
            }}>
            <div ref={scrollRef} style={{
                display: 'flex',
                height: '100%',
                gap: '20px',
                width: 'max-content',
                alignItems: 'flex-start',
                paddingTop: '78px',
                paddingBottom: '70px',
                boxSizing: 'border-box',
                willChange: 'transform',
                pointerEvents: 'auto'
            }}>
                {[...images, ...images].map((img, i) => {
                    const labels = [
                        // Slides 1–3: Quotient
                        { tags: ['quotient', 'Product', 'Website', 'AI agents platform', '$5.5M raised'] },
                        { tags: ['quotient', 'Product', 'Website', 'AI agents platform', '$5.5M raised'] },
                        { tags: ['quotient', 'Product', 'Website', 'AI agents platform', '$5.5M raised'] },
                        // Slides 4–5: Runable
                        { tags: ['Runable', 'Product', 'General AI'] },
                        { tags: ['Runable', 'Product', 'General AI'] },
                    ];
                    const label = labels[i % labels.length];
                    return (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                gap: '8px',
                                height: '100%',
                                flexShrink: 0,
                                paddingLeft: '6px',
                                pointerEvents: 'auto'
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={img}
                                alt={`Product Design Project ${i % 10 + 1} - Palett`}
                                loading="lazy"
                                onLoad={handleImageLoad}
                                style={{
                                    height: 'calc(100% - 14px)',
                                    objectFit: 'contain',
                                    borderRadius: '12px',
                                    outline: '0.4px solid rgba(150, 150, 150, 0.25)',
                                    outlineOffset: '0px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    display: 'block',
                                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            />
                            {/* Tags row */}
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '0px', paddingLeft: '4px', paddingTop: '1px' }}>
                                {label.tags.map((tag, ti) => (
                                    <span key={ti} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{
                                            fontFamily: '"Rethink Sans", sans-serif',
                                            fontSize: '13px',
                                            fontWeight: ti === 0 ? 500 : 400,
                                            color: ti === 0 ? '#4a4a4a' : '#8b8a8a',
                                            letterSpacing: '0.1px',
                                            whiteSpace: 'nowrap'
                                        }}>{ti === 0 ? tag.charAt(0).toUpperCase() + tag.slice(1) : tag}</span>
                                        {ti < label.tags.length - 1 && (
                                            <span style={{ color: '#c8c8c8', fontSize: '12px', margin: '0 5px' }}>·</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
});

// Single rolling digit — slides up when value changes
const RollingDigit = ({ value }) => {
    const [current, setCurrent] = useState(value);
    const [next, setNext] = useState(value);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        if (value !== current) {
            setNext(value);
            setRolling(true);
            setTimeout(() => {
                setCurrent(value);
                setRolling(false);
            }, 280);
        }
    }, [value, current]);

    return (
        <span style={{
            display: 'inline-block',
            overflow: 'hidden',
            height: '1em',
            lineHeight: '1em',
            position: 'relative'
        }}>
            <span style={{
                display: 'block',
                transform: rolling ? 'translateY(-100%)' : 'translateY(0)',
                transition: rolling ? 'transform 0.28s ease-in' : 'none',
            }}>{current}</span>
            <span style={{
                display: 'block',
                position: 'absolute',
                top: '100%',
                left: 0,
                transform: rolling ? 'translateY(-100%)' : 'translateY(0)',
                transition: rolling ? 'transform 0.28s ease-in' : 'none',
            }}>{next}</span>
        </span>
    );
};

// Live IST clock with rolling digits
const LiveIST = () => {
    const getIST = () => {
        const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        return {
            hh: String(ist.getHours()).padStart(2, '0'),
            mm: String(ist.getMinutes()).padStart(2, '0'),
            ss: String(ist.getSeconds()).padStart(2, '0'),
        };
    };

    const [time, setTime] = useState(getIST());

    useEffect(() => {
        const interval = setInterval(() => setTime(getIST()), 1000);
        return () => clearInterval(interval);
    }, []);

    const sep = <span style={{ opacity: 0.7, marginBottom: '0px' }}>:</span>;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            fontWeight: 400,
            color: '#8b8a8a',
            opacity: 1,
            letterSpacing: '-0.1px',
            lineHeight: 1
        }}>
            <RollingDigit value={time.hh[0]} />
            <RollingDigit value={time.hh[1]} />
            {sep}
            <RollingDigit value={time.mm[0]} />
            <RollingDigit value={time.mm[1]} />
            {sep}
            <RollingDigit value={time.ss[0]} />
            <RollingDigit value={time.ss[1]} />
            <span style={{ marginLeft: '4px', letterSpacing: '0px', opacity: 0.8 }}>IST</span>
        </span>
    );
};

// Message icon for nav
const MessageIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="#605a5a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Modular Expandable List Block Component
const ExpandableListBlock = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{
            backgroundColor: '#FBFBFB',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                role="button"
                aria-expanded={isExpanded}
                style={{
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h3 style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#373434', fontWeight: 500, margin: 0 }}>
                    {title}
                </h3>
                <div style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ArrowIcon />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{
                        padding: '0 12px 12px',
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontSize: '13px',
                        lineHeight: '16px',
                        color: '#9E9E9E',
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Thread Grid Component with Physics
const ThreadGrid = ({ hideContent = false, mode = 'full' }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dots, setDots] = useState([]);
    const [connections, setConnections] = useState([]);
    const threadRefs = useRef([]);
    const [picHover, setPicHover] = useState(false);
    const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
    const [displayQuoteIndex, setDisplayQuoteIndex] = useState(0);
    const quoteContentRef = useRef(null);
    const [hoveredMosaicIdx, setHoveredMosaicIdx] = useState(null);
    const location = useLocation();
    const [hoveredLink, setHoveredLink] = useState(null);
    const [isAutoMosaicEnabled, setIsAutoMosaicEnabled] = useState(true);
    const [showCal, setShowCal] = useState(false);
    const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);

    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("on", {
                action: "*",
                callback: (e) => {
                    console.log("Cal.com Event:", e.detail.action);
                    if (e.detail.action === "bookingSuccessfulV2") {
                        console.log("Booking Successful!");
                        setIsBookingSuccessful(true);
                        const count = 200;
                        const defaults = {
                            origin: { y: 0.3 },
                            zIndex: 1000,
                            colors: ['#8987ca', '#e2c6ab', '#274df5']
                        };

                        function fire(particleRatio, opts) {
                            confetti({
                                ...defaults,
                                ...opts,
                                particleCount: Math.floor(count * particleRatio)
                            });
                        }

                        fire(0.25, { spread: 26, startVelocity: 55 });
                        fire(0.2, { spread: 60 });
                        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                        fire(0.1, { spread: 120, startVelocity: 45 });
                    }
                }
            });
        })();
    }, []);

    const quotes = [
        {
            name: "Aurelien Bonnel",
            role: "CTO",
            text: "Excellent project management capability, mostly centralized in one person, who orchestrates the projects' tasks and aligns the efforts to the needs. Very able to switch priorities on the fly and to jump on issues as needed. I was impressed with their great outputs and wonderful design outcomes",
            img: client1
        },
        {
            name: "Sarah Jenkins",
            role: "Product Lead",
            text: "The team's ability to translate complex requirements into intuitive designs is remarkable. They don't just build what you ask for; they build what your users actually need. Their attention to detail in the final handoff was the best I've seen in years.",
            img: client1 // Reusing same for now
        },
        {
            name: "Marco Rossi",
            role: "Founder",
            text: "Working with Palett felt like having an elite in-house design team from day one. They are incredibly responsive and proactive, often identifying architectural bottlenecks before they became problems. A true strategic partner for any scaling startup.",
            img: client1
        },
        {
            name: "Elena Vance",
            role: "Design Director",
            text: "Their systematic approach to brand and product cohesion helped us launch our platform months ahead of schedule. The output was not only beautiful but also technically robust and highly scalable. I cannot recommend their dedicated model enough.",
            img: client1
        }
    ];

    const mosaicBlocks = [
        { area: '1 / 1 / 2 / 3', label: '#FFDEB9', title: 'Product design' },
        { area: '1 / 3 / 3 / 4', label: '#FE6244', title: 'Product development' },
        { area: '1 / 4 / 3 / 5', label: '#DC0E0E', title: 'Website & no-code' },
        { area: '3 / 3 / 5 / 5', label: '#274DF5', title: 'Motion & 3D' },
        { area: '2 / 1 / 5 / 2', label: '#62109F', title: 'Brand identity' },
        { area: '2 / 2 / 5 / 3', label: '#E2C6AB', title: 'Marketing collateral' }
    ];

    // Scroll to top instantly when in get-in-touch mode
    useEffect(() => {
        if (mode === 'get-in-touch') {
            window.scrollTo(0, 0);
            if (containerRef.current) {
                containerRef.current.scrollTop = 0;
            }
        }
    }, [mode]);

    // Animate content on Scroll & Mount
    useGSAP(() => {
        if (dots.length > 0 && containerRef.current) {
            // Above the fold - Hero content fades in on mount
            const box2 = document.querySelector(".fade-anim-box2");
            if (box2) {
                gsap.fromTo(box2,
                    { autoAlpha: 0, filter: 'blur(1px)', y: -6 },
                    {
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        duration: 1.3,
                        delay: 0.15,
                        ease: "power2.out"
                    }
                );
            }

            // Beyond the fold - Use ScrollTrigger
            const scrollElements = [
                { class: ".fade-anim-mosaic", delay: 0 },
                { class: ".fade-anim-newbox", delay: 0.8 }, // Significantly increased delay
                { class: ".fade-anim-newbox2", delay: 1.0 },
                { class: ".fade-anim-box3", delay: 1.2 }
            ];

            scrollElements.forEach(el => {
                const element = document.querySelector(el.class);
                if (element) {
                    gsap.fromTo(element,
                        { autoAlpha: 0, filter: 'blur(5px)', y: 25 },
                        {
                            autoAlpha: 1,
                            filter: 'blur(0px)',
                            y: 0,
                            duration: 2.2,
                            delay: el.delay,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: element,
                                scroller: containerRef.current,
                                start: "top 98%",
                                toggleActions: "play none none none",
                                invalidateOnRefresh: true
                            }
                        }
                    );
                }
            });

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        }
    }, { dependencies: [dots.length, mode], scope: containerRef.current ? containerRef : undefined });

    // Handle symmetrical exit and entry transitions
    useEffect(() => {
        if (activeQuoteIndex !== displayQuoteIndex && quoteContentRef.current) {
            // Very slow fade OUT to the left
            gsap.to(quoteContentRef.current, {
                opacity: 0,
                x: -12,
                filter: 'blur(6px)',
                duration: 1.1,
                ease: "sine.inOut",
                onComplete: () => {
                    setDisplayQuoteIndex(activeQuoteIndex);
                }
            });
        }
    }, [activeQuoteIndex]);

    // VERY slow fade-in from RIGHT for quote transitions
    useGSAP(() => {
        if (quoteContentRef.current) {
            gsap.fromTo(quoteContentRef.current,
                { opacity: 0, x: 12, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    duration: 1.1,
                    ease: "sine.inOut"
                }
            );
        }
    }, { dependencies: [displayQuoteIndex] });

    // Automatic Quote Switching - Resets whenever activeQuoteIndex changes (manual or auto)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 15000); // Switch every 15 seconds
        return () => clearInterval(interval);
    }, [activeQuoteIndex, quotes.length]);

    // Automatic Mosaic Hover Cycling
    useEffect(() => {
        if (!isAutoMosaicEnabled) return;

        const interval = setInterval(() => {
            setHoveredMosaicIdx((prev) => (prev === null ? 0 : (prev + 1) % 6));
        }, 3000); // Cycle every 3 seconds for a relaxed feel

        return () => clearInterval(interval);
    }, [isAutoMosaicEnabled]);

    // ─── Shared Layout Constants ────────────────────────────────────────────────
    const BOX_WIDTH_COLS = 23;          // All boxes share the same column width
    const BOX_2_START_ROW = 1;           // Nav row (row 1)
    const BOX_2_HEIGHT = 1;           // Top thin box (1 row)
    const box3Height = (mode === 'get-in-touch' && showCal) ? 27 : 15; // Extends by +12 rows when Cal is active
    const BOX_NEW_HEIGHT = 10;           // New middle box height in rows
    const BOX_NEW2_HEIGHT = 2;           // Lower part of the new middle box
    const BOX_TRIP_HEIGHT = 12; // Box 3 (carousel) height
    // Derived start rows
    const BOX_3_START_ROW = BOX_2_START_ROW + BOX_2_HEIGHT + 2; // +2 gap below nav
    const BOX_NEW_START_ROW = BOX_3_START_ROW + box3Height;
    const BOX_NEW2_START_ROW = BOX_NEW_START_ROW + BOX_NEW_HEIGHT;
    const BOX_TRIP_START_ROW = BOX_NEW2_START_ROW + BOX_NEW2_HEIGHT;
    // ────────────────────────────────────────────────────────────────────────────

    // Grid configuration & measurements
    const circleSize = 2;
    const gap = 48;
    const padding = 20;
    const cellSize = circleSize + gap;

    // Use current viewport size (Note: Grid doesn't reactively rebuild on resize)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Add extra rows/cols to ensure full coverage + extra rows for extending downwards
    const cols = Math.ceil(viewportWidth / cellSize) + 2;
    const baseRows = Math.ceil(viewportHeight / cellSize) + 2;
    const rowsCount = mode === 'get-in-touch'
        ? (BOX_3_START_ROW + box3Height + 3)
        : (baseRows + 31); // Total rows including vertical extension

    // Start offsets for centering
    const gridStartX = (viewportWidth - (cols * cellSize)) / 2;
    const gridStartY = (viewportHeight - (baseRows * cellSize)) / 2 + 8; // Add 8px top visual padding

    useEffect(() => {
        // Generate dots
        const generatedDots = [];
        const colors = ['#D9D9D9', '#9B9494'];

        let dotIndex = 0;

        for (let row = 0; row < rowsCount; row++) {
            for (let col = 0; col < cols; col++) {
                const color = colors[Math.floor(Math.random() * 2)];

                generatedDots.push({
                    id: dotIndex++,
                    x: gridStartX + col * cellSize + circleSize / 2,
                    y: gridStartY + row * cellSize + circleSize / 2,
                    col,
                    row,
                    color,
                    size: circleSize
                });
            }
        }

        // Filter and set dots (exclude inside of bottom box AND triplicate box)
        const centerCol = Math.round((cols - 1) / 2);

        // Duplicate Box Params
        const dupStartCol = centerCol - Math.floor(BOX_WIDTH_COLS / 2) - 1;
        const dupStartRow = BOX_3_START_ROW;
        const dupHeightRows_Filter = box3Height;

        // New Box Params
        const newStartCol = dupStartCol;
        const newStartRow = BOX_NEW_START_ROW;
        const newHeightRows_Filter = BOX_NEW_HEIGHT;

        // New Box 2 Params
        const new2StartCol = dupStartCol;
        const new2StartRow = BOX_NEW2_START_ROW;
        const new2HeightRows_Filter = BOX_NEW2_HEIGHT;

        // Triplicate Box Params (Bottom of New Box)
        const tripStartCol = dupStartCol;
        const tripStartRow = BOX_TRIP_START_ROW;
        const tripHeightRows_Filter = BOX_TRIP_HEIGHT;

        // Width is standardized
        const filterBoxWidth = BOX_WIDTH_COLS + 1;

        const finalDots = generatedDots.filter(d => {
            // Check Duplicate Box (First Content Box)
            const isInsideDupBox =
                d.col > dupStartCol &&
                d.col < dupStartCol + filterBoxWidth &&
                d.row > dupStartRow &&
                d.row < dupStartRow + dupHeightRows_Filter;

            if (mode === 'get-in-touch') {
                return !isInsideDupBox;
            }

            // Check other boxes (Only in Full Mode)
            const isInsideNewBox =
                d.col > newStartCol &&
                d.col < newStartCol + filterBoxWidth &&
                d.row > newStartRow &&
                d.row < newStartRow + newHeightRows_Filter;

            const isInsideNew2Box =
                d.col > new2StartCol &&
                d.col < new2StartCol + filterBoxWidth &&
                d.row > new2StartRow &&
                d.row < new2StartRow + new2HeightRows_Filter;

            const isInsideTripBox =
                d.col > tripStartCol &&
                d.col < tripStartCol + filterBoxWidth &&
                d.row > tripStartRow &&
                d.row < tripStartRow + tripHeightRows_Filter;

            return !isInsideDupBox && !isInsideNewBox && !isInsideNew2Box && !isInsideTripBox;
        });
        setDots(finalDots);

        // Identify candidate dots for connections
        const leftBoxStartCol = dupStartCol;
        const leftBoxStartRow = BOX_2_START_ROW;
        const leftBoxHeight = BOX_2_HEIGHT;
        const leftBoxBottomRow = leftBoxStartRow + leftBoxHeight;

        const rightBoxStartCol = leftBoxStartCol;
        const rightBoxStartRow = BOX_3_START_ROW;

        const sourceDots = generatedDots.filter(d =>
            d.row === leftBoxBottomRow &&
            d.col >= leftBoxStartCol &&
            d.col <= leftBoxStartCol + BOX_WIDTH_COLS + 1
        );

        const targetDots = generatedDots.filter(d =>
            d.row === rightBoxStartRow &&
            d.col >= rightBoxStartCol &&
            d.col <= rightBoxStartCol + BOX_WIDTH_COLS + 1
        );

        const generatedConnections = [];
        const threadColors = ['#E2C6AB', '#274DF5', '#802F64', '#802F64', '#555789'];
        let connectionId = 0;

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
                            controlOffset: { x: 0, y: 120 + baseSag }, // Start at equilibrium (gravity=120)
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
                    controlOffset: { x: 0, y: 120 }, // Start at equilibrium (gravity=120)
                    isHovered: false,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        }

        setConnections(generatedConnections);
    }, [mode, rowsCount]);

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



    // Physics animation for threads with momentum
    const velocitiesRef = useRef([]);

    useEffect(() => {
        if (connections.length === 0) return;

        // Initialize velocities if needed
        const isFirstInit = velocitiesRef.current.length !== connections.length;
        if (isFirstInit) {
            velocitiesRef.current = connections.map((_, i) => ({
                x: 0,
                y: 0
            }));
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

    const textWidthCols = 23; // Estimated width in columns
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
    let newBoxPosition = {};
    let new2BoxPosition = {};
    let tripBoxPosition = {};
    // Nav always starts with base styles (invisible) so it doesn't snap/glitch on first render
    let navBoxStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box',
        opacity: 0,           // hidden until dots are ready
        transition: 'opacity 0.35s ease',
    };
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
                ...navBoxStyle,                              // keep base styles
                height: `${anchorDot.y + cellSize}px`,      // computed height
                padding: `${anchorDot.y}px 30px 0 30px`,    // computed padding
                opacity: 1,                                  // now visible
            };

            // Generate Dashed Lines for the grid area covered by text - EDGES ONLY






            // Vertical lines - REMOVED for top box
            // const verticalCols = [0, effectiveLeftBoxWidth];

            // Duplicate Grid Box (Right 5 cols, Down 2 rows from CENTER origin)
            // original box top-left = (startCol, targetRow)
            // "duplicate grid box, to right by 5 columns and dowm by 2 rows"
            // Usually this means relative to the ORIGINAL center start position.

            const centerStartCol = centerCol - Math.floor(BOX_WIDTH_COLS / 2);

            const dupStartCol = startCol; // Align with first box (vertically stacked)
            const dupStartRow = BOX_3_START_ROW;
            const dupTargetRow = dupStartRow;

            const effectiveDupWidth = BOX_WIDTH_COLS + 1;

            const dupHeightRows = box3Height;
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


            // --- NEW, NEW2 and TRIPLICATE Grid Box Parameters (Needed for positioning) ---
            const newStartCol = dupStartCol;
            const newTargetRow = BOX_NEW_START_ROW;
            const newHeightRows = BOX_NEW_HEIGHT;
            const effectiveNewWidth = effectiveDupWidth;

            const new2StartCol = dupStartCol;
            const new2TargetRow = BOX_NEW2_START_ROW;
            const new2HeightRows = BOX_NEW2_HEIGHT;
            const effectiveNew2Width = effectiveDupWidth;

            const tripStartCol = dupStartCol;
            const tripTargetRow = BOX_TRIP_START_ROW;
            const tripHeightRows = BOX_TRIP_HEIGHT;
            const effectiveTripWidth = effectiveDupWidth;

            // --- Generate Grid Lines - Only in Full Mode ---
            if (mode !== 'get-in-touch') {
                // Horizontal lines for NEW Box (bottom edge)
                const newHorizontalRows = [newHeightRows];
                newHorizontalRows.forEach(r => {
                    for (let c = newStartCol; c < newStartCol + effectiveNewWidth; c++) {
                        const currentRow = newTargetRow + r;
                        const d1 = dots.find(d => d.col === c && d.row === currentRow);
                        const d2 = dots.find(d => d.col === c + 1 && d.row === currentRow);

                        if (d1 && d2) {
                            dashedLines.push({
                                id: `new-h-full-${r}-${c}`,
                                x1: d1.x,
                                y1: d1.y,
                                x2: d2.x,
                                y2: d2.y
                            });
                        }
                    }
                });

                // Corner Plus Icons for NEW Box
                const newCornerCoords = [
                    { col: newStartCol, row: newTargetRow },
                    { col: newStartCol + effectiveNewWidth, row: newTargetRow },
                    { col: newStartCol, row: newTargetRow + newHeightRows },
                    { col: newStartCol + effectiveNewWidth, row: newTargetRow + newHeightRows }
                ];

                newCornerCoords.forEach((coord, idx) => {
                    const dot = dots.find(d => d.col === coord.col && d.row === coord.row);
                    if (dot) {
                        dashedLines.push({
                            id: `new-corner-plus-${idx}`,
                            x1: dot.x,
                            y1: dot.y,
                            type: 'corner-plus'
                        });
                    }
                });

                // Horizontal lines for NEW Box 2 (bottom edge)
                const new2HorizontalRows = [new2HeightRows];
                new2HorizontalRows.forEach(r => {
                    for (let c = new2StartCol; c < new2StartCol + effectiveNew2Width; c++) {
                        const currentRow = new2TargetRow + r;
                        const d1 = dots.find(d => d.col === c && d.row === currentRow);
                        const d2 = dots.find(d => d.col === c + 1 && d.row === currentRow);

                        if (d1 && d2) {
                            dashedLines.push({
                                id: `new2-h-full-${r}-${c}`,
                                x1: d1.x,
                                y1: d1.y,
                                x2: d2.x,
                                y2: d2.y
                            });
                        }
                    }
                });

                // Corner Plus Icons for NEW Box 2
                const new2CornerCoords = [
                    { col: new2StartCol, row: new2TargetRow },
                    { col: new2StartCol + effectiveNew2Width, row: new2TargetRow },
                    { col: new2StartCol, row: new2TargetRow + new2HeightRows },
                    { col: new2StartCol + effectiveNew2Width, row: new2TargetRow + new2HeightRows }
                ];

                new2CornerCoords.forEach((coord, idx) => {
                    const dot = dots.find(d => d.col === coord.col && d.row === coord.row);
                    if (dot) {
                        dashedLines.push({
                            id: `new2-corner-plus-${idx}`,
                            x1: dot.x,
                            y1: dot.y,
                            type: 'corner-plus'
                        });
                    }
                });

                // Horizontal lines for TRIPLICATE - only box 3 width (not full screen)
                const tripHorizontalRows = [0, tripHeightRows];
                tripHorizontalRows.forEach(r => {
                    for (let c = tripStartCol; c < tripStartCol + effectiveTripWidth; c++) {
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

                // Corner Plus Icons for 3rd Grid Box
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
            }

            // --- Continuous Vertical Lines (Left and Right edges) ---
            // Extend from top of SECOND box (dupTargetRow) to very bottom of screen
            // Find max row in dots matching our column to be safe, or just max row overall
            const maxRow = dots.reduce((max, d) => Math.max(max, d.row), 0);

            const globalStartRow = dupTargetRow; // Start from duplicate box top
            const globalEndRow = rowsCount - 1; // Extended to full dot area height
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

            // Find columns that are comfortably within the visible screen area (for line extensions and markers)
            const visibleDots = dots.filter(d => d.x > 40 && d.x < window.innerWidth - 40);
            const screenVisibleMinCol = visibleDots.reduce((min, d) => Math.min(min, d.col), Infinity);
            const screenVisibleMaxCol = visibleDots.reduce((max, d) => Math.max(max, d.col), 0);

            const markerStartRow = targetRow + 1;
            const markerEndRow = rowsCount - 1;

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
                    height: `${dupHeightRows * cellSize}px`
                };
            }

            // Calculate position for New Grid Box (between Box 2 and Box 3)
            const newAnchorDot = dots.find(d => d.col === newStartCol && d.row === newTargetRow);
            if (newAnchorDot) {
                newBoxPosition = {
                    left: `${newAnchorDot.x}px`,
                    top: `${newAnchorDot.y}px`,
                    width: `${effectiveNewWidth * cellSize}px`,
                    height: `${newHeightRows * cellSize}px`
                };
            }

            // Calculate position for New Grid Box 2
            const new2AnchorDot = dots.find(d => d.col === new2StartCol && d.row === new2TargetRow);
            if (new2AnchorDot) {
                new2BoxPosition = {
                    left: `${new2AnchorDot.x}px`,
                    top: `${new2AnchorDot.y}px`,
                    width: `${effectiveNew2Width * cellSize}px`,
                    height: `${new2HeightRows * cellSize}px`
                };
            }

            // Calculate position for Triplicate Box (for carousel)
            const tripAnchorDot = dots.find(d => d.col === tripStartCol && d.row === tripTargetRow);
            if (tripAnchorDot) {
                tripBoxPosition = {
                    left: `${tripAnchorDot.x}px`,
                    top: `${tripAnchorDot.y}px`,
                    width: `${effectiveTripWidth * cellSize}px`,
                    height: `${tripHeightRows * cellSize}px`
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
                background: '#f2f3f3ff',
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
                    height: dots.length > 0 ? `${Math.max(...dots.map(d => d.y)) + 200}px` : '100%',
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
                    backgroundColor: '#FFFFFF',
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
                    height: dots.length > 0 ? `${Math.max(...dots.map(d => d.y)) + 200}px` : '100%',
                    pointerEvents: 'none',
                    zIndex: 6
                }}
            >
                {/* Static Lines */}
                {dashedLines.filter(l => !l.type && !l.id.startsWith('dup-h-edge') && !l.id.startsWith('trip-h-full')).map(line => (
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

                {/* Animated Lines */}
                <g>
                    {dashedLines.filter(l => !l.type && (l.id.startsWith('dup-h-edge') || l.id.startsWith('trip-h-full'))).map(line => (
                        <line
                            key={line.id}
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke="#B0B0B0"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            strokeOpacity={line.opacity || 0.64}
                        />
                    ))}
                    {dashedLines.filter(l => l.type === 'corner-plus').map(plus => (
                        <g key={plus.id}>
                            <line x1={plus.x1 - 7} y1={plus.y1} x2={plus.x1 + 7} y2={plus.y1} stroke="#373434" strokeWidth="1" />
                            <line x1={plus.x1} y1={plus.y1 - 7} x2={plus.x1} y2={plus.y1 + 7} stroke="#373434" strokeWidth="1" />
                        </g>
                    ))}
                </g>

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
                                fontSize: '9px',
                                fill: '#8b8a8aff', // Fixed color
                                fontWeight: 400
                            }}
                        >
                            {marker.label}
                        </text>
                    </g>
                ))}

                {/* Corner Plus Icons removed here (moved to animated lines group) */}
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


            {/* Bottom Non-Dots Area Div */}
            {dots.length > 0 && (
                <footer style={{
                    position: 'absolute',
                    top: `${Math.max(...dots.map(d => d.y))}px`,
                    left: 0,
                    width: '100%',
                    height: '30vh',
                    backgroundColor: '#FFF9F9',
                    zIndex: 10,
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* SVG dashed line at top edge matching Nav bottom edge style */}
                    <svg style={{ position: 'absolute', width: '100%', height: '1px', top: 0 }}>
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

                    <h2 style={{
                        fontFamily: '"Cocosharp Trial", sans-serif',
                        fontSize: '140px',
                        letterSpacing: '-1px',
                        fontWeight: 510,
                        color: '#373434',
                        margin: 0,
                        textAlign: 'center',
                        opacity: 0.9,
                        transition: 'opacity 0.3s ease'
                    }}>
                        your palett, our colours
                    </h2>


                </footer>
            )}

            {/* Navigation Box Container */}
            <div style={navBoxStyle}>
                {/* Inner Child 1: Text (Logo Part 1) + Time */}
                <div style={{ display: 'flex', alignItems: 'baseline', minWidth: '160px', gap: '8px' }}>
                    <Link to="/" aria-label="Home" style={{
                        fontFamily: '"Cocosharp Trial", sans-serif',
                        fontSize: '19px',
                        letterSpacing: '-1px',
                        fontWeight: 510,
                        color: '#373434',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        Palett
                    </Link>
                    <LiveIST />
                </div>

                {/* Inner Child 2: Spacer */}
                <div style={{ flex: 1 }}></div>

                {/* Inner Child 3: Right cluster — Menu + Home */}
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'flex-end',
                    minWidth: '160px',
                    gap: '24px'
                }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginRight: '6px' }}>
                        {/* Contact Link */}
                        <Link
                            to="/get-in-touch"
                            aria-label="Contact Us"
                            onMouseEnter={() => setHoveredLink('contact')}
                            onMouseLeave={() => setHoveredLink(null)}
                            style={{
                                fontFamily: '"Rethink Sans", sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#2d2d2d',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                opacity: location.pathname === '/get-in-touch'
                                    ? 1
                                    : (hoveredLink === 'contact' ? 0.6 : 1),
                                transition: 'opacity 0.2s ease',
                                padding: '4px 0'
                            }}
                        >
                            Contact
                        </Link>

                        {/* About Link */}
                        <span
                            onClick={() => {/* Add About path if needed */ }}
                            onMouseEnter={() => setHoveredLink('about')}
                            onMouseLeave={() => setHoveredLink(null)}
                            style={{
                                fontFamily: '"Rethink Sans", sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#2d2d2d',
                                cursor: 'pointer',
                                opacity: location.pathname === '/get-in-touch'
                                    ? (hoveredLink === 'about' ? 1 : 0.6)
                                    : (hoveredLink === 'about' ? 0.6 : 1),
                                transition: 'opacity 0.2s ease',
                                padding: '4px 0'
                            }}
                        >
                            About
                        </span>

                        {/* Join Us Link */}
                        <span
                            onClick={() => {/* Add Join Us path if needed */ }}
                            onMouseEnter={() => setHoveredLink('join')}
                            onMouseLeave={() => setHoveredLink(null)}
                            style={{
                                fontFamily: '"Rethink Sans", sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#2d2d2d',
                                cursor: 'pointer',
                                opacity: location.pathname === '/get-in-touch'
                                    ? (hoveredLink === 'join' ? 1 : 0.6)
                                    : (hoveredLink === 'join' ? 0.6 : 1),
                                transition: 'opacity 0.2s ease',
                                padding: '4px 0'
                            }}
                        >
                            Join Us
                        </span>
                    </div>

                </div>

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
                <Helmet>
                    <title>{mode === 'get-in-touch' ? 'Get in Touch | Palett' : 'Palett — Design & Development Studio'}</title>
                    <meta name="description" content={mode === 'get-in-touch'
                        ? 'Start a project with Palett. Book a 30-minute call or send us a message — we work with startups and scaleups building exceptional digital products.'
                        : 'Founded in 2025, Palett is a creative design and development studio radically obsessed with high-fidelity execution. No rules, no ego, just fast-paced revolution.'} />

                    {/* Canonical */}
                    <link rel="canonical" href={mode === 'get-in-touch' ? 'https://palettstudios.com/get-in-touch' : 'https://palettstudios.com/'} />

                    {/* Open Graph */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={mode === 'get-in-touch' ? 'https://palettstudios.com/get-in-touch' : 'https://palettstudios.com/'} />
                    <meta property="og:title" content={mode === 'get-in-touch' ? 'Get in Touch | Palett' : 'Palett — Design & Development Studio'} />
                    <meta property="og:description" content={mode === 'get-in-touch'
                        ? 'Start a project with Palett. Book a 30-minute call or drop a message — we work with startups and scaleups building exceptional digital products.'
                        : 'Founded in 2025, Palett is a creative design and development studio radically obsessed with high-fidelity execution. No rules, no ego, just fast-paced revolution.'} />
                    <meta property="og:image" content={mode === 'get-in-touch' ? 'https://palettstudios.com/logo.png' : 'https://palettstudios.com/og-preview.png'} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content={mode === 'get-in-touch' ? 'https://palettstudios.com/get-in-touch' : 'https://palettstudios.com/'} />
                    <meta name="twitter:title" content={mode === 'get-in-touch' ? 'Get in Touch | Palett' : 'Palett — Design & Development Studio'} />
                    <meta name="twitter:description" content={mode === 'get-in-touch'
                        ? 'Start a project with Palett. Book a 30-minute call or drop a message — we work with startups and scaleups building exceptional digital products.'
                        : 'Founded in 2025, Palett is a creative design and development studio radically obsessed with high-fidelity execution. No rules, no ego, just fast-paced revolution.'} />
                    <meta name="twitter:image" content={mode === 'get-in-touch' ? 'https://palettstudios.com/logo.png' : 'https://palettstudios.com/og-preview.png'} />
                </Helmet>
                {!hideContent && (
                    <div className="fade-anim-box2" style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: 0,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                width: '100%',
                                padding: '0 20px'
                            }}>
                                <div style={{
                                    textAlign: 'left',
                                    paddingTop: '0'
                                }}>
                                    <h1 style={{
                                        fontFamily: '"Rethink Sans", sans-serif',
                                        fontSize: '25px',
                                        letterSpacing: '-0.2px',
                                        lineHeight: '30px',
                                        fontWeight: 460,
                                        color: '#373434ff',
                                        margin: 0
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.05em', transition: 'all 0.5s cubic-bezier(0.16, 1.25, 0.4, 1)' }}>
                                            {mode === 'get-in-touch'
                                                ? 'Wondering where to begin?'
                                                : 'Design and Development shop'}
                                        </span>
                                        {mode !== 'get-in-touch' && 'for startups and scaleups'}
                                        {mode === 'get-in-touch' && showCal && (
                                            <div style={{ fontSize: '25px', color: '#373434ff', marginTop: '4px' }}>
                                                Book a 30 min call.
                                            </div>
                                        )}
                                    </h1>
                                    {mode === 'get-in-touch' && showCal && !isBookingSuccessful && (
                                        <div style={{
                                            marginTop: '24px', // Reduced gap for "full below" feel without excessive push
                                            fontFamily: '"Rethink Sans", sans-serif',
                                            fontSize: '15px',
                                            color: '#9b9494ff',
                                            fontWeight: 400,
                                            pointerEvents: 'auto',
                                            textAlign: 'left'
                                        }}>
                                            if not sure, just <span onClick={() => setShowCal(false)} style={{
                                                color: '#8987ca',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                textUnderlineOffset: '3px',
                                                textDecorationColor: 'rgba(137, 135, 202, 0.4)'
                                            }}>drop your message</span>
                                        </div>
                                    )}
                                    {/* Paragraphs moved to absolute-positioned description area */}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '8px',
                                width: '100%',
                                padding: '0 20px',
                                marginTop: mode === 'get-in-touch' ? (showCal ? '28px' : '110px') : '48px',
                                marginBottom: '20px',
                                pointerEvents: 'auto',
                                alignItems: 'flex-start'
                            }}>
                                {mode !== 'get-in-touch' && (
                                    <ThreadButton
                                        aria-label="Get in touch with us"
                                        extraPadding={1}
                                        onClick={() => navigate('/get-in-touch')}
                                    >
                                        Get in touch
                                    </ThreadButton>
                                )}

                                {mode !== 'get-in-touch' && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        padding: '9px 4px 0 4px'
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
                                )}
                            </div>
                        </div>

                        {/* Description - Positioned on the right, matches the original desc position */}
                        <div style={{
                            position: 'absolute',
                            left: '50.1%',
                            top: '-2px',
                            paddingTop: '7px',
                            paddingLeft: '15px',
                            paddingBottom: '16px',
                            textAlign: 'left',
                            pointerEvents: 'auto', // Adjusted to auto for link/interactions
                            borderLeft: '1px solid #E5E5E5'
                        }}>
                            {mode === 'get-in-touch' ? (
                                <>
                                    <p style={{
                                        fontFamily: '"Rethink Sans", sans-serif',
                                        fontSize: '15px',
                                        lineHeight: '20px',
                                        fontWeight: 460,
                                        color: '#373434ff',
                                        opacity: 0.9,
                                        margin: 0,
                                        maxWidth: '520px'
                                    }}>
                                        To help us get to know you, tell us about your product, your timeline, <br />
                                        and where in the world you are. Bonus points for letting us know <br />
                                        how you found us!
                                    </p>
                                    <p style={{
                                        fontFamily: '"Rethink Sans", sans-serif',
                                        fontSize: '15px',
                                        lineHeight: '20px',
                                        fontWeight: 460,
                                        color: '#373434ff',
                                        opacity: 0.9,
                                        margin: '18px 0 0 0',
                                        maxWidth: '520px'
                                    }}>
                                        We’re all ears for every message we get, <br />
                                        thanks for making yours stand out. 🌟
                                    </p>
                                </>
                            ) : (
                                <p style={{
                                    fontFamily: '"Rethink Sans", sans-serif',
                                    fontSize: '15px',
                                    lineHeight: '20px',
                                    fontWeight: 460,
                                    color: '#373434ff',
                                    opacity: 0.9,
                                    margin: 0,
                                    maxWidth: '80%'
                                }}>
                                    Partnering with forward-thinking founders and teams to craft meaningful digital experiences through strategy, brand identity, and high-performance product execution.
                                </p>
                            )}
                        </div>

                        {/* Bottom Area Div - Active for both Mosaic and Contact Form */}
                        {(mode !== 'get-in-touch' || true) && (
                            <div style={{
                                flex: 1,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '0 20px 20px 20px'
                            }}>
                                {mode === 'get-in-touch' ? (
                                    <div style={{
                                        flex: 1,
                                        width: '100%',
                                        backgroundColor: '#FBFBFB', // Exact flattened color of the overlay+bg mix
                                        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 0.5px, transparent 0.5px)',
                                        backgroundSize: '12px 12px',
                                        borderRadius: '0',
                                        pointerEvents: 'auto',
                                        border: '0.4px solid rgba(0, 0, 0, 0.04)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: showCal ? '40px 40px 0 40px' : '40px',
                                        position: 'relative'
                                    }}>
                                        {showCal ? (
                                            <div style={{ flex: 1, width: '100%', minHeight: '570px', marginTop: '0', position: 'relative' }}>
                                                <Cal
                                                    calLink="anugrah-palettstudios/30min"
                                                    style={{ width: "100%", height: "100%", overflow: "hidden", padding: 0 }}
                                                    config={{
                                                        layout: 'month_view',
                                                        theme: 'light',
                                                        hideEventTypeDetails: true
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '34px 42px',
                                                width: '100%'
                                            }}>
                                                {/* Field 1: Name */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                    <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', fontWeight: 400, color: '#8b8a8aff' }}>Name*</label>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            marginTop: '-2px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)',
                                                            padding: '10px 0',
                                                            fontFamily: '"Rethink Sans", sans-serif',
                                                            fontSize: '15px',
                                                            color: '#373434ff',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>

                                                {/* Field 2: Email */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                    <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', fontWeight: 400, color: '#8b8a8aff' }}>Email*</label>
                                                    <input
                                                        type="email"
                                                        style={{
                                                            marginTop: '-2px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)',
                                                            padding: '10px 0',
                                                            fontFamily: '"Rethink Sans", sans-serif',
                                                            fontSize: '15px',
                                                            color: '#373434ff',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>

                                                {/* Field 3: Referrer */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                    <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', fontWeight: 400, color: '#8b8a8aff' }}>How did you hear of us?*</label>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            marginTop: '-2px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)',
                                                            padding: '10px 0',
                                                            fontFamily: '"Rethink Sans", sans-serif',
                                                            fontSize: '15px',
                                                            color: '#373434ff',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>

                                                {/* Field 4: Stage */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                    <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', fontWeight: 400, color: '#8b8a8aff' }}>What stage is your company?</label>
                                                    <select
                                                        style={{
                                                            marginTop: '-2px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)',
                                                            padding: '10px 0',
                                                            fontFamily: '"Rethink Sans", sans-serif',
                                                            fontSize: '15px',
                                                            color: '#373434ff',
                                                            outline: 'none',
                                                            cursor: 'pointer',
                                                            appearance: 'none',
                                                            WebkitAppearance: 'none'
                                                        }}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Select One</option>
                                                        <option value="pre-seed">Pre-seed</option>
                                                        <option value="seed">Seed</option>
                                                        <option value="series-a">Series A</option>
                                                        <option value="series-b">Series B+</option>
                                                    </select>
                                                </div>

                                                {/* Field 5: Message */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', gridColumn: 'span 2' }}>
                                                    <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', fontWeight: 400, color: '#8b8a8aff' }}>Message*</label>
                                                    <textarea
                                                        rows={1}
                                                        onChange={(e) => {
                                                            e.target.style.height = 'auto';
                                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                                        }}
                                                        style={{
                                                            marginTop: '-2px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)',
                                                            padding: '10px 0',
                                                            fontFamily: '"Rethink Sans", sans-serif',
                                                            fontSize: '15px',
                                                            color: '#373434ff',
                                                            outline: 'none',
                                                            resize: 'none',
                                                            width: '100%',
                                                            maxHeight: '120px',
                                                            overflowY: 'auto'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}


                                        <div style={{
                                            position: 'absolute',
                                            bottom: '40px',
                                            right: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            {!showCal && (
                                                <div
                                                    onClick={() => {
                                                        setShowCal(true);
                                                        setIsBookingSuccessful(false);
                                                    }}
                                                    style={{
                                                        fontFamily: '"Rethink Sans", sans-serif',
                                                        fontSize: '15px',
                                                        color: '#8987ca',
                                                        fontWeight: 400,
                                                        textDecoration: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <span style={{
                                                        textDecoration: 'underline',
                                                        textUnderlineOffset: '3px',
                                                        textDecorationColor: 'rgba(137, 135, 202, 0.4)'
                                                    }}>
                                                        Schedule a meeting directly if you want.
                                                    </span>
                                                </div>
                                            )}
                                            {!showCal && (
                                                <ThreadButton
                                                    extraPadding={1}
                                                    onClick={() => {/* Contact submission logic */ }}
                                                >
                                                    Submit
                                                </ThreadButton>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="fade-anim-mosaic" style={{
                                        flex: 1,
                                        width: '100%',
                                        backgroundColor: '#f8f8f8ff',
                                        borderRadius: '0',
                                        pointerEvents: 'auto',
                                        border: '0.8px solid rgba(203, 203, 203, 0.08)'
                                    }}>
                                        {/* Decorative Grid Blocks - Asymmetrical Mondrian-style Mosaic */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1.2fr 1.1fr 1.1fr 0.9fr',
                                            gridTemplateRows: '1.5fr 0.7fr 1.1fr 0.7fr',
                                            width: '100%',
                                            height: '100%',
                                            gap: '0'
                                        }}>
                                            {mosaicBlocks.map((block, i) => (
                                                <div
                                                    key={i}
                                                    onMouseEnter={() => {
                                                        setHoveredMosaicIdx(i);
                                                        setIsAutoMosaicEnabled(false);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredMosaicIdx(null);
                                                        setIsAutoMosaicEnabled(true);
                                                    }}
                                                    aria-label={`Service: ${block.title}`}
                                                    style={{
                                                        gridArea: block.area,
                                                        width: '100%',
                                                        height: '100%',
                                                        border: '0.4px solid rgba(0, 0, 0, 0.04)',
                                                        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 0.5px, transparent 0.5px)',
                                                        backgroundSize: '12px 12px',
                                                        backgroundColor: hoveredMosaicIdx === i ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.45)',
                                                        padding: '8px',
                                                        display: 'flex',
                                                        alignItems: 'flex-end',
                                                        justifyContent: 'flex-end',
                                                        boxSizing: 'border-box',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.3s ease'
                                                    }}
                                                >
                                                    <div style={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '14px', // Fixed height for alignment
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                        pointerEvents: 'none'
                                                    }}>
                                                        {/* Hex Label - Fades Out */}
                                                        <span style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            fontFamily: '"Share Tech Mono", monospace',
                                                            fontSize: '11px',
                                                            color: 'rgba(55, 52, 52, 0.3)',
                                                            opacity: hoveredMosaicIdx === i ? 0 : 1,
                                                            transform: hoveredMosaicIdx === i ? 'translateY(-10px)' : 'translateY(0)',
                                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {block.label}
                                                        </span>

                                                        {/* Service Title - Fades In */}
                                                        <h3 style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            fontFamily: '"Rethink Sans", sans-serif',
                                                            fontSize: '12px',
                                                            fontWeight: 450,
                                                            color: 'rgba(55, 52, 52, 0.85)',
                                                            letterSpacing: '-0.2px',
                                                            margin: 0,
                                                            opacity: hoveredMosaicIdx === i ? 1 : 0,
                                                            transform: hoveredMosaicIdx === i ? 'translateY(0)' : 'translateY(10px)',
                                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {block.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* New Grid Box Area - Only in Full Mode */}
            {
                newBoxPosition.left && mode !== 'get-in-touch' && (
                    <div style={{
                        position: 'absolute',
                        ...newBoxPosition,
                        zIndex: 4,
                        pointerEvents: 'auto'
                    }}>
                        {!hideContent && (
                            <div className="fade-anim-newbox" style={{ width: '100%', height: '100%', display: 'flex' }}>
                                {/* Left Side */}
                                <div style={{
                                    flex: 1,
                                    borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    paddingTop: '16px'
                                }}>
                                    <div style={{
                                        padding: '0 20px',
                                        marginTop: 'auto',
                                        marginBottom: '6px',
                                        textAlign: 'left',
                                        marginLeft: '2px'
                                    }}>
                                        <p style={{
                                            fontFamily: '"Rethink Sans", sans-serif',
                                            fontSize: '13px',
                                            lineHeight: '18px',
                                            fontWeight: 400,
                                            color: '#8b8a8aff',
                                            margin: 0
                                        }}>
                                            who are we
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                        padding: '0 20px',
                                        marginBottom: '20px',
                                        pointerEvents: 'auto'
                                    }}>
                                        <h2 style={{
                                            fontFamily: '"Rethink Sans", sans-serif',
                                            fontSize: '20px',
                                            letterSpacing: '-0.2px',
                                            lineHeight: '26px',
                                            fontWeight: 460,
                                            color: '#373434ff',
                                            margin: 0,
                                            textAlign: 'left',
                                        }}>
                                            A design native studio, powered by <br />
                                            senior-led cracked builders. free from  <br />
                                            obsolete rituals, pushing beyound mediocrity.
                                        </h2>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div style={{ flex: 1 }}></div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* New Middle Box 2 Area - Only in Full Mode */}
            {
                new2BoxPosition.left && mode !== 'get-in-touch' && (
                    <div style={{
                        position: 'absolute',
                        ...new2BoxPosition,
                        zIndex: 4,
                        pointerEvents: 'auto'
                    }}>
                        {!hideContent && (
                            <div className="fade-anim-newbox2" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Empty container ready for content */}
                            </div>
                        )}
                    </div>
                )
            }

            {/* 3rd Grid Box Carousel - Only in Full Mode */}
            {
                tripBoxPosition.left && mode !== 'get-in-touch' && (
                    <div style={{
                        position: 'absolute',
                        ...tripBoxPosition,
                        zIndex: 4,
                        pointerEvents: 'auto',
                        backgroundColor: '#FFFFFF'
                    }}>
                        {!hideContent && (
                            <div className="fade-anim-box3" style={{ width: '100%', height: '100%', position: 'relative' }}>
                                {/* Carousel fills full box */}
                                <ImageCarousel
                                    images={[slide5, slide6, slide7, slide10, slide11]}
                                    width={tripBoxPosition.width}
                                    height={tripBoxPosition.height}
                                />


                                {/* Right-side overlay panel */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '32%',
                                    height: '100%',
                                    background: '#fcfcfdff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '32px 36px 36px 36px',
                                    boxSizing: 'border-box',
                                    gap: '16px',
                                    pointerEvents: 'auto',
                                    borderLeft: '1px dashed rgba(0, 0, 0, 0.12)',
                                    zIndex: 5
                                }}>
                                    {/* ── Content placeholder slots ── */}
                                    {/* Slot A — top content */}
                                    <div style={{ flex: '0 0 auto' }}>
                                        <h2 style={{
                                            fontFamily: '"Rethink Sans", sans-serif',
                                            fontSize: '20px',
                                            letterSpacing: '-0.2px',
                                            lineHeight: '26px',
                                            fontWeight: 460,
                                            color: '#373434ff',
                                            margin: 0,
                                            textAlign: 'left',
                                        }}>
                                            keep the product moving<br /><span style={{ opacity: 0.6 }}>skip the hiring pause</span>
                                        </h2>
                                    </div>

                                    {/* Action Section: Contact Link */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        position: 'relative',
                                        width: '100%',
                                        marginTop: '32px'
                                    }}>
                                        {/* Link Text + Pic Group */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transform: 'translateX(0.5px)',
                                            position: 'absolute',
                                            right: 0
                                        }}>
                                            <a href="mailto:anugrah@palettstudios.com" style={{
                                                fontFamily: '"Rethink Sans", sans-serif',
                                                fontSize: '15px',
                                                color: '#8987ca',
                                                fontWeight: 400,
                                                textDecoration: 'none',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '4px',
                                                transform: 'translateX(0.8px)'
                                            }}>
                                                <span style={{
                                                    textDecoration: 'underline',
                                                    textDecorationColor: 'rgba(137, 135, 202, 0.4)',
                                                    textUnderlineOffset: '3px'
                                                }}>
                                                    doubts ? say hi
                                                </span>
                                            </a>
                                            {/* Hover Pic Circle */}
                                            <div
                                                onMouseEnter={() => setPicHover(true)}
                                                onMouseLeave={() => setPicHover(false)}
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: '1px solid #E5E5E5',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                    transform: picHover ? 'translateY(-4px) rotate(8deg)' : 'translateY(0) rotate(0deg)',
                                                    boxShadow: picHover ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                                                }}
                                            >
                                                <img src={picImg} alt="Anugrah - Palett Founder" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Separation Indicator Bars (Replacing Static Line) */}
                                    <div style={{
                                        position: 'relative',
                                        height: '1px',
                                        marginTop: '12px',
                                        flexShrink: 0,
                                        width: '100%',
                                        display: 'flex',
                                        gap: '4px'
                                    }}>
                                        {/* Base Grey Bars */}
                                        {[0, 1, 2, 3].map((idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setActiveQuoteIndex(idx)}
                                                style={{
                                                    flex: 1,
                                                    height: '100%',
                                                    backgroundColor: '#E5E5E5',
                                                    borderRadius: '0px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                        {/* Active Sliding Indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: `calc(${activeQuoteIndex * 25}% + ${activeQuoteIndex * 1}px)`,
                                            width: 'calc(25% - 3px)',
                                            height: '100%',
                                            backgroundColor: '#373434',
                                            transition: 'all 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
                                            pointerEvents: 'none',
                                            zIndex: 2
                                        }} />
                                    </div>

                                    {/* Bottom Area filling the space to the bottom */}
                                    <div style={{
                                        flex: 1,
                                        marginTop: '12px',
                                        padding: '12px 0',
                                        width: '100%',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'transparent' // Background removed
                                    }}>
                                        {/* Bottom Container: 2 rows */}
                                        <div ref={quoteContentRef} style={{ display: 'flex', flexDirection: 'column' }}>
                                            {/* Double Quotes - Aligned Right and 8px up from circle */}
                                            <div style={{ alignSelf: 'flex-end', marginBottom: '8px', opacity: 0.6 }}>
                                                <svg width="23" height="19" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                                                    <path d="M6.78 21C2.92667 21 1 19.24 1 15.72C1 11.8933 4.15333 6.92 10.46 1L12.46 2.36C8.14 6.86667 5.84667 10.4933 5.58 13.24H11.06V21H6.78ZM19.78 21C15.9267 21 14 19.24 14 15.72C14 11.8933 17.1533 6.92 23.46 1L25.46 2.36C21.14 6.86667 18.8467 10.4933 18.58 13.24H24.06V21H19.78Z" fill="#A0A0A0" />
                                                </svg>
                                            </div>

                                            {/* Content Group with original 16px vertical gap between testimonial rows */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {/* Top Row: Circle left, 2 row text right */}
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                                                    {/* Profile Pic */}
                                                    <img src={quotes[displayQuoteIndex].img} alt={`${quotes[displayQuoteIndex].name} - ${quotes[displayQuoteIndex].role}`} loading="lazy" style={{ width: '29px', height: '29px', borderRadius: '50%', objectFit: 'cover' }} />
                                                    {/* 2 Row Text */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', transform: 'translateY(0.6px)' }}>
                                                        <span style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: '#373434', lineHeight: '11.8px' }}>
                                                            {quotes[displayQuoteIndex].name}
                                                        </span>
                                                        <span style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '11px', color: '#9E9E9E', lineHeight: '10.8px' }}>
                                                            {quotes[displayQuoteIndex].role}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Paragraph */}
                                                <div style={{
                                                    fontFamily: '"Rethink Sans", sans-serif',
                                                    fontSize: '12.5px',
                                                    lineHeight: '18px',
                                                    color: '#6d6d6d',
                                                    opacity: 0.68,
                                                    letterSpacing: '-0.1px'
                                                }}>
                                                    "{quotes[displayQuoteIndex].text}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Scroll Spacer */}
            <div style={{
                height: mode === 'get-in-touch'
                    ? '0px'
                    : (tripBoxPosition.top
                        ? `${parseFloat(tripBoxPosition.top) + parseFloat(tripBoxPosition.height) + 120}px`
                        : '150vh'),
                width: '100%',
                pointerEvents: 'none'
            }} />
        </div >
    );
};

// Thread Button Component
const ThreadButton = ({ children, onClick, extraPadding = 0 }) => {
    const navigate = useNavigate();
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
                padding: `${7.5 + extraPadding}px ${16.5 + extraPadding}px`,
                border: '0.6px solid rgba(38, 38, 91, 0.35)',
                borderRadius: '9px',
                fontFamily: '"Rethink Sans", sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'transparent',
                boxShadow: hovered ? '0 2px 2px rgba(38, 38, 91, 0.1)' : 'none',
                transition: 'box-shadow 0.3s ease, padding-right 0.3s ease',
                paddingRight: hovered ? `${46 + extraPadding}px` : `${18 + extraPadding}px`
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
                        [0, 2], [1, 2], [2, 2], [3, 2],
                        [3, 1], [4, 0],
                        [3, 3], [4, 4],
                        [1, 1], [1, 3],
                        [2, 1]
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
                                animation: 'blink 2s ease-in-out infinite',
                                animationDelay: `${i * 0.1}s`
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

const Book = ({ hideContent = false, mode = 'full' }) => {
    return (
        <div className="book-wrapper" style={{ width: '100%', position: 'relative' }}>
            {/* Thread Grid with Physics */}
            <ThreadGrid hideContent={hideContent} mode={mode} />
        </div>
    );
};

export default Book;
