import React, { useRef } from 'react';
import PostDetailsForm from './PostDetailsForm';
import * as moment from 'moment';
import PostDetailsIcons from './PostDetailsIcons';


const Footer = ({ viwerUser, currentPost, postId }) => {

    const commentInputRef = useRef();

    return (
        <div id="footer-container">

            <PostDetailsIcons
                commentInputRef={commentInputRef}
                currentPost={currentPost}
                viwerUser={viwerUser}
            />

            <div id="likes-container">
                <span id="likes">{currentPost.likes.length} likes</span>
            </div>

            <div id="date-container">
                <span id="date">{moment.unix(currentPost.timestamp.seconds).format('D MMMM').toString()}</span>
            </div>

            <PostDetailsForm
                commentInputRef={commentInputRef}
                postId={postId}
                viwerUser={viwerUser}
            />
        </div>
    )
}

export default Footer;
