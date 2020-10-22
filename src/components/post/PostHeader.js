import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

import { db } from '../../firebase';
import { profilePic } from '../../utils/utils';
import './Post.css';



const PostHeader = ({ post, onClick, classes }) => {

    const [profilePicUrl, setProfilePicUrl] = useState(profilePic);

    useEffect(() => {
        if (post && post.userId) {
            db.collection('users').doc(post.userId).get().then(doc => {
                setProfilePicUrl(doc.data().profilePic);
            });

        }
        return () => {}
    }, [post]);
    return (
        <Tooltip classes={{ tooltip: classes.tooltip }} title="View profile">
            <div className="post__header" onClick={onClick}>
                <Avatar
                    className="post__avatar"
                    alt='Agustín'
                    src={profilePicUrl !== profilePic ? profilePicUrl : 'static/images/avatar/1.jpg'}
                />
                <h3>{post.username}</h3>
            </div>
        </Tooltip>
    )
}

export default PostHeader
