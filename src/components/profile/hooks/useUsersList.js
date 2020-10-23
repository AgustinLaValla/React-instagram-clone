import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useUsersList = (usersArray, limit) => {

    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if(usersArray.length) {
            unsubscribe = db.collection('users').where('id', 'in', usersArray).limit(limit).onSnapshot(snap => {
                setUsersList(snap.docs.map(doc => doc.data()))
            });
        }

        return () => unsubscribe ? unsubscribe() : null; 
    }, [usersArray, limit]);

    return usersList;
}