import {getUserFromSessionStorage} from "./sessionService";
import {db} from "../firebase";
import {collection, doc, deleteDoc, getDocs, setDoc, getDoc} from "firebase/firestore";

export const fetchBoardNames = async () => {
    const user = getUserFromSessionStorage();
    const querySnapshot = await getDocs(collection(db, "boards"));
    const boards: any[] = [];
    querySnapshot.forEach((doc) => {
        boards.push(doc.data());
    });
    return boards
        .filter(board => board.admins.includes(user.email) || board.users.includes(user.email))
        .map(board => {
            board.columns.columns = [];
            return board;
        })
}

export const fetchBoardData = async (boardId: string) => {
    const docRef = doc(db, "boards", boardId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export const saveBoard = async (board: any) => {
    const user = getUserFromSessionStorage();
    await setDoc(doc(db, "boards", board.id), {...board, admins: [...board.admins, user.email]});
}

export const updateBoard = async (boardToSave: any) => {
    await setDoc(doc(db, "boards", boardToSave.id), boardToSave);
}

export const deleteBoard = async (boardId: string) => {
    await deleteDoc(doc(db, "boards", boardId));
}
