import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers(() => {});

const composedEnhancers = composeWithDevTools();

const store = createStore(rootReducer, undefined, composedEnhancers);

export default store;
