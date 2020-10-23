import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useGetPosts = (limit) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('posts')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .onSnapshot((docs) => {
                setPosts(docs.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            });
        return () => unsubscribe();
    }, [limit]);

    return posts;
}