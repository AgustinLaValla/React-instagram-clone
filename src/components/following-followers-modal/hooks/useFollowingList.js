import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useFollowingList = (id) => {
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(id).collection('following').onSnapshot((snap) => {
            setUsersList(snap.docs.map(doc => doc.data().userFollowed));
        });

        return () => unsubscribe ? unsubscribe() : null
    }, [id]);

    return usersList;
} 