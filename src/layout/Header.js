import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { homeSvg, picSvg } from '../utils/icons-data';
import { Avatar, makeStyles, ListItem, ListItemAvatar, ListItemText, Divider } from '@material-ui/core';
import { db } from '../firebase';
import { Menu } from '@material-ui/core';
import './Header.css';
import { DropdownMenu } from '../components/DropdownMenu';
import { useHistory } from 'react-router-dom';
import { SignupModal } from '../components/SignupModal';
import { profilePic } from '../utils/utils';
import { UploadImageModal } from '../components/UploadImageModal';

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: '28px',
        height: '28px'
    }
}))

export const Header = ({ userState, auth }) => {

    const classes = useStyles();
    const history = useHistory();

    const [searchResults, setSearchResults] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [searchMenuAnchorEl, setSearchMenuAnchorEl] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [openUploadImageModal, setOpenUploadImageModal] = useState(false);

    const [profilePicUrl, setProfilePicUrl] = useState(profilePic);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);

    const handleClose = (action) => {
        if (userState && action === 'Logout') {
            auth.signOut();
            history.push('/');
        } else if (userState && action === 'Profile') {
            history.push(`profile/${userState.uid}/${userState.uid}`);
        }
        setAnchorEl(null);
    };

    const goToUserProfile = (result) => {
        history.push(`/profile/${result.id}/${userState.uid}`);
        setSearchResults([]);
    }

    const searchUsers = async (text, anchorElement) => {
        if (text !== '') {
            await db.collection('users').orderBy('username').startAt(text).endAt(text + '\uf8ff').onSnapshot((docs) => {
                setSearchResults(docs.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });
            setSearchMenuAnchorEl(anchorElement);
        } else {
            setSearchResults([]);
        }
    }

    const handleCloseModal = () => openModal ? setOpenModal(false) : setOpenUploadImageModal(false);

    useEffect(() => {
        let unsubscribe;
        if (userState) {
            unsubscribe = db.collection('users').doc(userState.uid).onSnapshot((doc) => {
                setProfilePicUrl(doc.data().profilePic);
            })
        } else {
            setProfilePicUrl(profilePic);
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [userState])

    return (
        <div className="app__header">
            <Link to="/">
                <img id="header__image"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt="Instagram Clone"
                />
            </Link>

            <div id="search-input-header">
                <input id="searchInput" type="text" onChange={(ev) => searchUsers(ev.target.value, ev.currentTarget)} placeholder="&#xF002; Search user" />
                {searchResults.length > 0 &&
                    <Menu
                        id="search-menu"
                        anchorEl={searchMenuAnchorEl}
                        keepMounted
                        open={Boolean(searchMenuAnchorEl)}
                        onClose={() => setSearchMenuAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{ style: { maxHeight: '400px', overflowY: 'scroll', cursor: 'pointer' } }}
                    >
                        {searchResults.map(result => (
                            <Fragment>
                                <ListItem alignItems="flex-start" onClick={() => userState ? goToUserProfile(result) : setOpenModal(true)}>
                                    <ListItemAvatar>
                                        <Avatar alt={result.username} src={result.profilePic}></Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={result.username}
                                        secondary={
                                            <Fragment>
                                                {result.email}
                                            </Fragment>
                                        }
                                    >
                                    </ListItemText>
                                </ListItem>

                                <Divider />
                            </Fragment>
                        ))}
                    </Menu>}
            </div>

            <div id="header__icons-container">
                <Link to='/'>
                    <div className="header__iconContainer">
                        <svg className="header__icon _8-yf5" aria-label="Inicio" fill="#262626" height="22" viewBox="0 0 48 48" width="22">
                            <path d={homeSvg.path} />
                        </svg>
                    </div>
                </Link>

                <Link to='/'>
                    <div className="header__iconContainer">
                        <svg onClick={() => userState ? setOpenUploadImageModal(true) : setOpenModal(true)} className="header__icon" id="svg-i" fill="#262626" height="22" viewBox="0 0 48 48" width="22">
                            <path d={picSvg.path} />
                        </svg>
                    </div>
                </Link>

                {userState && <div id="avatar__container" className="header__iconContainer">
                    <Avatar onClick={handleOpenMenu} id="header__avatar" className={classes.avatar} alt="Remy Sharp" src={profilePicUrl} />

                    <DropdownMenu anchorEl={anchorEl}
                        itemsArray={[
                            { text: 'Profile', method: () => userState ? handleClose('Profile') : null },
                            { text: 'Logout', method: () => userState ? handleClose('Logout') : null }
                        ]}
                        handleClose={handleClose}
                    />
                </div>}

            </div>

            {/* Sign Modal */}
            <SignupModal open={openModal} handleClose={handleCloseModal} setOpenModal={setOpenModal} />
            {/* Upload Post modal */}
            <UploadImageModal
                open={openUploadImageModal}
                handleClose={handleCloseModal}
                userState={userState}
                setOpenUploadImageModal={setOpenUploadImageModal}
            />
        </div>
    )
}
