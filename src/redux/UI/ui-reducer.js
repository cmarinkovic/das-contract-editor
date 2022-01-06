import * as actionTypes from "./ui-types";

/**
 * Initial state of the store.
 * @constant
 *
 * @type {Object}
 */
const INITIAL_STATE = {
  appStarted: false,
};

/**
 * UI reducer.
 *
 * @param {Object} state State of the store.
 * @param {Object} action Invoked action.
 * @returns
 */
const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.START_APP:
      return { ...state, appStarted: true };
    default:
      return state;
  }
};

export default uiReducer;
