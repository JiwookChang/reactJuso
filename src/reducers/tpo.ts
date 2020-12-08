import {
  TpoState, TpoActionTypes,
  CREATE_TPO,
  UPDATE_TPO,
  DELETE_TPO,
  GET_TPO,
  LIST_TPO,
  NEW_TPO,
  EDIT_TPO,
  FETCHING_TPO
} from '../store/types';
import { Tpo, TpoModel } from '../types';

export function tpoReducer(
  state: TpoState = {
    isFetching: true,
    tpo: new TpoModel() as Tpo, // {} as Tpo,
    categoryList: [],
    tpoList:[],
    deleted: false,
    updated: false,
  },
  action: TpoActionTypes
) {
  console.log(action)
  switch (action.type) {
    case FETCHING_TPO:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: "",
        deleted: false,
        updated:false,
      })
    case LIST_TPO:
      return Object.assign({}, state, {
        isFetching: false,
        tpoList: action.payload,
        errorMessage: "",
        deleted: false,
        updated:false
      })
      
    case GET_TPO:
      return Object.assign({}, state, {
        isFetching: false,
        tpo:action.payload,
        errorMessage: action.error,
        deleted: false,
        updated: false
      });
    case NEW_TPO:
    case EDIT_TPO:
      const {tpo, categoryList} = action.payload
      return Object.assign({}, state, {
        isFetching: false,
        tpo,
        categoryList,
        errorMessage: action.error,
        deleted: false,
        updated: false
      });
    case CREATE_TPO:
    case UPDATE_TPO:
      return Object.assign({}, state, {
        isFetching: false,
        tpo: action.payload,
        errorMessage: action.error,
        deleted: false,
        updated: true
      });
    case DELETE_TPO:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.error,
        deleted: (!action.error && action.payload )? true : false,
        updated: false
      });

    default:
      return state;
  }
}
