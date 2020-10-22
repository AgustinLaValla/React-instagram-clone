import React from 'react';
import './Post.css';

const PostComments = ({comments}) => {
    return (
        <div id="comments-box" style={{ maxHeight: '100px', overflowY: 'scroll' }}>
            {comments.map(comment => (
                <p key={comment.id} className="post__comment">
                    <b>{comment.username}:</b> {comment.text}
                </p>
            ))}
        </div>
    )
}

export default PostComments
