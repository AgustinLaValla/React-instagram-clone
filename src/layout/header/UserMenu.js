import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DropdownMenu from './DropdownMenu';

const useStyles = makeStyles(() => ({
    avatar: {
        width: '28px',
        height: '28px'
    }
}))


const UserMenu = ({ userState, profilePicUrl, auth }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();


    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);

    const handleClose = (action) => {
        if (userState && action === 'Logout') {
            auth.signOut();
            history.push('/');
        } else if (userState && action === 'Profile') {
            history.push(`/profile/${userState.uid}/${userState.uid}`);
        }
        setAnchorEl(null);
    };

    return userState &&
        (
            <div id="avatar__container" className="header__iconContainer">
                <Avatar onClick={handleOpenMenu} id="header__avatar" className={classes.avatar} alt="Remy Sharp" src={profilePicUrl} />

                <DropdownMenu anchorEl={anchorEl}
                    itemsArray={[
                        { text: 'Profile', method: () => userState ? handleClose('Profile') : null },
                        { text: 'Logout', method: () => userState ? handleClose('Logout') : null }
                    ]}
                    handleClose={handleClose}
                />
            </div>

        )
}



export default UserMenu
