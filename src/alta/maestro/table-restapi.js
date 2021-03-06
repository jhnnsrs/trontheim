import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenRestAPI} from "../horten/restapi";
import type {HortenTable} from "../horten/table";


export const tableRestAPIMaestro = (restAPI: HortenRestAPI) => (list: HortenTable): Epic  => {


    //TODO: Set Node Input from FlowDiagram
    const postItem = (action$, state$) =>
        action$.pipe(
            ofType(list.model.postItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload

                if (!meta) meta = {}
                meta = {
                    actions: list.model.postItem,
                    method: "POST",
                    suburl: meta.restaction ? list.definition.url + "/" + meta.restaction : list.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : list.definition.urlaction,
                    responseType: 'json',
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const fetchList = (action$, state$) =>
        action$.pipe(
            ofType(list.model.fetchList.request),
            mergeMap(action => {
                let {filter, meta, data} = action.payload

                if (!meta) meta = {}
                meta = {
                    actions: list.model.fetchList,
                    method: "GET_LIST",
                    suburl: meta.restaction ? list.definition.url + "/" + meta.restaction : list.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : list.definition.urlaction,
                    filter: filter,
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const fetchItem = (action$, state$) =>
        action$.pipe(
            ofType(list.model.fetchItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload

                if (!meta) meta = {}
                meta = {
                    actions: list.model.fetchItem,
                    method: "GET_ITEM",
                    suburl: meta.restaction ? list.definition.url + "/" + meta.restaction : list.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : list.definition.urlaction,
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const updateItem = (action$, state$) =>
        action$.pipe(
            ofType(list.model.updateItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload

                if (!meta) meta = {}
                meta = { ...meta,
                    actions: list.model.updateItem,
                    method: "UPDATE",
                    suburl: meta.restaction ? list.definition.url + "/" + meta.restaction : list.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : list.definition.urlaction,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const deleteItem = (action$, state$) =>
        action$.pipe(
            ofType(list.model.deleteItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload

                if (!meta) meta = {}
                meta = { ...meta,
                    actions: list.model.deleteItem,
                    method: "DELETE",
                    suburl: meta.restaction ? list.definition.url + "/" + meta.restaction : list.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : list.definition.urlaction,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));


    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(postItem,fetchList,fetchItem,updateItem,deleteItem)
}


