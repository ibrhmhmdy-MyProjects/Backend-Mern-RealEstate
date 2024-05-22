import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state)=>{
            state.loading = true;
        },
        signInSuccess: (state,action)=>{
            state.loading = false
            state.error = null
            state.currentUser = action.payload
        },
        signInFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        updateUserStart: (state)=>{
            state.loading = true;
        },
        updateUserSuccess: (state,action)=>{
            state.loading = false
            state.error = null
            state.currentUser = action.payload
        },
        updateUserFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        deleteUserStart: (state)=>{
            state.loading = true;
        },
        deleteUserSuccess: (state)=>{
            state.loading = false
            state.error = null
            state.currentUser = null
        },
        deleteUserFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        signOutStart: (state)=>{
            state.loading = true;
        },
        signOutSuccess: (state)=>{
            state.loading = false
            state.error = null
            state.currentUser = null
        },
        signOutFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
        }
    }
});

export const {
        signInStart,signInSuccess,signInFailure,
        updateUserStart,updateUserSuccess,updateUserFailure,
        deleteUserStart,deleteUserSuccess,deleteUserFailure,
        signOutStart,signOutSuccess,signOutFailure
    } = userSlice.actions;
export default userSlice.reducer;