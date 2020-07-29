/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import { Tooltip, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { likeSvg, unLikeSvg, commentSvg } from '../utils/icons-data';
import { profilePic } from '../utils/utils';
import * as firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
    tooltip: {
        fontSize: '18px',
        padding: '10px'
    }
}))

export const Post = ({ post, user, handleOpenModal, handleOpenPostDetailsModal }) => {

    const classes = useStyles();
    const history = useHistory();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [likeIcon, setLikeIcon] = useState(unLikeSvg);
    const [profilePicUrl, setProfilePicUrl] = useState(profilePic);

    const addComment = async (ev) => {
        ev.preventDefault();
        await db.collection('posts').doc(post.id).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: user.uid
        });
        setComment('');
    }

    const handleLikeAction = async (postId) => {
        try {
            if (likeIcon.ariaLabel === unLikeSvg.ariaLabel) {
                await db.collection('posts').doc(postId).update({ likes: firebase.firestore.FieldValue.arrayUnion(user.uid) });
            } else {
                await db.collection('posts').doc(postId).update({ likes: firebase.firestore.FieldValue.arrayRemove(user.uid) });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user && post.likes.includes(user.uid)) {
            setLikeIcon(likeSvg);
        } else {
            setLikeIcon(unLikeSvg);
        }
    }, [post.likes, user])

    useEffect(() => {
        let unsubscribe;
        if (post) {
            unsubscribe = db.collection('posts').doc(post.id).collection('comments').orderBy('timestamp', 'asc').onSnapshot((snap) => {
                setComments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });
        }

        return () => unsubscribe();

    }, [post]);

    useEffect(() => {
        db.collection('users').doc(post.userId).get().then(doc => {
            setProfilePicUrl(doc.data().profilePic);
        });
    }, [post.userId]);


    return (
        <div className="post">
            <Tooltip classes={{ tooltip: classes.tooltip }} title="View profile">
                <div className="post__header" onClick={() => !user ? handleOpenModal() : history.push(`profile/${post.userId}/${user.uid}`)}>
                    <Avatar
                        className="post__avatar"
                        alt='Agustín'
                        src={profilePicUrl !== profilePic ? profilePicUrl : 'static/images/avatar/1.jpg'}
                    />
                    <h3>{post.username}</h3>
                </div>
            </Tooltip>

            <Tooltip classes={{ tooltip: classes.tooltip }} title="See picture and add a comment">
                <img onClick={() => user ? handleOpenPostDetailsModal(post.id) : handleOpenModal()} className="post__image" src={post.imageUrl} alt="" />
            </Tooltip>

            <h4 className="post__text">
                <strong>{post.username} :</strong> {post.caption}
            </h4>

            <div className="post__iconContainer">
                <svg onClick={() => user ? handleLikeAction(post.id) : handleOpenModal()} aria-label={likeIcon.ariaLabel} className="_8-yf5" fill={likeIcon.fill} height="35" viewBox="0 0 48 48" width="35"><path d={likeIcon.path} /></svg>
            </div>

            <div className="post__iconContainer">
                <svg onClick={() => user ? handleOpenPostDetailsModal(post.id) : handleOpenModal()} aria-label={commentSvg.ariaLabel} className="_8-yf5" fill="#262626" height="35" viewBox="0 0 48 48" width="35"><path clip-rule="evenodd" d={commentSvg.path} fill-rule="evenodd" /></svg>
            </div>

            <div id="comments-box" style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                {comments.map(comment => (
                    <p key={comment.id} className="post__comment">
                        <b>{comment.username}:</b> {comment.text}
                    </p>
                ))}
            </div>


            {user &&
                <div>
                    <form className="post__commentBox">
                        <input type="text"
                            className="post__input"
                            placeholder="Add comment..."
                            value={comment}
                            onChange={ev => setComment(ev.target.value)}
                        />
                        <button disabled={!comment} className="post__button" type="submit" onClick={addComment}>Post</button>
                    </form>
                </div>
            }
        </div>
    )
}
