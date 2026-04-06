import React, { useRef, useState, useEffect } from 'react';
import { getCalApi } from "@calcom/embed-react";
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import ThreadButton from './ThreadButton';

gsap.registerPlugin(ScrollTrigger);
import './Home.css';

const leftPageImg = "";
const rightPageImg = "";
import slide5 from '../../pics/5-slide.webp';
import slide6 from '../../pics/6-slide.webp';
import slide10 from '../../pics/10-slide.webp';
import slide11 from '../../pics/11-slide.webp';
import grayforgeImg from '../../pics/grayforge-new.webp';
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

const LiveButton = ({ style = {} }) => (
    <div style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '7px 14px',
        borderRadius: '2px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: '"Rethink Sans", sans-serif',
        fontSize: '11px',
        height: '28px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        ...style
    }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-45deg)' }}>
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ marginTop: '0px' }}>LIVE</span>
    </div>
);

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
            duration: slides.length * 40,
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
            height: height,
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '2px',
            pointerEvents: 'auto'
        }}>
            <div ref={scrollRef} style={{
                display: 'flex',
                gap: '20px',
                height: '100%',
                width: 'max-content',
                pointerEvents: 'auto'
            }}>
                {[...slides, ...slides].map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        onLoad={() => setImagesLoaded(prev => prev + 1)}
                        style={{
                            height: '100%',
                            width: 'auto',
                            objectFit: 'contain',
                            borderRadius: '2px',
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
            slides: [grayforgeImg],
            link: 'https://grayforge.vercel.app/'
        },
        {
            title: 'Quotient',
            desc: 'Product design and development for an AI marketing platform',
            tags: ['Software Product'],
            slides: [slide5, slide6],
            link: 'https://www.getquotient.ai/'
        },
        {
            title: 'Runable',
            desc: "Product design for India's leading general AI platform",
            tags: ['Software Product'],
            slides: [slide10, slide11],
            link: 'https://runable.com/'
        }
    ];

    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '12px',
            backgroundColor: '#FBFBFB',
            borderRadius: '6px',
            pointerEvents: 'auto'
        }}>
            {projects.map((project, pi) => (
                <div
                    key={pi}
                    onMouseEnter={() => setHoveredIdx(pi)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => window.open(project.link, '_blank')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '40px',
                        width: '100%',
                        position: 'relative',
                        cursor: 'pointer',
                        backgroundColor: '#FBFBFB',
                        padding: '12px',
                        borderRadius: '4px'
                    }}
                >
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
                            color: '#888888',
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
                                color: '#1A1A1A',
                                margin: 0,
                                letterSpacing: '-0.1px',
                                position: 'relative',
                                zIndex: 5
                            }}>
                                {project.title}
                            </h3>
                            <p style={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '13px',
                                color: '#666666',
                                marginTop: '4px',
                                marginBottom: '14px',
                                lineHeight: 1.4,
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
                                opacity: hoveredIdx === pi ? 1 : 0,
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
                                        color: '#373434',
                                        backgroundColor: '#EAEAEA',
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

                    <div style={{ width: '70%', paddingTop: '0px', position: 'relative' }}>
                        {project.slides.length > 1 ? (
                            <ProjectImageStrip
                                slides={project.slides}
                                height={pi === 1 ? '456px' : '480px'}
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
                        <LiveButton style={{
                            position: 'absolute',
                            bottom: '24px',
                            right: '24px',
                            zIndex: 10
                        }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

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

const ThreadGrid = ({ hideContent = false }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [isIntroActive, setIsIntroActive] = useState(() => !sessionStorage.getItem('palettIntroPlayed'));
    const [isNavDelayed, setIsNavDelayed] = useState(() => !sessionStorage.getItem('palettIntroPlayed'));
    const [isNavInFooter, setIsNavInFooter] = useState(false);
    const [isSmallLaptop, setIsSmallLaptop] = useState(window.innerWidth < 1700);

    useEffect(() => {
        const handleResize = () => setIsSmallLaptop(window.innerWidth < 1700);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useGSAP(() => {
        const contentSelectors = [".fixed-nav-content", ".fade-anim-box2", ".fade-anim-mosaic", ".fade-anim-newbox", ".fade-anim-box3"];
        if (!isIntroActive) {
            gsap.set(contentSelectors, { opacity: 1, visibility: 'visible' });
            return;
        }
        const tl = gsap.timeline();
        const introLogo = document.querySelector(".intro-logo");
        if (introLogo) {
            tl.fromTo(introLogo, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.inOut" })
                .to(introLogo, { opacity: 0.1, duration: 0.05 })
                .to(introLogo, { opacity: 0.7, duration: 0.04 })
                .to(introLogo, { opacity: 0.4, duration: 0.06 })
                .to(introLogo, { opacity: 0.9, duration: 0.04 })
                .to(introLogo, { opacity: 0.2, duration: 0.05, repeat: 10, yoyo: true, ease: "none" })
                .to(introLogo, { opacity: 0, duration: 0.8, ease: "power2.inOut", onComplete: () => { setIsIntroActive(false); sessionStorage.setItem('palettIntroPlayed', 'true'); } }, "+=0.2");
        }
        const contentElements = contentSelectors.map(sel => document.querySelector(sel)).filter(Boolean);
        tl.fromTo(contentElements, { opacity: 0 }, { opacity: 1, duration: 1.8, stagger: 0.25, ease: "power2.inOut", onStart: () => setIsNavDelayed(false) }, "-=1.4s");
    }, { dependencies: [isIntroActive], scope: containerRef });

    useEffect(() => {
        const scroller = containerRef.current;
        if (!scroller) return;
        const handleScroll = () => {
            const footer = scroller.querySelector('footer');
            if (footer) {
                const triggerPoint = isSmallLaptop ? 60 : scroller.offsetHeight * 0.5;
                setIsNavInFooter(footer.offsetTop - scroller.scrollTop <= triggerPoint);
            }
        };
        scroller.addEventListener('scroll', handleScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', handleScroll);
    }, [isSmallLaptop]);

    const textStyle = { width: '1200px', margin: '0 auto', pointerEvents: 'none' };
    const navBoxStyle = {
        position: 'fixed', top: isSmallLaptop ? '0' : '50%', left: 0, width: '100%', height: isSmallLaptop ? '60px' : '80px',
        padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'transparent', zIndex: 10, transform: isSmallLaptop ? 'none' : 'translateY(-50%)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'none', borderBottom: 'none'
    };

    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <>
            {isIntroActive && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <h1 className="intro-logo" style={{ fontFamily: '"Cocosharp Trial", sans-serif', fontSize: '22px', fontWeight: 510, color: '#373434', letterSpacing: '-0.2px' }}>Palett</h1>
                </div>
            )}
            <div style={{ ...navBoxStyle, opacity: isNavDelayed ? 0 : 1 }} className="fixed-nav-content">
                <div style={{ display: 'flex', flexDirection: isSmallLaptop ? 'column' : 'row', alignItems: isSmallLaptop ? 'flex-start' : 'baseline', minWidth: '160px', gap: isSmallLaptop ? '2px' : '8px', pointerEvents: 'auto' }}>
                    <Link to="/" style={{ fontFamily: '"Cocosharp Trial", sans-serif', fontSize: '20px', fontWeight: 510, color: isNavInFooter ? '#FFFFFF' : '#373434', textDecoration: 'none', transition: 'color 0.4s ease' }}>Palett</Link>
                    {!isSmallLaptop && <LiveIST color={isNavInFooter ? '#FFFFFF' : '#8b8a8a'} />}
                </div>
                <div style={{ flex: 1 }}></div>
                <div style={{ display: 'flex', flexDirection: isSmallLaptop ? 'column' : 'row', alignItems: isSmallLaptop ? 'flex-end' : 'baseline', gap: isSmallLaptop ? '8px' : '18px', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                    {isSmallLaptop ? <MenuIcon color={isNavInFooter ? '#FFFFFF' : '#373434'} /> : ['Work', 'About', 'Contact', 'Join us'].map((item) => (
                        <Link 
                            key={item} 
                            to={item === 'Contact' ? '/get-in-touch' : `/${item.toLowerCase().replace(' ', '-')}`} 
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{ 
                                fontFamily: '"Rethink Sans", sans-serif', 
                                fontSize: '15px', 
                                fontWeight: 500, 
                                color: isNavInFooter ? '#FFFFFF' : '#2d2d2d', 
                                textDecoration: 'none', 
                                opacity: hoveredItem === item ? 0.4 : 1.0, // On Home, hover triggers lower opacity
                                transition: 'color 0.4s ease, opacity 0.3s ease' 
                            }}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
            <div ref={containerRef} className="main-scroller" style={{ width: '100%', height: '100vh', background: '#FFFFFF', position: 'relative', overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
                <div style={{ ...textStyle, height: '810px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 'calc(50vh - 405px)', marginBottom: '100px', pointerEvents: 'auto' }}>
                    <Helmet>
                        <title>Palett — Design & Development Collective</title>
                        <meta name="description" content="Founded in 2025, Palett is a creative design and development collective radically obsessed with high-fidelity execution." />
                    </Helmet>
                    {!hideContent && (
                        <div className="fade-anim-box2" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                <div className="fade-anim-mosaic" style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#1E06D5', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderRadius: '4px' }}>
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mainContentBg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', zIndex: 1, opacity: 1 }} />
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '42%', maxWidth: '560px', backgroundColor: '#FFFFFF', zIndex: 5, padding: '0 16px 16px 0', borderBottomRightRadius: '4px' }}>
                                        <h1 style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '24px', letterSpacing: '-0.2px', lineHeight: '30px', fontWeight: 460, color: '#373434ff', margin: '4px 0 0 2px', marginBottom: '44px' }}>Design and Development shop<br />for startups and scaleups</h1>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                            <ThreadButton onClick={() => navigate('/get-in-touch')}>Get in touch</ThreadButton>
                                        </div>
                                    </div>
                                    <div style={{ position: 'absolute', right: 0, bottom: 0, width: '310px', backgroundColor: '#FFFFFF', zIndex: 5, padding: '16px 0 0 22px', borderTopLeftRadius: '4px' }}>
                                        <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', lineHeight: '20px', color: '#6e6e6eff', textAlign: 'justify' }}>Partnering with forward-thinking founders and teams to craft meaningful digital experiences through strategy, brand identity, and high-performance product execution.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ ...textStyle, height: '500px', marginBottom: '100px', pointerEvents: 'auto' }}>
                    {!hideContent && (
                        <div className="fade-anim-newbox" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff', textAlign: 'center', margin: '0 0 6px 0' }}>who are we</p>
                            <h2 style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '20px', fontWeight: 460, color: '#373434ff', textAlign: 'center', margin: 0 }}>A design native collective, with<br />curious and passionate builders. free from<br />obsolete rituals, pushing beyound mediocrity.</h2>
                        </div>
                    )}
                </div>
                <div style={{ ...textStyle, height: 'auto', backgroundColor: '#FFFFFF', marginBottom: '120px', position: 'relative', pointerEvents: 'auto' }}>
                    {!hideContent && (
                        <div className="fade-anim-box3" style={{ width: '100%', position: 'relative' }}>
                            <ProjectShowcase />
                        </div>
                    )}
                </div>
                <footer style={{ width: '100%', height: 'calc(50vh + 40px)', backgroundColor: '#1E06D5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '36px', paddingLeft: '32px', paddingRight: '32px', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px', marginBottom: '32px', pointerEvents: 'auto', paddingRight: '0px', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', transform: 'translateY(-2px)' }}>
                            <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2V9zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="white" /></svg>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'opacity 0.2s', marginTop: '1px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c2.717 0 3.056.01 4.122.058 1.066.048 1.794.218 2.43.465a4.902 4.902 0 0 1 1.766 1.148 4.902 4.902 0 0 1 1.148 1.766c.247.636.417 1.364.465 2.43.048 1.066.058 1.405.058 4.122s-.01 3.056-.058 4.122c-.048 1.066-.217 1.794-.465 2.43a4.902 4.902 0 0 1-1.148 1.766 4.902 4.902 0 0 1-1.766 1.148c-.636.247-1.364.417-2.43.465-1.066.048-1.405.058-4.122.058s-3.056-.01-4.122-.058c-1.066-.048-1.794-.217-2.43-.465a4.902 4.902 0 0 1-1.766-1.148 4.902 4.902 0 0 1-1.148-1.766c-.247-.636-.417-1.364-.465-2.43C2.01 15.056 2 14.717 2 12s.01-3.056.058-4.122c.048-1.066.218-1.794.465-2.43a4.902 4.902 0 0 1 1.148-1.766 4.902 4.902 0 0 1 1.766-1.148c.636-.247 1.364-.417 2.43-.465C8.944 2.01 9.283 2 12 2zm0 4.882a5.118 5.118 0 1 0 0 10.236 5.118 5.118 0 0 0 0-10.236zm0 8.468a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7zm5.338-9.07a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" fill="white" /></svg>
                            </a>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'right' }}>
                            <span style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#FFFFFF', opacity: 0.4 }}>Say hi — </span>
                            <a href="mailto:anugrah@palettstudios.com" style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '15px', color: '#FFFFFF', textDecoration: 'underline', opacity: 0.9, transition: 'opacity 0.2s', fontWeight: 500 }}>anugrah@palettstudios.com</a>
                        </div>
                    </div>
                    <div style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
                        <h2 style={{ fontFamily: '"Cocosharp Trial", sans-serif', fontSize: '112px', fontWeight: 510, lineHeight: 1.1, color: '#FFFFFF', margin: 0, opacity: 0.9 }}>your palett, our colours</h2>
                        <span style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '11px', color: '#FFFFFF', opacity: 0.3, letterSpacing: '0.05em', marginBottom: '14px', whiteSpace: 'nowrap' }}>©2024 <span style={{ fontFamily: '"Cocosharp Trial", sans-serif', fontWeight: 510 }}>Palett</span>. ALL RIGHTS RESERVED.</span>
                    </div>
                </footer>
            </div>
        </>
    );
};

const Home = ({ hideContent = false }) => {
    return (
        <div className="home-wrapper" style={{ width: '100%', position: 'relative' }}>
            {/* Thread Grid with Physics */}
            <ThreadGrid hideContent={hideContent} />
        </div>
    );
};

export default Home;
