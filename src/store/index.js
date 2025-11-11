import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./authSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    // добавь другие редьюсеры здесь
});

const store = configureStore({
    reducer: rootReducer,
    // devTools: true по умолчанию в dev
});

export default store;
