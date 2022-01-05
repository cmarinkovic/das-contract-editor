import * as actionTypes from "./contracts-types";

export const loadContract = (contract) => {
  return {
    type: actionTypes.LOAD_CONTRACT,
    payload: contract,
  };
};

export const setLoadContractError = (isError) => {
  return {
    type: actionTypes.LOAD_CONTRACT_ERROR,
    payload: isError,
  };
};

/*export const fetchContractsRequest = () => {
    return {
        type: actionTypes.FETCH_CONTRACTS_REQUEST,
    }
};

export const fetchContractsSuccess = contracts => {
    return {
        type: actionTypes.FETCH_CONTRACTS_SUCCESS,
        payload: contracts
    }
};

export const fetchContractsFailure = error => {
    return {
        type: actionTypes.FETCH_CONTRACTS_FAILURE,
        payload: error
    }
};

export const fetchContracts = () => {
    return (dispatch) => {
        dispatch(fetchContractsRequest);
        axios.get("http://localhost:3001/contracts")
            .then(
                response => {
                    const contracts = response.data
                    dispatch(fetchContractsSuccess(contracts))
                })
            .catch(
                error => {
                    const errorMsg = error.message;
                    dispatch(fetchContractsFailure(errorMsg))
                }
            );
    }
}*/
