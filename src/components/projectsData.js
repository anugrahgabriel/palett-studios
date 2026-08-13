import slide5 from '../../pics/clients/quotient/5-slide.webp';
import slide6 from '../../pics/clients/quotient/6-slide.webp';
import slide10 from '../../pics/clients/runable/10-slide.webp';
import slide11 from '../../pics/clients/runable/11-slide.webp';
import grayforgeImg from '../../pics/clients/grayforge/grayforge-new.webp';
import pennywiseImg from '../../pics/clients/pennywise/BG.jpg';
import pennywiseBrand1 from '../../pics/clients/pennywise/Brand 01.png';
import pennywiseBrand2 from '../../pics/clients/pennywise/Brand 02.png';
import pennywiseBrand3 from '../../pics/clients/pennywise/Brand 03.png';
import pennywiseBrand4Video from '../../pics/clients/pennywise/Brand 04.mp4';
import pennywiseBrand5 from '../../pics/clients/pennywise/Brand 05.png';
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
        link: '',
        rows: [
            { type: 'images', images: [pennywiseImg] },
            { type: 'text' },
            { type: 'images', images: [pennywiseBrand1] },
            { type: 'video', src: pennywiseBrand4Video },
            { type: 'images', images: [pennywiseBrand5] },
            { type: 'images', images: [pennywiseBrand3], trimY: 12, offsetY: 20 },
            { type: 'images', images: [pennywiseBrand2], zoom: 1.25 }
        ]
    },
    {
        title: 'Runable',
        desc: "Product design for India's leading general AI platform",
        tags: ['Software Product'],
        year: '2026',
        cover: runableImg,
        coverSize: 'auto 100%',
        slides: [slide10, slide11],
        link: 'https://runable.com/',
        rows: [
            { type: 'images', images: [runableImg] },
            { type: 'text' },
            { type: 'images', images: [slide10, slide11] }
        ]
    },
    {
        title: 'GrayForge',
        desc: 'Website design, development and branding for a well based marketing agency',
        tags: ['Agency'],
        year: '2025',
        slides: [grayforgeImg],
        link: 'https://grayforge.vercel.app/',
        rows: [
            { type: 'images', images: [grayforgeImg] },
            { type: 'text' }
        ]
    },
    {
        title: 'Quotient',
        desc: 'Product design and development for an AI marketing platform',
        tags: ['Software Product'],
        year: '2025',
        slides: [slide5, slide6],
        link: 'https://www.getquotient.ai/',
        rows: [
            { type: 'images', images: [slide5, slide6] },
            { type: 'text' }
        ]
    }
];
