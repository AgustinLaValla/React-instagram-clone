import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import * as firebase from 'firebase/app';
import { likeSvg, unLikeSvg, commentSvg } from '../../utils/icons-data';

const PostDetailsIcons = ({viwerUser, currentPost, commentInputRef}) => {

    const [likeIcon, setLikeIcon] = useState(unLikeSvg);
    
    useEffect(() => {
        if (viwerUser) {
            if (currentPost && currentPost.likes.includes(viwerUser.uid)) {
                setLikeIcon(likeSvg);
            } else {
                setLikeIcon(unLikeSvg);
            }

        }
    }, [currentPost, viwerUser]);

    const handleLikeAction = async (postId) => {
        try {
            if (likeIcon.ariaLabel === unLikeSvg.ariaLabel) {
                await db.collection('posts').doc(postId).update({ likes: firebase.firestore.FieldValue.arrayUnion(viwerUser.uid) });
            } else {
                await db.collection('posts').doc(postId).update({ likes: firebase.firestore.FieldValue.arrayRemove(viwerUser.uid) });
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div id="icons-container">

            <div className="icon-container">
                <svg onClick={() => handleLikeAction(currentPost.id)} aria-label={likeIcon.ariaLabel} class="_8-yf5" fill={likeIcon.fill} height="25" viewBox="0 0 48 48" width="25"><path d={likeIcon.path} /></svg>
            </div>

            <div className="icon-container">
                <svg onClick={() => commentInputRef.current.focus()} aria-label={commentSvg.ariaLabel} class="_8-yf5" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d={commentSvg.path} fill-rule="evenodd" /></svg>
            </div>

        </div>
    )
}

export default PostDetailsIcons
