import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useUserData = (id) => {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const unsubscribe = db.collection('users').doc(id).onSnapshot((snap) => {
            setUser(snap.data());
        });

        return () => unsubscribe();
    }, [id]);

    return user;

}