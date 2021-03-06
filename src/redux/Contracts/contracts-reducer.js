import * as actionTypes from "./contracts-types";

/**
 * Initial state of the store.
 * @constant
 *
 * @type {Object}
 */
const INITIAL_STATE = {
  /*loading: false,*/
  loadedContract: null,
  loadContractError: false,
};

/**
 * Contracts reducer.
 *
 * @param {Object} state State of the store.
 * @param {Object} action Invoked action.
 * @returns
 */
const contractsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LOAD_CONTRACT:
      return {
        ...state,
        loadedContract: action.payload,
      };
    case actionTypes.LOAD_CONTRACT_ERROR:
      return {
        ...state,
        loadContractError: action.payload,
      };
    /*        case actionTypes.FETCH_CONTRACTS_REQUEST:
                return {
                    ...state,
                    loading: true
                }
            case actionTypes.FETCH_CONTRACTS_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    contracts: action.payload,
                    error: ""
                }
            case actionTypes.FETCH_CONTRACTS_FAILURE:
                return {
                    ...state,
                    loading: false,
                    error: action.payload
                }*/
    default:
      return state;
  }
};

export default contractsReducer;
