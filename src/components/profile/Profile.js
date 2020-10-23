/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, Fragment } from 'react'
import { useParams } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PostDetails from '../post-details/PostDetails';
import FollowingFollowersModal from '../following-followers-modal/FollowingFollowersModal';
import { FFmodalAction } from '../../utils/utils';
import { useResizeListener } from '../../utils/hooks';
import { EditProfileModal } from './EditProfileModal';
import { setStyles } from '../../material/uiStyles';
import ProfileHeader from './ProfileHeader';
import Posts from './Posts';
import { useAuthStateProvider } from '../../App';
import { useUsersIds } from './hooks/useUsersIds';
import { useUsersList } from './hooks/useUsersList';
import { useUserPosts } from './hooks/useUserPosts';
import { useUserData } from './hooks/useUserData';
import './Profile.css'


const useStyles = makeStyles((theme) => ({ ...setStyles(theme) }));

export const Profile = () => {
    const classes = useStyles();
    const { id, viwerId } = useParams();
    const [openPostDetails, setOpenPostDetails] = useState(false);
    const [postDetailsId, setPostDetailsId] = useState(null);
    const [openFollowingFollowersModal, setOpenFollowingFollowersModal] = useState(false);
    const [followingFollowerModalAction, setFollowingFollowerModalAction] = useState(FFmodalAction.SHOW_FOLLOWERS);
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
    const [userListLength, setUserListLength] = useState(0);
    const [userQueryLimit, setUserQueryLimit] = useState(10);

    const userData = useUserData(id);

    const followers = useUsersIds(id, 'followers', 'follower');
    const following = useUsersIds(id, 'following', 'userFollowed')

    const followersList = useUsersList(followers, userQueryLimit);
    const followingList = useUsersList(following, userQueryLimit);

    const posts = useUserPosts(id);

    const breakPostModal = useResizeListener();

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

    }

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
            <PostDetails
                open={openPostDetails}
                handleClose={handleCloseModal}
                postId={postDetailsId}
                viwerUser={userState}
                breakPostModal={breakPostModal}
            />

            {/* Following - Followers Modal */}

            <FollowingFollowersModal
                open={openFollowingFollowersModal}
                handleClose={() => setOpenFollowingFollowersModal(false)}
                data={followingFollowerModalAction === FFmodalAction.SHOW_FOLLOWERS ? followersList : followingList}
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
