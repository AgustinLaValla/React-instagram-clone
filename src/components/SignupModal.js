/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Modal, Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../firebase';
import { profilePic } from '../utils/utils';
import './SignupModal.css';

function getModalStyle() {


    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));



export const SignupModal = ({ open, setOpenModal, handleClose, auth }) => {
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);

    const intialCredentialsValues = { username: '', email: '', password: '' };
    const [credentials, setCredential] = useState(intialCredentialsValues);
    const [modalAction, setModalAction] = useState('signin');
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredential({ ...credentials, [name]: value });
    }

    const goFromSignInToSignUp = () => setModalAction('signup');
    const goFromSignUpToSignIn = () => setModalAction('signin');

    const handleLogin = async (ev) => {
        ev.preventDefault();
        try {
            if (modalAction === 'signup') {
                const exists = await db.collection('users').where('username', '==', credentials.username).get();
                if (exists.docs[0]) return alert('Username already exists. Please, try to sign up with another username');
                const userState = await auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
                await db.collection('users').doc(userState.user.uid).set({
                    username: credentials.username,
                    email: credentials.email,
                    id: userState.user.uid, 
                    profilePic
                });
                await userState.user.updateProfile({ displayName: credentials.username, photoURL: profilePic });
            } else {
                auth.signInWithEmailAndPassword(credentials.email, credentials.password);
            }
            setOpenModal(false);
        } catch (error) {
            alert(error.message)
        }
    }

   

    const showUsername = modalAction === 'signup' ?
        <Input className="dashboard__input" style={{ width: '100%' }} type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} />
        : null;

    return (


        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <center>
                    <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                </center>
                <form onSubmit={handleLogin} className="signup__form">
                    {showUsername}
                    <Input className="dashboard__input" style={{ width: '100%' }} type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} />
                    <Input className="dashboard__input" style={{ width: '100%' }} type="password" name="password" value={credentials.password} onChange={handleChange} />
                    <Button variant="contained" type="submit">{modalAction === 'signup' ? 'Register' : 'Login'}</Button>
                </form>

                <div id="register__warning">
                    <a onClick={modalAction === 'signin' ? goFromSignInToSignUp : goFromSignUpToSignIn}>
                        {modalAction === 'signin' ? 'Click here to register' : 'Click to login with your account'}
                    </a>
                </div>
            </div>

        </Modal>

    )
}
