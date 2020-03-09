import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenRestAPI} from "../horten/restapi";
import type {HortenItem} from "../horten/item";


export const itemRestAPIMaestro = (restAPI: HortenRestAPI) => (item: HortenItem): Epic  => {

    const getSubUrl = (meta, definition) => {
        // First
        let suburl = ""
        if (meta.url) suburl += meta.url
        else if (definition.url) suburl += definition.url
        else throw "Neither Model nur Definition.url was provided"

        if (meta.restaction) suburl += "/" + meta.restaction
        return suburl
    }

    //TODO: Set Node Input from FlowDiagram
    const postItem = (action$, state$) =>
        action$.pipe(
            ofType(item.model.postItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                if (!meta) meta = {}
                meta = {
                    actions: item.model.postItem,
                    method: "POST",
                    suburl: meta.restaction ? item.definition.url + "/" + meta.restaction : item.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : item.definition.urlaction,
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
                if (!meta) meta = {}

                let urlaction = meta.urlaction


                meta = {
                    actions: item.model.fetchItem,
                    method: "GET_ITEM",
                    suburl: getSubUrl(meta, item.definition),
                    urlaction: meta.urlaction ? meta.urlaction : item.definition.urlaction,
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));

    const updateItem = (action$, state$) =>
        action$.pipe(
            ofType(item.model.updateItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                if (!meta) meta = {}
                meta = { ...meta,
                    actions: item.model.updateItem,
                    method: "UPDATE",
                    suburl: meta.restaction ? item.definition.url + "/" + meta.restaction : item.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : item.definition.urlaction,
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
                    suburl: meta.restaction ? item.definition.url + "/" + meta.restaction : item.definition.url,
                    urlaction: meta.urlaction ? meta.urlaction : item.definition.urlaction,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta})]
            }));


    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(postItem,fetchItem,updateItem,deleteItem)
}