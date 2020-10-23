import { useState, useEffect } from 'react';
import { db } from '../firebase';

export const usePostComments = (post) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (post && post.id) {
            unsubscribe = db.collection('posts').doc(post.id).collection('comments').orderBy('timestamp', 'asc').onSnapshot((snap) => {
                setComments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });
        }

        return () => unsubscribe ? unsubscribe() : null;

    }, [post]);

    return comments;
}

export const useResizeListener = () => {
    const [breakPoint, setBreakpPoint] = useState(false);
    
    const onResize = () => {
        if (window.innerWidth <= 759) {
            setBreakpPoint(true);
        } else {
            setBreakpPoint(false);
        }
    }

    useEffect(() => {
        onResize();
        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    return breakPoint;
}