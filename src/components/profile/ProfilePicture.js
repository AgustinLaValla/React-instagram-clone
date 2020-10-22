import React, { useRef, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { db, storage } from '../../firebase';
import { useAuthStateProvider } from '../../App';
import './Profile.css';

const ProfilePicture = ({ id, viwerId, classes, userData }) => {
    const fileInput = useRef();
    const { auth } = useAuthStateProvider();
    const [, setProgress] = useState(0);

    const uploadImage = (file) => {
        if (file.type.indexOf('image') === -1) return alert('Only image type is allowed');
        const uploadTask = storage.ref('profilePics').child(file.name).put(file);
        uploadTask.on('state_changed', snap => {
            const loadingProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setProgress(loadingProgress);
        },
            error => alert(error.message),
            async () => {
                try {
                    const profilePic = await storage.ref('profilePics').child(file.name).getDownloadURL();
                    await db.collection('users').doc(id).update({ profilePic });
                    await auth.currentUser.updateProfile({ photoURL: profilePic });
                    alert('UPDATED');
                } catch (error) {
                    alert(error.message);
                }
                setProgress(0);
            }
        )
    }


    return (
        <div className="profile__picContainer">
            {
                id === viwerId
                    ?
                    <Tooltip
                        title='Add Profile Picture'
                        placement="right"
                        classes={{ tooltip: classes.tooltip }}
                        onClick={() => fileInput.current.click()}
                    >
                        <div className="image__container">
                            <img className="profile__image" src={userData.profilePic} alt="" />
                        </div>
                    </Tooltip> :

                    <div className="image__container">
                        <img className="profile__image" src={userData.profilePic} alt="" />
                    </div>
            }
            <input ref={fileInput} id="profilePic__input" type="file" hidden onChange={ev => uploadImage(ev.target.files[0])} />
        </div>
    )
}

export default ProfilePicture;
