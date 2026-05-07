import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from '../slice/auth'
export const store = configureStore({
    reducer:{
        auth : AuthReducer
    }
})