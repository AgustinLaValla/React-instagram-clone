import React, { useState, useEffect } from 'react';
import Post from '../post/Post';
import SignupModal from '../signup/SignupModal';
import  PostDetails  from '../post-details/PostDetails';
import { db } from '../../firebase';
import { useAuthStateProvider } from '../../App';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Dashboard.css'

const Dashboard = () => {

    const [posts, setPosts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openPostDetailsModal, setOpenPostDetailsModal] = useState(false);
    const [postId, setPostId] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const [postQueryLimit, setPostQueryLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

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
        const unsubscribe = db.collection('posts')
            .orderBy('timestamp', 'desc')
            .limit(postQueryLimit)
            .onSnapshot((docs) => {
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
            <PostDetails open={openPostDetailsModal} handleClose={handleClose} postId={postId} viwerUser={userState} />

        </div>
    )
}


export default Dashboard;