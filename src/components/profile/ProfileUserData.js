import React from 'react';
import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useState } from 'react';

export const ProfileUserData = ({ id, viwerId, username, onFollowBtnClick, onEditBtnClick, followBtnText, classes }) => {
    const [innerWidth, setInnerWidth] = useState();

    const onResize = (ev) => setInnerWidth(ev.target.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
    return (

        <div className="profile__userInfo">
            <h2 className="profile__username">{username}</h2>
            {
                id !== viwerId
                    ?
                    <Button className="profile__followBtn" variant="outlined" onClick={onFollowBtnClick} >
                        {followBtnText}
                    </Button>
                    :
                    <Button variant="outlined" onClick={onEditBtnClick} size={innerWidth > 800 ? 'medium' : 'small'} className="profile__editBtn">
                        Edit Profile
                    </Button>
            }
        </div>

    );
}
