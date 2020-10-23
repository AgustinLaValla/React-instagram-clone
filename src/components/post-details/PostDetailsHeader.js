import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { profilePic } from '../../utils/utils';
import { db } from '../../firebase';
import './PostDetails.css';
import { useIsFollowing } from './hooks/useIsFollowing';

const PostDetailsHeader = ({ classes, username, currentUser, viwerUser }) => {

    const [following, setIsFollowing] = useState(false);
    const isFollowing = useIsFollowing(viwerUser, currentUser, following);

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



    return (
        <div>
            <ListItem alignItems="flex-start"  className={classes.postDetails__listItem}>
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

            <Divider />
        </div>
    )
}

export default PostDetailsHeader;
