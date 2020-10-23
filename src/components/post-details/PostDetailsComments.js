import React, { useState, useEffect, Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { getTimeStamp } from '../../utils/utils';
import { db } from '../../firebase';
import { usePostComments } from '../../utils/hooks';
import PostDetailsCaption from './PostDetailsCaption';

const PostDetailsComments = ({ classes, currentPost, currentUser }) => {

    const comments = usePostComments(currentPost);

    const getUserProfilePic = async (userId) => {
        const user = await db.collection('users').doc(userId).get();
        return user.data().profilePic;
    }


    return (
        <List id="comment-list" className={classes.postDetails__list}>
            <PostDetailsCaption
                classes={classes}
                currentUser={currentUser}
                currentPost={currentPost}
            />

            {comments.map(comment => (
                <ListItem alignItems="flex-start" className={classes.postDetails__comment}>
                    <ListItemAvatar>
                        <Avatar src={async () => { return await getUserProfilePic(comment.userId) }}></Avatar>
                    </ListItemAvatar>

                    <ListItemText
                        primary={comment.username}
                        secondary={
                            <Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >{comment.text}
                                </Typography>
                                <br />
                                {comment && comment.timestamp ? getTimeStamp(comment.timestamp.seconds) : null}
                            </Fragment>
                        }
                    >
                    </ListItemText>

                </ListItem>
            ))}

        </List>
    )
}

export default PostDetailsComments;
