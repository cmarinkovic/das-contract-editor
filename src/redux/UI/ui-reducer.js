import * as actionTypes from "./ui-types";

const INITIAL_STATE = {
    appStarted: false,
};

const uiReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.START_APP:
            return {...state,
            appStarted: true};
        default:
            return state
    }
};

export default uiReducer;
