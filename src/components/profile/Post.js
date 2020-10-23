import React from 'react'

const Post = ({ post, openPost }) => {
    return (
        <div className="pic__container" onClick={openPost}>
            <img className="profile__pic" src={post.imageUrl} alt={post.username} />
            <div className="icons__container">
                <div className="icon">
                    <i className="material-icons">favorite</i>
                    <span>{post.likes.length}</span>
                </div>
                <div className="icon">
                    <i className="material-icons">mode_comment</i>
                    <span>{post.comments.length}</span>
                </div>
            </div>
        </div>
    )
}

export default Post
