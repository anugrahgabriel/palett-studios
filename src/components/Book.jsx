import React from 'react';
import './Book.css';
import leftPageImg from '../assets/page_left.jpg';

const Book = () => {
    return (
        <div className="book-container">
            <div className="book">
                <div className="spine-center"></div>

                <div className="page left no-padding">
                    <img src={leftPageImg} alt="Left Page" className="page-image" />
                </div>

                <div className="page right">
                    <div className="page-content">
                        {/* Content for right page */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;
