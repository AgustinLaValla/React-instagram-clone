/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../../firebase'
import makeStyles from '@material-ui/core/styles/makeStyles';
import PostDetails from '../post-details/PostDetails';
import  FollowingFollowersModal  from '../following-followers-modal/FollowingFollowersModal';
import { FFmodalAction } from '../../utils/utils';
import { EditProfileModal } from './EditProfileModal';
import { setStyles } from '../../material/uiStyles';
import ProfileHeader from './ProfileHeader';
import { useAuthStateProvider } from '../../App';
import './Profile.css'
import Posts from './Posts';


const useStyles = makeStyles((theme) => ({ ...setStyles(theme) }));



export const Profile = () => {
    const classes = useStyles();
    const { id, viwerId } = useParams();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [followersData, setFollowersData] = useState([]);
    const [usersFollowedList, setUsersFollowedList] = useState([]);
    const [openPostDetails, setOpenPostDetails] = useState(false);
    const [postDetailsId, setPostDetailsId] = useState(null);
    const [openFollowingFollowersModal, setOpenFollowingFollowersModal] = useState(false);
    const [followingFollowerModalAction, setFollowingFollowerModalAction] = useState(FFmodalAction.SHOW_FOLLOWERS);
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
    const [userListLength, setUserListLength] = useState(0);
    const [userQueryLimit, setUserQueryLimit] = useState(10);
    const [currentUserListLength, setCurrentUserListLength] = useState(0);

    const { userState } = useAuthStateProvider();


    const handleOpenModal = (postId) => {
        setPostDetailsId(postId);
        setOpenPostDetails(true);
    }
    const handleCloseModal = () => {
        setPostDetailsId(null);
        setOpenPostDetails(false);
        setUserQueryLimit(10);
    };



    const scrolling = () => {
        if (currentUserListLength < userListLength) {
            setUserQueryLimit(userQueryLimit + 10);
        }
    }

    useEffect(() => {

        const unsubscribe = db.collection('users').doc(id).onSnapshot((snap) => {
            setUserData(snap.data());
        });

        return () => unsubscribe();

    }, [id]);

    useEffect(() => {
        const unsubscribe = db.collection('posts').where('userId', '==', id).orderBy('timestamp', 'desc').onSnapshot(snap => {
            setPosts(snap.docs.map(doc => ({ ...doc.data(), postId: doc.id })));
        });

        return () => unsubscribe ? unsubscribe() : null;

    }, [id]);


    useEffect(() => {
        const unsubscribe = db.collection('users').doc(id).collection('followers').onSnapshot(snap => {
            setFollowers(snap.docs.map(doc => doc.data().follower));
        });
        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(id).collection('following').onSnapshot(snap => {
            setFollowing(snap.docs.map(doc => doc.data().userFollowed));
        });
        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        let unsubscribe;
        if (followers.length > 0) {
            unsubscribe = db.collection('users').where('id', 'in', followers).limit(userQueryLimit).onSnapshot(snap => {
                setFollowersData(snap.docs.map(doc => doc.data()));
                if (followingFollowerModalAction === FFmodalAction.SHOW_FOLLOWERS) {
                    setCurrentUserListLength(snap.docs.length)
                }
            })
        }
        return () => unsubscribe ? unsubscribe() : null;
    }, [followers, userQueryLimit]);

    useEffect(() => {
        let unsubscribe;
        if (following.length > 0) {
            unsubscribe = db.collection('users').where('id', 'in', following).limit(userQueryLimit).onSnapshot(snap => {
                setUsersFollowedList(snap.docs.map(doc => doc.data()));
                if (followingFollowerModalAction === FFmodalAction.SHOW_FOLLOWING) {
                    setCurrentUserListLength(snap.docs.length)
                }
            })
        }
        return () => unsubscribe ? unsubscribe() : null;
    }, [following, userQueryLimit]);

    useEffect(() => console.table([{ userListLength, currentUserListLength, userQueryLimit }]), [userListLength, currentUserListLength, userQueryLimit])

    return (
        <div className="profile__container">
            {userData &&
                <Fragment>
                    <ProfileHeader
                        classes={classes}
                        setUserListLength={setUserListLength}
                        setFollowingFollowerModalAction={setFollowingFollowerModalAction}
                        setOpenFollowingFollowersModal={setOpenFollowingFollowersModal}
                        setOpenEditProfileModal={setOpenEditProfileModal}
                        id={id}
                        viwerId={viwerId}
                        userData={userData}
                        following={following}
                        followers={followers}
                        postsLength={posts.length}
                    />

                    <Posts posts={posts} handleOpenModal={handleOpenModal} />

                </Fragment>
            }

            {/* Post Details Modal */}
            <PostDetails open={openPostDetails} handleClose={handleCloseModal} postId={postDetailsId} viwerUser={userState} />

            {/* Following - Followers Modal */}

            <FollowingFollowersModal
                open={openFollowingFollowersModal}
                handleClose={() => setOpenFollowingFollowersModal(false)}
                data={followingFollowerModalAction === FFmodalAction.SHOW_FOLLOWERS ? followersData : usersFollowedList}
                viwerId={viwerId}
                userSpiedId={id}
                action={followingFollowerModalAction}
                listLength={userListLength}
                onscroll={scrolling}
            />


            {/* Edit Profile Modal */}
            <EditProfileModal
                open={openEditProfileModal}
                handleClose={() => setOpenEditProfileModal(false)}
                userData={userData}
            />
        </div>
    )
}
