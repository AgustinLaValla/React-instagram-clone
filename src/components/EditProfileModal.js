/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useContext } from 'react'
import { Modal, makeStyles, ListItem, TextField, Button } from '@material-ui/core';
import { closeSVG } from '../utils/icons-data';
import { db } from '../firebase';
import './EditProfileModal.css';
import { AuthContext } from '../App';

const modalStyles = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: '400px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px',
        borderBottom: '1px solid lightgrey',
        cursor: 'pointer'
    },
    lastListItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '0px',
        justifyContent: 'center',
        borderBottom: 'none',
        cursor: 'pointer'
    },
    changeDataModal: {
        position: 'absolute',
        width: '400px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

}))

const actions = {
    CHANGE_USERNAME: 'Change Username',
    CHANGE_EMAIL: 'Change Email',
    CHANGE_DESCRIPTION: 'Change Description',
    CHANGE_PASSWORD: 'Change Password'
};

const DataModal = ({ open, handleClose, action, data, setData, updateUserData, changePassword }) => {
    const classes = useStyles();

    const [confirmPassword, setConfirmPassword] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [nameError, setNameError] = useState(null);
    const [confirmPasswordNameError, setConfirmPasswordNameError] = useState(null);
    const [touched, setTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [dataIsValid, setDataIsValid] = useState(false);
    const [confirnPasswordIsValid, setConfirmPasswordIsValid] = useState(false);


    const formValidation = () => {

        if (!changePassword) {
            if (data === '' || data === null || data === undefined) {
                setNameError('Should not be empty');
                setDataIsValid(false);
                return true;
            } else {
                setNameError(null);
            }
            if (action === actions.CHANGE_EMAIL) {
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;

                if (!regex.test(data)) {
                    setNameError('Should be an email');
                    setDataIsValid(false);
                    return true;
                } else {
                    setNameError(null);
                    setDataIsValid(true);
                }
            }
            setDataIsValid(true);
            return false;
        } else {
            if (data === '' || data === null || data === undefined) {
                setNameError('Should not be empty');
                setDataIsValid(false);
                return true;
            };
            if (data !== '' && data !== null && data !== undefined && data.length > 0) {
                setDataIsValid(true);
                setNameError(null);
            }
            if (!confirmPasswordTouched) {
                return true;
            }
            if (confirmPasswordTouched && data !== confirmPassword) {
                setConfirmPasswordNameError('Passwords should match');
                setConfirmPasswordIsValid(false);
                return true;
            }
            if (confirmPasswordTouched && data === confirmPassword) {
                setConfirmPasswordNameError(null);
                setConfirmPasswordIsValid(true);
            }

            return false;
        }

    }

    const handleChange = (event) => {
        const { value } = event.target;
        setData(value);
        setTouched(true);
    }

    const handleConfirmPasswordInputChange = (event) => {
        const { value } = event.target;
        setConfirmPassword(value);
        setConfirmPasswordTouched(true);
    }

    useEffect(() => {
        return () => {
            setTouched(false);
            setDataIsValid(false);
            setConfirmPasswordIsValid(false);
            setConfirmPasswordTouched(false);
        };
    }, [open])

    useEffect(() => {

        setDisabled(formValidation);

        return () => setDisabled(false);

    }, [data, setData, confirmPassword, setConfirmPassword]);

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={modalStyles} className={classes.paper}>
                <h3 style={{ textAlign: 'center', padding: '10px 0px' }}>{action}</h3>
                <div className='DataModal__inputBox'>
                    {!changePassword ?
                        <TextField

                            value={data}
                            onChange={handleChange}
                            fullWidth
                            style={{ margin: 8, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                            placeholder={action}
                            label={action}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            error={!dataIsValid && touched}
                            helperText={!dataIsValid && touched ? nameError : null}
                        />
                        :
                        <form>
                            <TextField
                                value={data}
                                type="password"
                                onChange={handleChange}
                                fullWidth
                                style={{ margin: 8, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                placeholder={action}
                                label={action}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                error={touched && !dataIsValid}
                                helperText={touched && !dataIsValid ? nameError : null}

                            />
                            <TextField
                                value={confirmPassword}
                                type="password"
                                onChange={handleConfirmPasswordInputChange}
                                fullWidth
                                style={{ margin: 8, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                placeholder="Confirm password"
                                label='Confirm'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                error={confirmPasswordTouched && !confirnPasswordIsValid}
                                helperText={confirmPasswordNameError}

                            />
                        </form>
                    }
                    <Button
                        onClick={updateUserData}
                        variant="contained"
                        style={{ width: '100%' }}
                        disabled={disabled}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export const EditProfileModal = ({ open, handleClose, userData }) => {

    const classes = useStyles();

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [description, setDescription] = useState(null);
    const [password, setPassword] = useState(null);
    const [openEditDataModal, setOpenEditDataModal] = useState(false);
    const [dataToChange, setDataToChange] = useState(null);
    const [action, setAction] = useState(null);
    const [propertyName, setPropertyName] = useState(null);
    const [changePassword, setChangePassword] = useState(false);

    const { auth } = useContext(AuthContext);


    const openModal = (itemAction) => {
        setAction(itemAction);
        setOpenEditDataModal(true);
    }


    const updateUserData = async () => {
        if (action === actions.CHANGE_USERNAME || action === actions.CHANGE_EMAIL || action === actions.CHANGE_PASSWORD) {
            if (propertyName === 'username') {

                try {
                    await auth.currentUser.updateProfile({ displayName: dataToChange });
                } catch (error) {
                    alert(error.message);
                }

            } else if (propertyName === 'email') {
                try {
                    await auth.currentUser.updateProfile({ email: dataToChange });
                } catch (error) {
                    alert(error.message);
                }

            } else if (propertyName === 'password') {
                try {
                    await auth.currentUser.updatePassword(dataToChange);
                    alert('Password Changed');
                    setPassword(null);
                    resetValues();
                } catch (error) {
                    console.log(error);
                    alert(error.message);
                }
                return;
            };
        }
        await db.collection('users').doc(userData.id).update({ [propertyName]: dataToChange });
        propertyName === 'username' ? alert('Username Changed') : alert('Email Changed');
        resetValues();
    };

    const resetValues = () => {
        setOpenEditDataModal(false);
        setDataToChange(null);
        setAction(null);
        setPropertyName(null);
        handleClose();
    }

    useEffect(() => {
        if (userData) {
            setUsername(userData.username);
            setEmail(userData.email);
            setDescription(userData.description ? userData.description : null);
        }
    }, [userData])

    useEffect(() => {
        switch (action) {
            case actions.CHANGE_USERNAME:
                setChangePassword(false);
                setPropertyName('username');
                setDataToChange(username);

                break;
            case actions.CHANGE_EMAIL:
                setChangePassword(false);
                setPropertyName('email');
                setDataToChange(email);

                break;
            case actions.CHANGE_DESCRIPTION:
                setChangePassword(false);
                setPropertyName('description');
                setDataToChange(description);

                break;
            case actions.CHANGE_PASSWORD:
                setChangePassword(true);
                setPropertyName('password');
                setDataToChange(password);

                break;
            default: return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    return (
        <Modal open={open} handleClose={handleClose}>
            <div style={modalStyles} className={classes.paper}>
                <div className="editProfile__modalHeader">
                    <span className="editProfile__modalTitle">
                        Edit Profile
                    </span>
                    <div className="editProfile__timerBox">
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

                <ListItem onClick={() => openModal(actions.CHANGE_USERNAME)} alignItems='center' className={classes.listItem}>
                    <span className="editProfile__itemDescription">Change Username</span>
                </ListItem>

                <ListItem onClick={() => openModal(actions.CHANGE_DESCRIPTION)} alignItems="center" className={classes.listItem}>
                    <span className="editProfile__itemDescription">
                        {userData && userData.description ? 'Change Description' : 'Add Description'}
                    </span>
                </ListItem>

                <ListItem onClick={() => openModal(actions.CHANGE_EMAIL)} alignItems="center" className={classes.listItem}>
                    <span className="editProfile__itemDescription">Change Email</span>
                </ListItem>

                <ListItem onClick={() => openModal(actions.CHANGE_PASSWORD)} alignItems="center" className={classes.listItem}>
                    <span className="editProfile__itemDescription">Change Password</span>
                </ListItem>

                <ListItem alignItems="center" className={classes.lastListItem}>
                    <span className="editProfile__itemDescription">Logout</span>
                </ListItem>

                <DataModal
                    open={openEditDataModal}
                    handleClose={() => setOpenEditDataModal(false)}
                    action={action}
                    data={dataToChange}
                    setData={setDataToChange}
                    updateUserData={updateUserData}
                    changePassword={changePassword}
                />


            </div>


        </Modal>
    )
}
