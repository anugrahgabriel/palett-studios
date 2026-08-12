import React, { useRef, useState, useEffect } from 'react';
import { getCalApi } from "@calcom/embed-react";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import ThreadButton from './ThreadButton';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';

gsap.registerPlugin(ScrollTrigger);
import './Home.css';

const leftPageImg = "";
const rightPageImg = "";
import slide5 from '../../pics/clients/quotient/5-slide.webp';
import slide6 from '../../pics/clients/quotient/6-slide.webp';
import slide10 from '../../pics/clients/runable/10-slide.webp';
import slide11 from '../../pics/clients/runable/11-slide.webp';
import grayforgeImg from '../../pics/clients/grayforge/grayforge-new.webp';
import pennywiseImg from '../../pics/clients/pennywise/BG.jpg';
import client1 from '../../pics/client 1.png';
import mainContentBg from '../../pics/main-content-bg.webp';

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

const ProjectShowcase = () => {
    const projects = [
        {
            title: 'Pennywise',
            desc: 'Mobile design and branding for an Indian consumer intelligence fintech',
            tags: ['Fintech'],
            cover: pennywiseImg,
            coverSize: '630px auto',
            slides: [],
            link: ''
        },
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

    return (
        <div style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            padding: '12px',
            backgroundColor: '#FBFBFB',
            borderRadius: '6px',
            pointerEvents: 'auto'
        }}>
            {projects.map((project, pi) => (
                <div
                    key={pi}
                    onClick={() => project.link && window.open(project.link, '_blank')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        cursor: project.link ? 'pointer' : 'default'
                    }}
                >
                    <div style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        backgroundColor: '#F0F0F0',
                        borderRadius: '2px',
                        ...(project.cover && {
                            backgroundImage: `url(${project.cover})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: project.coverSize || 'auto'
                        })
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3 style={{
                            fontFamily: '"Cocosharp Trial", sans-serif',
                            fontSize: '14px',
                            fontWeight: 510,
                            color: '#3E3E3E',
                            margin: 0
                        }}>
                            {project.title}
                        </h3>
                        <p style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '13px',
                            color: '#666666',
                            margin: 0,
                            lineHeight: 1.4,
                            letterSpacing: '-0.1px'
                        }}>
                            {project.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
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

    return (
        <>
            {isIntroActive && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <h1 className="intro-logo" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '22px', fontWeight: 400, color: '#373434', letterSpacing: '-0.2px' }}>Palett</h1>
                </div>
            )}
            <SiteNav isNavInFooter={isNavInFooter} isSmallLaptop={isSmallLaptop} delayed={isNavDelayed} className="fixed-nav-content" />
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
                <SiteFooter />
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
