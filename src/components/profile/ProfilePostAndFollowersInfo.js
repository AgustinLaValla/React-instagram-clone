import React from 'react';
import { FFmodalAction } from '../../utils/utils';

const ProfilePostAndFollowersInfo = ({showFollowers, postsLength, following, followers}) => {
    return (
        <div className="profile__postAndFollowersInfoContainer">
            <ul className="profile__postAndFollowersInfoList">
                <li className="profile__postAndFollowersInfoItem" style={{ cursor: 'default !important' }}><strong>{postsLength} </strong>Posts</li>
                <li onClick={() => showFollowers(FFmodalAction.SHOW_FOLLOWERS)} className="profile__postAndFollowersInfoItem"><strong>{followers.length} </strong>Followers</li>
                <li onClick={() => showFollowers(FFmodalAction.SHOW_FOLLOWING)} className="profile__postAndFollowersInfoItem"><strong>{following.length} </strong>Following</li>
            </ul>
        </div>
    )
}

export default ProfilePostAndFollowersInfo
