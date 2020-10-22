import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Modal from '@material-ui/core/Modal';
import Header from './Header';
import UsersList from './UsersList';
import { setStyles } from '../../material/uiStyles';
import './FollowingFollowersModal.css';

const modalStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const useStyles = makeStyles(theme => ({ ...setStyles(theme) }));

const FollowingFollowersModal = ({ open, handleClose, data, viwerId, action, listLength, onscroll }) => {

    const classes = useStyles();

    return (
        <Modal className={classes.modal} open={open} onClose={handleClose}>
            <div style={modalStyle} className={classes.ffModal__paper}>
                <Header action={action} handleClose={handleClose} />
                <UsersList data={data} viwerId={viwerId} listLength={listLength} onscroll={onscroll} classes={classes} />
            </div>
        </Modal>
    )
}

export default FollowingFollowersModal;