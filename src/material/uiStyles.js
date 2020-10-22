

export const setStyles = (theme) => ({
    
    //------------------- TOOLTIP -------------------
    
    tooltip: {
        fontSize: '18px',
        padding: '10px'
    },

    // ------------------- PROFILE -------------------

    listItem: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '20px',
    },
    listItemText: {
        fontWeight: '500',
        paddingRight: '10px'
    },

    //-------------- EDIT PROFILE MODAL --------------

    paper: {
        position: 'absolute',
        width: '400px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
        [theme.breakpoints.down('sm')]: {
            width: '300px'
        }
    },
    editProfile__listItem: {
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
        [theme.breakpoints.down('sm')]: {
            width: '300px'
        }
    },

    // -------------- UPLOAD-IMAGE-MODAL --------------
    
    uploadImageModal__paper: {
        position: 'absolute',
        minWidth: '600px',
        maxWidth: '900px',
        minHeight: '300px',
        backgroundColor: theme.palette.background.paper,
        border: '2px dashed #000',
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        [theme.breakpoints.down('md')] : {
            maxWidth: 800
        },
        [theme.breakpoints.down('sm')] : {
            maxWidth: 500,
            minWidth: 320,
            padding: '10px 0px 20px'
        }
    },
    papperOnDrag: {
        position: 'absolute',
        minWidth: '600px',
        maxWidth: '900px',
        minHeight: '300px',
        backgroundColor: theme.palette.background.paper,
        border: '2px dashed #22ff',
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        [theme.breakpoints.down('md')] : {
            maxWidth: 800
        },
        [theme.breakpoints.down('sm')] : {
            maxWidth: 500,
            minWidth: 320,
            padding: '10px 0px 20px'
        }
    },
    papperOnDrop: {
        position: 'absolute',
        minWidth: '600px',
        maxWidth: '900px',
        minHeight: '300px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        [theme.breakpoints.down('md')] : {
            maxWidth: 800
        },
        [theme.breakpoints.down('sm')] : {
            maxWidth: 500,
            minWidth: 320,
            padding: '10px 0px 20px'
        }
    },
    loadingModal: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '200px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    svg: {
        margin: 'auto'
    },

    // -------------- POST DETAILS ------------------

    postDetails__paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
    },
    postDetails__list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    postDetails__comment : {
        maxHeight: 76
    },
    postDetails__listItem: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '20px',
        position: 'sticky',
        flex: 1,
        maxHeight: '75px'
    },
    postDetails__captionContainer: {
        flex: 1,
        maxHeight: 76,
        overflowY: 'scroll'
    },

    postDetails__listItemText: {
        fontWeight: '500',
        paddingRight: '10px'
    },
    divider: {
        height: '1px'
    },
    inline: {
        display: 'inline',
    },

    // ----------- FOLLOWING-FOLLOWERS-MODAL ----------- 

    ffModal__paper: {
        position: 'absolute',
        width: 400,
        height: 400,
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],


    },
    ffModal__listItem: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '0px'
    },
    ffModal__listItemText: {
        fontWeight: '500',
        paddingRight: '10px'
    },

    // ------------------ SIGNUP ---------------------- 
    singupModal__paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
});
