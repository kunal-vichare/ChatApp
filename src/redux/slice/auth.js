import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name:'auth',
    initialState:{
        isLogged:false
    },
    reducers:{
        setLoginUser:(state)=>{
            state.isLogged=true;
        },
        setLogoutUser:(state)=>{
            state.isLogged=false;
        }
    }
});

export const {setLoginUser,setLogoutUser} = authSlice.actions;
export default authSlice.reducer;