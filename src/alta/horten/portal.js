//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenSelector} from "../halden";
import {
    createHaldenAction, createHaldenEpic,
    createHaldenFunctionSelector,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Reducer} from "redux";
import {
    ABORTED,
    FAILURE,
    ITEMCREATED,
    ITEMDELETED,
    ITEMUPDATED,
    LOADED,
    LOADING,
    POSTED,
    POSTING,
    SET,
    SETTING
} from "../constants";
import {deletingFromStavangerList} from "../helpers";
import type {HaldenActions} from "../oslo";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import {getAuthHeaderFromToken, preprocessResponse} from "./http";

export interface HortenPortalModel<T> extends HortenModel  {
    setPortal: HaldenActions<T>,
}

export type HortenPortalSelectors = HortenSelectors & {
    getPortal: HaldenSelector,
}


export type HortenPortalHelpers = HortenHelpers & {}


export type HortenPortalDefaultState = {
    data: any,
    meta: { status: any, statuscode: any, error: any },
}

export type HortenPortalDefinition = {
    type: HortenType,
    url: string

}

export interface HortenPortal<T>  {
    model: HortenPortalModel<T>,
    selectors: HortenPortalSelectors,
    helpers: HortenPortalHelpers,
    definition: HortenPortalDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenPortalDefinition,
    defaultState: HortenPortalDefaultState
}

export const createHortenPortalModel = createHortenModel({
    setPortal: createHaldenAction("SET_PORTAL"),
})

export const createHortenPortalHelpers = createHortenHelpers()

export const createHortenPortalSelectors = createHortenSelectors({
    getPortal: createHaldenFunctionSelector( (state, props, params) => {
        let portalid = params
        let actions = state.actions

        // Read: All links that are targeting the node
        return actions[portalid]
    }, true)
})


export const createHortenPortalEpic = createHortenEpic((model: HortenPortalModel, selectors: HortenItemSelectors, helpers) => ({
    setPortalPassThrough: createHaldenEpic((action$,state$) =>
        action$.pipe(
            ofType(model.setPortal.request),
            mergeMap(action => {
                helpers.log(`Portal ${action.payload.id} is now Open`)
                return [model.setPortal.success(action.payload)]
            })
        )
    ),
}));


const defaultState = {
    actions: {}
};

export const createHortenPortalReducer = createHortenReducer((hortenPortalModel: HortenPortalModel) => (
    {

        [hortenPortalModel.setPortal.success]: (state, action) => {
            return { ...state, actions: { ...state.actions, [action.payload.id] : action.payload.action}};

        },

    })
);

export function createHortenPortal<M>(definition: HortenPortalDefinition): ((Alias) => HortenPortal<M>) {
    let modelCreator = createHortenPortalModel;
    let selectorsCreator = createHortenPortalSelectors;
    let helperCreator = createHortenPortalHelpers;
    let epicCreator = createHortenPortalEpic;
    let reducerCreator = createHortenPortalReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}