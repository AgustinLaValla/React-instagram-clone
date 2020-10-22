import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import SignupModal from '../../components/signup/SignupModal';
import { profilePic } from '../../utils/utils';
import UploadImageModal from '../../components/upload-image/UploadImageModal';
import HeaderMenu from './HeaderMenu';
import HomeIcon from './HomeIcon';
import PostIcon from './PostIcon';
import UserMenu from './UserMenu';
import './Header.css';


const Header = ({ userState, auth }) => {


    const [searchResults, setSearchResults] = useState([]);
    const [searchMenuAnchorEl, setSearchMenuAnchorEl] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [openUploadImageModal, setOpenUploadImageModal] = useState(false);

    const [profilePicUrl, setProfilePicUrl] = useState(profilePic);


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
                <input
                    id="searchInput"
                    type="text"
                    onChange={(ev) => searchUsers(ev.target.value, ev.currentTarget)}
                    placeholder="&#xF002; Search user"
                />
                {
                    searchResults.length > 0 &&
                    <HeaderMenu
                        searchResults={searchResults}
                        searchMenuAnchorEl={searchMenuAnchorEl}
                        onClose={() => setSearchMenuAnchorEl(null)}
                        userState={userState}
                        setSearchResults={setSearchResults}
                        setOpenModal={setOpenModal}
                    />
                }
            </div>

            <div id="header__icons-container">
                <HomeIcon />
                <PostIcon onClick={() => userState ? setOpenUploadImageModal(true) : setOpenModal(true)} />
                <UserMenu userState={userState} profilePicUrl={profilePicUrl} auth={auth} />
            </div>

            {/* Sign Modal */}
            <SignupModal open={openModal} handleClose={handleCloseModal} setOpenModal={setOpenModal} />
            {/* Upload Post modal */}
            <UploadImageModal
                open={openUploadImageModal}
                handleClose={handleCloseModal}
                userState={userState}
                closeImageModal={() => setOpenUploadImageModal(false)}
            />
        </div>
    )
}


export default Header;