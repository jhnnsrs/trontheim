//@flow
import type {Alias,Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten, createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, takeUntil} from "rxjs/operators";
import {
    createHortenApi, createHortenEpic,
    createHortenEpics,
    createHortenHelpers,
    createHortenModel, createHortenReducer,
    createHortenSelectors
} from "./creators";
import {
    createHaldenAction,
    createHaldenApi,
    createHaldenEpic,
    createHaldenFunctionSelector, createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import type {HaldenSelector} from "../halden";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import {ajax} from "rxjs/ajax";
import * as qs from "querystring";
import {Observable} from "rxjs";
import type {HaldenActions} from "../oslo";

export type HortenFakeAPIModel = HortenModel &{
    ApiRequest: HaldenActions,
    setAuth: HaldenActions,
    setHeaders: HaldenActions,
    setAvailableAuths: HaldenActions
}

export type HortenFakeAPISelectors = HortenSelectors & {
    getCurrentAuth: HaldenSelector,
    getCurrentHeaders: HaldenSelector
}

export type HortenFakeAPIHelpers = HortenHelpers


export type HortenFakeAPIMap = {
    [string]: [any]
}
export type HortenFakeAPIDefinition = {
    type: HortenType,
    map: HortenFakeAPIMap

}

export type HortenFakeAPI = {
    model: HortenFakeAPIModel,
    selectors: HortenFakeAPISelectors,
    helpers: HortenFakeAPIHelpers,
    definition: HortenFakeAPIDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    defaultState: HortenFakeAPIDefaultState
}

export type HortenFakeAPIDefaultState = {
    currentAuth: any,
    currentHeaders: any,
    authList: any,
}


export const createHortenFakeAPIModel = createHortenModel({
    ApiRequest: createHaldenAction("API_REQUEST"),
    setAuth: createHaldenAction("SET_AUTH"),
    setHeaders: createHaldenAction("SET_HEADERS"),
    setAvailableAuths: createHaldenAction("SET_AVAILABLE_AUTHS"),
})

export const createHortenFakeAPIHelpers = createHortenHelpers()

export const createHordenFakeAPISelectors = createHortenSelectors({
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
    actions: OsloActions,

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
    filter: any,
    data: any
}
export const getResponseFromApi = (request: Request): Observable<any> => {
    console.log(request)

    if (request.method === "GET_LIST") {
        let q = "";
        if (request.filter) {
            q = "?" + qs.stringify(request.filter);
        }
        return ajax
            .getJSON(`${request.rooturl}/${request.suburl}/${q}`, request.headers);
    }
    if (request.method === "POST") {
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
        return ajax.getJSON(`${request.rooturl}/${request.suburl}/${q}`, request.headers);
    }
    if (request.method === "UPDATE") {
        const q = encodeURIComponent(request.data.id);
        return ajax
            .put(`${request.rooturl}/${request.suburl}/${q}/`, request.data , request.headers);

    }

    if (request.method === "DELETE") {
        const q = encodeURIComponent(request.data.id);
        return ajax.delete(`${request.rooturl}/${request.suburl}/${q}/`, request.headers);
    }

    else return Observable.of(1)



}

export const createHortenFakeAPIEpic = createHortenEpic((model: HortenFakeAPIModel, selectors: HortenFakeAPISelectors, helper, definition: HortenFakeAPIDefinition) => ({

    apiRequestEpic: createHaldenEpic((action$,state$) =>
        action$.pipe(
            ofType(model.ApiRequest.request),
            mergeMap(action => {
                let {data, meta}: ApiRequest = action.payload

                let actions = meta.actions
                let method = meta.method
                let suburl = meta.suburl

                let fakeapiendpoint = definition.map[suburl]
                let element;
                if (method == "GET_ITEM") element = fakeapiendpoint.filter(item => item.id  == data.id)
                if (method == "GET_LIST") element = fakeapiendpoint


                let apicall =  Observable.from(element)
                return apicall.pipe(
                    map(response => preprocessResponse(response)),
                    map(response => actions.success(response)),
                    catchError(error => {
                        console.log(error)
                        return [actions.failure(error)]
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

export const createHortenFakeAPIReducer = createHortenReducer( (model: HortenFakeAPIModel) => (
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



export function createHortenFakeAPI(definition: HortenFakeAPIDefinition): ((Alias) => HortenFakeAPI) {
    let modelCreator = createHortenFakeAPIModel;
    let selectorsCreator = createHordenFakeAPISelectors;
    let helperCreator = createHortenFakeAPIHelpers;
    let epicCreator = createHortenFakeAPIEpic;
    let reducerCreator = createHortenFakeAPIReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}