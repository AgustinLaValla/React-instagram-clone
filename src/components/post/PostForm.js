import React from 'react'
import './Post.css';

const PostForm = ({ user, comment, addComment, onChange }) => {
    return user && (
        <div>
            <form className="post__commentBox">
                <input type="text"
                    className="post__input"
                    placeholder="Add comment..."
                    value={comment}
                    onChange={onChange}
                />
                <button disabled={!comment} className="post__button" type="submit" onClick={addComment}>Post</button>
            </form>
        </div>
    )
}

export default PostForm
