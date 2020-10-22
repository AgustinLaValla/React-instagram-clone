import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import './Header.css';

const HeaderMenu = ({
    searchResults,
    searchMenuAnchorEl,
    onClose,
    userState,
    setSearchResults,
    setOpenModal
}) => {
    const history = useHistory();
    const goToUserProfile = (result) => {
        history.push(`/profile/${result.id}/${userState.uid}`);
        setSearchResults([]);
    }
    return (
        <Menu
            id="search-menu"
            anchorEl={searchMenuAnchorEl}
            keepMounted
            open={Boolean(searchMenuAnchorEl)}
            onClose={onClose}
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
        </Menu>
    )
}

export default HeaderMenu
