import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name:'auth',
    initialState:{
        isLogged:false,
         user: null,
    },
    reducers:{
        setLoginUser:(state,action)=>{
            state.isLogged=true;
            state.user=action.payload;
        },
        setLogoutUser:(state)=>{
            state.isLogged=false;
            state.user=null;
        }
    }
});

export const {setLoginUser,setLogoutUser} = authSlice.actions;
export default authSlice.reducer;