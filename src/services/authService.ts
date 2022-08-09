import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import {clearSessionStorage, saveUserToSessionStorage} from "./sessionService";
import {auth, db} from "../firebase";

export const login = async ({email, password}: any) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const accessToken = await user.getIdToken();
        saveUserToSessionStorage({email, accessToken, uid: user.uid});
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
        clearSessionStorage();
    } catch (err) {
        console.error(err);
        // alert(err.message);
    }
}

export const signup = async ({email, password, name}: any) => {
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
    } catch (err) {
        console.error(err);
        // alert(err.message);
    }
};
