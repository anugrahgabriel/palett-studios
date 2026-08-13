import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Cal, { getCalApi } from "@calcom/embed-react";
import ThreadButton from './ThreadButton';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';

const GetInTouch = () => {
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
                setTimeout(() => {
                    alert('Thank you! Your message has been sent.');
                }, 1000);
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

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
            <Helmet>
                <title>Palett | Get in Touch</title>
                <meta name="description" content="Start a project with Palett. Send us a message or schedule a call to build exceptional digital experiences." />
            </Helmet>

            {/* Global Navbar */}
            <SiteNav isNavInFooter={isNavInFooter} isSmallLaptop={isSmallLaptop} activeItem="Contact" />

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
                                            status={submitStatus === 'success' ? 'success' : (isSubmitting ? 'submitting' : 'idle')}
                                            disabled={isSubmitting || submitStatus === 'success'}
                                        >
                                            {isSubmitting ? 'Sending...' : (submitStatus === 'success' ? 'Sent' : 'Submit')}
                                        </ThreadButton>
                                    </div>
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

export default GetInTouch;
