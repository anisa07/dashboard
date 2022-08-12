import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchBoardData, fetchBoardNames} from "../services/boardService";
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

export const getBoardNameList = createAsyncThunk('board/boardNamesList', async () => {
    const boardNamesList: Board[] = await fetchBoardNames();
    return {
        boardNamesList
    }
});

export const getBoardData = createAsyncThunk('board/boardData', async (id: string) => {
   const boardData: Board = await fetchBoardData(id) as unknown as Board;
    return {
        boardWithColumns: boardData
    }
});

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
    extraReducers: builder => {
        builder
            .addCase(getBoardNameList.fulfilled, (state, {payload}) => {
                state.boardNamesList = payload.boardNamesList;
            })
            .addCase(getBoardData.fulfilled, (state, {payload}) => {
                state.boardWithColumns = payload.boardWithColumns
            })
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
