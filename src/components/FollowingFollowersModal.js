import React, { useState, useEffect, Fragment } from 'react'
import { makeStyles, Modal, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { profilePic, FFmodalAction } from '../utils/utils';
import { db } from '../firebase';
import { closeSVG } from '../utils/icons-data';
import './FollowingFollowersModal.css';
import InfiniteScroll from 'react-infinite-scroll-component';

const modalStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const useStyles = makeStyles(theme => ({

    paper: {
        position: 'absolute',
        width: 400,
        height: 400,
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],


    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '0px'
    },
    listItemText: {
        fontWeight: '500',
        paddingRight: '10px'
    }
}));

export const FollowingFollowersModal = ({ open, handleClose, data, viwerId, action, listLength, onscroll }) => {
    const classes = useStyles();


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

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(viwerId).collection('following').onSnapshot((snap) => {
            setViwerFollowingList(snap.docs.map(doc => doc.data().userFollowed));
        });

        return () => unsubscribe ? unsubscribe() : null
    }, [viwerId])


    return (


        <Modal className={classes.modal} open={open} onClose={handleClose}>

            <div style={modalStyle} className={classes.paper}>
                <div className="FollowingFollowers__modalHeader">
                    <span className="FollowingFollowers__modalTitle">
                        {action === FFmodalAction.SHOW_FOLLOWERS ? 'Followers' : 'Following'}
                    </span>
                    <div className="FollowingFollowers__timerBox">
                        <svg onClick={handleClose}
                            aria-label="Cerrar"
                            class="_8-yf5"
                            fill="#262626"
                            height="24"
                            viewBox="0 0 48 48"
                            width="24"
                            style={{ cursor: 'pointer' }}
                        >
                            <path clip-rule="evenodd" d={closeSVG.path} fill-rule="evenodd" />
                        </svg>
                    </div>
                </div>

                <InfiniteScroll
                    dataLength={listLength}
                    next={onscroll}
                    hasMore={true}
                    height={400 - 42}
                >
                    {
                        data.map(user => (
                            <ListItem alignItems="flex-start" className={classes.listItem}>
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
                        ))
                    }
                </InfiniteScroll>
            </div>
        </Modal>
    )
}
