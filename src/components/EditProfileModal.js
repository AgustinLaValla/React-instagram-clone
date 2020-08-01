import React, { useState, useEffect, useContext } from 'react'
import { Modal, makeStyles, ListItem, Input, TextField, Button } from '@material-ui/core';
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
    }
}))

const actions = {
    CHANGE_USERNAME: 'Change Username',
    CHANGE_EMAIL: 'Change Email',
    CHANGE_DESCRIPTION: 'Change Description',
    CHANGE_PASSWORD: 'Change Password'
};

const DataModal = ({ open, handleClose, action, data, setData, updateUserData, }) => {
    const classes = useStyles();

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={modalStyles} className={classes.paper}>
                <h3 style={{ textAlign: 'center', padding: '10px 0px' }}>{action}</h3>
                <div className='DataModal__inputBox'>
                    <TextField
                        value={data}
                        onChange={(ev) => setData(ev.target.value)}
                        fullWidth
                        style={{ margin: 8, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                        placeholder={action}
                        label={action}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"

                    />
                    <Button onClick={updateUserData} variant="contained" style={{ width: '100%' }}>Save Changes</Button>
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

    const { auth } = useContext(AuthContext);


    const openModal = (itemAction) => {
        setAction(itemAction);
        setOpenEditDataModal(true);
    }


    const updateUserData = async () => {
        if (action === actions.CHANGE_USERNAME || action === actions.CHANGE_EMAIL) {
            if (propertyName === 'username') {
                await auth.currentUser.updateProfile({ displayName: dataToChange });
            } else {
                await auth.currentUser.updateProfile({email:dataToChange});
            };
        }
        await db.collection('users').doc(userData.id).update({ [propertyName]: dataToChange });
        setOpenEditDataModal(false);
        setDataToChange(null);
        setAction(null);
        setPropertyName(null);
    };

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
                setPropertyName('username');
                setDataToChange(username);
                break;
            case actions.CHANGE_EMAIL:
                setPropertyName('email');
                setDataToChange(email);
                break;
            case actions.CHANGE_DESCRIPTION:
                setPropertyName('description');
                setDataToChange(description);
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
                />


            </div>


        </Modal>
    )
}
