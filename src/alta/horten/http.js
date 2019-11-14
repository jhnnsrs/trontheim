//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
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
import {Action, Reducer} from "redux";
import {ajax} from "rxjs/ajax";
import type {HaldenActions} from "../oslo";

export type HortenHTTPModel = HortenModel &{
    requestHttp: HaldenActions,
    setAuth: HaldenActions,
    setHeaders: HaldenActions,
    setAvailableAuths: HaldenActions
}

export type HortenHTTPSelectors = HortenSelectors & {
    getCurrentAuth: HaldenSelector
}


export type HortenHTTPHelpers = HortenHelpers & {
    makeHttpRequest: (any, HortenHttpMeta, HaldenActions) => Action
}

export type HortenHTTPDefinition = {
    type: string

}
export type HortenHTTP = {
    model: HortenHTTPModel,
    selectors: HortenHTTPSelectors,
    helpers: HortenHTTPHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenHTTPDefaultState
}

export type HortenHTTPDefaultState = {
    currentAuth: HortenHTTPRequestAuth,
    currentHeaders: HortenHTTPRequestHeaders,
    authList: [HortenHTTPRequestAuth],
}


export const createHortenHTTPModel = createHortenModel({
    requestHttp: createHaldenAction("HTTP_REQUEST"),
    setAuth: createHaldenAction("SET_AUTH"),
    setHeaders: createHaldenAction("SET_HEADERS"),
    setAvailableAuths: createHaldenAction("SET_AVAILABLE_AUTHS"),
})

export const createHortenHTTPHelpers = createHortenHelpers({
    makeHttpRequest: (s, s1, hortenModel: HortenHTTPModel, hortenSelectors) => (data: any, meta, actions: HaldenActions) => {


        let request = { data: data,
            meta: {...meta, actions: actions}

        }

        return hortenModel.requestHttp.request(request)
    }


})

export const createHordenHTTPSelectors = createHortenSelectors({
    getCurrentAuth: createHaldenSelector("currentAuth"),
    getCurrentHeaders: createHaldenSelector("currentHeaders"),
})


export type HortenHTTPRequestAuth = {
        name: string,
        rooturl: string,
        token: string,
}

export type HortenHTTPRequestHeaders = {
    [string] : string,
}

export type HortenHttpMeta = {
    auth: HortenHTTPRequestAuth,
    headers: HortenHTTPRequestAuth,
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

export const createHortenHTTPEpic = createHortenEpic((model: HortenHTTPModel, selectors: HortenHTTPSelectors) => ({

    httpRequestEpic: createHaldenEpic((action$,state$) =>
        action$.pipe(
            ofType(model.requestHttp.request),
            mergeMap(action => {
                console.log(action.payload)
                let {data, meta} = action.payload

                let currentAuth = selectors.getCurrentAuth(state$.value)

                let actions = meta.actions
                let method = meta.method
                let metaheaders = meta.headers
                let rooturl = meta.rooturl ? meta.rooturl : currentAuth.rooturl
                let suburl = meta.suburl


                const headers = {
                    ...selectors.getCurrentHeaders(state$.value),
                    ...getAuthHeaderFromToken(currentAuth.token),
                    ...metaheaders,
                }

                let apicall = ajax({
                    body: data,
                    method: method,
                    crossDomain: true,
                    url: `${rooturl}/${suburl}`,
                    headers: headers,
                    data: data
                })

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
    currentHeaders: null,
    authList: null
};

export const createHortenHTTPReducer = createHortenReducer( (model: HortenHTTPModel) => (
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


export function createHortenHTTP(definition: HortenHTTPDefinition): ((Alias) => HortenHTTP) {
    let modelCreator = createHortenHTTPModel;
    let selectorsCreator = createHordenHTTPSelectors;
    let helperCreator = createHortenHTTPHelpers;
    let epicCreator = createHortenHTTPEpic;
    let reducerCreator = createHortenHTTPReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}