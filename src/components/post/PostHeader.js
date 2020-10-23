import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import { useProfilePic } from './hooks/useProfilePic';
import './Post.css';

const PostHeader = ({ post, onClick, classes }) => {

    const profilePicUrl = useProfilePic(post)
    
    return (
        <Tooltip classes={{ tooltip: classes.tooltip }} title="View profile">
            <div className="post__header" onClick={onClick}>
                <Avatar
                    className="post__avatar"
                    alt='Agustín'
                    src={profilePicUrl}
                />
                <h3>{post.username}</h3>
            </div>
        </Tooltip>
    )
}

export default PostHeader
