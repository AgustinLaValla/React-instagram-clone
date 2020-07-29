/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { storage, db } from '../firebase';
import * as firebase from 'firebase/app'
import { Button, Input } from '@material-ui/core';
import './ImageUpload.css'

export const ImageUpload = ({userState}) => {

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChage = (file) => {
        // eslint-disable-next-line no-unused-expressions
        file ? (file.type.indexOf('image') > -1 ? setImage(file) : alert('Only image files are allowed')) 
             : setImage(null)
    }

    const handleUpload = () => {
        if(!image) {
            return alert('You should upload an image too!');
        }
        const uploadTask = storage.ref(`images`).child(image.name).put(image);
        uploadTask.on('state_changed', snap => {
            const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setProgress(progress);
        },
            error => alert(error.message),
            async () => {
                const imageUrl = await storage.ref("images").child(image.name).getDownloadURL();
                db.collection('posts').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    imageUrl,
                    username: userState.displayName,
                    caption,
                    userId:userState.uid,
                    likes:[],
                    comments:[]
                });
                setProgress(0);
                setCaption('');
                setImage(null);
            }
        )
    }

    const progressElement = progress > 0 ? <progress value={progress} max="100"></progress> : null;

    return (
        <div className="imageUpload">
            {progressElement}
            <Input placeholder="Enter a caption"
                style={{ width: '100%', margin: '10px 0px' }}
                value={caption}
                onChange={event => setCaption(event.target.value)}
            />
            <input id="file__input" type="file" onChange={event => handleChage(event.target.files[0])} />
            <Button variant="contained" color="secondary" id="post__button" onClick={handleUpload}>Post</Button>
        </div>
    )
}
