import React from 'react';

const SiteFooter = () => (
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
            <h2 style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '102px', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.5px', color: '#FFFFFF', margin: 0, opacity: 0.9 }}>your palett, our colours</h2>
            <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '11px', fontWeight: 400, color: '#FFFFFF', opacity: 0.3, letterSpacing: '0.05em', marginBottom: '14px', whiteSpace: 'nowrap' }}>©2024 Palett. ALL RIGHTS RESERVED.</span>
        </div>
    </footer>
);

export default SiteFooter;
