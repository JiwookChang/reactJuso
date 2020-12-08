import {
  Customer,
  User,
  Order,
  Product,
  Tpo,
  Category,
} from "../types";

export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
}

export interface ApiAction {
  type: TODO;
  endpoint: string;
  method: HttpMethod;
  data?: TODO;
  filters?: TODO;
}

export interface QActions {
  type: TODO;
  actions: { [key: string]: ApiAction };
}

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export interface AuthState {
  isFetching: boolean;
  user: User;
  token: string | undefined | null;
  isAuthenticated: boolean;
  errorMessage?: null;
}
interface SignInAction {
  type: typeof SIGN_IN;
  payload: { user?: User; token?: string };
  error?: string;
}

interface SignOutAction {
  type: typeof SIGN_OUT;
  payload: { user?: User; token?: string };
  error?: string;
}

export type AuthActionTypes = SignInAction | SignOutAction;

export type AuthActions = typeof SIGN_IN | typeof SIGN_OUT;

export const LIST_CUSTOMER = "LIST_CUSTOMER";
export const GET_CUSTOMER = "GET_CUSTOMER";
export const NEW_CUSTOMER = "NEW_CUSTOMER";
export const UPDATE_CUSTOMER = "UPDATE_CUSTOMER";
export const CREATE_CUSTOMER = "CREATE_CUSTOMER";
export const DELETE_CUSTOMER = "DELETE_CUSTOMER";

export interface CustomerState {
  isFetching: boolean;
  customer: Customer;
  customerList: [];
  error?: null;
  deleted?: boolean;
  updated?: boolean;
}

interface GetCustomerAction {
  type: typeof GET_CUSTOMER;
  payload: Customer;
  error?: string;
}

interface ListCustomerAction {
  type: typeof LIST_CUSTOMER;
  payload: Customer[];
}

interface NewCustomerAction {
  type: typeof NEW_CUSTOMER;
  payload: Customer;
  error?: string;
}

interface UpdateCustomerAction {
  type: typeof UPDATE_CUSTOMER;
  payload: Customer;
  error?: string;
}

interface CreateCustomerAction {
  type: typeof CREATE_CUSTOMER;
  payload: Customer;
  error?: string;
}

interface DeleteCustomerAction {
  type: typeof DELETE_CUSTOMER;
  payload: number;
  error?: string;
}

export type CustomerActions =
  | typeof LIST_CUSTOMER
  | typeof GET_CUSTOMER
  | typeof NEW_CUSTOMER
  | typeof UPDATE_CUSTOMER
  | typeof CREATE_CUSTOMER
  | typeof DELETE_CUSTOMER;

export type CustomerActionTypes =
  | NewCustomerAction
  | GetCustomerAction
  | CreateCustomerAction
  | ListCustomerAction
  | UpdateCustomerAction
  | DeleteCustomerAction;

export const LIST_ORDER = "LIST_ORDER";
export const GET_ORDER = "GET_ORDER";
export const NEW_ORDER = "NEW_ORDER";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const CREATE_ORDER = "CREATE_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";
export const EDIT_ORDER = "EDIT_ORDER";

export interface OrderState {
  isFetching: boolean;
  order: Order;
  orderList: [];
  error?: null;
  deleted?: boolean;
  updated?: boolean;
}

interface GetOrderAction {
  type: typeof GET_ORDER;
  payload: Order;
  error?: string;
}

interface ListOrderAction {
  type: typeof LIST_ORDER;
  payload: Order[];
}

interface NewOrderAction {
  type: typeof NEW_ORDER;
  payload: Order;
  error?: string;
}

interface UpdateOrderAction {
  type: typeof UPDATE_ORDER;
  payload: Order;
  error?: string;
}

interface CreateOrderAction {
  type: typeof CREATE_ORDER;
  payload: Order;
  error?: string;
}

interface DeleteOrderAction {
  type: typeof DELETE_ORDER;
  payload: number;
  error?: string;
}

interface EditOrderAction {
  type: typeof EDIT_ORDER;
  payload: {
    order: Order;
    categoryList: Category[];
    productList: Product[];
  };
  error?: string;
}

export type OrderActions =
  | typeof LIST_ORDER
  | typeof GET_ORDER
  | typeof NEW_ORDER
  | typeof UPDATE_ORDER
  | typeof CREATE_ORDER
  | typeof DELETE_ORDER
  | typeof EDIT_ORDER;

export type OrderActionTypes =
  | NewOrderAction
  | GetOrderAction
  | CreateOrderAction
  | ListOrderAction
  | UpdateOrderAction
  | DeleteOrderAction
  | EditOrderAction;

