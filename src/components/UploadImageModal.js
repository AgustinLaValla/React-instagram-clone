import React, { useCallback, useState, useEffect } from 'react'
import { Dropzone } from './Dropzone';
import { Modal, makeStyles, Button, CircularProgress } from '@material-ui/core';
import { db, storage } from '../firebase';
import * as firebase from 'firebase/app';
import './UploadImageModal.css';

const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        minWidth: '600px',
        maxWidth: '900px',
        minHeight: '300px',
        backgroundColor: theme.palette.background.paper,
        border: '2px dashed #000',
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
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
    },
    loadingModal: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '200px',
        height: '200px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    svg: {
        margin:'auto'
    }

}));



export const UploadImageModal = ({ open, handleClose, userState, setOpenUploadImageModal }) => {
    const classes = useStyles();

    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [openLoadingModal, setOpenLoadingModal] = useState(false);

    const onDrop = useCallback((acceptedFile) => {
        setImage(acceptedFile[0]);
        const reader = new FileReader();
        reader.onload = e => setSelectedImage(e.target.result);
        reader.readAsDataURL(acceptedFile[0])
    }, []);

    const getModalStyles = () => !isDragging ? (!selectedImage ? classes.paper : classes.papperOnDrop) : classes.papperOnDrag

    const uploadPost = (ev) => {
        setOpenLoadingModal(true);
        ev.preventDefault();

        const uploadTask = storage.ref(`posts`).child(image.name).put(image);
        uploadTask.on('state_changed',
            snap => {
                const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                setProgress(progress);
            },
            error => {
                alert(error.message);
                setOpenLoadingModal(false);
            },
            async () => {
                try {
                    const imageUrl = await storage.ref("posts").child(image.name).getDownloadURL();
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        imageUrl,
                        username: userState.displayName,
                        caption,
                        userId: userState.uid,
                        likes: [],
                        comments: []
                    });
                    setOpenLoadingModal(false);
                    setProgress(0);
                    setCaption('');
                    setOpenUploadImageModal(false);
                    setImage(null);
                    setSelectedImage(null);

                } catch (error) {
                    console.log(error);
                }
            }
        )
    }

    useEffect(() => {
        setImage(null);
        setSelectedImage(null);
    }, [open])

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <div style={modalStyle} className={getModalStyles()}>
                    {(!selectedImage && !image) ?
                        <Dropzone onDrop={onDrop}
                            accept={'image/*'}
                            setIsDragging={setIsDragging} />
                        :
                        <div id="uploadImage__postContainer">
                            <img src={selectedImage} alt="" id="uploadImage__postImage" />
                            <div id="uploadImage__formContainer">
                                <form onSubmit={uploadPost}>
                                    <textarea
                                        name="caption"
                                        placeholder="Add a caption"
                                        id="uploadImage__postCaptionInput"
                                        value={caption}
                                        onChange={(ev) => setCaption(ev.target.value)}
                                    >
                                    </textarea>
                                    <Button type="submit" variant="contained" style={{ marginTop: '15px', width: '100%' }}>
                                        Upload
                                    </Button>
                                </form>
                            </div>
                            <Modal open={openLoadingModal}>
                                <div style={modalStyle} className={classes.loadingModal}>
                                    <CircularProgress variant="static" value={progress} size="150px"/>
                                </div>
                            </Modal>
                        </div>
                    }
                </div>
            </Modal>
        </div>
    )
}
