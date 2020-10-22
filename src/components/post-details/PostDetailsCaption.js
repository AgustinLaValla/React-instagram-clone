import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { profilePic, getTimeStamp } from '../../utils/utils';
import './PostDetails.css';

const PostDetailsCaption = ({ currentUser, currentPost, classes }) => {
    return (
        <ListItem alignItems="flex-start" className={`${classes.postDetails__captionContainer} captionContainer`}>
            <ListItemAvatar>
                <Avatar alt={currentPost.username} src={currentUser ? currentUser.profilePic : profilePic}></Avatar>
            </ListItemAvatar>

            <ListItemText
                primary={currentPost.username}
                secondary={
                    <Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                        >{currentPost.caption}
                        </Typography>
                        <br />
                        {getTimeStamp(currentPost.timestamp.seconds)}
                    </Fragment>
                }
            >
            </ListItemText>

        </ListItem>
    )
}

export default PostDetailsCaption
