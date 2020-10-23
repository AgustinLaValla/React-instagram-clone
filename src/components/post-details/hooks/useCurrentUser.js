import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useCurrentUser = (currentPost) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        let unsubscribe;
        if (currentPost) {
            unsubscribe = db.collection('users').doc(currentPost.userId).onSnapshot((snap) => {
                setCurrentUser(snap.data());
            });
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [currentPost])

    return currentUser;
};