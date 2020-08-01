import React, { useEffect, useState, Fragment, useRef } from 'react'
import { Modal, makeStyles, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Typography } from '@material-ui/core';
import { db } from '../firebase';
import { profilePic, getTimeStamp } from '../utils/utils';
import * as moment from 'moment/moment';
import { likeSvg, unLikeSvg, commentSvg } from '../utils/icons-data';
import * as firebase from 'firebase/app';
import './PostDetails.css';

const modalStyles = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    gridTemplateColumns: '70% 30%',
    gridTemplateGap: '0'
};


const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: '70%',
        minHeight: '600px',
        maxHeight: '600px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: '0px',
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '20px',
        position: 'sticky'
    },
    listItemText: {
        fontWeight: '500',
        paddingRight: '10px'
    },
    divider: {
        height: '1px'
    },
    inline: {
        display: 'inline',
    }
}));




export const PostDetails = ({ open, handleClose, postId, viwerUser }) => {
    const classes = useStyles();

    const [currentPost, setCurrentPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeIcon, setLikeIcon] = useState(unLikeSvg);
    const [newComment, setNewComment] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const commentInputRef = useRef();


    const getUserProfilePic = async (userId) => {
        const user = await db.collection('users').doc(userId).get();
        return user.data().profilePic;
    }


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

    const follow = async () => {
        await db.collection('users').doc(currentUser.id).collection('followers').doc(viwerUser.uid).set({
            follower: viwerUser.uid
        });
        await db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).set({
            userFollowed: currentUser.id
        });
        setIsFollowing(true);
    }

    const unFollow = async () => {
        await db.collection('users').doc(currentUser.id).collection('followers').doc(viwerUser.uid).delete();
        await db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).delete();
        setIsFollowing(false);
    }

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts').doc(postId).onSnapshot((doc) => setCurrentPost({ ...doc.data(), id: doc.id }));
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [postId]);


    useEffect(() => {
        let unsubscribe;
        if (currentPost) {
            unsubscribe = db.collection('users').doc(currentPost.userId).onSnapshot((snap) => {
                setCurrentUser(snap.data());
            }, error => console.log(error));
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [currentPost])


    useEffect(() => {
        let unsubcribe;
        if (currentPost) {
            unsubcribe = db.collection('posts').doc(currentPost.id).collection('comments').orderBy('timestamp', 'asc').onSnapshot(docs => {
                setComments(docs.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });

        }
        return () => unsubcribe ? unsubcribe() : null;

    }, [currentPost])

    useEffect(() => {
        if (viwerUser) {
            if (currentPost && currentPost.likes.includes(viwerUser.uid)) {
                setLikeIcon(likeSvg);
            } else {
                setLikeIcon(unLikeSvg);
            }

        }
    }, [currentPost, viwerUser]);

    useEffect(() => {
        let unsubscribe;
        if (currentUser && viwerUser) {
            unsubscribe = db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).onSnapshot((doc) => {
                doc.exists ? setIsFollowing(true) : setIsFollowing(false);
            });
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [viwerUser, currentUser]);

    return (
        <Fragment>

            {currentPost &&
                <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    <div style={modalStyles} className={classes.paper}>


                        <div style={{ width: '100%', height: '100%' }}>
                            <img style={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '100%', minHeight: '100%' }} id="postDetails__image" src={currentPost.imageUrl} alt="" />
                        </div>

                        <div id="postDetails__dataContainer">

                            <ListItem alignItems="flex-start" className={classes.listItem}>
                                <ListItemAvatar>
                                    <Avatar alt={currentPost.username} src={currentUser ? currentUser.profilePic : profilePic}></Avatar>
                                </ListItemAvatar>

                                <span style={{ fontWeight: '500', fontSize: '14px' }}>{currentUser ? currentUser.username : null}</span>

                                <div style={{ display: 'inline-block', paddingLeft: '10px' }}>
                                    <span onClick={() => !isFollowing ? follow() : unFollow()} style={{ fontWeight: 'bold', fontSize: '15px', color: '#0095f6', cursor:'pointer' }}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </span>
                                </div>

                            </ListItem>
                            <Divider />

                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={currentPost.username} src={currentUser ? currentUser.profilePic : profilePic}></Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={currentPost.username}
                                    secondary={
                                        <Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >{currentPost.caption}
                                            </Typography>
                                            <br />
                                            {getTimeStamp(currentPost.timestamp.seconds)}
                                        </Fragment>
                                    }
                                >
                                </ListItemText>

                            </ListItem>



                            <List id="comment-list" className={classes.list}>

                                {comments.map(comment => (
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar src={async () => {return await getUserProfilePic(comment.userId)}}></Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={comment.username}
                                            secondary={
                                                <Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >{comment.text}
                                                    </Typography>
                                                    <br />
                                                    {comment && comment.timestamp ? getTimeStamp(comment.timestamp.seconds) : null}
                                                </Fragment>
                                            }
                                        >
                                        </ListItemText>

                                    </ListItem>
                                ))}

                            </List>

                            <div id="footer-container">

                                <div id="icons-container">

                                    <div className="icon-container">
                                        <svg onClick={() => handleLikeAction(currentPost.id)} aria-label={likeIcon.ariaLabel} class="_8-yf5" fill={likeIcon.fill} height="25" viewBox="0 0 48 48" width="25"><path d={likeIcon.path} /></svg>
                                    </div>

                                    <div className="icon-container">
                                        <svg onClick={() => commentInputRef.current.focus()} aria-label={commentSvg.ariaLabel} class="_8-yf5" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d={commentSvg.path} fill-rule="evenodd" /></svg>
                                    </div>

                                </div>

                                <div id="likes-container">
                                    <span id="likes">{currentPost.likes.length} likes</span>
                                </div>

                                <div id="date-container">
                                    <span id="date">{moment.unix(currentPost.timestamp.seconds).format('D MMMM').toString()}</span>
                                </div>

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
                            </div>
                        </div>

                    </div>
                </Modal>}
        </Fragment>
    )
}


