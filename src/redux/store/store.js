import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from '../slice/auth'
import themeReducer from '../slice/darkMode'
export const store = configureStore({
    reducer:{
        auth : AuthReducer,
        theme : themeReducer
    }
})