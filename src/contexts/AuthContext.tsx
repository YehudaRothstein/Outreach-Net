import {createContext, useCallback, useState, ReactNode, useEffect} from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import {doc, setDoc, serverTimestamp, getDoc} from 'firebase/firestore';
import {auth, db} from '../firebase/config';

interface User {
    uid: string;
    email: string | null;
    role: 'user' | 'admin';
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthState: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    error: null,
    register: async () => {},
    login: async () => {},
    logout: async () => {},
    checkAuthState: () => {},
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatUser = async (firebaseUser: FirebaseUser): Promise<User> => {
        // Get the user's role from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userData?.role || 'user' // Default to 'user' if no role is found
        };
    };

    const register = async (email: string, password: string, displayName: string) => {
        setLoading(true);
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update profile to add display name
            await updateProfile(firebaseUser, {displayName});

            // Create user document in Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName,
                photoURL: null,
                createdAt: serverTimestamp(),
                role: 'user'
            });

            const formattedUser = await formatUser(firebaseUser);
            setUser(formattedUser);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const formattedUser = await formatUser(userCredential.user);
            setUser(formattedUser);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const checkAuthState = useCallback(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const formattedUser = await formatUser(firebaseUser);
                    setUser(formattedUser);
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Clean up subscription
        return () => unsubscribe();
    }, []);

    // Run checkAuthState when the component mounts
    useEffect(() => {
        const unsubscribe = checkAuthState();
        return unsubscribe;
    }, [checkAuthState]);

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        checkAuthState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};