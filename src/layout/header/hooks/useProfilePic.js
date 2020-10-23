import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { profilePic } from '../../../utils/utils';

export const useProfilePic = (userState) => {
    const [profilePicUrl, setProfilePicUrl] = useState(profilePic);
    
    useEffect(() => {
        let unsubscribe;
        if (userState) {
            unsubscribe = db.collection('users').doc(userState.uid).onSnapshot((doc) => {
                setProfilePicUrl(doc.data().profilePic);
            })
        } else {
            setProfilePicUrl(profilePic);
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [userState])

    return profilePicUrl;
}