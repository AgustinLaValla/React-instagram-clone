import React from 'react'
import { Menu, MenuItem } from '@material-ui/core';

const DropdownMenu = ({ anchorEl, itemsArray, handleClose }) => {

    return (

        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{style:{width:'220px'}}}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            {itemsArray.map((item, i) => <MenuItem key={i} onClick={item.method}>{item.text}</MenuItem>)}

        </Menu>

    )
}

export default DropdownMenu;