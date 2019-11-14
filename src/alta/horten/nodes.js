//@flow
import type {Alias, Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten, createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap, takeUntil} from "rxjs/operators";
import {
    createHortenApi,
    createHortenEpic,
    createHortenHelpers,
    createHortenModel, createHortenReducer,
    createHortenSelectors
} from "./creators";
import {
    createHaldenAction,
    createHaldenEpic,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import type {HaldenSelector} from "../halden";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import type {OsloActions} from "../oslo";
import type {HortenNodeDefaultState} from "./node";
import {empty, of} from "rxjs"
import {createOsloPassThroughEpic} from "../helpers";
import v4 from "uuid"

export type HortenNodesModel = HortenModel & {
    setNodes: OsloActions,
    registerNode: OsloActions,
    allNodesRegistered: OsloActions,
    setError: OsloActions
}

export type HortenNodesSelectors = HortenSelectors & {
    getComponents: HaldenSelector<[HortenNodeDefaultState]>,
    getRunning: HaldenSelector<{ [Alias]: HortenNodeDefaultState }>
}

export type HortenNodesDefinition = {
    type: HortenType
}
export type HortenNodesApi = HortenApi
export type HortenNodesHelpers = HortenHelpers

export type HortenNodes = {
    model: HortenNodesModel,
    selectors: HortenNodesSelectors,
    definition: HortenNodesDefinition,
    helpers: HortenNodesHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenNodesDefaultState
}

export const createHortenNodesModel = createHortenModel({
    setNodes: createHaldenAction("SET_NODES"),
    registerNode: createHaldenAction("REGISTER_NODE"),
    setError: createHaldenAction("SET_ERROR"),
    allNodesRegistered: createHaldenAction("ALL_NODES_REGISTERED"),
})

export const createHortenNodesHelpers = createHortenHelpers()

export const createHordenNodesSelectors = createHortenSelectors({
    getComponents: createHaldenSelector("nodes"),
    getRunning: createHaldenSelector("running")
})


export const createHortenNodesEpic = createHortenEpic((model: HortenNodesModel, selectors: HortenNodesSelectors, helpers: HortenNodesApi, definition: HortenNodesDefinition) => ({

        registerNode: createHaldenEpic((action$, state$) =>
            action$.pipe(
                ofType(model.registerNode.request),
                mergeMap(action => {
                    // TODO: mabye by buffer? First make sure old graph is destroyed
                    return [model.registerNode.success(action.payload)]

                }))),
        onNodeRegisterCheckAllRegistered: createHaldenEpic((action$, state$) =>
            action$.pipe(
                ofType(model.registerNode.success),
                mergeMap(action => {
                    let state = state$.value
                    let running = selectors.getRunning(state, null)
                    let components = selectors.getComponents(state, null)
                    let running_length = Object.keys(running).length
                    let components_length = components.length

                    if (running_length == components_length) return [model.allNodesRegistered.request(components)]
                    else return empty()

                }))),
        onSetNodesRequestSetNodes: createHaldenEpic((action$, state$) =>
            action$.pipe(
                ofType(model.setNodes.request.toString()),
                mergeMap(action => {
                    console.log("Setting Nodes from FlowDiagram", action.payload)
                    const graph = action.payload.data
                    let {nodes} = graph.diagram

                    // Parse item
                    let newnodes = [];
                    for (let node in nodes) {
                        let object = {...nodes[node]}
                        delete object.ports
                        newnodes.push(object)
                    }
                    return [
                        model.setNodes.success(newnodes),
                    ]
                }))),
        onAllNodesRegisteredPassThrough: createHaldenPassThroughEpicFromActions(model.allNodesRegistered)
    }
));


export type HortenNodesDefaultState = {
    running: any,
    nodes: any,
}
const defaultState = {
    running: {},
    nodes: []
};

export const createHortenNodesReducer = createHortenReducer((model: HortenNodesModel) => (
    {
        [model.setNodes.success.toString()]: (state, action) => {
            return {...state, touched: true, nodes: action.payload, running: {}}

        },
        [model.registerNode.success.toString()]: (state, action) => {
            let newdict = {}
            console.log("Registering node")
            console.log(action.payload.nodeid)
            //TODO: Nameing sceme shoud be simmilar
            newdict[action.payload.nodeid] = action.payload
            return {...state, running: Object.assign(state.running, newdict)}
        },
    }
))


export function createHortenNodes(definition: HortenNodesDefinition): ((Alias) => HortenNodes) {
    let modelCreator = createHortenNodesModel;
    let selectorsCreator = createHordenNodesSelectors;
    let helperCreator = createHortenNodesHelpers;
    let epicCreator = createHortenNodesEpic;
    let reducerCreator = createHortenNodesReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}