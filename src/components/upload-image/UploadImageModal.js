import React, { useCallback, useState, useEffect } from 'react'
import Dropzone from './Dropzone';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { setStyles } from '../../material/uiStyles';
import Image from './Image';
import './UploadImageModal.css';

const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

const useStyles = makeStyles(theme => ({ ...setStyles(theme) }));


const UploadImageModal = ({ open, handleClose, userState, closeImageModal }) => {
    const classes = useStyles();

    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);


    const onDrop = useCallback((acceptedFile) => {
        setImage(acceptedFile[0]);
        const reader = new FileReader();
        reader.onload = e => setSelectedImage(e.target.result);
        reader.readAsDataURL(acceptedFile[0])
    }, []);

    const getModalStyles = () => !isDragging
        ? (!selectedImage
            ? classes.uploadImageModal__paper
            : classes.papperOnDrop
           )
        : classes.papperOnDrag


    useEffect(() => {
        setImage(null);
        setSelectedImage(null);
    }, [open])

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <div style={modalStyle} className={getModalStyles()}>
                    {
                        (!selectedImage && !image)
                            ?
                            <Dropzone
                                onDrop={onDrop}
                                accept={'image/*'}
                                setIsDragging={setIsDragging} />
                            :
                            <Image
                                image={image}
                                selectedImage={selectedImage}
                                userState={userState}
                                closeImageModal={closeImageModal}
                                onPostUploaded={() => { setImage(null); setSelectedImage(null) }}
                                modalStyle={modalStyle}
                            />
                    }
                </div>
            </Modal>
        </div>
    )
}
export default UploadImageModal;