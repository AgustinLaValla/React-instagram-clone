/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { likeSvg, unLikeSvg } from '../../utils/icons-data';
import { setStyles } from '../../material/uiStyles';
import PostHeader from './PostHeader';
import * as firebase from 'firebase/app';
import PostContent from './PostContent';
import PostIcons from './PostIcons';
import PostComments from './PostComments';
import PostForm from './PostForm';
import { usePostComments } from '../../utils/hooks';
import './Post.css';

const useStyles = makeStyles((theme) => ({ ...setStyles(theme) }));

const Post = ({ post, user, handleOpenModal, handleOpenPostDetailsModal }) => {

    const classes = useStyles();
    const history = useHistory();

    const comments = usePostComments(post)
    const [comment, setComment] = useState('');
    const [likeIcon, setLikeIcon] = useState(unLikeSvg);


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
        if (user && post && post.likes && post.likes.includes(user.uid)) {
            setLikeIcon(likeSvg);
        } else {
            setLikeIcon(unLikeSvg);
        }
    }, [post, user])


    return (
        <div className="post">
            <PostHeader
                classes={classes}
                post={post}
                onClick={() => !user ? handleOpenModal() : history.push(`profile/${post.userId}/${user.uid}`)}
            />
            <PostContent
                classes={classes}
                onClick={() => user ? handleOpenPostDetailsModal(post.id) : handleOpenModal()}
                post={post}
            />
            <PostIcons
                handleLike={() => user ? handleLikeAction(post.id) : handleOpenModal()}
                handleOpenDetails={() => user ? handleOpenPostDetailsModal(post.id) : handleOpenModal()}
                likeIcon={likeIcon}
            />
            <PostComments comments={comments} />
            <PostForm
                user={user}
                addComment={addComment}
                comment={comment}
                onChange={ev => setComment(ev.target.value)}
            />
        </div>
    )
}


export default Post;