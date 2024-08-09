import { createSlice, createAsyncThunk, PayloadAction, isAction } from "@reduxjs/toolkit";
import axios from "axios";


//Define Car interface
interface Car {
    _id: string;
    make: string;
    model: string;
    year: number;
    description: string;
}

// define initial state using interface
interface CarState {
    updateState: boolean;
    loading: boolean;
    carList: Car[];
    error: string | null;
    response: string;

}

// initialize CarState with values
const initialState: CarState = {
    updateState: false,
    loading: false,
    carList: [],
    error: null,
    response: "",
}

// Async thunks

// the thunk returns an array of cars
export const fetchCar = createAsyncThunk<Car[]>(
    // action type string used by Redux to identify this thunk
    "car/fetchCar",
    async () => {
        // sends a GET request to the API endpoint of the backend "http://localhost:8000/api/cars"
        const response = await axios.get("http://localhost:8000/api/cars");
        // takes out the 'response' field of the API endpoint.
        // the value returned from this thunk becomes the payload when fulfilled
        return response.data.response;
    }
);

// this thunk is uused to add a new car to the database
export const addCar = createAsyncThunk<Car, { make: string; model: string; year: number; description: string}>(
    // action type string used by Redux to identify this thunk
    "car/addCar",
    // receives data as an argument
    async (data) => {
        // sends a POST to the API endpoint which includes propoerties in the body.
        const response = await axios.post("http://localhost:8000/api/cars", {
            make: data.make,
            model: data.model,
            year: data.year,
            description: data.description,
        });
        // returns the 'response' field from the API response endpoint. 
        // This becomes the payload of the fullfilled action 
        return response.data.response;
    }
);


// the thunk returns the id of the removed car and expects
// to receive the id as an argument
export const removeCar = createAsyncThunk<string, string>(
    // action type string used by Redux to identify this thunk
    "car/removeCar",
    async (_id) => {
        // sends a DELETE request to the API endpoint, removing the specified id.
        const response = await axios.delete(`http://localhost:8000/api/cars/${_id}`);
        // returns the id of the removed car which will be used as payload.
        return _id;
    }
);


// the thunk will return a Car object and expects to receive
// a Car object as an argument.
export const modifiedCar = createAsyncThunk<Car, Car>(
    // action type string used by Redux to identify this thunk
    "car/modifiedCar",
    // the data receives the updated car as an argument
    async (data) => {
        // sends a PUT request to the API endpoint of updated car
        const response = await axios.put(`http://localhost:8000/api/cars/${data._id}`, {
            make: data.make,
            model: data.model,
            year: data.year,
            description: data.description,
        });
        // returns the updated cars detail as a payload when the 
        // action is fulfilled
        return response.data.response;

    }
);

// car slices
const carSlice = createSlice({
    name: "car",
    initialState,
    reducers: {
        changeStateTrue: (state) => {
            state.updateState = true;
        },
        changeStateFalse: (state) => {
            state.updateState = false;
        },
        clearResponse: (state) => {
            state.response = "";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(addCar.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
                state.loading = false;
                state.carList.push(action.payload);
                state.response = "Car successfully added.";
            })
            .addCase(addCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to add employee";
            })

        builder
            .addCase(fetchCar.fulfilled, (state, action: PayloadAction<Car[]>) => {
                state.carList = action.payload;
            })
            .addCase(fetchCar.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch cars"
            })
        
        builder
            .addCase(removeCar.fulfilled, (state, action: PayloadAction<string>) => {
                state.carList = state.carList.filter((item) => item._id !== action.payload);
                state.response = "Car successfully removed";
            })

        builder
            .addCase(modifiedCar.fulfilled, (state, action: PayloadAction<Car>) => {
                const updatedCar = action.payload;
                const index = state.carList.findIndex((item) => item._id === updatedCar._id);
                if (index !== -1) {
                    state.carList[index] = updatedCar;
                }
                state.response = "Car successfully updated";
            });
    },
});

export const { changeStateTrue, changeStateFalse, clearResponse } = carSlice.actions;
export default carSlice.reducer;
