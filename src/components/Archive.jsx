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
                <title>Palett | Archive</title>
                <meta name="description" content="Selected work from Palett — product design, development and branding projects." />
            </Helmet>

            <SiteNav isNavInFooter={isNavInFooter} isSmallLaptop={isSmallLaptop} activeItem="Archive" />

            <div ref={scrollerRef} className="main-scroller" style={{ width: '100%', height: '100vh', background: '#FFFFFF', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
                <main style={{ width: '100%', minHeight: '100vh', padding: isSmallLaptop ? '60px 32px 240px' : '32px 32px 240px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '24px',
                        flex: 1
                    }}>
                        {/* Left: project list */}
                        <div className="no-scrollbar" style={{
                            width: 'calc((100% - 1176px) / 2 - 24px)',
                            marginLeft: '-2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                            maxHeight: 'calc(50vh - 72px)',
                            overflowY: 'auto',
                            gap: '4px'
                        }}>
                            {projects.map((project, pi) => (
                                <div
                                    key={pi}
                                    onClick={() => setSelected(project.title)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        gap: '12px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        padding: '9px 12px 9px 0',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <h3 style={{
                                        fontFamily: '"Cocosharp Trial", sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 510,
                                        color: selected === project.title ? '#5240F0' : '#3E3E3E',
                                        margin: 0,
                                        transition: 'color 0.25s ease'
                                    }}>
                                        {project.title}
                                    </h3>
                                    <div style={{
                                        fontFamily: '"Share Tech Mono", monospace',
                                        fontSize: '12px',
                                        color: selected === project.title ? '#5240F0' : '#888888',
                                        fontWeight: 400,
                                        letterSpacing: '-0.3px',
                                        transition: 'color 0.25s ease'
                                    }}>
                                        {project.year}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: overview grid, or the selected project's inner grid.
                            Fixed at 1176px so the tiles match the home grid's width and position.
                            Scrolls within itself; the page takes over once it's exhausted. */}
                        <div className="no-scrollbar" style={{ width: '1176px', flexShrink: 0, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                            {selectedProject ? (
                                selectedProject.rows ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {selectedProject.rows.map((row, ri) => row.type === 'text' ? (
                                            <div key={ri} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 2fr',
                                                gap: '20px',
                                                alignItems: 'start',
                                                padding: '18px 0 38px'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '14px', lineHeight: 1.5, color: '#3E3E3E', letterSpacing: '-0.1px' }}>
                                                        {selectedProject.title}
                                                    </span>
                                                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '14px', lineHeight: 1.5, color: '#888888', letterSpacing: '-0.1px' }}>
                                                        Client: {selectedProject.client || selectedProject.title}, {selectedProject.year}
                                                    </span>
                                                </div>
                                                <p style={{
                                                    fontFamily: '"Inter", sans-serif',
                                                    fontSize: '14px',
                                                    color: '#3E3E3E',
                                                    margin: 0,
                                                    lineHeight: 1.5,
                                                    letterSpacing: '-0.1px',
                                                    maxWidth: '720px'
                                                }}>
                                                    {row.desc || selectedProject.desc}
                                                </p>
                                            </div>
                                        ) : row.type === 'video' ? (
                                            <video key={ri} src={row.src} autoPlay muted loop playsInline style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                                borderRadius: '2px'
                                            }} />
                                        ) : (
                                            <div key={ri} style={{
                                                display: 'grid',
                                                gridTemplateColumns: `repeat(${row.images.length}, 1fr)`,
                                                gap: '10px'
                                            }}>
                                                {row.images.map((img, i) => (
                                                    <div key={i} style={{ overflow: 'hidden', borderRadius: '2px' }}>
                                                        <img src={img} alt={selectedProject.title} style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            display: 'block',
                                                            transform: row.zoom ? `scale(${row.zoom})` : 'none',
                                                            transformOrigin: 'center',
                                                            marginTop: row.trimY ? `-${row.trimY / 2}px` : 0,
                                                            marginBottom: row.trimY ? `-${row.trimY / 2}px` : 0
                                                        }} />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '20px'
                                    }}>
                                        {(innerImages.length > 0 ? innerImages : [null, null, null]).map((img, i) => (
                                            <div key={i} style={tileStyle(img)} />
                                        ))}
                                    </div>
                                )
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
