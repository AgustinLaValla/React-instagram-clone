import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { profilePic } from '../../utils/utils';
import { db } from '../../firebase';
import './PostDetails.css';

const PostDetailsHeader = ({ classes, username, currentUser, viwerUser }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const follow = async () => {
        await db.collection('users').doc(currentUser.id).collection('followers').doc(viwerUser.uid).set({
            follower: viwerUser.uid
        });
        await db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).set({
            userFollowed: currentUser.id
        });
        setIsFollowing(true);
    }

    const unFollow = async () => {
        await db.collection('users').doc(currentUser.id).collection('followers').doc(viwerUser.uid).delete();
        await db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).delete();
        setIsFollowing(false);
    }

    useEffect(() => {
        let unsubscribe;
        if (currentUser && viwerUser) {
            unsubscribe = db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).onSnapshot((doc) => {
                doc.exists ? setIsFollowing(true) : setIsFollowing(false);
            });
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [viwerUser, currentUser]);

    return (
        <ListItem alignItems="flex-start" className={classes.postDetails__listItem}>
            <ListItemAvatar>
                <Avatar alt={username} src={currentUser ? currentUser.profilePic : profilePic}></Avatar>
            </ListItemAvatar>

            <span className="postDetails__headerName">
                {currentUser ? currentUser.username : null}
            </span>

            <div className="postDetails__followBtnContainer">
                <span onClick={() => !isFollowing ? follow() : unFollow()} className="postDetails__followBtn">
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </span>
            </div>

        </ListItem>
    )
}

export default PostDetailsHeader;
