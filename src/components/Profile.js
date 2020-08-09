/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { db, storage } from '../firebase'
import { Button, Tooltip, makeStyles } from '@material-ui/core';
import './Profile.css'
import { PostDetails } from './PostDetails';
import { AuthContext } from '../App';
import { FollowingFollowersModal } from './FollowingFollowersModal';
import { FFmodalAction } from '../utils/utils';
import { EditProfileModal } from './EditProfileModal';
import InfiniteScroll from 'react-infinite-scroll-component';


const useStyles = makeStyles((theme) => ({
    tooltip: {
        fontSize: '15px'
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '20px',
    },
    listItemText: {
        fontWeight: '500',
        paddingRight: '10px'
    },
}))



export const Profile = () => {
    const classes = useStyles();
    const { id, viwerId } = useParams();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [progress, setProgress] = useState(0);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
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

    const { userState, auth } = useContext(AuthContext);
    const fileInput = useRef();



    const uploadImage = (file) => {
        if (file.type.indexOf('image') === -1) return alert('Only image type is allowed');
        const uploadTask = storage.ref('profilePics').child(file.name).put(file);
        uploadTask.on('state_changed', snap => {
            const loadingProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setProgress(loadingProgress);
        },
            error => alert(error.message),
            async () => {
                try {
                    const profilePic = await storage.ref('profilePics').child(file.name).getDownloadURL();
                    await db.collection('users').doc(id).update({ profilePic });
                    await auth.currentUser.updateProfile({ photoURL: profilePic });
                    alert('UPDATED');
                } catch (error) {
                    alert(error.message);
                }
                setProgress(0);
            }
        )
    }

    const follow = async () => {
        await db.collection('users').doc(id).collection('followers').doc(viwerId).set({ follower: viwerId });
        await db.collection('users').doc(viwerId).collection('following').doc(id).set({ userFollowed: id });
    }

    const unFollow = async () => {
        await db.collection('users').doc(id).collection('followers').doc(viwerId).delete();
        await db.collection('users').doc(viwerId).collection('following').doc(id).delete();
    }

    const handleOpenModal = (postId) => {
        setPostDetailsId(postId);
        setOpenPostDetails(true);
    }
    const handleCloseModal = () => {
        setPostDetailsId(null);
        setOpenPostDetails(false);
        setUserQueryLimit(10);
    };

    const showFollowers = (action) => {
        action === FFmodalAction.SHOW_FOLLOWERS ? setUserListLength(followers.length) : setUserListLength(following.length);
        setFollowingFollowerModalAction(action);
        setOpenFollowingFollowersModal(true);
    }

    const scrolling = () => {
        console.log('Pasé')
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

        followers.includes(viwerId) ? setIsFollowing(true) : setIsFollowing(false);

    }, [followers, viwerId])

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

    useEffect(() => console.table([{ userListLength, currentUserListLength, userQueryLimit }]), [userListLength, currentUserListLength, userQueryLimit])

    return (
        <div className="profile__container">
            {userData &&
                <Fragment>
                    <header className="profile__header">
                        <div className="profile__picContainer">
                            {id === viwerId ?
                                <Tooltip title='Add Profile Picture'
                                    placement="right"
                                    classes={{ tooltip: classes.tooltip }}
                                    onClick={() => fileInput.current.click()}
                                >
                                    <div className="image__container">
                                        <img className="profile__image" src={userData.profilePic} alt="" />
                                    </div>
                                </Tooltip> :

                                <div className="image__container">
                                    <img className="profile__image" src={userData.profilePic} alt="" />
                                </div>
                            }
                            <input ref={fileInput} id="profilePic__input" type="file" hidden onChange={ev => uploadImage(ev.target.files[0])} />
                        </div>
                        <div className="profile__userData">
                            <div className="profile__userInfo">
                                <h2 className="profile__username">{userData.username}</h2>
                                {id !== viwerId
                                    ? <Button className="profile__followBtn" variant="outlined" onClick={() => !isFollowing ? follow() : unFollow()} >
                                        {!isFollowing ? 'Follow' : 'Unfollow'}
                                    </Button>
                                    :
                                    <Button variant="outlined" className="profile__editBtn" onClick={() => setOpenEditProfileModal(true)}>
                                        Edit Profile
                                    </Button>
                                }
                            </div>
                            <div className="profile__postAndFollowersInfoContainer">
                                <ul className="profile__postAndFollowersInfoList">
                                    <li className="profile__postAndFollowersInfoItem" style={{ cursor: 'default !important' }}><strong>{posts.length} </strong>Posts</li>
                                    <li onClick={() => showFollowers(FFmodalAction.SHOW_FOLLOWERS)} className="profile__postAndFollowersInfoItem"><strong>{followers.length} </strong>Followers</li>
                                    <li onClick={() => showFollowers(FFmodalAction.SHOW_FOLLOWING)} className="profile__postAndFollowersInfoItem"><strong>{following.length} </strong>Following</li>
                                </ul>
                            </div>
                            {userData.description &&
                                <div className="profile__descriptionContainer">
                                    <h5 style={{ fontWeight: '400' }}>{userData.description}</h5>
                                </div>}
                        </div>
                    </header>

                    <main className="profile__picsContainer">
                        {posts.map(post =>
                            <div key={post.postId} className="pic__container" onClick={() => handleOpenModal(post.postId)}>
                                <img className="profile__pic" src={post.imageUrl} alt={post.username} />
                                <div className="icons__container">
                                    <div className="icon">
                                        <i className="material-icons">favorite</i>
                                        <span>{post.likes.length}</span>
                                    </div>
                                    <div className="icon">
                                        <i className="material-icons">mode_comment</i>
                                        <span>{post.comments.length}</span>
                                    </div>
                                </div>

                            </div>
                        )
                        }
                    </main>

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
