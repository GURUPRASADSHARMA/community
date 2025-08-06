import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/AuthSlice.js'


 export const store = configureStore({
    reducer:{
        auth:authReducer
    }
})