import {combineReducers} from "redux";
import uiReducer from "./UI/ui-reducer";
import contractsReducer from "./Contracts/contracts-reducer";


const rootReducer = combineReducers({
    ui: uiReducer,
    contracts: contractsReducer
});

export default rootReducer;
