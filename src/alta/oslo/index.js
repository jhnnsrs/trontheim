//@flow

import {createAction} from "redux-actions";
import {Action} from "redux";


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

export function createHaldenMetaActions(alias: string,model: string,key:string,method:string): HaldenActions { return {
    request: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_REQUEST`,undefined,(payload) => payload.meta),
    success: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_SUCCESS`,undefined,(payload) => payload.meta),
    failure: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_FAILURE`,undefined,(payload) => payload.meta),
    abort: createAction(`${alias.toUpperCase()}-${key.toUpperCase()}_${model.toUpperCase()}_${method.toUpperCase()}_ABORT`,undefined,(payload) => payload.meta),
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