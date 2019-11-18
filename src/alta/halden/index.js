//@flow
import type {Alias, HortenApiCall, HortenType, Props, State} from "../horten/types";
import type {HaldenActions} from "../oslo";
import {createHaldenActions, createHaldenMetaActions, createHaldenParameterActions} from "../oslo";
import {Action} from "redux";
import type {ActionStream, StateStream} from "../horten/creators";
import {Epic, ofType} from "redux-observable";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {createAction} from "redux-actions";

export type HaldenActionParameter= string;
export type HaldenAction = (Alias,HortenType,string) => HaldenActions;
export type HaldenParameterAction = (any) => (Alias,HortenType,string) => HaldenActions;
export type HaldenApiCreator = (Alias,HortenType) => HortenApiCall;
export type HaldenSelector = (State,Props) => any;
export type HaldenAccesor = (any) => (State,Props) => any;


export function createHaldenAction(haldenActionParameter: HaldenActionParameter, meta = null, parameter = null): HaldenAction {
    return function (alias: Alias,type: HortenType,key) {

        if (parameter) {
            return createHaldenParameterActions(alias, type, key, haldenActionParameter)
        }
        if (meta) {
            return createHaldenMetaActions(alias, type, key, haldenActionParameter)
        }
        else {
            return createHaldenActions(alias, type, key, haldenActionParameter)
        }
    }
}

export function createHaldenParamterizedAction(haldenActionParameterFunction: (params) => HaldenActionParameter ): HaldenParameterAction {
    return function (alias: Alias,type: HortenType,key) {
        return function (params) {
                return createHaldenActions(alias, type, key, haldenActionParameterFunction(params))

        }
    }
}

export function createHaldenModelAction(type: HortenType, haldenActionParameter: HaldenActionParameter ): HaldenAction {
    return function (alias: Alias,typedefault: HortenType,key) {
        return createHaldenActions(alias,type,key,haldenActionParameter)
    }
}

export function createHaldenDetachedAction(alias: Alias, type: HortenType, haldenActionParameter: HaldenActionParameter ): HaldenAction {
    return function (aliasdefault: Alias,typedefault: HortenType,key) {
        return createHaldenActions(alias,type,key,haldenActionParameter)
    }
}

export function createHaldenSelector(element: string)
{
    return function (alias: Alias,type: HortenType) {
        return function (state: State, props: Props) {
            if (element) return state[alias][type][element]
            else return state[alias][type]

        }
    }
}

export function createHaldenAccessor() {
    return function (alias: Alias, type: HortenType) {
        return function (accesor) {
            return function (state: State, props: Props) {
                return accesor(state[alias][type])

            }
        }
    }
}

export type HortenParams = any

export function createHaldenFunctionSelector(fn: (State,Props) => any, withParams = false)
{
    return function (alias: Alias,type: HortenType) {

        if (withParams) {
            // This needs to be called with the params before the state
            // TODO: Implement error detection
            return function (params: HortenParams) {
                return function (state: State, props: Props) {
                    return fn(state[alias][type],props, params)

                }
            }
        }
        else {
            return function (state: State, props: Props) {
                if (fn) return fn(state[alias][type],props)
                else return fn(state[alias][type],props)

            }
        }
    }
}

export function createHaldenApi(fn: (State, Action) => any)
{
    return function (alias: Alias,type: HortenType) {

        return fn
    }
}

export function createHaldenEpic( fn: (ActionStream, StateStream) => any)
{
    return fn
}

export function createHaldenHelper(fn: any)
{
    return function (alias: Alias,type: HortenType, model: any) {
        return fn(alias,type,model)
    }
}

export const createHaldenPassThroughEpicFromActions = (haldenActions: HaldenActions): Epic => {
    return (action$: Observable, state$: Observable) =>
        action$.pipe(
            ofType(haldenActions.request.toString()),
            map(action => haldenActions.success(action.payload)),
            catchError(error => Observable.of(haldenActions.failure(error)))
        );
};

export function createHaldenMergedSelector(element1: string, element2: string) {
    return function (alias: Alias, type: HortenType) {

        return function (state: State, props: Props) {
            let list1 = state[alias][type][element1]
            let list2 = state[alias][type][element2]
            return {...list1, ...list2}
        }
    }
}
export function createHaldenOsloActions(alias: string,model:string,method:string): HaldenActions { return {
    request: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}`),
    success: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_SUCCESS`),
    failure: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_FAILURE`),
    abort: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_ABORT`),
}}
