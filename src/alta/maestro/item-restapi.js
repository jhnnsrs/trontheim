import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenRestAPI} from "../horten/restapi";
import type {HortenItem} from "../horten/item";


export const itemRestAPIMaestro = (restAPI: HortenRestAPI) => (item: HortenItem): Epic  => {


    //TODO: Set Node Input from FlowDiagram
    const postItem = (action$, state$) =>
        action$.pipe(
            ofType(item.model.postItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                meta = {
                    actions: item.model.postItem,
                    method: "POST",
                    suburl: item.definition.url,
                    responseType: 'json',
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const fetchItem = (action$, state$) =>
        action$.pipe(
            ofType(item.model.fetchItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                meta = {
                    actions: item.model.fetchItem,
                    method: "GET_ITEM",
                    suburl: item.definition.url,
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const updateItem = (action$, state$) =>
        action$.pipe(
            ofType(item.model.updateItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                meta = { ...meta,
                    actions: item.model.updateItem,
                    method: "UPDATE",
                    suburl: item.definition.url
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const deleteItem = (action$, state$) =>
        action$.pipe(
            ofType(item.model.deleteItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                meta = { ...meta,
                    actions: item.model.deleteItem,
                    method: "DELETE",
                    suburl: item.definition.url
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));


    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(postItem,fetchItem,updateItem,deleteItem)
}