import React from 'react';
import {FFmodalAction } from '../../utils/utils';
import { closeSVG } from '../../utils/icons-data';
import './FollowingFollowersModal.css';

const Header = ({action, handleClose}) => {
    return (
        <div className="FollowingFollowers__modalHeader">
            <span className="FollowingFollowers__modalTitle">
                {action === FFmodalAction.SHOW_FOLLOWERS ? 'Followers' : 'Following'}
            </span>
            <div className="FollowingFollowers__timerBox">
                <svg onClick={handleClose}
                    aria-label="Cerrar"
                    class="_8-yf5"
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                    style={{ cursor: 'pointer' }}
                >
                    <path clip-rule="evenodd" d={closeSVG.path} fill-rule="evenodd" />
                </svg>
            </div>
        </div>
    )
}

export default Header
