import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store";
import { callApi, callTpoApi, login } from "../middleware/api";
import {
  listCustomers,
  getCustomer,
  deleteCustomer,
  newCustomer,
  updateCustomer,
  createCustomer,
} from "../actions/customer";
import { signIn, signOut } from "../actions/auth";

import {
  ApiAction,
  SIGN_IN,
  SIGN_OUT,
  LIST_CUSTOMER,
  GET_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
  NEW_CUSTOMER,
  CREATE_CUSTOMER,
  LIST_ORDER,
  GET_ORDER,
  DELETE_ORDER,
  UPDATE_ORDER,
  NEW_ORDER,
  CREATE_ORDER,
  LIST_PRODUCT,
  GET_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  NEW_PRODUCT,
  CREATE_PRODUCT,
  NewAction,
  LIST_CATEGORY,
  QActions,
  EDIT_PRODUCT,
  EDIT_ORDER,

  LIST_TPO,
  GET_TPO,
  DELETE_TPO,
  UPDATE_TPO,
  NEW_TPO,
  CREATE_TPO,
  EDIT_TPO,
  // NewTpoAction,
} from "../store/types";
import {
  Customer,
  CustomerModel,
  OrderModel,
  Product,
  ProductModel,
  Tpo,
  TpoModel,
  Order,
} from "../types";
import {
  listOrder,
  newOrder,
  getOrder,
  updateOrder,
  createOrder,
  deleteOrder,
  editOrder,
} from "../actions/order";
import {
  listProduct,
  newProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategory,
  editProduct,
} from "../actions/product";
import {
  listTpo,
  newTpo,
  getTpo,
  createTpo,
  updateTpo,
  deleteTpo,
  editTpo,
} from "../actions/tpo";

export const thunkAuth = (
  apiAction?: ApiAction
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  let response;

  const { type, endpoint, method, data } = apiAction;
  
  response = data;
  if (type === SIGN_IN) {
    response = await login(endpoint, method, data);
  }

  dispatchSignIn(dispatch, type, response);
};

function dispatchSignIn(dispatch, type, response) {
  switch (type) {
    case SIGN_IN:
      dispatch(signIn(response));
      break;
    case SIGN_OUT:
      dispatch(signOut(response));
      break;
  }
}

export const thunkApiCall = (
  apiAction?: ApiAction
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  let response: TODO;
  const { type, endpoint, method, data, filters } = apiAction;
  console.log("***************** thunkApiCall For ***************** type = "+type);
  if (!isNewAction(type)) {
    response = await callApi(endpoint, method, data, filters);
  } else {
    response = getNewEntity(type);
  }
  
  dispatchReponse(dispatch, type, response);
};

export const thunkApiQCall = (
  qActions: QActions
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  const response = {};
  const { type, actions } = qActions;
  

  for (const key in actions) {
    console.log("***************** thunkApi Q Call For ***************** key = "+key);
    const res = await callEndPoint(actions[key]);
    response[key] = res.data;
  }

  
  dispatchReponse(dispatch, type, response);
};

export const thunkTpoApiCall = (
  apiAction?: ApiAction
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  let response: TODO;
  const { type, endpoint, method, data, filters } = apiAction;
  console.log("***************** thunkTpoApiCall For ***************** type = "+type);
  if (!isNewAction(type)) {
    response = await callTpoApi(endpoint, method, data, filters);
  } else {
    response = getNewEntity(type);
  }
  
  dispatchReponse(dispatch, type, response);
};

export const thunkTpoApiQCall = (
  qActions: QActions
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  const response = {};
  const { type, actions } = qActions;
  
  console.log("***************** thunkTpoApi Q Call *****************");
  for (const key in actions) {
    console.log("***************** thunkTpoApi Q Call For ***************** key = "+key);
    const res = await callTpoEndPoint(actions[key]);
    response[key] = res.data;
  }

  
  dispatchReponse(dispatch, type, response);
};

function getNewEntity(newAction: NewAction) {
  switch (newAction) {
    case NEW_CUSTOMER:
      return {
        data: new CustomerModel() as Customer,
      };
    case NEW_ORDER:
      return {
        data: new OrderModel() as Order,
      };
    case NEW_PRODUCT:
      return {
        data: new ProductModel() as Product,
      };
    case NEW_TPO:
    return {
      data: new TpoModel() as Tpo,
    };
  }
}

async function callEndPoint(apiAction: ApiAction) {
  let response: TODO;
  const { type, endpoint, method, data, filters } = apiAction;
  if (!isNewAction(type)) {
    response = await callApi(endpoint, method, data, filters);
  } else {
    response = getNewEntity(type);
  }
  return response;
}

async function callTpoEndPoint(apiAction: ApiAction) {
  let response: TODO;
  const { type, endpoint, method, data, filters } = apiAction;
  if (!isNewAction(type)) {
    response = await callTpoApi(endpoint, method, data, filters);
  } else {
    response = getNewEntity(type);
  }
  return response;
}

const isNewAction = (x: any): x is NewAction => x.toString().startsWith("NEW_");

function dispatchReponse(dispatch, type, response) {
  console.log("***************** dispatchReponse *****************");
  switch (type) {
    case LIST_CUSTOMER:
      dispatch(listCustomers(response.data));
      break;
    case NEW_CUSTOMER:
      dispatch(newCustomer(response.data));
      break;
    case GET_CUSTOMER:
      dispatch(getCustomer(response.data));
      break;
    case CREATE_CUSTOMER:
      dispatch(createCustomer(response.data));
      break;
    case UPDATE_CUSTOMER:
      dispatch(updateCustomer(response.data));
      break;
    case DELETE_CUSTOMER:
      dispatch(deleteCustomer(response.data));
      break;
    //------------------------
    case LIST_ORDER:
      dispatch(listOrder(response.data));
      break;
    case NEW_ORDER:
      dispatch(newOrder(response.data));
      break;
    case GET_ORDER:
      dispatch(getOrder(response.data));
      break;
    case CREATE_ORDER:
      dispatch(createOrder(response.data));
      break;
    case UPDATE_ORDER:
      dispatch(updateOrder(response.data));
      break;
    case DELETE_ORDER:
      dispatch(deleteOrder(response.data));
      break;
    case EDIT_ORDER:
      dispatch(editOrder(response));
      break;
    //------------------------
    case LIST_PRODUCT:
      dispatch(listProduct(response.data));
      break;
    case GET_PRODUCT:
      dispatch(getProduct(response.data));
      break;
    case NEW_PRODUCT:
      dispatch(newProduct(response));
      break;
    case EDIT_PRODUCT:
      dispatch(editProduct(response));
      break;
    case CREATE_PRODUCT:
      dispatch(createProduct(response.data));
      break;
    case UPDATE_PRODUCT:
      dispatch(updateProduct(response.data));
      break;
    case DELETE_PRODUCT:
      dispatch(deleteProduct(response.data));
      break;
    //------------------------
    case LIST_TPO:
      dispatch(listTpo(response.data));
      break;
    case GET_TPO:
      dispatch(getTpo(response.data));
      break;
    case NEW_TPO:
      dispatch(newTpo(response));
      break;
    case EDIT_TPO:
      dispatch(editTpo(response));
      break;
    case CREATE_TPO:
      dispatch(createTpo(response.data));
      break;
    case UPDATE_TPO:
      dispatch(updateTpo(response.data));
      break;
    case DELETE_TPO:
      dispatch(deleteTpo(response.data));
      break;

    case LIST_CATEGORY:
      dispatch(listCategory(response.data));
      break;
  }
}
