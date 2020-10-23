import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useIsFollowing = ({viwerUser, currentUser, following}) => {
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        let unsubscribe;
        if (currentUser && viwerUser) {
            unsubscribe = db.collection('users').doc(viwerUser.uid).collection('following').doc(currentUser.id).onSnapshot((doc) => {
                doc.exists ? setIsFollowing(true) : setIsFollowing(false);
            });
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [viwerUser, currentUser, following]);

    return isFollowing;
};