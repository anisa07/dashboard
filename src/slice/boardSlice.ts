import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchBoardData, fetchBoardNames} from "../services/boardService";
import {RootState} from "../types/storeTypes";

export type BoardState = {
    boardNamesList: any[],
    boardWithColumns: any,
    currentBoard: any,
};

const initialState: BoardState = {
    boardNamesList: [],
    boardWithColumns: {columns: []},
    currentBoard: undefined
};

export const getBoardNameList = createAsyncThunk('board/boardNamesList', async () => {
    const boardNamesList: any[] = await fetchBoardNames();
    return {
        boardNamesList
    }
});

export const getBoardData = createAsyncThunk('board/boardData', async (id: string) => {
   const boardData = await fetchBoardData(id);
   console.log(boardData)
    return {
        boardWithColumns: boardData
    }
});

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setCurrentBoard: (state, action: PayloadAction<any>) => {
            state.currentBoard = action.payload;
        },
        setBoardWithColumns: (state, action: PayloadAction<any>) => {
            state.boardWithColumns = action.payload;
        },
        setBoardNamesList: (state, action: PayloadAction<any[]>) => {
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
