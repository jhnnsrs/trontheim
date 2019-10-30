//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import { createHorten2} from "./index";

import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, takeUntil} from "rxjs/operators";
import { createHortenEpic,
    createHortenHelpers,
    createHortenModel, createHortenReducer,
    createHortenSelectors
} from "./creators";
import {
    createHaldenAction,
    createHaldenEpic, createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import type {HaldenSelector} from "../halden";
import type {OsloActions} from "../oslo";

import {logout, login, LOGIN_SUCCESS} from 'redux-implicit-oauth2'
import {osloEndpoints} from "../../constants/endpoints";

export type HortenOAuthModel = HortenModel &{
    login: OsloActions,
    logout: OsloActions,
    requestLogin: OsloActions,
    changeEndpoint: OsloActions,
    changeEndpointAndLogin: OsloActions,
    setEndpoints: OsloActions,
    fetchUser: OsloActions,
}

export type HortenOAuthSelectors = HortenSelectors & {
    getCurrentEndpoint: HaldenSelector,
    getAvailableEndpoints: HaldenSelector
}

export type HortenOAuthHelpers = HortenHelpers

export type HortenOAuthDefaultState = {
    [string] : any
}

export type HortenOAuthDefinition = {
    type: HortenType

}


export type HortenOAuth = {
    model: HortenOAuthModel,
    selectors: HortenOAuthSelectors,
    helpers: HortenOAuthHelpers,
    definition: HortenOAuthDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenOAuthDefaultState
}


export const createHortenOAuthModel = createHortenModel({
    login: createHaldenAction("LOGIN"),
    logout: createHaldenAction("LOGOUT"),
    requestLogin: createHaldenAction("REQUEST_LOGIN"),
    changeEndpoint: createHaldenAction("CHANGE_ENDPOINT"),
    changeEndpointAndLogin: createHaldenAction("CHANGE_ENDPOINT_AND_LOGIN"),
    setEndpoints: createHaldenAction("SET_ENDOINT"),
})

export const createHortenOAuthHelpers = createHortenHelpers()

export const createHortenOAuthSelectors = createHortenSelectors({
    getCurrentEndpoint: createHaldenSelector("currentEndpoint"),
    getAvailableEndpoints: createHaldenSelector("availableEndpoints"),
})



export const createHortenOAuthEpic = createHortenEpic((model: HortenOAuthModel, selectors: HortenOAuthSelectors) => ({
    loginEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.login.request),
            mergeMap(action => {
                let activeosloconfig = selectors.getCurrentEndpoint(state$.value);
                return [login(activeosloconfig),]
            })
        )
    ),
    logoutEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.logout.request),
            mergeMap(action => {
                return [logout(),]
            })
        )
    ),
    logoutsdsdsdccess: (action$, state$) =>
        action$.pipe(
            ofType('LOGOUT'),
            map(action => model.logout.success(""))

    )
    ,
    loginsdsduccess: (action$, state$) =>
        action$.pipe(
            ofType('LOGIN_SUCCESS'),
            map( action => model.login.success({token: action.token, expiresAt: action.expiresAt}))
        )
    ,
    requestLogin: (action$, state$) =>
        action$.pipe(
            ofType(model.requestLogin.request),
            map( action => {
                let activeosloconfig = selectors.getCurrentEndpoint(state$.value);
                return login(activeosloconfig)
            })
        )
    ,
    changeAndLogin: (action$, state$) =>
        action$.pipe(
            ofType(model.changeEndpointAndLogin.request),
            mergeMap( action => {
                let config = action.payload

                return [model.changeEndpoint.request(config),login(config)]
            })
        )
    ,

    changeOsloPassThrough: createHaldenPassThroughEpicFromActions(model.changeEndpoint)

}));


const defaultState = {
    roles: [],
    currentEndpoint: osloEndpoints[0],
    availableEndpoints: osloEndpoints
};

export const createHortenOAuthReducer = createHortenReducer( (model: HortenOAuthModel) => (
    {
        [model.changeEndpoint.success.toString()]: (state, action) => {
            return {...state, currentEndpoint: action.payload}

        },
        [model.setEndpoints.success]: (state, action) => {
            return { ...state, availableEndpoints: action.payload}
        }
    })
);

export function createHortenOAuth(definition: HortenOAuthDefinition): ((Alias) => HortenOAuth) {
    let modelCreator = createHortenOAuthModel;
    let selectorsCreator = createHortenOAuthSelectors;
    let helperCreator = createHortenOAuthHelpers;
    let epicCreator = createHortenOAuthEpic;
    let reducerCreator = createHortenOAuthReducer;


    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)

}