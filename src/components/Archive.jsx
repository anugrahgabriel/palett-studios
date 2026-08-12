import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { projects } from './projectsData';

const Archive = () => {
    const scrollerRef = useRef(null);
    const location = useLocation();
    const [isNavInFooter, setIsNavInFooter] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selected, setSelected] = useState(location.state?.selected ?? null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const handleScroll = () => {
            const footer = scroller.querySelector('footer');
            if (footer) {
                const isSmallLaptop = windowWidth < 1700;
                const triggerPoint = isSmallLaptop ? 60 : scroller.offsetHeight * 0.5;
                setIsNavInFooter(footer.offsetTop - scroller.scrollTop <= triggerPoint);
            }
        };

        scroller.addEventListener('scroll', handleScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', handleScroll);
    }, [windowWidth]);

    const isSmallLaptop = windowWidth < 1700;

    const selectedProject = projects.find(p => p.title === selected) || null;
    const innerImages = selectedProject
        ? [selectedProject.cover, ...selectedProject.slides].filter(Boolean)
        : [];

    const tileStyle = (image, size) => ({
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#F0F0F0',
        borderRadius: '2px',
        ...(image && {
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: size || 'cover'
        })
    });

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
            <Helmet>
                <title>Archive | Palett</title>
                <meta name="description" content="Selected work from Palett — product design, development and branding projects." />
            </Helmet>

            <SiteNav isNavInFooter={isNavInFooter} isSmallLaptop={isSmallLaptop} activeItem="Archive" />

            <div ref={scrollerRef} className="main-scroller" style={{ width: '100%', height: '100vh', background: '#FFFFFF', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
                <main style={{ width: '100%', padding: '32px', boxSizing: 'border-box' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '24px'
                    }}>
                        {/* Left: project list */}
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                            gap: '4px'
                        }}>
                            {projects.map((project, pi) => (
                                <div
                                    key={pi}
                                    onClick={() => setSelected(project.title)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        backgroundColor: selected === project.title ? '#F3F3F3' : '#FBFBFB',
                                        padding: '9px 12px',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.25s ease'
                                    }}
                                >
                                    <div style={{
                                        fontFamily: '"Share Tech Mono", monospace',
                                        fontSize: '12px',
                                        color: '#888888',
                                        fontWeight: 400,
                                        letterSpacing: '-0.3px'
                                    }}>
                                        [{pi + 1}]
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
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
                                            marginTop: '4px',
                                            marginBottom: 0,
                                            lineHeight: 1.4,
                                            letterSpacing: '-0.1px'
                                        }}>
                                            {project.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: overview grid, or the selected project's inner grid */}
                        <div style={{ width: '70%' }}>
                            {selectedProject ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <span
                                        onClick={() => setSelected(null)}
                                        style={{
                                            fontFamily: '"Rethink Sans", sans-serif',
                                            fontSize: '13px',
                                            color: '#888888',
                                            cursor: 'pointer',
                                            alignSelf: 'flex-start'
                                        }}
                                    >
                                        ← All projects
                                    </span>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '20px'
                                    }}>
                                        {(innerImages.length > 0 ? innerImages : [null, null, null]).map((img, i) => (
                                            <div key={i} style={tileStyle(img)} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '20px'
                                }}>
                                    {projects.map((project, pi) => (
                                        <div
                                            key={pi}
                                            onClick={() => setSelected(project.title)}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={tileStyle(project.cover, project.coverSize)} />
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
                            )}
                        </div>
                    </div>
                </main>

                <SiteFooter />
            </div>
        </div>
    );
};

export default Archive;
