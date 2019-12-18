//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap, switchMap, map, take, withLatestFrom} from "rxjs/operators";

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
    createHaldenEpic, createHaldenHelper,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Action, Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import {ATTENTION, buildStatus, NODE} from "../../constants/nodestatus";
import type {StatusCode} from "../../constants/nodestatus";

export type OutName = string


export type HortenNodeModel = HortenModel & {
    init: HaldenActions,
    setOutput: HaldenActions,
    setOut: (OutName) => HaldenActions,
    setInput: HaldenActions,
    setModel: HaldenActions,
    pop: HaldenActions, //For the Node that causes the Pop
    unpop: HaldenActions, //For the Node that causes the Pop
    alienate: HaldenActions, //For the Node that causes the Pop
    homecoming: HaldenActions, //For the Node that causes the Pop
    setIsPopped: HaldenActions, //For the Node that has been opened
    setIsAlien: HaldenActions, //For the Node that has been opened
    setProgress: HaldenActions,
    setStatus: HaldenActions,
    setState: HaldenActions,
    requireUser: HaldenActions,
    fetchLinks: HaldenActions
}

export type HortenNodeSelectors = HortenSelectors & {
    getLinks: HaldenSelector,
    isPopped: HaldenSelector,
    getInput: HaldenSelector,
    getState: HaldenSelector,
    getStatus: HaldenSelector,
    getPorts: HaldenSelector

}

export type PortName = string

export type HortenNodeHelpers = HortenHelpers & {
    setStatus: (StatusCode, string) => Action,
    requireUser: (string) => Action,
    sendOut: (PortName, any) => Action

}


export type HortenNodeDefaultState = {
    [string]: any
}


export type NodeMap = {
    in: string,
    map: string,
}

export type HortenNodeDefinition = {
    isPoppable: boolean | isUndefined,
    isAlienable: boolean | isUndefined,
    type: HortenType,
    ins: Array<NodeMap>,
    ports: {
        ins: [ {name: PortName, map?: string, type: string }],
        outs: [ {name: PortName, map?: string, type: string }]
    }

}

export type HortenNode = {
    model: HortenNodeModel,
    selectors: HortenNodeSelectors,
    helpers: HortenNodeHelpers,
    definition: HortenNodeDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenNodeDefaultState
}


export const createHortenNodeModel = createHortenModel({
    init: createHaldenAction("INIT"),
    setInput: createHaldenAction("SET_INPUT"),
    setOutput: createHaldenAction("SET_OUTPUT",true),
    setOut: createHaldenAction("SET_OUTPUT", true, true),
    fetchLinks: createHaldenAction("FETCH_LINKS"),
    setModel: createHaldenAction("SET_MODEL"),
    setProgress: createHaldenAction("UPDATE_FIELD"),
    setStatus: createHaldenAction("SET_STATUS"),
    pop: createHaldenAction("SET_POPPED"),
    unpop: createHaldenAction("SET_UNPOPPED"),
    alienate: createHaldenAction("SET_ALIEN"),
    homecoming: createHaldenAction("SET_HOME"),
    setIsPopped: createHaldenAction("SET_IS_POPPED"),
    setIsAlien: createHaldenAction("SET_IS_ALIEN"),
    setState: createHaldenAction("SET_STATE"),
    requireUser: createHaldenAction("REQUIRE_USER"),
})

export const createHortenNodeHelpers = createHortenHelpers({
    setStatus: createHaldenHelper( (model) => (statuscode, message) => model.setStatus.request(buildStatus(statuscode, message))),
    requireUser: createHaldenHelper( (model) => (message) => model.setStatus.request(buildStatus(ATTENTION.requireUserOnInput, message))),
    sendOut: createHaldenHelper( (model) => (out,model) => model.setOut(out).request(model))
    })

export const createHortenNodeSelectors = createHortenSelectors({
    getInput: createHaldenSelector("input"),
    isPopped: createHaldenSelector("isPopped"), //For the Node that is being Popped
    getState: createHaldenSelector("state"), //For the Node that is being Popped
    getStatus: createHaldenSelector("status"), //For the Node that is being Popped
})


export const createHortenNodeEpic = createHortenEpic((model: HortenNodeModel, selectors: HortenNodeSelectors , helpers: HortenNodeHelpers, definition) => {
    // We are Building Now According to the constructed Models and setting the Out with the Required Information

    const outepics = definition.ports.outs.map(
        out => {
            return (action$, state$) => action$.pipe(
                ofType(model.setOut(out.name).request),
                mergeMap(action => {
                        let output = {
                            data: action.payload.data,
                            meta: {
                                ...action.payload.meta,
                                type: out.type,
                                instance: model.alias,
                                port: out.name
                            }
                        }
                        return [
                            model.setOutput.success(output,output.meta),
                            helpers.setStatus({
                                code: NODE.sendOnPort,
                                message: "Input out on " + out.name,
                            })]
                    }
                )
            )
        }
    )

    return {
        progressPassThrough: createHaldenPassThroughEpicFromActions(model.setProgress),
        requireUserThrough: createHaldenPassThroughEpicFromActions(model.requireUser),
        setModelPassThrough: createHaldenPassThroughEpicFromActions(model.setModel),
        setStatusPassThrough: createHaldenPassThroughEpicFromActions(model.setStatus),
        setStatePassThrough: createHaldenPassThroughEpicFromActions(model.setState),
        setOutput: combineEpics(...outepics)


    }
}
        // No Fetch links Passthrough because it is handled by the Graph
);


const defaultState = {
    nodeid: false,
    color: "#ff00FF",
    attention: false,
    touched: false,
    hallo: false,
    links: null,
    popurl: null,
    progress: null,
    isPopped: null,
    isAlien: null, // This will be set to the channelID it should listen on
    hasPopped: false,
    isPoppable: false,
    isAlienable: false,
    status: 999,
    state: false
};

export const createHortenNodeReducer = createHortenReducer((model: HortenNodeModel) => (
    {
        [model.fetchLinks.success]: (state, action) => {
            return {...state, links: action.payload}

        },
        [model.setModel.success]: (state, action) => {
            return {...state, ...action.payload}
        },
        [model.setStatus.success]: (state, action) => {
            return {...state, status: action.payload}
        },
        [model.setState.success]: (state, action) => {
            return {...state, state: action.payload}
        },
        [model.pop.success]: (state, action) => {
            return {...state, isPopped: action.payload}
        },
        [model.unpop.success]: (state, action) => {
            return {...state, isPopped: false}
        },
    })
);

export function createHortenNode(definition: HortenNodeDefinition): ((Alias) => HortenNode) {
    let modelCreator = createHortenNodeModel;
    let selectorsCreator = createHortenNodeSelectors;
    let helperCreator = createHortenNodeHelpers;
    let epicCreator = createHortenNodeEpic;
    let reducerCreator = createHortenNodeReducer;

    let newdefaultState = {...defaultState, isPoppable: definition.isPoppable, isAlienable: definition.isAlienable}

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, newdefaultState)
}