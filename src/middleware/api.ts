/* eslint-disable */
import { DB } from "./demo-db"

import { Entity } from '../types';
import url from 'url';
import querystring from 'querystring';
import { HttpMethod } from "../store/types";
import { getSeachFilters } from "../utils/app-utils";
import axios from 'axios';

const ds = Object.assign({}, DB)
const EXPAND = "_expand"

function getModel(action: string) {
  if (action.includes("/")) {
    return action.substring(0, action.indexOf("/"))
  }
  else {
    return action;
  }
}

function getId(action: string): number {
  if (action.includes("/")) {
    return parseInt(action.substring(action.indexOf("/") + 1))
  }
  else {
    return 0
  }
}

function getExpand(qs: TODO) {
  if (EXPAND in qs) {
    return qs[EXPAND];
  }
  else return ''
}

function parseRequest(req: string) {
  const parsedUrl = url.parse(req);
  const parsedQs = querystring.parse(parsedUrl.query);
  const model = getModel(parsedUrl.pathname);
  const id = getId(parsedUrl.pathname);
  const exp = getExpand(parsedQs)
  const filters = getSeachFilters(parsedQs)
  return { model, id, exp, filters }
}

export function getData(action: string): Promise<TODO> {
  const { model, id, exp , filters} = parseRequest(action)
  return new Promise(function (resolve, _reject) {
    const expandModel = exp
      ? exp === "category"
        ? "categories"
        : exp + "s"
      : exp;

    
      let result: TODO;
    let expand: string, expandId: number;
    
    if (model in ds) {
      if (id && id > 0) {
        result =
          ds[model][ds[model].findIndex((d: { id: number }) => d.id === id)];
        if (expandModel) {
          expand =
            expandModel === "categories"
              ? "category"
              : expandModel.substr(0, expandModel.length - 1);
          expandId = result[expand + "Id"] as number;
          result[expand] =
            ds[expandModel][
            ds[expandModel].findIndex((d: { id: number }) => d.id === expandId)
            ];
        }
      } else {
        result = ds[model].map((m: { [x: string]: TODO }) => {
          if (expandModel) {
            expand =
              expandModel === "categories"
                ? "category"
                : expandModel.substr(0, expandModel.length - 1);
            expandId = m[expand + "Id"] as number;
            m[expand] =
              ds[expandModel][
              ds[expandModel].findIndex((d: { id: number }) => d.id === expandId)
              ];
          }
          return m;
        });
      }
      
      if (filters !== null && filters !== undefined
        && Object.keys(filters).length > 0) {
        result = result.filter(
          row => Object.keys(filters).every(
            prop => filters[prop](prop,row)
          )
        )
      }
    }
    setTimeout(resolve, 300, { data: result });
  });
}

export function getBackEndData(action: string): Promise<TODO> {
  const { model, id, exp , filters} = parseRequest(action)
  let params = querystring.parse(action);
  let param = "";
  if (params["name_like"]){
    param = ""+params["name_like"];
    param = param.trim();
  }
  
  
  const apiUrl = 'http://a9accac0b93c7456b826153fa2b7850d-596788161.ap-northeast-2.elb.amazonaws.com/tpo/findTpoListByTpoNm?tpoNm='+  param;
  return new Promise(function (resolve, _reject) {
    let result: TODO;
    
    axios.get(apiUrl)
          .then(res => {
            let allRepos = Array.from(res.data);
            let i=1;
            result = allRepos.map((m: { [x: string]: TODO }) => {
              m["category"] = {"description": "국사정보", "id": i, "name": m["tpoTypeNm"], "picture": null};
              m["id"]=i++;
              return m;
            });

            setTimeout(resolve, 300, { data: result });
          })
  }); 
}

export function postData(action: string, data: Entity): Promise<TODO> {
  const { model } = parseRequest(action)
  return new Promise(function (resolve, _reject) {
    ds[model].push(data);
    setTimeout(resolve, 300, { data: data });
  });
}

export function putData(action: string, data: Entity): Promise<TODO> {
  const { model, id } = parseRequest(action)
  return new Promise(function (resolve, _reject) {
    const idx = ds[model].findIndex((d: { id: number }) => d.id === id);
    ds[model][idx] = Object.assign({}, data);
    setTimeout(resolve, 300, { data: data });
  });
}

export function deleteData(action: string): Promise<TODO> {
  const { model, id } = parseRequest(action)
  return new Promise(function (resolve, _reject) {
    if (id > 0) {
      ds[model].splice(ds[model].findIndex((d: Entity) => d.id === id), 1);
    }
    setTimeout(resolve, 300, { data: id });
  });
}

export function login(action: string, _method: HttpMethod, data: TODO): Promise<TODO> {
  return new Promise(function (resolve, _reject) {
    if (data.username === "oss@test.com" && data.password === "skcc") {
      const { accessToken: accessToken, user } = ds.token;
      setTimeout(resolve, 300, {
        token: accessToken,
        user,
      });
    } else {
      _reject({
        code: 403,
        error: "Your name or password is wrong",
      });
    }
  });
}

export function  callApi(endpoint, method: HttpMethod, data?: TODO, filters?: TODO) {
  switch (method) {
    case HttpMethod.GET:
      return getData(endpoint);
      // return getBackEndData(endpoint);
    case HttpMethod.PUT:
      return putData(endpoint, data);
    case HttpMethod.POST:
      return postData(endpoint, data)
    case HttpMethod.DELETE:
      return deleteData(endpoint)
    default:
      return null;

  }
}

export function  callTpoApi(endpoint, method: HttpMethod, data?: TODO, filters?: TODO) {
  switch (method) {
    case HttpMethod.GET:
      return getBackEndData(endpoint);
    case HttpMethod.PUT:
      return putData(endpoint, data);
    case HttpMethod.POST:
      return postData(endpoint, data)
    case HttpMethod.DELETE:
      return deleteData(endpoint)
    default:
      return null;

  }

}

export const CALL_API = Symbol("Call API")

