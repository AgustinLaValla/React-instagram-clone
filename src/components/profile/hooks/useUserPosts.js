import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useUserPosts = (id) => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
        const unsubscribe = db.collection('posts').where('userId', '==', id).orderBy('timestamp', 'desc').onSnapshot(snap => {
            setPosts(snap.docs.map(doc => ({ ...doc.data(), postId: doc.id })));
        });

        return () => unsubscribe ? unsubscribe() : null;
    }, [id]);

    return posts;

}