export const LIST_PRODUCT = "LIST_PRODUCT";
export const GET_PRODUCT = "GET_PRODUCT";
export const NEW_PRODUCT = "NEW_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const LIST_CATEGORY = "LIST_CATEGORY";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const FETCHING_PRODUCT = "FETCHING_PRODUCT"

export interface ProductState {
  isFetching: boolean;
  product: Product;
  productList: Product[];
  categoryList: Category[];
  error?: null;
  deleted?: boolean;
  updated?: boolean;
}

interface GetProductAction {
  type: typeof GET_PRODUCT;
  payload: Product;
  error?: string;
}

interface ListProductAction {
  type: typeof LIST_PRODUCT;
  payload: Product[];
}

interface NewProductAction {
  type: typeof NEW_PRODUCT;
  payload: { product: Product; categoryList: Category[] };
  error?: string;
}

interface UpdateProductAction {
  type: typeof UPDATE_PRODUCT;
  payload: Product;
  error?: string;
}

interface CreateProductAction {
  type: typeof CREATE_PRODUCT;
  payload: Product;
  error?: string;
}

interface DeleteProductAction {
  type: typeof DELETE_PRODUCT;
  payload: number;
  error?: string;
}

interface ListCategoryAction {
  type: typeof LIST_CATEGORY;
  payload: Category[];
}

interface EditProductAction {
  type: typeof EDIT_PRODUCT;
  payload: { product: Product; categoryList: Category[] };
  error?: string;
}

interface FetchingProductAction {
  type: typeof FETCHING_PRODUCT;
  payload: null;
  error?: string;
}

export type ProductActions =
  | typeof EDIT_PRODUCT
  | typeof LIST_CATEGORY
  | typeof LIST_PRODUCT
  | typeof GET_PRODUCT
  | typeof NEW_PRODUCT
  | typeof UPDATE_PRODUCT
  | typeof CREATE_PRODUCT
  | typeof DELETE_PRODUCT
  | typeof FETCHING_PRODUCT

export type ProductActionTypes =
  | EditProductAction
  | ListCategoryAction
  | NewProductAction
  | GetProductAction
  | CreateProductAction
  | ListProductAction
  | UpdateProductAction
  | DeleteProductAction
  | FetchingProductAction

  export const LIST_TPO = "LIST_TPO";
  export const GET_TPO = "GET_TPO";
  export const NEW_TPO = "NEW_TPO";
  export const UPDATE_TPO = "UPDATE_TPO";
  export const CREATE_TPO = "CREATE_TPO";
  export const DELETE_TPO = "DELETE_TPO";
  export const EDIT_TPO = "EDIT_TPO";
  export const FETCHING_TPO = "FETCHING_TPO"
  
  export interface TpoState {
    isFetching: boolean;
    tpo: Tpo;
    tpoList: Tpo[];
    categoryList: Category[];
    error?: null;
    deleted?: boolean;
    updated?: boolean;
  }
  
  interface GetTpoAction {
    type: typeof GET_TPO;
    payload: Tpo;
    error?: string;
  }
  
  interface ListTpoAction {
    type: typeof LIST_TPO;
    payload: Tpo[];
  }
  
  interface NewTpoAction {
    type: typeof NEW_TPO;
    payload: { tpo: Tpo; categoryList: Category[] };
    error?: string;
  }
  
  interface UpdateTpoAction {
    type: typeof UPDATE_TPO;
    payload: Tpo;
    error?: string;
  }
  
  interface CreateTpoAction {
    type: typeof CREATE_TPO;
    payload: Tpo;
    error?: string;
  }
  
  interface DeleteTpoAction {
    type: typeof DELETE_TPO;
    payload: number;
    error?: string;
  }
  
  interface EditTpoAction {
    type: typeof EDIT_TPO;
    payload: { tpo: Tpo; categoryList: Category[] };
    error?: string;
  }
  
  interface FetchingTpoAction {
    type: typeof FETCHING_TPO;
    payload: null;
    error?: string;
  }
  
  export type TpoActions =
    | typeof EDIT_TPO
    | typeof LIST_CATEGORY
    | typeof LIST_TPO
    | typeof GET_TPO
    | typeof NEW_TPO
    | typeof UPDATE_TPO
    | typeof CREATE_TPO
    | typeof DELETE_TPO
    | typeof FETCHING_TPO
  
  export type TpoActionTypes =
    | EditTpoAction
    | ListCategoryAction
    | NewTpoAction
    | GetTpoAction
    | CreateTpoAction
    | ListTpoAction
    | UpdateTpoAction
    | DeleteTpoAction
    | FetchingTpoAction

export type NewAction =
  | typeof NEW_TPO
  | typeof NEW_PRODUCT
  | typeof NEW_CUSTOMER
  | typeof NEW_ORDER
  

  
