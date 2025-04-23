import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    updateDoc,
    where,
    limit,
    startAfter,
    DocumentSnapshot
} from 'firebase/firestore';
import {db} from '../firebase/config';

export interface Thread {
    id: string;
    title: string;
    content: string;
    userId: string;
    author: {
        displayName: string;
        photoURL: string | null;
    };
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    commentCount: number;
    viewCount: number;
    likes?: string[];
}

export interface Comment {
    id: string;
    threadId: string;
    content: string;
    userId: string;
    author: {
        displayName: string;
        photoURL: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
    likes?: string[];
}

export const createThread = async (
    title: string,
    content: string,
    userId: string,
    displayName: string,
    photoURL: string | null,
    category: string,
    tags: string[]
) => {
    try {
        const docRef = await addDoc(collection(db, 'threads'), {
            title,
            content,
            userId,
            author: {
                displayName,
                photoURL
            },
            category,
            tags,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            commentCount: 0,
            viewCount: 0
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating thread:', error);
        throw error;
    }
};

export const getThreads = async (lastDoc?: DocumentSnapshot, itemsPerPage = 10) => {
    try {
        let threadsQuery;

        if (lastDoc) {
            threadsQuery = query(
                collection(db, 'threads'),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(itemsPerPage)
            );
        } else {
            threadsQuery = query(
                collection(db, 'threads'),
                orderBy('createdAt', 'desc'),
                limit(itemsPerPage)
            );
        }

        const snapshot = await getDocs(threadsQuery);

        const threads: Thread[] = snapshot.docs.map((doc: DocumentSnapshot) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                content: data.content,
                userId: data.userId,
                author: data.author,
                category: data.category,
                tags: data.tags,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                commentCount: data.commentCount,
                viewCount: data.viewCount,
                likes: data.likes || []
            };
        });

        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        return {threads, lastVisible};
    } catch (error) {
        console.error('Error getting threads:', error);
        throw error;
    }
};

export const getThreadById = async (id: string) => {
    try {
        const docRef = doc(db, 'threads', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Thread not found');
        }

        const threadData = docSnap.data();

        // Increment view count
        await updateDoc(docRef, {
            viewCount: (threadData.viewCount || 0) + 1
        });

        return {
            id: docSnap.id,
            title: threadData.title,
            content: threadData.content,
            userId: threadData.userId,
            author: threadData.author,
            category: threadData.category,
            tags: threadData.tags,
            createdAt: threadData.createdAt?.toDate(),
            updatedAt: threadData.updatedAt?.toDate(),
            commentCount: threadData.commentCount,
            viewCount: (threadData.viewCount || 0) + 1,
            likes: threadData.likes || []
        } as Thread;
    } catch (error) {
        console.error('Error getting thread:', error);
        throw error;
    }
};

export const getThreadsByCategory = async (category: string, lastDoc?: DocumentSnapshot, itemsPerPage = 10) => {
    try {
        let threadsQuery;

        if (lastDoc) {
            threadsQuery = query(
                collection(db, 'threads'),
                where('category', '==', category),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(itemsPerPage)
            );
        } else {
            threadsQuery = query(
                collection(db, 'threads'),
                where('category', '==', category),
                orderBy('createdAt', 'desc'),
                limit(itemsPerPage)
            );
        }

        const snapshot = await getDocs(threadsQuery);

        const threads: Thread[] = snapshot.docs.map((doc: DocumentSnapshot) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                content: data.content,
                userId: data.userId,
                author: data.author,
                category: data.category,
                tags: data.tags,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                commentCount: data.commentCount,
                viewCount: data.viewCount,
                likes: data.likes || []
            };
        });

        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        return {threads, lastVisible};
    } catch (error) {
        console.error('Error getting threads by category:', error);
        throw error;
    }
};

