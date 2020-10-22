import React from 'react';
import { Link } from 'react-router-dom';
import { picSvg } from '../../utils/icons-data';
import './Header.css';

const PostIcon = ({ onClick }) =>

    <Link to='/'>
        <div className="header__iconContainer">
            <svg onClick={onClick} className="header__icon" id="svg-i" fill="#262626" height="22" viewBox="0 0 48 48" width="22">
                <path d={picSvg.path} />
            </svg>
        </div>
    </Link>



export default PostIcon;
