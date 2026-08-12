import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

export const LiveIST = ({ color = "#8b8a8a" }) => {
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

export const MenuIcon = ({ color = "#373434", onClick }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={onClick}>
        <path d="M8 6V18M12 6V18M16 6V18" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const NAV_ITEMS = ['Work', 'About', 'Contact', 'Join us'];

// activeItem: on inner pages the active item stays at full opacity and the rest dim;
// without it (Home), all items are full opacity and dim on hover.
const SiteNav = ({ isNavInFooter, isSmallLaptop, activeItem = null, delayed = false, className }) => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const navBoxStyle = {
        position: 'fixed', top: isSmallLaptop ? '0' : '50%', left: 0, width: '100%', height: isSmallLaptop ? '60px' : '80px',
        padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'transparent', zIndex: 10, transform: isSmallLaptop ? 'none' : 'translateY(-50%)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'none', borderBottom: 'none'
    };

    const itemOpacity = (item) => {
        if (activeItem) return item === activeItem || hoveredItem === item ? 1.0 : 0.4;
        return hoveredItem === item ? 0.4 : 1.0;
    };

    return (
        <div style={{ ...navBoxStyle, opacity: delayed ? 0 : 1 }} className={className}>
            <div style={{ display: 'flex', flexDirection: isSmallLaptop ? 'column' : 'row', alignItems: isSmallLaptop ? 'flex-start' : 'baseline', minWidth: '160px', gap: isSmallLaptop ? '2px' : '8px', pointerEvents: 'auto' }}>
                <Link to="/" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '20px', fontWeight: 400, color: isNavInFooter ? '#FFFFFF' : '#373434', textDecoration: 'none', transition: 'color 0.4s ease' }}>Palett</Link>
                {!isSmallLaptop && <LiveIST color={isNavInFooter ? '#FFFFFF' : '#8b8a8a'} />}
            </div>
            <div style={{ flex: 1 }}></div>
            <div style={{ display: 'flex', flexDirection: isSmallLaptop ? 'column' : 'row', alignItems: isSmallLaptop ? 'flex-end' : 'baseline', gap: isSmallLaptop ? '8px' : '18px', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                {isSmallLaptop ? <MenuIcon color={isNavInFooter ? '#FFFFFF' : '#373434'} /> : NAV_ITEMS.map((item) => (
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
                            opacity: itemOpacity(item),
                            transition: 'color 0.4s ease, opacity 0.3s ease'
                        }}
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SiteNav;
