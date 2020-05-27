import React from 'react';
import './wrapper-card.css'

const WrapperCard = ({children,header}) => {

    return (
        <div className="card wrapper-card">
            {(header) ? header : (<div className="mb-4"></div>)}
            <div className="wrapper-card-content">
                {children}
            </div>
        </div>)
}

export default WrapperCard