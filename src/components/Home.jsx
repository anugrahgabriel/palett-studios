import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);
import './Home.css';
// Page images removed because files were deleted
const leftPageImg = "";
const rightPageImg = "";
import slide5 from '../../pics/5-slide.webp';
import slide6 from '../../pics/6-slide.webp';
import slide10 from '../../pics/10-slide.webp';
import slide11 from '../../pics/11-slide.webp';
import slide12 from '../../pics/12-slide.webp';
import client1 from '../../pics/client 1.png';
import mainContentBg from '../../pics/main-content-bg.webp';

const MenuIcon = ({ color = "#373434", onClick }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={onClick}>
        <path d="M8 6V18M12 6V18M16 6V18" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const ArrowIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '12px', marginRight: '8px' }}>
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#D2D2D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);



// Image Carousel Component for the 3rd Grid Box
const ProjectImageStrip = ({ slides, height = '480px' }) => {
    const scrollRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    useGSAP(() => {
        if (!scrollRef.current || imagesLoaded < slides.length) return;

        const el = scrollRef.current;
        const totalWidth = el.scrollWidth / 2;

        gsap.killTweensOf(el);
        gsap.set(el, { x: 0 });

        gsap.to(el, {
            x: `-=${totalWidth}`,
            duration: slides.length * 40, // Even slower (increased from 30 to 40)
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
    }, [imagesLoaded, slides.length]);

    return (
        <div style={{
            width: '100%',
            height: height, // Dynamic height support
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '2px', // Added 2px corner radius as requested
            pointerEvents: 'auto'
        }}>
            <div ref={scrollRef} style={{
                display: 'flex',
                gap: '20px',
                height: '100%',
                width: 'max-content',
                pointerEvents: 'auto'
            }}>
                {/* Duplicate slides for infinite loop */}
                {[...slides, ...slides].map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        onLoad={() => setImagesLoaded(prev => prev + 1)}
                        style={{
                            height: '100%',
                            width: 'auto',
                            objectFit: 'contain',
                            borderRadius: '2px', // Tightened to 2px for technical look
                            outline: '0.4px solid rgba(0, 0, 0, 0.05)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const ProjectShowcase = () => {
    const projects = [
        {
            title: 'GrayForge',
            desc: 'Website design, development and branding for a well based marketing agency',
            tags: ['Agency'],
            slides: [slide12]
        },
        {
            title: 'Quotient',
            desc: 'Product design and dev for an AI marketing platform',
            tags: ['Software Product'],
            slides: [slide5, slide6]
        },
        {
            title: 'Runable',
            desc: "Product design for India's leading general AI platform",
            tags: ['Software Product'],
            slides: [slide10, slide11]
        }
    ];

    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px', // Increased by 12px from 12px to 24px
            padding: '12px',
            backgroundColor: '#1f1f1fff', // Dark mode bg as requested
            borderRadius: '6px',
            pointerEvents: 'auto'
        }}>
            {projects.map((project, pi) => (
                <div
                    key={pi}
                    onMouseEnter={() => setHoveredIdx(pi)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '40px',
                        width: '100%',
                        position: 'relative',
                        cursor: 'pointer',
                        backgroundColor: '#1f1f1fff', // Matching dark mode bg
                        padding: '12px',
                        borderRadius: '4px'
                    }}
                >
                    {/* Left Side: Static Metadata anchored to top */}
                    <div style={{
                        width: '30%',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        paddingTop: '0px'
                    }}>
                        <div style={{
                            fontFamily: '"Share Tech Mono", monospace',
                            fontSize: '12px',
                            color: '#f7f7f7', // High-contrast light gray numbering
                            fontWeight: 400,
                            letterSpacing: '-0.3px'
                        }}>
                            [{pi + 1}]
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0px',
                            position: 'relative'
                        }}>
                            <h3 style={{
                                fontFamily: '"Cocosharp Trial", sans-serif',
                                fontSize: '14px',
                                fontWeight: 510,
                                color: '#ffffff', // Pure white title
                                margin: 0,
                                letterSpacing: '-0.1px',
                                position: 'relative',
                                zIndex: 5
                            }}>
                                {project.title}
                            </h3>
                             <p style={{
                                 fontFamily: '"Inter", sans-serif',
                                 fontSize: '13px', // Increased from 12px to 13px
                                 color: '#a0a0a0', // Muted light gray description
                                 marginTop: '4px', // Increased by 2px to 4px gap
                                 marginBottom: '14px',
                                 lineHeight: 1.4, // Further increased by ~1px
                                 letterSpacing: '-0.1px',
                                 position: 'relative',
                                 zIndex: 5
                             }}>
                                {project.desc}
                            </p>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: '6px',
                                opacity: hoveredIdx === pi ? 1 : 0, // Only appear on hover
                                transform: hoveredIdx === pi ? 'translateY(0)' : 'translateY(-10px)',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {project.tags.map((tag, ti) => (
                                    <span key={ti} style={{
                                         fontFamily: '"Rethink Sans", sans-serif',
                                         fontSize: '12px',
                                         textTransform: 'none',
                                         color: 'rgba(255, 255, 255, 0.7)', // Slightly transparent white for subtlety
                                         backgroundColor: '#2a2a2a',
                                         display: 'inline-flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         height: '26px',
                                         padding: '0 9px',
                                         borderRadius: '2px',
                                         lineHeight: 0
                                     }}>
                                        {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Carousel (if multiple) or Static Content (if one) */}
                    <div style={{ width: '70%', paddingTop: '0px' }}>
                        {project.slides.length > 1 ? (
                            <ProjectImageStrip
                                slides={project.slides}
                                height={pi === 1 ? '456px' : '480px'} // Further decrease Row 2 (Quotient) to 456px
                            />
                        ) : (
                            <div style={{ width: '100%', height: '480px', display: 'flex', justifyContent: 'flex-start', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: 'auto',
                                    overflow: 'hidden',
                                    borderRadius: '2px',
                                    outline: '0.4px solid rgba(0, 0, 0, 0.05)'
                                }}>
                                    {project.slides[0].toString().toLowerCase().includes('.mov') || 
                                     project.slides[0].toString().toLowerCase().includes('.mp4') || 
                                     project.slides[0].toString().toLowerCase().includes('.webm') ? (
                                        <video
                                            src={project.slides[0]}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            style={{
                                                height: '100%',
                                                width: 'auto',
                                                objectFit: 'cover',
                                                transform: 'scaleX(1.0) translateX(-12px)',
                                                transformOrigin: 'right center'
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={project.slides[0]}
                                            alt={project.title}
                                            style={{
                                                height: '100%',
                                                width: 'auto',
                                                objectFit: 'cover',
                                                transform: 'scaleX(1.0) translateX(-12px)',
                                                transformOrigin: 'right center'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Update existing ImageCarousel component to use the new Showcase layout
const ImageCarousel = (props) => <ProjectShowcase {...props} />;

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
const LiveIST = ({ color = "#8b8a8a" }) => {
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
            color: color,
            opacity: 1,
            letterSpacing: '-0.1px',
            lineHeight: 1,
            transition: 'color 0.4s ease'
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
    const [isNavInFooter, setIsNavInFooter] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);

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

    // ─── Simple Layout Constants (Decoupled from Grid) ──────────────────────────
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isSmallLaptop = windowWidth < 1700;

    const PAGE_WIDTH = 1200;
    const SECTION_MARGIN = 80;
    const box3Height = (mode === 'get-in-touch' && showCal) ? 1350 : 810; // Increased by 60px from original 750
    const BOX_NEW_HEIGHT = 500;
    const BOX_TRIP_HEIGHT = 600;
    // ────────────────────────────────────────────────────────────────────────────

    const [isIntroActive, setIsIntroActive] = useState(true);
    const [isNavDelayed, setIsNavDelayed] = useState(true);

    // Scroll to top instantly when in get-in-touch mode
    useEffect(() => {
        if (mode === 'get-in-touch') {
            window.scrollTo(0, 0);
        }
    }, [mode]);

    useEffect(() => {
        if (mode) {
            if (containerRef.current) {
                containerRef.current.scrollTop = 0;
            }
        }
    }, [mode]);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Intro Flicker Sequence (Continuous Loading style)
        const introLogo = document.querySelector(".intro-logo");
        if (introLogo) {
            tl.fromTo(introLogo, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.inOut" })
                .to(introLogo, { opacity: 0.1, duration: 0.05 })
                .to(introLogo, { opacity: 0.7, duration: 0.04 })
                .to(introLogo, { opacity: 0.4, duration: 0.06 })
                .to(introLogo, { opacity: 0.9, duration: 0.04 })
                .to(introLogo, { opacity: 0.2, duration: 0.05, repeat: 10, yoyo: true, ease: "none" })
                .to(introLogo, {
                    opacity: 0, duration: 0.8, ease: "power2.inOut",
                    onComplete: () => setIsIntroActive(false)
                }, "+=0.2");
        }

        // 2. Main Content & Nav Sequence (Unified staggered fade)
        const contentElements = [
            ".fixed-nav-content",
            ".fade-anim-box2",
            ".fade-anim-mosaic",
            ".fade-anim-newbox",
            ".fade-anim-box3"
        ].map(sel => document.querySelector(sel)).filter(Boolean);

        tl.fromTo(contentElements,
            { opacity: 0 },
            { opacity: 1, duration: 1.8, stagger: 0.25, ease: "power2.inOut", onStart: () => setIsNavDelayed(false) }
            , "-=1.4s"); // Significant overlap so content appears while logo is still visible

        // ScrollTrigger removed in favor of manual scroll listener for better stability

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === "footer") st.kill();
            });
        };
    }, { dependencies: [mode, isSmallLaptop], scope: containerRef });

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


    // Threads removal confirmed.
    useEffect(() => {
        setConnections([]);
    }, []);

    // Scroll tracker simplified for flow layout
    useEffect(() => {
        const scroller = containerRef.current;
        if (!scroller) return;

        const handleScroll = () => {
            const currentScroll = scroller.scrollTop;
            setIsHeaderVisible(currentScroll > 100);

            // Manual check for footer overlap
            const footer = scroller.querySelector('footer');
            if (footer) {
                const triggerPoint = isSmallLaptop ? 60 : scroller.offsetHeight * 0.5;
                // If footer top has reached the trigger point
                setIsNavInFooter(footer.offsetTop - currentScroll <= triggerPoint);
            }
        };

        scroller.addEventListener('scroll', handleScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', handleScroll);
    }, []);

    // Grid threads generation removed as requested
    useEffect(() => {
        setConnections([]);
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

    // Clean pixel-based positioning
    const textStyle = {
        width: `${PAGE_WIDTH}px`,
        margin: '0 auto',
        pointerEvents: 'none'
    };

    const navBoxStyle = {
        position: 'fixed',
        top: isSmallLaptop ? '0' : '50%',
        left: 0,
        width: '100%',
        height: isSmallLaptop ? '60px' : '80px',
        padding: '0 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        zIndex: 10,
        transform: isSmallLaptop ? 'none' : 'translateY(-50%)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        borderBottom: 'none'
    };

    return (
        <>
            {isIntroActive && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                }}>
                    <h1 className="intro-logo" style={{
                        fontFamily: '"Cocosharp Trial", sans-serif', fontSize: '22px', fontWeight: 510,
                        color: '#373434', letterSpacing: '-0.2px'
                    }}>
                        Palett
                    </h1>
                </div>
            )}

            {/* Fixed Nav */}
            <div style={{ ...navBoxStyle, opacity: isNavDelayed ? 0 : 1 }} className="fixed-nav-content">
                <div style={{
                    display: 'flex',
                    flexDirection: isSmallLaptop ? 'column' : 'row',
                    alignItems: isSmallLaptop ? 'flex-start' : 'baseline',
                    minWidth: '160px',
                    gap: isSmallLaptop ? '2px' : '8px',
                    pointerEvents: 'auto'
                }}>
                    <Link to="/" style={{
                        fontFamily: '"Cocosharp Trial", sans-serif',
                        fontSize: '20px',
                        fontWeight: 510,
                        color: isNavInFooter ? '#FFFFFF' : '#373434',
                        textDecoration: 'none',
                        transition: 'color 0.4s ease'
                    }}>
                        Palett
                    </Link>
                    {!isSmallLaptop && <LiveIST color={isNavInFooter ? '#FFFFFF' : '#8b8a8a'} />}
                </div>
                <div style={{ flex: 1 }}></div>
                <div style={{
                    display: 'flex',
                    flexDirection: isSmallLaptop ? 'column' : 'row',
                    alignItems: isSmallLaptop ? 'flex-end' : 'baseline',
                    gap: isSmallLaptop ? '8px' : '18px',
                    justifyContent: 'flex-end',
                    pointerEvents: 'auto'
                }}>
                    {isSmallLaptop ? (
                        <MenuIcon color={isNavInFooter ? '#FFFFFF' : '#373434'} onClick={() => {/* Toggle Menu logic if needed */ }} />
                    ) : (
                        ['Work', 'About', 'Contact', 'Join us'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase().replace(' ', '-')}`}
                                style={{
                                    fontFamily: '"Rethink Sans", sans-serif',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    color: isNavInFooter ? '#FFFFFF' : '#2d2d2d',
                                    textDecoration: 'none',
                                    transition: 'color 0.4s ease'
                                }}
                            >
                                {item}
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <div
                ref={containerRef}
                className="main-scroller"
                style={{
                    width: '100%',
                    height: '100vh',
                    background: '#FFFFFF',
                    position: 'relative',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollBehavior: 'smooth'
                }}>

                {/* Top Spacer to account for Nav height and initial offset */}
                <div style={{ height: '0', width: '100%' }} />

                {/* Second Text Container (Tagline area) */}
                <div style={{
                    ...textStyle,
                    height: `${box3Height}px`,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop: 'calc(50vh - 405px)', // Precisely centers the 810px div in 100vh viewport
                    marginBottom: '100px',
                    pointerEvents: 'auto'
                }}>
                    <Helmet>
                        <title>{mode === 'get-in-touch' ? 'Get in Touch | Palett' : 'Palett — Design & Development Collective'}</title>
                        <meta name="description" content={mode === 'get-in-touch'
                            ? 'Start a project with Palett. Book a 30-minute call or send us a message — we work with startups and scaleups building exceptional digital products.'
                            : 'Founded in 2025, Palett is a creative design and development collective radically obsessed with high-fidelity execution. No rules, no ego, just fast-paced revolution.'} />
                        <link rel="canonical" href={mode === 'get-in-touch' ? 'https://palettcollective.com/get-in-touch' : 'https://palettcollective.com/'} />
                    </Helmet>

                    {!hideContent && (
                        <div className="fade-anim-box2" style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}>
                            <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                {mode === 'get-in-touch' ? (
                                    <div style={{ flex: 1, width: '100%', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ textAlign: 'left', width: '100%', padding: '0 0 20px 20px' }}>
                                            <h1 style={{
                                                fontFamily: '"Rethink Sans", sans-serif',
                                                fontSize: '22px',
                                                letterSpacing: '-0.2px',
                                                lineHeight: '28px',
                                                fontWeight: 460,
                                                color: '#373434ff',
                                                margin: '4px 0 0 2px'
                                            }}>
                                                Wondering where to begin?
                                            </h1>
                                        </div>
                                        <div style={{ flex: 1, width: '100%', backgroundColor: '#FBFBFB', backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 0.5px, transparent 0.5px)', backgroundSize: '12px 12px', borderRadius: '0', pointerEvents: 'auto', border: '0.4px solid rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', padding: '40px', position: 'relative' }}>
                                            {showCal ? (
                                                <div style={{ width: '100%', height: '100%' }}>
                                                    <Cal calLink="palett/30min" style={{ width: "100%", height: "100%", overflow: 'scroll' }} config={{ layout: 'month_view' }} />
                                                </div>
                                            ) : (
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '600px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                                <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff' }}>Name*</label>
                                                                <input type="text" style={{ background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#373434ff', outline: 'none' }} />
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                                <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff' }}>Email*</label>
                                                                <input type="email" style={{ background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#373434ff', outline: 'none' }} />
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                                <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff' }}>Organization*</label>
                                                                <input type="text" style={{ background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#373434ff', outline: 'none' }} />
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                                <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff' }}>Stage*</label>
                                                                <select style={{ background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#373434ff', outline: 'none' }}>
                                                                    <option value="" disabled selected>Select One</option>
                                                                    <option value="pre-seed">Pre-seed</option>
                                                                    <option value="seed">Seed</option>
                                                                    <option value="series-a">Series A</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <textarea placeholder="Message*" style={{ background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0, 0, 0, 0.1)', padding: '10px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#373434ff', outline: 'none', resize: 'none' }} />
                                                        <div style={{ position: 'absolute', bottom: '40px', right: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                            <div onClick={() => setShowCal(true)} style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '14px', color: '#8987ca', cursor: 'pointer', textDecoration: 'underline' }}>Schedule directly</div>
                                                            <ThreadButton extraPadding={1}>Submit</ThreadButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div className="fade-anim-mosaic" style={{
                                            flex: 1, width: '100%', position: 'relative', overflow: 'hidden',
                                            backgroundColor: '#1E06D5', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderRadius: '4px'
                                        }}>
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                backgroundImage: `url(${mainContentBg})`, backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                                                zIndex: 1, opacity: 1
                                            }} />
                                            {/* Top Left integrated Box */}
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, width: '42%', maxWidth: '560px',
                                                backgroundColor: '#FFFFFF', zIndex: 5, padding: '0 16px 16px 0', borderBottomRightRadius: '4px'
                                            }}>
                                                <h1 style={{
                                                    fontFamily: '"Rethink Sans", sans-serif', fontSize: '24px', letterSpacing: '-0.2px',
                                                    lineHeight: '30px', fontWeight: 460, color: '#373434ff', margin: '4px 0 0 2px', marginBottom: '44px'
                                                }}>
                                                    Design and Development shop<br />for startups and scaleups
                                                </h1>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                    <ThreadButton extraPadding={1} onClick={() => navigate('/get-in-touch')}>
                                                        Get in touch
                                                    </ThreadButton>
                                                </div>
                                            </div>
                                            {/* Bottom Right Box */}
                                            <div style={{
                                                position: 'absolute', right: 0, bottom: 0, width: '310px',
                                                backgroundColor: '#FFFFFF', zIndex: 5, padding: '16px 0 0 22px', borderTopLeftRadius: '4px'
                                            }}>
                                                <p style={{
                                                    margin: 0, fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: '14px', lineHeight: '20px', color: '#6e6e6eff', textAlign: 'justify'
                                                }}>
                                                    Partnering with forward-thinking founders and teams to craft meaningful digital experiences through strategy, brand identity, and high-performance product execution.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Who Are We Section */}
                {mode !== 'get-in-touch' && (
                    <div style={{ ...textStyle, height: `${BOX_NEW_HEIGHT}px`, marginBottom: '100px', pointerEvents: 'auto' }}>
                        {!hideContent && (
                            <div className="fade-anim-newbox" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{
                                    fontFamily: '"Rethink Sans", sans-serif',
                                    fontSize: '13px',
                                    color: '#8b8a8aff',
                                    textAlign: 'center',
                                    margin: '0 0 6px 0'
                                }}>
                                    who are we
                                </p>
                                <h2 style={{
                                    fontFamily: '"Rethink Sans", sans-serif',
                                    fontSize: '20px',
                                    fontWeight: 460,
                                    color: '#373434ff',
                                    textAlign: 'center',
                                    margin: 0
                                }}>
                                    A design native collective, with<br />
                                    curious and passionate builders. free from  <br />
                                    obsolete rituals, pushing beyound mediocrity.
                                </h2>
                            </div>
                        )}
                    </div>
                )}

                {/* Project Showcase Section */}
                {mode !== 'get-in-touch' && (
                    <div style={{ ...textStyle, height: 'auto', backgroundColor: '#FFFFFF', marginBottom: '120px', position: 'relative', pointerEvents: 'auto' }}>
                        {!hideContent && (
                            <div className="fade-anim-box3" style={{ width: '100%', position: 'relative' }}>
                                <ProjectShowcase />
                            </div>
                        )}
                    </div>
                )}

                <footer style={{
                    width: '100%',
                    height: 'calc(50vh + 40px)',
                    backgroundColor: '#1E06D5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <svg style={{ position: 'absolute', width: '100%', height: '1px', top: 0 }}>
                        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="#FFFFFF" strokeDasharray="4 4" strokeOpacity="0.2" />
                    </svg>
                    <h2 style={{
                        fontFamily: '"Cocosharp Trial", sans-serif',
                        fontSize: '112px',
                        fontWeight: 510,
                        color: '#FFFFFF',
                        margin: 0,
                        opacity: 0.9
                    }}>
                        your palett, our colours
                    </h2>
                </footer>


            </div>
        </>
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
                padding: `${7.5 + extraPadding}px ${34 + extraPadding}px`,
                border: '0.6px solid rgba(38, 38, 91, 0.1)',
                borderRadius: '4px',
                fontFamily: '"Rethink Sans", sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'transparent',
                boxShadow: hovered ? '0 2px 2px rgba(174, 174, 176, 0.1)' : 'none',
                transition: 'box-shadow 0.3s ease, padding-right 0.3s ease',
                paddingRight: hovered ? `${50 + extraPadding}px` : `${34 + extraPadding}px`
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
                    background: 'rgba(233, 233, 233, 1)',
                    borderRadius: '3px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
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
                    color: '#333333',
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

const Home = ({ hideContent = false, mode = 'full' }) => {
    return (
        <div className="home-wrapper" style={{ width: '100%', position: 'relative' }}>
            {/* Thread Grid with Physics */}
            <ThreadGrid hideContent={hideContent} mode={mode} />
        </div>
    );
};

export default Home;
