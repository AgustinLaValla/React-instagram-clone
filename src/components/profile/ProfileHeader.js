import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { FFmodalAction } from '../../utils/utils';
import ProfilePicture from './ProfilePicture';
import './Profile.css';
import { ProfileUserData } from './ProfileUserData';
import ProfilePostAndFollowersInfo from './ProfilePostAndFollowersInfo';


const ProfileHeader = ({
    id,
    viwerId,
    classes,
    userData,
    following,
    followers,
    setUserListLength,
    setFollowingFollowerModalAction,
    setOpenFollowingFollowersModal,
    setOpenEditProfileModal,
    postsLength
}) => {

    const [isFollowing, setIsFollowing] = useState(false);

    const follow = async () => {
        await db.collection('users').doc(id).collection('followers').doc(viwerId).set({ follower: viwerId });
        await db.collection('users').doc(viwerId).collection('following').doc(id).set({ userFollowed: id });
    }

    const unFollow = async () => {
        await db.collection('users').doc(id).collection('followers').doc(viwerId).delete();
        await db.collection('users').doc(viwerId).collection('following').doc(id).delete();
    }

    const showFollowers = (action) => {
        action === FFmodalAction.SHOW_FOLLOWERS
            ? setUserListLength(followers.length)
            : setUserListLength(following.length);
        setFollowingFollowerModalAction(action);
        setOpenFollowingFollowersModal(true);
    }

    useEffect(() => {

        followers.includes(viwerId) ? setIsFollowing(true) : setIsFollowing(false);

        return () => { };

    }, [followers, viwerId])

    return (
        <header className="profile__header">

            <ProfilePicture  {...{ id, viwerId, classes, userData }} />
            <div className="profile__userData">
                <ProfileUserData
                    onFollowBtnClick={() => !isFollowing ? follow() : unFollow()}
                    onEditBtnClick={() => setOpenEditProfileModal(true)}
                    followBtnText={!isFollowing ? 'Follow' : 'Unfollow'}
                    id={id}
                    viwerId={viwerId}
                    username={userData.username}
                    classes={classes}
                />
                <ProfilePostAndFollowersInfo
                    {...{ followers, following, postsLength, showFollowers }}
                />
                {
                    userData.description &&
                    <div className="profile__descriptionContainer">
                        <h5 style={{ fontWeight: '400' }}>{userData.description}</h5>
                    </div>
                }
            </div>
        </header>
    )
}

export default ProfileHeader
