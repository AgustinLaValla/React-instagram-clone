import React, { useState, useEffect } from 'react';
import Post from '../post/Post';
import SignupModal from '../signup/SignupModal';
import PostDetails from '../post-details/PostDetails';
import { useAuthStateProvider } from '../../App';
import { useGetPosts } from './hooks/useGetPosts';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Dashboard.css'
import { usePostsCounter } from './hooks/usePostsCounter';
import { useResizeListener } from '../../utils/hooks';

const Dashboard = () => {

    const [openModal, setOpenModal] = useState(false);
    const [openPostDetailsModal, setOpenPostDetailsModal] = useState(false);
    const [postId, setPostId] = useState(null);

    const [postQueryLimit, setPostQueryLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const breakPostModal = useResizeListener();

    const posts = useGetPosts(postQueryLimit);
    const totalPosts = usePostsCounter();

    const { userState, auth } = useAuthStateProvider();


    const handleOpenModal = () => !userState ? setOpenModal(true) : setOpenModal(false);

    const handleOpenPostDetailsModal = (id) => {
        if (userState) {
            setPostId(id);
            setOpenPostDetailsModal(true);
        } else {
            setOpenPostDetailsModal(false);
            setOpenModal(true);
            setPostId(null);
        }
    }
    const handleClose = () => openModal ? setOpenModal(false) : setOpenPostDetailsModal(false);

    const getCollectionAfterScroll = async () => {
        if (postQueryLimit < totalPosts) {
            setPostQueryLimit(postQueryLimit + 10);
            setHasMore(true);
        }

    }


    useEffect(() => {
        const loginTimeout = setTimeout(() => {
            if (!userState) {
                setOpenModal(true);
            }
        }, 2500);

        if (userState) {
            clearTimeout(loginTimeout);
        }

        return () => clearTimeout(loginTimeout);

    }, [userState])

    return (
        <div className="dashboard">
            {/* Modal */}
            <SignupModal open={openModal} handleClose={handleClose} setOpenModal={setOpenModal} auth={auth} />

            {/* Posts */}
            <InfiniteScroll
                dataLength={postQueryLimit}
                next={getCollectionAfterScroll}
                hasMore={hasMore}
            >
                <div className="dashboard__posts">

                    {posts.map(post =>
                        <Post id="dashboard__post" key={post.id} {...{
                            user: userState,
                            post: post,
                            handleOpenModal,
                            handleOpenPostDetailsModal
                        }} />)
                    }

                </div>
            </InfiniteScroll>

            {/* Post Modal */}
            <PostDetails
                open={openPostDetailsModal}
                handleClose={handleClose}
                postId={postId}
                viwerUser={userState}
                breakPostModal={breakPostModal}
            />

        </div>
    )
}


export default Dashboard;