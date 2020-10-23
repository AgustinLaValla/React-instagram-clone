import React from 'react'
import Post from './Post'

const Posts = ({ posts, handleOpenModal }) => {
    return (
        <main className="profile__picsContainer">
            {
                posts.map(post =>
                    <Post
                        key={post.id}
                        post={post}
                        openPost={() => handleOpenModal(post.postId)}
                    />
                )
            }
        </main>
    )
}

export default Posts;
