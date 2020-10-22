import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { db, storage } from '../../firebase';
import * as firebase from 'firebase/app';
import './UploadImageModal.css';

const FormCaption = ({ onPostUploaded, setOpenLoadingModal, image, userState, setProgress}) => {

    const [caption, setCaption] = useState('');

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
                    const counter = await db.collection('posts-counter').get();
                    if (counter.empty) {
                        await db.collection('posts-counter').doc('-- post counter --').set({ totalPosts: 1 });
                    } else {
                        await db.collection('posts-counter').doc('-- post counter --').update({
                            totalPosts: firebase.firestore.FieldValue.increment(1)
                        })
                    }
                    setCaption('');
                    onPostUploaded();

                } catch (error) {
                    console.log(error);
                }
            }
        )
    }

    return (
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
    )
}

export default FormCaption
