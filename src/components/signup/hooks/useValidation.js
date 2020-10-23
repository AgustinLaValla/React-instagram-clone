import { useState, useEffect } from 'react';

export const useValidation = (modalAction, intialCredentialsValues) => {

    const [credentials, setCredential] = useState(intialCredentialsValues);
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
    }, [credentials, modalAction, usernameIsTouched, emailIsTouched, passwordIsTouched, usernameIsValid, emailIsValid, passwordIsValid]);

    return {
        handleUsernameChange,
        handleEmailChange,
        handlePasswordChange,
        usernameIsValid,
        emailIsValid,
        passwordIsValid,
        usernameErrorMessage,
        emailErrorMessage,
        passwordErrorMessage,
        disable,
        credentials,
        usernameIsTouched,
        emailIsTouched,
        passwordIsTouched,
    }
}