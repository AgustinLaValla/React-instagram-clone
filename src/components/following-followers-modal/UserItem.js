import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { profilePic } from '../../utils/utils';

const UserItem = ({ user, classes, follow, unFollow, isFollowing, viwerId }) => {

    const getSuitableButton = (id) => {

        if (!isFollowing(id)) {
            return (
                <button className="follow_unfollow__button" onClick={() => follow(id)}>
                    Follow
                </button>
            )
        } else {
            return (
                <button className="follow_unfollow__button" onClick={() => unFollow(id)}>
                    Unfollow
                </button>
            )
        }
    }

    
    return (
        <ListItem alignItems="flex-start" className={classes.ffModal__listItem}>
            <ListItemAvatar>
                <Avatar alt={user.username} src={user.profilePic ? user.profilePic : profilePic}></Avatar>
            </ListItemAvatar>

            <ListItemText
                className="followingFollower__username"
                primary={user.username}
                secondary={
                    <Fragment>
                        {user.description ? user.description : null}
                    </Fragment>
                }
            >
            </ListItemText>

            {user.id !== viwerId ? getSuitableButton(user.id) : null}

        </ListItem>
    )
}

export default UserItem
