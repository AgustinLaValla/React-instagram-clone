import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setStyles } from '../../material/uiStyles';
import FormCaption from './FormCaption';
import './UploadImageModal.css';


const useStyles = makeStyles(theme => ({ ...setStyles(theme) }));

const Image = ({ selectedImage, image, closeImageModal, userState, onPostUploaded, modalStyle }) => {
    const classes = useStyles();
    const [progress, setProgress] = useState(0);

    const [openLoadingModal, setOpenLoadingModal] = useState(false);

    const postUploaded = () => {
        setOpenLoadingModal(false);
        setProgress(0);
        closeImageModal();
        onPostUploaded();
    }

    return (
        <div id="uploadImage__postContainer">
            <img src={selectedImage} alt="" id="uploadImage__postImage" />
            <FormCaption
                onPostUploaded={postUploaded}
                userState={userState}
                image={image}
                setOpenLoadingModal={setOpenLoadingModal}
                setProgress={setProgress}
            />
            <Modal open={openLoadingModal}>
                <div style={modalStyle} className={classes.loadingModal}>
                    <CircularProgress variant="static" value={progress} size="150px" />
                </div>
            </Modal>
        </div>
    )
}

export default Image
