import {getUserFromSessionStorage} from "./sessionService";
import {db} from "../firebase";
import {collection, doc, deleteDoc, getDocs, setDoc, onSnapshot} from "firebase/firestore";
import {Board} from "../types/dataTypes";
import {store} from "../store/store";

export const fetchBoardNames = async () => {
    try {
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
    } catch (e: unknown) {
        throw new Error("Error fetching boards list")
    }
}

export const fetchBoardData = async (boardId: string) => {
    try {
        onSnapshot(doc(db, "boards", boardId), (doc) => {
            const boardData: Board = doc.data() as Board;
            store.dispatch({type: 'board/setBoardWithColumns', payload: boardData})
        });
    } catch (e: unknown) {
        throw new Error("Error fetching board details")
    }
}

export const saveBoard = async (board: Board) => {
    try {
        await setDoc(doc(db, "boards", board.id), board);
    } catch (e: unknown) {
        throw new Error("Error saving new board")
    }
}

export const updateBoard = async (boardToSave: Board) => {
    try {
        await setDoc(doc(db, "boards", boardToSave.id), boardToSave);
    } catch (e: unknown) {
        throw new Error("Error updating board")
    }
}

export const deleteBoard = async (boardId: string) => {
    try {
        await deleteDoc(doc(db, "boards", boardId));
    } catch (e: unknown) {
        throw new Error("Error deleting board")
    }
}
