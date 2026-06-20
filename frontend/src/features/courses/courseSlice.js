import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
    courses: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Fetch public course catalog
export const fetchCourses = createAsyncThunk('courses/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/courses');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        resetCourses: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetCourses } = courseSlice.actions;
export default courseSlice.reducer;
