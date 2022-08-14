import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import {clearSessionStorage, saveUserToSessionStorage} from "./sessionService";
import {auth, db} from "../firebase";
import {getErrorMessage} from "../helpers/helperFunc";

interface Auth {
    email: string,
    password: string,
}

interface User {
    email: string,
    password: string,
    name: string
}

export const login = async ({email, password}: Auth) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const accessToken = await user.getIdToken();
        saveUserToSessionStorage({email, accessToken, uid: user.uid});
    } catch (err: unknown) {
        if (getErrorMessage(err).includes('auth/wrong-password')) {
            throw new Error("Password or email is incorrect");
        }
        if (getErrorMessage(err).includes('auth/user-not-found')) {
            throw new Error("User not registered");
        }
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
        clearSessionStorage();
    } catch (err) {
        throw new Error("Error during logout");
    }
}

export const signup = async ({email, password, name}: User) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const accessToken = await user.getIdToken();
        saveUserToSessionStorage({email, accessToken, uid: user.uid});
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email
        });
    } catch (err: unknown) {
        if (getErrorMessage(err).includes('auth/email-already-in-use')) {
            throw new Error("Email already in use");
        }
        throw new Error("Error during signup");
    }
};
