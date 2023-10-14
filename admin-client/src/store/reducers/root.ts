import { combineReducers } from "redux";
import UserReducer from "./user";

const rootReducer = combineReducers({
    UserReducer,
})

export type RootState = {
    user: any
}

export default rootReducer