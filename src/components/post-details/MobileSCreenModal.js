import React from 'react'
import Footer from './Footer';
import PostDetailsComments from './PostDetailsComments';
import PostDetailsHeader from './PostDetailsHeader'
import PostImage from './PostImage';

const MobileSCreenModal = ({ classes, currentPost, currentUser, viwerUser, postId }) => {
    return (
        <div className={`${classes.postDetails__paper} postDetails__container`}>
            <PostDetailsHeader
                classes={classes}
                username={currentPost.username}
                currentUser={currentUser}
                viwerUser={viwerUser}
            />
            <PostImage imageUrl={currentPost.imageUrl} />
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
        </div>
    )
}

export default MobileSCreenModal
