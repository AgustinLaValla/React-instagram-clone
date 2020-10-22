import React from 'react'

const Posts = ({ posts, handleOpenModal }) => {
    return (
        <main className="profile__picsContainer">
            {posts.map(post =>
                <div key={post.postId} className="pic__container" onClick={() => handleOpenModal(post.postId)}>
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
        </main>
    )
}

export default Posts
