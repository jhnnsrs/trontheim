//@flow
import type {Alias, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap} from "rxjs/operators";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenSelector} from "../halden";
import {
    createHaldenAction,
    createHaldenEpic,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Reducer} from "redux";
import {ajax} from "rxjs/ajax";
import * as qs from "querystring";
import {Observable} from "rxjs";
import type {HaldenActions} from "../oslo";

export type HortenRestAPIModel = HortenModel &{
    ApiRequest: HaldenActions,
    setAuth: HaldenActions,
    setHeaders: HaldenActions,
    setAvailableAuths: HaldenActions
}

export type HortenRestAPISelectors = HortenSelectors & {
    getCurrentAuth: HaldenSelector
}

export type HortenRestAPIApi = HortenApi
export type HortenRestAPIHelpers = HortenHelpers

export type HortenRestAPI = {
    model: HortenRestAPIModel,
    selectors: HortenRestAPISelectors,
    api: HortenRestAPIApi,
    helpers: HortenRestAPIHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenRestAPIDefaultState
}

export type HortenRestAPIDefaultState = {
    currentAuth: ApiRequestAuth,
    currentHeaders: ApiRequestHeaders,
    authList: [ApiRequestAuth],
}


export const createHortenRestAPIModel = createHortenModel({
    ApiRequest: createHaldenAction("API_REQUEST"),
    setAuth: createHaldenAction("SET_AUTH"),
    setHeaders: createHaldenAction("SET_HEADERS"),
    setAvailableAuths: createHaldenAction("SET_AVAILABLE_AUTHS"),
})

export const createHortenRestAPIHelpers = createHortenHelpers()

export const createHordenRestAPISelectors = createHortenSelectors({
    getCurrentAuth: createHaldenSelector("currentAuth"),
    getCurrentHeaders: createHaldenSelector("currentHeaders"),
})


export type ApiRequestAuth = {
        name: string,
        rooturl: string,
        token: string,
}

export type ApiRequestHeaders = {
    [string] : string,
}

export type ApiRequestMeta = {
    auth: ApiRequestAuth,
    headers: ApiRequestHeaders,
    rooturl: string,
    method: string,
    suburl: string,
    actions: HaldenActions,

}

export type ApiRequest = {
    data: any,
    meta: ApiRequestMeta
}

export const getAuthHeaderFromToken = (token: string) => ({ 'Authorization': "Bearer " + token});
export const preprocessResponse  = (response) => ({ data: response, meta: null})


export type Request = {
    method: string,
    headers: any,
    suburl: string,
    rooturl: string,
    urlaction: string,
    filter: any,
    data: any
}
export const getResponseFromApi = (request: Request): Observable<any> => {

    if (request.method === "GET_LIST") {
        let q = "";
        if (request.filter) {
            q = "?" + qs.stringify(request.filter);
        }
        if (request.urlaction) {
            return ajax.getJSON(request.urlaction(request,q), request.headers)
        }
        return ajax
            .getJSON(`${request.rooturl}/${request.suburl}/${q}`, request.headers);
    }
    if (request.method === "POST") {
        if (request.urlaction) {
            return ajax.getJSON(request.urlaction(request), request.headers)
        }
        return ajax
            .post(`${request.rooturl}/${request.suburl}/`, request.data, request.headers);
    }
    if (request.method === "GET_ITEM") {
        let q = "";
        if (request.data) {
            if (request.data.id) {
                q = encodeURIComponent(request.data.id);
            } else {
                q = encodeURIComponent(request.data);
            }
        }
        if (request.urlaction) {
            return ajax.getJSON(request.urlaction(request,q), request.headers)
        }
        return ajax.getJSON(`${request.rooturl}/${request.suburl}/${q}`, request.headers);
    }
    if (request.method === "UPDATE") {
        const q = encodeURIComponent(request.data.id);
        if (request.urlaction) {
            return ajax.getJSON(request.urlaction(request,q), request.headers)
        }
        return ajax
            .put(`${request.rooturl}/${request.suburl}/${q}/`, request.data , request.headers);

    }

    if (request.method === "DELETE") {
        const q = encodeURIComponent(request.data.id);
        if (request.urlaction) {
            return ajax.getJSON(request.urlaction(request,q), request.headers)
        }
        return ajax.delete(`${request.rooturl}/${request.suburl}/${q}/`, request.headers);
    }

    else return Observable.of(1)



}

export const createHortenRestAPIEpic = createHortenEpic((model: HortenRestAPIModel, selectors: HortenRestAPISelectors) => ({

    apiRequestEpic: createHaldenEpic((action$,state$) =>
        action$.pipe(
            ofType(model.ApiRequest.request),
            mergeMap(action => {
                let {data, meta}: ApiRequest = action.payload

                let currentAuth = selectors.getCurrentAuth(state$.value)
                let actions = meta.actions
                let method = meta.method
                let rooturl = meta.rooturl ? meta.rooturl : currentAuth.rooturl
                let suburl = meta.suburl
                let urlaction = meta.urlaction
                let filter = meta.filter


                const headers = {
                    ...selectors.getCurrentHeaders(state$.value),
                    ...getAuthHeaderFromToken(currentAuth.token),
                    ...action.headers,
                }

                let request = {
                    rooturl,
                    suburl,
                    urlaction,
                    headers,
                    filter,
                    method,
                    data
                }

                let apicall = getResponseFromApi(request)
                return apicall.pipe(
                    map(response => preprocessResponse(response)),
                    map(response => actions.success(response)),
                    catchError(error => {
                        console.log(error)
                        return [actions.failure(error.response)]
                    })
                )
            })
    )
    ),

    setAuthPassThrough: createHaldenPassThroughEpicFromActions(model.setAuth),
    setHeadersPassThrough: createHaldenPassThroughEpicFromActions(model.setHeaders),
    setAvailableAuthsPassThrough: createHaldenPassThroughEpicFromActions(model.setAvailableAuths)
}));




const defaultState = {
    currentAuth: null,
    currentHeaders: { 'Content-Type': 'application/json'},
    authList: null
};

export const createHortenRestAPIReducer = createHortenReducer( (model: HortenRestAPIModel) => (
    {
        [model.setAuth.success.toString()]: (state, action) => {
            return {...state, currentAuth: action.payload}

        },
        [model.setAvailableAuths.success.toString()]: (state, action) => {
            return {...state, authList: action.payload}
        },
        [model.setHeaders.success.toString()]: (state, action) => {
            return {...state, currentHeaders: action.payload}

        }
    })
);

export type RestApiDefinition = {
    type: HortenType

}

export function createHortenRestAPI(definition: RestApiDefinition): ((Alias) => HortenRestAPI) {
    let modelCreator = createHortenRestAPIModel;
    let selectorsCreator = createHordenRestAPISelectors;
    let helperCreator = createHortenRestAPIHelpers;
    let epicCreator = createHortenRestAPIEpic;
    let reducerCreator = createHortenRestAPIReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}