import React from 'react';
import { Link } from 'react-router-dom';
import { homeSvg } from '../../utils/icons-data';
import './Header.css';

const HomeIcon = () => {
    return (
        <Link to='/'>
            <div className="header__iconContainer">
                <svg className="header__icon _8-yf5" aria-label="Inicio" fill="#262626" height="22" viewBox="0 0 48 48" width="22">
                    <path d={homeSvg.path} />
                </svg>
            </div>
        </Link>
    )
}

export default HomeIcon
