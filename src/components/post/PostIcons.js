import React, { Fragment } from 'react';
import {  commentSvg } from '../../utils/icons-data';

const PostIcons = ({handleLike, handleOpenDetails, likeIcon}) => {
    return (
        <Fragment>
            <div className="post__iconContainer">
                <svg onClick={handleLike} aria-label={likeIcon.ariaLabel} className="_8-yf5" fill={likeIcon.fill} height="35" viewBox="0 0 48 48" width="35"><path d={likeIcon.path} /></svg>
            </div>

            <div className="post__iconContainer">
                <svg onClick={handleOpenDetails} aria-label={commentSvg.ariaLabel} className="_8-yf5" fill="#262626" height="35" viewBox="0 0 48 48" width="35"><path clip-rule="evenodd" d={commentSvg.path} fill-rule="evenodd" /></svg>
            </div>
        </Fragment>
    )
}

export default PostIcons
