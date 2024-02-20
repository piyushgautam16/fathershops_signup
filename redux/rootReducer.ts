import { combineReducers } from "redux";
import { authReducer } from "./reducer";

export default combineReducers({
    auth: authReducer
})
