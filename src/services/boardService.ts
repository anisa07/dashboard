import {getUserFromSessionStorage} from "./sessionService";
import {db} from "../firebase";
import {collection, doc, deleteDoc, getDocs, setDoc, getDoc} from "firebase/firestore";
import {Board} from "../types/dataTypes";

export const fetchBoardNames = async () => {
    const user = getUserFromSessionStorage();
    const querySnapshot = await getDocs(collection(db, "boards"));
    const boards: Board[] = [];
    querySnapshot.forEach((doc) => {
        boards.push(doc.data() as Board);
    });
    return boards
        .filter(board => board.admins.includes(user.email) || board.users.includes(user.email))
        .map(board => {
            board.columns = [];
            return board;
        })
}

export const fetchBoardData = async (boardId: string) => {
    const docRef = doc(db, "boards", boardId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : undefined;
}

export const saveBoard = async (board: Board) => {
    await setDoc(doc(db, "boards", board.id), board);
}

export const updateBoard = async (boardToSave: Board) => {
    await setDoc(doc(db, "boards", boardToSave.id), boardToSave);
}

export const deleteBoard = async (boardId: string) => {
    await deleteDoc(doc(db, "boards", boardId));
}
