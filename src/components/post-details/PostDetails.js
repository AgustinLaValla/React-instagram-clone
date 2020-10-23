import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PostImage from './PostImage';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsComments from './PostDetailsComments';
import Box from '@material-ui/core/Box';
import { setStyles } from '../../material/uiStyles';
import './PostDetails.css';
import Footer from './Footer';
import { useCurrentPost } from './hooks/useCurrentPost';
import { useCurrentUser } from './hooks/useCurrentUser';
import { LargeScreenModal } from './LargeScreenModal';
import MobileSCreenModal from './MobileSCreenModal';


const useStyles = makeStyles((theme) => ({ ...setStyles(theme) }));

const PostDetails = ({ open, handleClose, postId, viwerUser, breakPostModal }) => {

    const classes = useStyles();

    const currentPost = useCurrentPost(postId);
    const currentUser = useCurrentUser(currentPost);

    return (
        <Fragment>

            {
                currentPost &&

                <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    {
                        !breakPostModal 
                        ?
                        <LargeScreenModal {
                            ...{
                                classes,
                                currentPost,
                                currentUser,
                                viwerUser,
                                postId
                            }
                        } />
                        :
                        <MobileSCreenModal {
                            ...{
                                classes,
                                currentPost,
                                currentUser,
                                viwerUser,
                                postId
                            }
                        } 
                        />
                    }
                </Modal>
            }
        </Fragment>
    )
}


export default PostDetails;