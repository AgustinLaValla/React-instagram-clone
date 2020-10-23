import { useState, useEffect } from 'react';
import { db } from '../../../firebase';

export const useCurrentPost = (postId) => {
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts').doc(postId).onSnapshot((doc) => setCurrentPost({ ...doc.data(), id: doc.id }));
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [postId]);

    return currentPost;
}