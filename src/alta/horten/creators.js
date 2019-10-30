import type {Alias, HortenModel, HortenSelectors, HortenType, HortenURL, HttpMethod} from "./types";
import type {HaldenAction, HaldenApiCreator} from "../halden";

import _ from "lodash";
import {createHaldenSelector} from "../halden";
import {createHaldenActions, createOsloActions} from "../oslo";
import type {Header} from "../oslo/api";
import {createOsloApi} from "../oslo/api";
import {Observable} from "rxjs";
import {Action, Reducer} from "redux";
import {combineEpics, Epic} from "redux-observable";
import type {HortenEpics} from "./epics";
import {handleActions} from "redux-actions";
import {POSTING} from "../constants";

export type State= any
export type Props = any
export type ActionStream = Observable<Action>
export type StateStream = Observable<State>


export type HortenModelCreator = {
    [string]: HaldenAction
}
export type HortenReducerCreator = any


export type HortenApiCreator = {
    [string]: HaldenApiCreator
}

export type HortenEpicCreator = {
    [string]: (ActionStream, StateStream) => Epic
}

export type HortenSelectorsCreator = {
    [string]: (Alias,HortenType) => (State,Props)  => any
}

export type HortenHelpersCreator = {
    [string]: (Alias,HortenType, HortenModel, HortenSelectors) => any
}

export function createHortenModel<T>(list: HortenModelCreator): T {
    return function (alias: Alias, type: HortenType, key: string) {
        // Returns It
        let preliminaryList =  _.mapValues(list,haldenActionCreator => haldenActionCreator(alias,type,key))

        return {...preliminaryList, alias: alias, type: type, key: key,
            dynamic: (action:string) => createHaldenActions(alias,type,key,action.toUpperCase()),
            reset: createHaldenActions(alias,type,key,"RESET")
        }
    }

}

export function createHortenApi<T>(list: HortenApiCreator): T {
    return function (alias: Alias, type: HortenType) {
        // Returns It
        let preliminaryList = _.mapValues(list,haldenApiCreator => haldenApiCreator(alias,type))
        return {...preliminaryList,
            alias: alias,
            type: type,
            dynamic: (url: HortenURL, method: HttpMethod, header: Header) => (state: State, data: any) => createOsloApi(state,url,method,data, header)
        }
    }

}

export function createHortenSelectors<T>(list: HortenSelectorsCreator): T {
    return function (alias: Alias, type: HortenType) {
        // Expands Selectors with Commenly Used Ones
        let newlist = {
            ...list,
            getModel: createHaldenSelector(null),
            getProps: (alias,type) => (state:State,props:Props) => props
        }
        return _.mapValues(newlist,haldenSelectorCreator => haldenSelectorCreator(alias,type))
    }

}

export function createHortenHelpers<T>(list: HortenHelpersCreator): T {
    return function (alias: Alias, type: HortenType, model: any, selectors: any,...restArgs) {
        // Returns It
        return _.mapValues(list,haldenHelperCreator => haldenHelperCreator(alias,type,model,selectors, ...restArgs))
    }

}

export function createHortenEpic<M,S,H,D>( fn: (M,S,H) => HortenEpicCreator): HortenEpics {

    return function (model: M, selectors: S, helpers: H, definition: D) {
        try
        {
            let epicDict = fn(model,selectors,helpers,definition)
            let epicList = Object.keys(epicDict).map(function(key){
                return epicDict[key];
            });

            return combineEpics(...epicList)
        }
        catch (e)
        {
            console.log("Failure with Epic in",model.alias)
        }
    }
}

export function createHortenReducer<M,D>(reducerCreator: (M) => HortenReducerCreator): (M,D) => Reducer{
    return function (model: M, defaultState: D ): Reducer {
        function resetCreator(model){
            return ({
                [model.reset.request]: (state, action) => defaultState})
        }

        let extendedReducer = {...reducerCreator(model),...resetCreator(model)}

        return handleActions(
            extendedReducer,
            defaultState)
    }
}

