import React, { useEffect, useState, Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import PostImage from './PostImage';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsCaption from './PostDetailsCaption';
import PostDetailsComments from './PostDetailsComments';
import { db } from '../../firebase';
import { setStyles } from '../../material/uiStyles';
import './PostDetails.css';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({ ...setStyles(theme) }));

const PostDetails = ({ open, handleClose, postId, viwerUser }) => {

    const classes = useStyles();

    const [currentPost, setCurrentPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

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

    return (
        <Fragment>

            {
                currentPost &&
                
                <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    <div className={`${classes.postDetails__paper} postDetails__container`}>
                        <PostImage imageUrl={currentPost.imageUrl} />
                        <div id="postDetails__dataContainer">
                            <PostDetailsHeader
                                classes={classes}
                                username={currentPost.username}
                                currentUser={currentUser}
                                viwerUser={viwerUser}
                            />

                            <Divider />

                            <PostDetailsCaption
                                classes={classes}
                                currentUser={currentUser}
                                currentPost={currentPost}
                            />
                            <PostDetailsComments
                                classes={classes}
                                currentPost={currentPost}
                            />

                            <Footer
                                currentPost={currentPost}
                                viwerUser={viwerUser}
                                postId={postId}
                            />
                        </div>
                    </div>
                </Modal>
            }
        </Fragment>
    )
}


export default PostDetails;