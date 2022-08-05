import {
    configureStore,
} from '@reduxjs/toolkit';
import boardReducer from '../slice/boardSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer
    },
});
