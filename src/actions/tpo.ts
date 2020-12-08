import {
  LIST_TPO,
  GET_TPO,
  DELETE_TPO,
  UPDATE_TPO,
  NEW_TPO,
  HttpMethod,
  TpoActions,
  ApiAction,
  CREATE_TPO,
  LIST_CATEGORY,
  EDIT_TPO,
  QActions,
  FETCHING_TPO,
} from "../store/types";
import { Entity } from "../types";

export function listCategory(result?: TODO) {
  return {
    type: LIST_CATEGORY,
    payload: result,
  };
}

export function listTpo(result?: TODO) {
  return {
    type: LIST_TPO,
    payload: result,
  };
}

export function getTpo(result?: TODO) {
  return {
    type: GET_TPO,
    payload: result,
  };
}

export function createTpo(result?: TODO) {
  return {
    type: CREATE_TPO,
    payload: result,
  };
}

export function updateTpo(result?: TODO) {
  return {
    type: UPDATE_TPO,
    payload: result,
  };
}

export function deleteTpo(id) {
  return {
    type: DELETE_TPO,
    payload: id,
  };
}

export function newTpo(result?: TODO) {
  return {
    type: NEW_TPO,
    payload: result,
  };
}

export function editTpo(result?: TODO) {
  return {
    type: EDIT_TPO,
    payload: result,

  };
}

export function fetchingTpo(){
  return {
    type: FETCHING_TPO,
    payload: null,
  };
}






export function getAction(
  action: TpoActions,
  id = 0,
  data?: Entity,
  query?: string
): 
Partial<ApiAction & QActions>
// ApiAction | QActions 

{
  switch (action) {

    case GET_TPO:
      return {
        type: GET_TPO,
        endpoint: "tpos/" + id + "?_expand=category",
        method: HttpMethod.GET,
      };

      case NEW_TPO:
        const actions = {
          tpo: {
            type: NEW_TPO,
            endpoint: "tpos/",
            method: HttpMethod.GET,
          },  categoryList: {
            type: LIST_CATEGORY,
            endpoint: "categories/",
            method: HttpMethod.GET,
          },
        };
        return {
          type: NEW_TPO,
          actions:actions,
        };
    case EDIT_TPO:
      const editActions = {
        tpo: {
          type: GET_TPO,
          endpoint: "tpos/" + id + "?_expand=category",
          method: HttpMethod.GET,
        },
        categoryList: {
          type: LIST_CATEGORY,
          endpoint: "categories/",
          method: HttpMethod.GET,
        },
      };
      return {
        type: EDIT_TPO,
        actions:editActions,
      };

    case LIST_TPO:
      return {
        type: LIST_TPO,
        endpoint: `tpos?_expand=category&${query}`,
        method: HttpMethod.GET,
      };
    case UPDATE_TPO:
      return {
        type: UPDATE_TPO,
        endpoint: "tpos/",
        method: HttpMethod.PUT,
        data,
      };
    case CREATE_TPO:
      return {
        type: CREATE_TPO,
        endpoint: "tpos/",
        method: HttpMethod.POST,
        data,
      };
    case DELETE_TPO:
      return {
        type: DELETE_TPO,
        endpoint: "tpos/" + id,
        method: HttpMethod.DELETE,
      };
    case LIST_CATEGORY:
      return {
        type: LIST_CATEGORY,
        endpoint: "categories/",
        method: HttpMethod.GET,
      };
  }
}
