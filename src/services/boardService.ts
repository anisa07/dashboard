import {getUserFromSessionStorage} from "./sessionService";

const api = "http://localhost:5000";

export const fetchBoardList = async () => {
    const response = await fetch(`${api}/boards`);
    const boards = await response.json();
    const user = getUserFromSessionStorage();
    return (boards || [])
        .filter((board: any) => (board.users.includes(user.email) || board.admins.includes(user.email)))
        .map(({id, name, users, admins, columns}: any) => ({
            id,
            name,
            users,
            admins,
            columns: columns.map(({id, name}: any) => ({id, name, cards: []}))
        }));
}

export const fetchBoardData = async (boardId: string) => {
    const response = await fetch(`${api}/boards?id=${boardId}`);
    const boardList = await response.json();
    return boardList[0];
}

function options<T>(method: string, body?: T) {
    return {
        method: method,
        mode: 'cors' as RequestMode | undefined,
        credentials: 'same-origin' as RequestCredentials | undefined,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body || {})
    }
}

export const saveBoard = async (board: any) => {
    const user = getUserFromSessionStorage();
    const response = await fetch(`${api}/boards`, options('POST', {...board, admins: [...board.admins, user.email]}));
    return await response.json();
}

export const updateBoard = async (boardToSave: any) => {
    const response = await fetch(`${api}/boards/${boardToSave.id}`, options('PUT', boardToSave));
    return await response.json();
}

export const deleteBoard = async (boardId: string) => {
    const response = await fetch(`${api}/boards/${boardId}`, options('DELETE'));
    return await response.json();
}
