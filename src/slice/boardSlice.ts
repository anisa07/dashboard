import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchBoardData, fetchBoardList} from "../services/boardService";
import {RootState} from "../types/storeTypes";

export type BoardState = {
    boardList: any[],
    boardWithColumns: any,
    currentBoard: any,
};

const initialState: BoardState = {
    boardList: [],
    boardWithColumns: {columns: []},
    currentBoard: undefined
};

export const getBoardList = createAsyncThunk('board/boardList', async () => {
    const boardList = await fetchBoardList();
    return {
        boardList
    }
});

export const getBoardData = createAsyncThunk('board/boardData', async (id: string) => {
   const boardList = await fetchBoardData(id);
    return {
        boardWithColumns: boardList
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
        setBoardList: (state, action: PayloadAction<any[]>) => {
            state.boardList = action.payload || [];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getBoardList.fulfilled, (state, {payload}) => {
                state.boardList = payload.boardList;
            })
            .addCase(getBoardData.fulfilled, (state, {payload}) => {
                state.boardWithColumns = payload.boardWithColumns
            })
    },
});

export const {
    setCurrentBoard,
    setBoardWithColumns,
    setBoardList,
} = boardSlice.actions;

export const selectBoardList = (state: RootState) => state.board.boardList;
export const selectCurrentBoard = (state: RootState) => state.board.currentBoard;
export const selectBoardWithColumns = (state: RootState) => state.board.boardWithColumns;

export default boardSlice.reducer;
