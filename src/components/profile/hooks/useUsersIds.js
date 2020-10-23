import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useUsersIds = (id, listType, listProperty) => {
    const [usersIds, setUsersIds] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(id).collection(listType).onSnapshot(snap => {
            setUsersIds(snap.docs.map(doc => doc.data()[listProperty]));
        })

        return () => unsubscribe();
    },[id]);

    return usersIds;
}