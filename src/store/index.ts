import { createStore, combineReducers, applyMiddleware,  } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// import { chatReducer, systemReducer } from "./reducers";
import { customerReducer } from "../reducers/customer";
import { authReducer } from "../reducers/auth";
import { orderReducer } from "../reducers/order";
import { productReducer } from "../reducers/product";
import { tpoReducer } from "../reducers/tpo";

const rootReducer = combineReducers({
  customer: customerReducer,
  auth: authReducer,
  order: orderReducer,
  product: productReducer,
  tpo: tpoReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middlewares = [ thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  );

  return store;
}
