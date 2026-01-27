import React from 'react';
import './Book.css';
import leftPageImg from '../assets/page_left.jpg';
import rightPageImg from '../assets/page_right.jpg';

const Book = () => {
    return (
        <div className="book-container">
            <div className="book">
                <div className="spine-center"></div>

                <div className="page left no-padding">
                    <img src={leftPageImg} alt="Left Page" className="page-image" />
                </div>

                <div className="page right no-padding">
                    <img src={rightPageImg} alt="Right Page" className="page-image" />
                </div>
            </div>

            {/* New section to the right of the book */}
            <div className="book-controls">
                <div className="controls-header">
                    <span className="text-header">What you get when you work with us:</span>
                </div>
                <div className="controls-list">
                    <span className="text-list-item">Faster time-to-market with clean, dev-ready design files.</span>
                    <span className="text-list-item">Higher conversions from UX that speaks to real user needs.</span>
                    <span className="text-list-item">Better retention through interfaces users actually enjoy.</span>
                    <span className="text-list-item">A product that feels premium, and performs like it too.</span>
                    <span className="text-list-item">Fewer revisions, smarter decisions, and design that just works.</span>
                </div>
            </div>
        </div>
    );
};

export default Book;
