import { applyMiddleware, legacy_createStore as createStore, Middleware, Store } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import rootReducer, { RootState } from "./reducers/root";
import { useDispatch } from 'react-redux'

const logger: Middleware<{}, RootState> = (store) => (next) => (action) => {
    const result = next(action);
    return result;
};

type ThunkAction = ThunkMiddleware<RootState, any>;
const store = createStore(
    rootReducer,
    applyMiddleware(logger, thunk as ThunkAction)
);
export default store;


type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch




