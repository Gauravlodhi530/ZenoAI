import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            // Save to localStorage as backup
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        loginFailure: (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = action.payload;
            // Clear localStorage on failure
            localStorage.removeItem('user');
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
            // Clear localStorage on logout
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
        restoreAuth: (state, action) => {
            // Restore auth state from localStorage
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        resetLoading: (state) => {
            state.loading = false;
            state.error = null;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, restoreAuth, resetLoading } = authSlice.actions;
export default authSlice.reducer;