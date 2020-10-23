import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { db } from '../../firebase';
import './FollowingFollowersModal.css';
import { useFollowingList } from './hooks/useFollowingList';
import UserItem from './UserItem';

const UsersList = ({ data, viwerId, listLength, onscroll, classes }) => {

    const viwerFollowingList = useFollowingList(viwerId);

    const follow = (id) => {
        db.collection('users').doc(id).collection('followers').doc(viwerId).set({ follower: viwerId });
        db.collection('users').doc(viwerId).collection('following').doc(id).set({ userFollowed: id })

    };
    const unFollow = (id) => {
        db.collection('users').doc(id).collection('followers').doc(viwerId).delete();
        db.collection('users').doc(viwerId).collection('following').doc(id).delete();
    };

    const isFollowing = (userId) => viwerFollowingList.find(userFollowedId => userFollowedId === userId);

    return (
        <InfiniteScroll
            dataLength={listLength}
            next={onscroll}
            hasMore={true}
            height={400 - 42}
        >
            {
                data.map(user => (
                    <UserItem
                        key={user.id}
                        user={user}
                        follow={follow}
                        unFollow={unFollow}
                        classes={classes}
                        isFollowing={isFollowing}
                        viwerId={viwerId}
                    />
                ))
            }
        </InfiniteScroll>
    )
}

export default UsersList;
