//@flow
import type {Alias,Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten, createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {
    createHortenApi, createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import {
    createHaldenAccessor,
    createHaldenAction, createHaldenEpic,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import type {HaldenAccesor, HaldenSelector} from "../halden";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import {combineOsloActionsWithPassThrough} from "../oslo/epics";
import {logout} from "redux-implicit-oauth2";

export type HortenPageModel = HortenModel &{
    initPage: HaldenActions,
    resetPage: HaldenActions,
    killPage: HaldenActions,
    setProp: HaldenActions,
}

export type HortenPageSelectors = HortenSelectors & {
    getInput: HaldenSelector,
    getProp: HaldenAccesor
}

export type HortenPageHelpers = HortenHelpers & {}

export type HortenPageDefaultState = {
    props: any,
    [string]: any
}

export type HortenPageDefinition = {
    type: HortenType,
    reset: false,

}



export type HortenPage = Horten & {
    model: HortenPageModel,
    selectors: HortenPageSelectors,
    helpers: HortenPageHelpers,
    definition: HortenPageDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenPageDefaultState
}

export const createHortenPageModel = createHortenModel({
    // This is Mainly for the FlowDiagram Interoperability
    initPage: createHaldenAction("INIT"),
    killPage: createHaldenAction("KILL", true),
    resetPage: createHaldenAction("RESET_PAGE", true),
    setProp: createHaldenAction("SET_PROP"),
})

export const createHortenPageHelpers = createHortenHelpers({
    //TODO: make really okay
})

export const createHortenPageSelectors = createHortenSelectors({
    getInput: createHaldenSelector("input"),
    getProp: createHaldenAccessor()
})



export const createHortenPageEpic = createHortenEpic((model: HortenPageModel, selector: HortenPageSelectors, helpers: HortenPageHelpers, definition: HortenPageDefinition) => ({

    // PARTSTART: EPICS
    // The Nodes Epic will carry along the EPICS of all the spawned Node
    setPropPassThrough: createHaldenPassThroughEpicFromActions(model.setProp),
    killPage: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.killPage.request),
            mergeMap(action => {
                console.log(action)
                return definition.reset ? [model.resetPage.request(action.payload,action.meta)] : [model.killPage.success(action.payload,action.meta)]
                }

            )))

        }
    )
)
;

const defaultState = {
    props: null
};

export const createHortenPageReducer =  createHortenReducer((model: HortenPageModel) => (
    {
        [model.initPage.success]: (state, action) => {
            return {...state, props: action.payload}
        },
        [model.setProp.success]: (state, action) => {
            return {...state, [action.payload.key]: action.payload.value}
        },

    })
);


export function createHortenPage(definition: HortenPageDefinition): ((Alias) => HortenPage) {
    let modelCreator = createHortenPageModel;
    let selectorsCreator = createHortenPageSelectors;
    let helperCreator = createHortenPageHelpers;
    let epicCreator = createHortenPageEpic;
    let reducerCreator = createHortenPageReducer;



    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}