import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../types/storeTypes";
import {Board} from "../types/dataTypes";

export type BoardState = {
    boardNamesList: Board[],
    boardWithColumns: Board,
    currentBoard: Board,
};

const initialState: BoardState = {
    boardNamesList: [],
    boardWithColumns: {columns: []} as unknown as Board,
    currentBoard: undefined as unknown as Board
};

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setCurrentBoard: (state, action: PayloadAction<Board>) => {
            state.currentBoard = action.payload;
        },
        setBoardWithColumns: (state, action: PayloadAction<Board>) => {
            state.boardWithColumns = action.payload;
        },
        setBoardNamesList: (state, action: PayloadAction<Board[]>) => {
            state.boardNamesList = action.payload || [];
        }
    },
});

export const {
    setCurrentBoard,
    setBoardWithColumns,
    setBoardNamesList,
} = boardSlice.actions;

export const selectBoardNamesList = (state: RootState) => state.board.boardNamesList;
export const selectCurrentBoard = (state: RootState) => state.board.currentBoard;
export const selectBoardWithColumns = (state: RootState) => state.board.boardWithColumns;

export default boardSlice.reducer;
