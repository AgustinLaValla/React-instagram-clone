/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { Modal, Button, TextField } from '@material-ui/core';
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
    const [usernameIsTouched, setUserNameIsTouched] = useState(false);
    const [emailIsTouched, setEmailIsTouched] = useState(false);
    const [passwordIsTouched, setPasswordIsTouched] = useState(false);
    const [usernameIsValid, setUserNameIsValid] = useState(false);
    const [emailIsValid, setEmailIsValid] = useState(false);
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState(null);
    const [emailErrorMessage, setEmailErrorMessage] = useState(null);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
    const [disable, setDisable] = useState(true);

    const handleUsernameChange = (event) => {
        const { value } = event.target;
        setUserNameIsTouched(true);
        setCredential({ ...credentials, username: value })
    }


    const handleEmailChange = (event) => {
        const { value } = event.target;
        setEmailIsTouched(true);
        setCredential({ ...credentials, email: value })
    }


    const handlePasswordChange = (event) => {
        const { value } = event.target;
        setPasswordIsTouched(true);
        setCredential({ ...credentials, password: value })
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
                await auth.signInWithEmailAndPassword(credentials.email, credentials.password);
            }
            setOpenModal(false);
        } catch (error) {
            alert(error.message)
        }
    }

    const formValidation = () => {
        if (modalAction === 'signup') {
            if (credentials.username === '' || !credentials.username) {
                setUserNameIsValid(false);
                setUsernameErrorMessage('Username is required')
                setDisable(true);
            } else {
                setUserNameIsValid(true);
                setUsernameErrorMessage(null);
            }
        }

        if (credentials.email === '' || !credentials.email) {
            setEmailIsValid(false);
            setEmailErrorMessage('Email is required');

        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(credentials.email)) {
            setEmailIsValid(false);
            setEmailErrorMessage('Should be an email');

        } else {
            setEmailIsValid(true);
            setEmailErrorMessage(null);
        }

        if (credentials.password === '' || !credentials.password) {
            setPasswordIsValid(false);
            setPasswordErrorMessage('Password is required');

        } else if (credentials.password.length < 6) {
            setPasswordIsValid(false);
            setPasswordErrorMessage('Password should be at least 6 characters');

        } else {
            setPasswordIsValid(true);
            setPasswordErrorMessage(null);
        }

    }

    const isDisable = () => {
        if (modalAction === 'signup') {
            setDisable(!usernameIsValid || !emailIsValid || !passwordIsValid);
        }
        if (modalAction === 'signin') {
            setDisable(!emailIsValid || !passwordIsValid);
        }
    }

    useEffect(() => {
        formValidation();
        isDisable();
        return () => setDisable(false);
    }, [credentials, modalAction, usernameIsTouched,emailIsTouched, passwordIsTouched,usernameIsValid, emailIsValid, passwordIsValid]);



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

                    {modalAction === 'signup' &&
                        <TextField
                            className="dashboard__input"
                            style={{ width: '100%' }}
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={handleUsernameChange}
                            error={usernameIsTouched && !usernameIsValid}
                            helperText={usernameIsTouched && !usernameIsValid ? usernameErrorMessage : null}

                        />

                    }
                    <TextField
                        className="dashboard__input"
                        style={{ width: '100%' }}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleEmailChange}
                        error={emailIsTouched && !emailIsValid}
                        helperText={emailIsTouched && !emailIsValid ? emailErrorMessage : null}
                        autoComplete={false}
                    />
                    <TextField
                        className="dashboard__input"
                        style={{ width: '100%' }}
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handlePasswordChange}
                        error={passwordIsTouched && !passwordIsValid}
                        helperText={passwordIsTouched && !passwordIsValid ? passwordErrorMessage : null}
                        autoComplete={false}
                    />
                    <Button disabled={disable} variant="contained" type="submit" id="signupmodal__submitBtn">
                        {modalAction === 'signup' ? 'Register' : 'Login'}
                    </Button>
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