import React, { Fragment } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import './Post.css';


const PostContent = ({ classes, post, onClick }) => {
    return (
        <Fragment>
            <Tooltip classes={{ tooltip: classes.tooltip }} title="See picture and add a comment">
                <img onClick={onClick} className="post__image" src={post.imageUrl} alt="" />
            </Tooltip>

            <h4 className="post__text">
                <strong>{post.username} :</strong> {post.caption.length > 200 ? post.caption.slice(0, 200) + '...' : post.caption}
            </h4>
        </Fragment>
    )
}

export default PostContent
