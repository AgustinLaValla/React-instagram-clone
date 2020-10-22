import React from 'react';
import './PostDetails.css';

const PostImage = ({imageUrl}) => {
    return (
        <div className="postDetails__imageContainer">
            <img className="postDetails__image" id="postDetails__image" src={imageUrl} alt="" />
        </div>
    )
}

export default PostImage
