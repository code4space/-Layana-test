import { USER } from "../actions/actionType";

const initialState = {
    user: [],
    absen: [],
    totalPage: 1
}

export interface UserState {
    UserReducer: {
        user?: Array<any>,
        absen?: Array<any>,
        totalPage?: number
    };
}


function UserReducer(state = initialState, action: any) {
    switch (action.type) {
        case USER:
            return {
                ...state,
                user: action.payload.data,
                absen: action.payload.absen,
                totalPage: action.payload.totalPages,
            }
        default:
            return state;
    }
}

export default UserReducer