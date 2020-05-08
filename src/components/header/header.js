import React from 'react';
import {Link} from 'react-router-dom'
import './header.css'
const Header = () => {

    return (
        <div className="header d-flex">
            <h1>
                <Link to="/">Web Storage</Link>
            </h1>
            <h4>Done by Medvediev Michael and TUHICH</h4>
        
        </div>
    )
}

export default Header