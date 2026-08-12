import slide5 from '../../pics/clients/quotient/5-slide.webp';
import slide6 from '../../pics/clients/quotient/6-slide.webp';
import slide10 from '../../pics/clients/runable/10-slide.webp';
import slide11 from '../../pics/clients/runable/11-slide.webp';
import grayforgeImg from '../../pics/clients/grayforge/grayforge-new.webp';
import pennywiseImg from '../../pics/clients/pennywise/BG.jpg';
import runableImg from '../../pics/clients/runable/bg.jpg';

// Ordered newest to oldest.
export const projects = [
    {
        title: 'Pennywise',
        desc: 'Mobile design and branding for an Indian consumer intelligence fintech',
        tags: ['Fintech'],
        year: '2026',
        cover: pennywiseImg,
        coverSize: 'auto 100%',
        slides: [],
        link: ''
    },
    {
        title: 'Runable',
        desc: "Product design for India's leading general AI platform",
        tags: ['Software Product'],
        year: '2026',
        cover: runableImg,
        coverSize: 'auto 100%',
        slides: [slide10, slide11],
        link: 'https://runable.com/'
    },
    {
        title: 'GrayForge',
        desc: 'Website design, development and branding for a well based marketing agency',
        tags: ['Agency'],
        year: '2025',
        slides: [grayforgeImg],
        link: 'https://grayforge.vercel.app/'
    },
    {
        title: 'Quotient',
        desc: 'Product design and development for an AI marketing platform',
        tags: ['Software Product'],
        year: '2025',
        slides: [slide5, slide6],
        link: 'https://www.getquotient.ai/'
    }
];
