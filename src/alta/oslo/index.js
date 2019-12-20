//@flow

import {createAction} from "redux-actions";

export interface DataStructure<M> { data: M, meta: any}
export type OsloPayload<M> = any
export type OsloAction<M> = { payload: DataStructure<M>, meta: any, type: string}
export type OsloActionCreator<T> = (OsloPayload<T>) => OsloAction<T>

export type OsloApiCall = (action: any, state: any) => any

export type OsloActions = {
    request: OsloActionCreator,
    success: OsloActionCreator,
    failure: OsloActionCreator,
    abort: OsloActionCreator
}

export interface HaldenActions<T> {
    request: OsloActionCreator<T>,
    success: OsloActionCreator<T>,
    failure: OsloActionCreator<T>,
    abort: OsloActionCreator<T>,
}

export function createOsloActions(alias: string,model:string,method:string): OsloActions { return {
    request: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_REQUEST`),
    success: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_SUCCESS`),
    failure: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_FAILURE`),
    abort: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_ABORT`),
}}

export function createHaldenActions(alias: string,model: string,key:string,method:string): HaldenActions { return {
    request: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_REQUEST`),
    success: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_SUCCESS`),
    failure: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_FAILURE`),
    abort: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_ABORT`),
}}

export const MetaAction = (type)  => {

    let actionCreator = (payload, meta) => ({
        type: type,
        payload: payload,
        meta: meta
    })

    actionCreator.toString = function () {
        return type;
    };

    return actionCreator
}

export function createHaldenParameterActions(alias: string,model: string,key:string,method:string): HaldenActions {
    return (parameter) =>
    ({
    request: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_${parameter.toUpperCase()}_REQUEST`),
    success: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_${parameter.toUpperCase()}_SUCCESS`),
    failure: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_${parameter.toUpperCase()}_FAILURE`),
    abort: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_${parameter.toUpperCase()}_ABORT`)
        })
}

export function createHaldenMetaActions(alias: string,model: string,key:string,method:string): HaldenActions { return {
    request: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_REQUEST`),
    success: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_SUCCESS`),
    failure: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_FAILURE`),
    abort: MetaAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_ABORT`)
}}

export function createHaldenListeningActions(alias: string,key: string,model:string,method:string): OsloActions {
    return ({
        request: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_ITEM_OSLO_${method.toUpperCase()}`),
        success: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_ITEM_OSLO_${method.toUpperCase()}_SUCCESS`),
        failure: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_ITEM_OSLO_${method.toUpperCase()}_FAILURE`),
        abort: createAction(`${alias.toUpperCase()}_${model.toUpperCase()}_ITEM_OSLO_${method.toUpperCase()}_FAILURE`)
    })

}

export type OsloHeader = any