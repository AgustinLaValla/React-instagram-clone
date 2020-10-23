/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Modal, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../firebase';
import { profilePic } from '../../utils/utils';
import { setStyles } from '../../material/uiStyles';
import './SignupModal.css';
import { useValidation } from './hooks/useValidation';

function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };
}

const useStyles = makeStyles((theme) => ({ ...setStyles(theme) }));

const SignupModal = ({ open, setOpenModal, handleClose, auth }) => {
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);

    const intialCredentialsValues = { username: '', email: '', password: '' };

    const [modalAction, setModalAction] = useState('signin');

    const {
        handleUsernameChange,
        handleEmailChange,
        handlePasswordChange,
        usernameIsTouched,
        usernameIsValid,
        emailIsTouched,
        emailIsValid,
        passwordIsTouched,
        passwordIsValid,
        usernameErrorMessage,
        emailErrorMessage,
        passwordErrorMessage,
        disable,
        credentials
    } = useValidation(modalAction, intialCredentialsValues);

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

    return (

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.singupModal__paper}>
                <center>
                    <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                </center>
                <form onSubmit={handleLogin} className="signup__form">

                    {
                        modalAction === 'signup' &&
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

export default SignupModal;