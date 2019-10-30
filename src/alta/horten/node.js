//@flow
import type {Alias,Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap, takeUntil} from "rxjs/operators";
import {createHortenApi, createHortenHelpers, createHortenModel, createHortenSelectors} from "./creators";
import {createHaldenAction, createHaldenSelector} from "../halden";
import type {HaldenSelector} from "../halden";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import {createOsloPassThroughEpic} from "../helpers";
export type HortenNodeModel = HortenModel &{
    setOutput: HaldenActions,
    setInput: HaldenActions,
    setModel: HaldenActions,
    setProgress: HaldenActions,
}

export type HortenNodeSelectors = HortenSelectors & {
    getInput: HaldenSelector<string>
}

export type HortenNodeApi = HortenApi
export type HortenNodeHelpers = HortenHelpers
export type HortenNodeDefaultState = any

export type HortenNode = {
    model: HortenNodeModel,
    selectors: HortenNodeSelectors,
    api: HortenNodeApi,
    helpers: HortenNodeHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenNodeDefaultState
}

export const createHortenNodeModel = createHortenModel({
    // This is Mainly for the FlowDiagram Interoperability
    setInput: createHaldenAction("SET_INPUT"),
    setOutput: createHaldenAction("SET_OUTPUT"),
    setProgress: createHaldenAction("UPDATE_FIELD"),
    setModel: createHaldenAction("SET_MODEL"),
})

export const createHortenNodeHelpers = createHortenHelpers({
    //TODO: make really okay
})

export const createHordenNodeSelectors = createHortenSelectors({
    getInput: createHaldenSelector("input")
})


export const createHortenNodeApi = createHortenApi({
    fetchItem: () => null
})


export const createHortenNodeEpic = (model: HortenNodeModel, selector: HortenNodeSelectors, api: HortenNodeApi ) => {



    const setModelPassThrough = createOsloPassThroughEpic(model.setModel)


    return combineEpics(
        setModelPassThrough
    )
};

const initialNodeState = {
    nodeid: false,
    color: "#ff00FF",
    attention: false,
    touched: false,
    hallo: false
};

export const createHortenNodeReducer =  (model: HortenNodeModel) => handleActions(
    {
        [model.setOutput.success]: (state, action) => {
            let newstate = {...state, touched: true}
            newstate[action.payload.field.toLowerCase()] = action.payload.value;
            return newstate;
        },
        [model.setModel.success]: (state, action) => {
            return {...state, ...action.payload}
        },

    },
    initialNodeState
);


export function createHortenNode(type: HortenType = "node"): ((Alias) => HortenNode) {

    let modelCreator = createHortenNodeModel;
    let apiCreator = createHortenNodeApi;
    let selectorsCreator = createHordenNodeSelectors;
    let helperCreator = createHortenNodeHelpers;
    let epicCreator = createHortenNodeEpic;
    let reducerCreator = createHortenNodeReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator)
}