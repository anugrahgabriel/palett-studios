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
        </div>
    );
};

export default Book;
