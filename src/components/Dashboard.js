import React, { useState, useEffect, useContext } from 'react';
import { Post } from './Post';
import { SignupModal } from './SignupModal';
import { db } from '../firebase';

import './Dashboard.css'
import { AuthContext } from '../App';
import { PostDetails } from './PostDetails';

export const Dashboard = () => {

    const [posts, setPosts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openPostDetailsModal, setOpenPostDetailsModal] = useState(false);
    const [postId, setPostId] = useState(null);

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



    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((docs) => {
            const postsArray = [];
            docs.docs.map(doc => postsArray.push({ ...doc.data(), id: doc.id }));
            setPosts(postsArray);
        });
    }, []);

    useEffect(() => {
        const loginTimeout = setTimeout(() => {
            if (!userState) {
                setOpenModal(true);
            }
        }, 2500);

        if(userState) {
            clearTimeout(loginTimeout);
        }

        return () => clearTimeout(loginTimeout);

    }, [userState])

    return (
        <div className="dashboard">
            {/* Modal */}
            <SignupModal open={openModal} handleClose={handleClose} setOpenModal={setOpenModal} auth={auth} />

            {/* Posts */}
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

            {/* Post Modal */}
            <PostDetails open={openPostDetailsModal} handleClose={handleClose} postId={postId} viwerUser={userState} />

        </div>
    )
}
