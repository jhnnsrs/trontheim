import {Epic} from "redux-observable";
import {Action, Reducer} from "redux";
import type {HaldenSelector} from "../halden";
import type {Header} from "../oslo/api";
import {Observable} from "rxjs";
import type {HaldenActions} from "../oslo";

// Base types
export type State = any
export type Props = any

export type Alias = string
export type HortenURL = string
export type HttpMethod = string
export type ApiCreator = (state: State, data: any) => Observable



export type HortenType = string;
export type HortenApiCall = (Action,any) => any

// Generic Types to inherit from
export type HortenModel<M = any> = {
    alias: Alias,
    type: HortenType,
    dynamic: (string) => HaldenActions<M>,
    reset: HaldenActions
}
export type HortenApi = {
    dynamic: (url: HortenURL, method: HttpMethod, header: ?Header) => ApiCreator
}

export type HortenSelectors = {
    getModel: HaldenSelector
}
export type HortenHelpers = {
    [string]: any
}
export type HortenDefaulState = any



// Creator Types with Generics
export type HortenModelCreator<M> = (Alias, HortenType) => M;
export type HortenSelectorsCreator<S> = (Alias, HortenType) => S;
export type HortenReducerCreator<M> = (M) => Reducer
export type HortenEpicCreator<M, S> = (M, S) => Epic
export type HortenApiCreator<A> = (Alias) => A;
export type HortenHelperCreator<H> = (Alias, HortenType) => H;

// Basic Horten
export type Horten<M, A, S, H, D> = {
    model: M,
    selectors: S,
    api: A,
    helpers: H,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    key: string,
    type: HortenType,
    defaultState: D

}