export const toggleThreadLike = async (threadId: string, userId: string): Promise<Thread> => {
    try {
        const threadRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadRef);

        if (!threadDoc.exists()) {
            throw new Error('Thread not found');
        }

        const threadData = threadDoc.data();
        const likes = threadData.likes || [];

        // Check if user already liked the thread
        const userLikedIndex = likes.indexOf(userId);

        // Toggle the like
        if (userLikedIndex === -1) {
            // User hasn't liked it yet, add the like
            likes.push(userId);
        } else {
            // User already liked it, remove the like
            likes.splice(userLikedIndex, 1);
        }

        // Update the thread with the new likes array
        await updateDoc(threadRef, {
            likes,
            updatedAt: serverTimestamp()
        });

        // Return the updated thread
        return {
            id: threadId,
            title: threadData.title,
            content: threadData.content,
            userId: threadData.userId,
            author: threadData.author,
            category: threadData.category,
            tags: threadData.tags,
            createdAt: threadData.createdAt?.toDate(),
            updatedAt: threadData.updatedAt?.toDate(),
            commentCount: threadData.commentCount,
            viewCount: threadData.viewCount,
            likes
        } as Thread;
    } catch (error) {
        console.error('Error toggling thread like:', error);
        throw error;
    }
};

export const addComment = async (
    threadId: string,
    content: string,
    userId: string,
    displayName: string,
    photoURL: string | null
) => {
    try {
        // Add comment to comments collection
        const commentRef = await addDoc(collection(db, 'comments'), {
            threadId,
            content,
            userId,
            author: {
                displayName,
                photoURL
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Update thread's comment count
        const threadRef = doc(db, 'threads', threadId);
        const threadDoc = await getDoc(threadRef);

        if (threadDoc.exists()) {
            await updateDoc(threadRef, {
                commentCount: (threadDoc.data().commentCount || 0) + 1,
                updatedAt: serverTimestamp()
            });
        }

        return commentRef.id;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getCommentsByThreadId = async (threadId: string) => {
    try {
        const commentsQuery = query(
            collection(db, 'comments'),
            where('threadId', '==', threadId),
            orderBy('createdAt', 'asc')
        );

        const snapshot = await getDocs(commentsQuery);

        const comments: Comment[] = snapshot.docs.map((doc: DocumentSnapshot) => {
            const data = doc.data();
            return {
                id: doc.id,
                threadId: data.threadId,
                content: data.content,
                userId: data.userId,
                author: data.author,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                likes: data.likes || []
            };
        });

        return comments;
    } catch (error) {
        console.error('Error getting comments:', error);
        throw error;
    }
};

export const getUserThreads = async (userId: string) => {
    try {
        const threadsQuery = query(
            collection(db, 'threads'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(threadsQuery);

        const threads: Thread[] = snapshot.docs.map((doc: DocumentSnapshot) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                content: data.content,
                userId: data.userId,
                author: data.author,
                category: data.category,
                tags: data.tags,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                commentCount: data.commentCount,
                viewCount: data.viewCount,
                likes: data.likes || []
            };
        });

        return threads;
    } catch (error) {
        console.error('Error getting user threads:', error);
        throw error;
    }
};

export const toggleCommentLike = async (commentId: string, userId: string): Promise<Comment> => {
    try {
        const commentRef = doc(db, 'comments', commentId);
        const commentDoc = await getDoc(commentRef);

        if (!commentDoc.exists()) {
            throw new Error('Comment not found');
        }

        const commentData = commentDoc.data();
        const likes = commentData.likes || [];

        // Check if user already liked the comment
        const userLikedIndex = likes.indexOf(userId);

        // Toggle the like
        if (userLikedIndex === -1) {
            // User hasn't liked it yet, add the like
            likes.push(userId);
        } else {
            // User already liked it, remove the like
            likes.splice(userLikedIndex, 1);
        }

        // Update the comment with the new likes array
        await updateDoc(commentRef, {
            likes,
            updatedAt: serverTimestamp()
        });

        // Return the updated comment
        return {
            id: commentId,
            threadId: commentData.threadId,
            content: commentData.content,
            userId: commentData.userId,
            author: commentData.author,
            createdAt: commentData.createdAt?.toDate(),
            updatedAt: commentData.updatedAt?.toDate(),
            likes
        } as Comment;
    } catch (error) {
        console.error('Error toggling comment like:', error);
        throw error;
    }
};