import { Box } from '@material-ui/core';
import React from 'react';
import Footer from './Footer';
import PostDetailsComments from './PostDetailsComments';
import PostDetailsHeader from './PostDetailsHeader';
import PostImage from './PostImage';


export const LargeScreenModal = ({classes, currentPost, currentUser, viwerUser, postId}) => {
    return (
        <div className={`${classes.postDetails__paper} postDetails__container`}>
            <PostImage imageUrl={currentPost.imageUrl} />

            <Box id="postDetails__dataContainer">
                <PostDetailsHeader
                    classes={classes}
                    username={currentPost.username}
                    currentUser={currentUser}
                    viwerUser={viwerUser}

                />


                <PostDetailsComments
                    classes={classes}
                    currentPost={currentPost}
                    currentUser={currentUser}
                />

                <Footer
                    currentPost={currentPost}
                    viwerUser={viwerUser}
                    postId={postId}
                />
            </Box>
        </div>
    )
}
