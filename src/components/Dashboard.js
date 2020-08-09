import React, { useState, useEffect, useContext } from 'react';
import { Post } from './Post';
import { SignupModal } from './SignupModal';
import { db } from '../firebase';
import './Dashboard.css'
import { AuthContext } from '../App';
import { PostDetails } from './PostDetails';
import InfiniteScroll from 'react-infinite-scroll-component';

export const Dashboard = () => {

    const [posts, setPosts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openPostDetailsModal, setOpenPostDetailsModal] = useState(false);
    const [postId, setPostId] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPostsLength, setCurrentPostLength] = useState(0);
    const [postQueryLimit, setPostQueryLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const { userState, auth } = useContext(AuthContext);


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
        if (currentPostsLength < totalPosts) {
            setPostQueryLimit(postQueryLimit + 10);
            setHasMore(true);
        }

    }

    useEffect(() => {
        const unsubscribe = db.collection('posts').orderBy('timestamp', 'desc').limit(postQueryLimit).onSnapshot((docs) => {
            setCurrentPostLength(docs.docs.length);
            setPosts(docs.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        });
        return () => unsubscribe();
    }, [postQueryLimit]);

    useEffect(() => {
        const unsubscribe = db.collection('posts-counter').doc('-- post counter --').onSnapshot(snap => {
            if (snap.exists) {
                setTotalPosts(snap.data().totalPosts);
            }
        });

        return () => unsubscribe();

    }, []);


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
                dataLength={currentPostsLength}
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
            <PostDetails open={openPostDetailsModal} handleClose={handleClose} postId={postId} viwerUser={userState} />

        </div>
    )
}
