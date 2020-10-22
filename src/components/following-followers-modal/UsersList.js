import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { db } from '../../firebase';
import './FollowingFollowersModal.css';
import UserItem from './UserItem';

const UsersList = ({ data, viwerId, listLength, onscroll, classes }) => {

    const [viwerFollowingList, setViwerFollowingList] = useState([]);

    const follow = (id) => {
        db.collection('users').doc(id).collection('followers').doc(viwerId).set({ follower: viwerId });
        db.collection('users').doc(viwerId).collection('following').doc(id).set({ userFollowed: id })

    };
    const unFollow = (id) => {
        db.collection('users').doc(id).collection('followers').doc(viwerId).delete();
        db.collection('users').doc(viwerId).collection('following').doc(id).delete();
    };

    const isFollowing = (userId) => viwerFollowingList.find(userFollowedId => userFollowedId === userId);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(viwerId).collection('following').onSnapshot((snap) => {
            setViwerFollowingList(snap.docs.map(doc => doc.data().userFollowed));
        });

        return () => unsubscribe ? unsubscribe() : null
    }, [viwerId])
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
