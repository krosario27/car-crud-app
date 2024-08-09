import { configureStore } from "@reduxjs/toolkit";
import carReducer from '../features/carSlice';


// store instance created by configureStore
export const store = configureStore({ 
    reducer: {
        // state related to carKey is managed by carReducer
        carKey: carReducer,
    },
});


// represents the shape of the entire Redux store.
export type RootState = ReturnType<typeof store.getState>;

// represents the dispatch action for the Redux store.
export type AppDispatch = typeof store.dispatch;

