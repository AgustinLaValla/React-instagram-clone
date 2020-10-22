import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../../firebase';


const PostDetailsForm = ({viwerUser, postId, commentInputRef}) => {

    const [newComment, setNewComment] = useState('');

    const addComment = async (ev) => {
        if (newComment === '') return;
        ev.preventDefault();
        await db.collection('posts').doc(postId).collection('comments').add({
            text: newComment,
            username: viwerUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: viwerUser.uid
        });
        setNewComment('');
    }
    
    return (
        <div id="comment-input-container">
            <form onSubmit={addComment}>
                <input ref={commentInputRef}
                    id="comment-input"
                    type="text"
                    placeholder="Add a comment..."
                    name="newComment"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                />
                <button type="submit" id="comment-btn" disabled={newComment === ''}>Submit</button>
            </form>
        </div>
    )
}

export default PostDetailsForm;
