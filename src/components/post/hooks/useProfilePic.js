import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { profilePic } from '../../../utils/utils';

export const useProfilePic = (post) => {
    const [profilePicUrl, setProfilePicUrl] = useState(profilePic);

    useEffect(() => {
        if (post && post.userId) {
            db.collection('users').doc(post.userId).get().then(doc => {
                setProfilePicUrl(doc.data().profilePic);
            });

        }
        return () => {}
    }, [post]);

    return profilePicUrl;
}