import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Cal, { getCalApi } from "@calcom/embed-react";
import ThreadButton from './ThreadButton';

const RollingDigit = ({ value }) => {
    const [current, setCurrent] = useState(value);
    const [next, setNext] = useState(value);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        if (value !== current) {
            setNext(value);
            setRolling(true);
            const timer = setTimeout(() => {
                setCurrent(value);
                setRolling(false);
            }, 280);
            return () => clearTimeout(timer);
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
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: color,
            lineHeight: 1
        }}>
            <RollingDigit value={time.hh[0]} />
            <RollingDigit value={time.hh[1]} />
            <span style={{ opacity: 0.7 }}>:</span>
            <RollingDigit value={time.mm[0]} />
            <RollingDigit value={time.mm[1]} />
            <span style={{ opacity: 0.7 }}>:</span>
            <RollingDigit value={time.ss[0]} />
            <RollingDigit value={time.ss[1]} />
            <span style={{ marginLeft: '4px', letterSpacing: '0px', opacity: 0.8 }}>IST</span>
        </span>
    );
};

const MenuIcon = ({ color = "#373434", onClick }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={onClick}>
        <path d="M8 6V18M12 6V18M16 6V18" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const GetInTouch = () => {
    const navigate = useNavigate();
    const scrollerRef = useRef(null);
    const [showCal, setShowCal] = useState(false);
    const [isNavInFooter, setIsNavInFooter] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in Name, Email and Message.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', company: '', message: '' });
                alert('Thank you! Your message has been sent.');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            alert('Something went wrong. Please try again or email us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
    const PAGE_WIDTH = 1200;
    const [hoveredItem, setHoveredItem] = useState(null);

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
        zIndex: 10,
        transform: isSmallLaptop ? 'none' : 'translateY(-50%)',
        transition: 'all 0.4s ease',
        background: 'transparent'
    };

    const menuItems = ['Work', 'About', 'Contact', 'Join us'];

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
            <Helmet>
                <title>Get in Touch | Palett</title>
                <meta name="description" content="Start a project with Palett. Send us a message or schedule a call to build exceptional digital experiences." />
            </Helmet>

            {/* Global Navbar */}
            <div style={navBoxStyle}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <Link to="/" style={{ fontFamily: '"Cocosharp Trial", sans-serif', fontSize: '20px', fontWeight: 510, color: isNavInFooter ? '#FFFFFF' : '#373434', textDecoration: 'none', transition: 'color 0.4s ease' }}>
                        Palett
                    </Link>
                    {!isSmallLaptop && <LiveIST color={isNavInFooter ? '#FFFFFF' : '#8b8a8a'} />}
                </div>
                <div style={{ display: 'flex', gap: '18px' }}>
                    {isSmallLaptop ? (
                        <MenuIcon color={isNavInFooter ? '#FFFFFF' : '#373434'} onClick={() => { }} />
                    ) : (
                        menuItems.map((item) => {
                            const isContact = item === 'Contact';
                            // In non-home pages, selected menu (Contact) is 1.0, others are 0.4 (hover to 1.0)
                            const opacity = isContact || hoveredItem === item ? 1.0 : 0.4;
                            
                            return (
                                <Link 
                                    key={item} 
                                    to={isContact ? '/get-in-touch' : `/${item.toLowerCase().replace(' ', '-')}`} 
                                    onMouseEnter={() => setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{
                                        fontFamily: '"Rethink Sans", sans-serif',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        color: isNavInFooter ? '#FFFFFF' : '#2d2d2d',
                                        textDecoration: 'none',
                                        opacity: opacity,
                                        transition: 'color 0.4s ease, opacity 0.3s ease'
                                    }}
                                >
                                    {item}
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Custom Scroller to match Home */}
            <div ref={scrollerRef} className="main-scroller" style={{ width: '100%', height: '100vh', background: '#FFFFFF', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
                <main style={{ maxWidth: PAGE_WIDTH, margin: '0 auto', paddingTop: '160px', paddingBottom: '240px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '0 32px' }}>
                        <h1 style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '22px', fontWeight: 460, color: '#373434ff', margin: '4px 0 20px 0', paddingLeft: '2px' }}>
                            Wondering where to begin? Say hi
                        </h1>

                        {/* THE DIV WITH FIXED HEIGHT TO PREVENT GROWTH */}
                        <div style={{
                            backgroundColor: '#FBFBFB',
                            padding: '60px 40px 0px 40px',
                            borderRadius: '4px',
                            position: 'relative',
                            height: '440px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden' // PREVENT CONTAINER GROWTH
                        }}>
                            {showCal ? (
                                <Cal calLink="palett/30min" style={{ width: "100%", height: "400px", overflow: 'scroll' }} config={{ layout: 'month_view' }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', width: '100%', flex: 1, position: 'relative' }}>
                                    <style>
                                        {`
                                            input::placeholder, textarea::placeholder {
                                                opacity: 0.3 !important;
                                                color: #373434 !important;
                                            }
                                            textarea::-webkit-scrollbar {
                                                display: none;
                                            }
                                        `}
                                    </style>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: isSmallLaptop ? '30px' : '60px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff', letterSpacing: '0.01em' }}>Name</label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Your name" 
                                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0,0,0,0.1)', padding: '12px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '16px', color: '#373434ff', outline: 'none' }} 
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff', letterSpacing: '0.01em' }}>Email</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="hi@gmail.com" 
                                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0,0,0,0.1)', padding: '12px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '16px', color: '#373434ff', outline: 'none' }} 
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff', letterSpacing: '0.01em' }}>Company name</label>
                                            <input 
                                                type="text" 
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                placeholder="Organization" 
                                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '0.8px solid rgba(0,0,0,0.1)', padding: '12px 0', fontFamily: '"Rethink Sans", sans-serif', fontSize: '16px', color: '#373434ff', outline: 'none' }} 
                                            />
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gap: '40px',
                                        paddingRight: '360px'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontFamily: '"Rethink Sans", sans-serif', fontSize: '13px', color: '#8b8a8aff', letterSpacing: '0.01em' }}>Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Tell us about the project and make it a good one!"
                                                rows={1}
                                                onInput={(e) => {
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                style={{
                                                    width: '100%',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    borderBottom: '0.8px solid rgba(0,0,0,0.1)',
                                                    padding: '12px 0',
                                                    fontFamily: '"Rethink Sans", sans-serif',
                                                    fontSize: '16px',
                                                    color: '#373434ff',
                                                    outline: 'none',
                                                    resize: 'none',
                                                    overflowY: 'auto',
                                                    scrollbarWidth: 'none',
                                                    msOverflowStyle: 'none',
                                                    minHeight: '44px',
                                                    maxHeight: '170px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: '-40px',
                                        width: '360px',
                                        height: '201px',
                                        backgroundColor: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        padding: '24px',
                                        borderTopLeftRadius: '4px',
                                        border: 'none',
                                        zIndex: 10
                                    }}>
                                        <ThreadButton 
                                            extraPadding={0} 
                                            extraWidth={20} 
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Submit'}
                                        </ThreadButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <footer style={{
                    width: '100%',
                    height: 'calc(50vh + 40px)',
                    backgroundColor: '#1E06D5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    padding: '36px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '16px',
                        marginBottom: '32px',
                        pointerEvents: 'auto',
                        paddingRight: '0px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
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
        </div>
    );
};

export default GetInTouch;
