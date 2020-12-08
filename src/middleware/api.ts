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

function changeTpoTypeCd(req: number){
  let changedCd = "";
  if      (req ===3)  changedCd = "A";
  else if (req ===5)  changedCd = "D";
  else if (req ===6)  changedCd = "P";
  else if (req ===8)  changedCd = "Q";
  else if (req ===9)  changedCd = "T";
  else if (req ===10) changedCd = "X";
  else if (req ===11) changedCd = "f";
  else changedCd = req.toString();

  return changedCd
}

function getSubmitForm(data: Entity){
  let submitForm = {};

  // When tpoTypeCd exists then it's for put work. 
  if(data["tpoTypeCd"]){
    submitForm["tpoId"] = data["tpoId"];
    submitForm["useYn"] = data["useYn"];
    submitForm["tpoCd"] = data["tpoCd"];
    submitForm["tpoTypeCd"] = data["tpoTypeCd"];

  // When tpoTypeCd doesn't exists It's for post work.
  }else{
    let tpoTypeCd = ds["tpoCategories"][ds["tpoCategories"].findIndex((d: { name: string }) => d.name === data["tpoTypeNm"])]; 
    submitForm["tpoTypeCd"] = changeTpoTypeCd(tpoTypeCd["id"]);
    submitForm["useYn"] = "Y";
    submitForm["tpoCd"] = "TEST01";
  }
  submitForm["tpoNm"] = data["tpoNm"];
  submitForm["tpoTypeNm"] = data["tpoTypeNm"];
  submitForm["mgmtTpoCd"] = data["mgmtTpoCd"];
  
  
  return submitForm
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

export function getBackEndData(action: string): Promise<TODO> {
  const { model, id, exp , filters} = parseRequest(action)
  let params = querystring.parse(action);
  let param = "";
  let apiUrl = "";
  let result: TODO;

  if (params["name_like"]){
    param = ""+params["name_like"];
    param = param.trim();
  }
  
  return new Promise(function (resolve, _reject) {
    if(model==="categories"){
      result = ds["tpoCategories"].map((m: { [x: string]: TODO }) => {
        return m;
      });
      setTimeout(resolve, 100, { data: result });
    }else{
      if (id && id > 0) {
        apiUrl = 'http://a9accac0b93c7456b826153fa2b7850d-596788161.ap-northeast-2.elb.amazonaws.com/tpo/findTpo/'+ id;
        axios.get(apiUrl)
              .then(res => {
                result = res.data;
                let i=1;
                let categoryId: number;

                result["id"]=Number.parseInt(result["tpoId"]);

                if (result["tpoTypeCd"] ==="A")         categoryId = 3;
                  else if (result["tpoTypeCd"] ==="D")  categoryId = 5;
                  else if (result["tpoTypeCd"] ==="P")  categoryId = 6;
                  else if (result["tpoTypeCd"] ==="Q")  categoryId = 8;
                  else if (result["tpoTypeCd"] ==="T")  categoryId = 9;
                  else if (result["tpoTypeCd"] ==="X")  categoryId = 10;
                  else if (result["tpoTypeCd"] ==="f")  categoryId = 11;
                  else                                    categoryId = Number.parseInt(result["tpoTypeCd"]);
                result["categoryId"] = categoryId;
                result["category"] = ds["tpoCategories"][ds["tpoCategories"].findIndex((d: { id: number }) => d.id === categoryId)];                
                setTimeout(resolve, 100, { data: result });
              })
      }else{
        apiUrl = 'http://a9accac0b93c7456b826153fa2b7850d-596788161.ap-northeast-2.elb.amazonaws.com/tpo/findTpoListByTpoNm?tpoNm='+  param;
        axios.get(apiUrl)
              .then(res => {
                let allRepos = Array.from(res.data);
                let categoryId: number;
                result = allRepos.map((m: { [x: string]: TODO }) => {
                  m["id"]=Number.parseInt(m["tpoId"]);

                  if (m["tpoTypeCd"] ==="A")      categoryId = 3;
                  else if (m["tpoTypeCd"] ==="D") categoryId = 5;
                  else if (m["tpoTypeCd"] ==="P") categoryId = 6;
                  else if (m["tpoTypeCd"] ==="Q") categoryId = 8;
                  else if (m["tpoTypeCd"] ==="T") categoryId = 9;
                  else if (m["tpoTypeCd"] ==="X") categoryId = 10;
                  else if (m["tpoTypeCd"] ==="f") categoryId = 11;
                  else                            categoryId = Number.parseInt(m["tpoTypeCd"]);
                  m["categoryId"] = categoryId;
                  
                  return m;
                });
                setTimeout(resolve, 100, { data: result });
              })
      }
    }
    
    
  }); 
}
export function postBackEndData(action: string, data: Entity): Promise<TODO> {
  console.log("********** postBackEndData : data >>>>");
  console.log(data);
  let submitForm = getSubmitForm(data);

  console.log("********** postBackEndData : submitForm >>>>");
  console.log(submitForm);

  return new Promise(function (resolve, _reject) {
    let apiUrl = 'http://a9accac0b93c7456b826153fa2b7850d-596788161.ap-northeast-2.elb.amazonaws.com/tpo/registTpo';
    
    axios.post(apiUrl,submitForm)
      .then(res => {
        console.log(res.data);
      })
    setTimeout(resolve, 300, { data: data });
  });
}

export function putBackEndData(action: string, data: Entity): Promise<TODO> {
  console.log("********** putBackEndData : data >>>>");
  console.log(data);
  console.log("********** putBackEndData : id >>>>"+ data["id"]);
  let submitForm = getSubmitForm(data);
  return new Promise(function (resolve, _reject) {
    let apiUrl = 'http://a9accac0b93c7456b826153fa2b7850d-596788161.ap-northeast-2.elb.amazonaws.com/tpo/updateTpo/'+data["id"];
    
    axios.put(apiUrl,submitForm)
      .then(res => {
        console.log(res.data);
      })
      
    setTimeout(resolve, 300, { data: data });
  });
}

export function deleteBackEndData(action: string): Promise<TODO> {
  const { id } = parseRequest(action);
  console.log("********** deleteBackEndData : id >>>>"+ id);
  return new Promise(function (resolve, _reject) {
    let apiUrl = 'http://a9accac0b93c7456b826153fa2b7850d-596788161.ap-northeast-2.elb.amazonaws.com/tpo/deleteTpo/'+id;
    axios.delete(apiUrl)
      .then(res => {
        console.log(res.data);
      })
      
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
      return putBackEndData(endpoint, data);
    case HttpMethod.POST:
      return postBackEndData(endpoint, data)
    case HttpMethod.DELETE:
      return deleteBackEndData(endpoint)
    default:
      return null;
  }
}
