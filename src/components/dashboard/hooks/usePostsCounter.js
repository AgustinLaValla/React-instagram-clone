import { useState ,useEffect } from 'react';
import { db } from '../../../firebase';

export const usePostsCounter = () => {
    const [totalPosts, setTotalPosts] = useState(0);
    
    useEffect(() => {
        const unsubscribe = db.collection('posts-counter').doc('-- post counter --').onSnapshot(snap => {
            if (snap.exists) {
                setTotalPosts(snap.data().totalPosts);
            }
        });

        return () => unsubscribe();

    }, []);

    return totalPosts;
}