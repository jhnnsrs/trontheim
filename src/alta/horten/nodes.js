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
import type {OsloActions} from "../oslo";
import type {HortenNodeDefaultState} from "./node";
import { empty, of } from "rxjs"
import {createOsloPassThroughEpic} from "../helpers";
import v4 from "uuid"

export type HortenNodesModel = HortenModel &{
    setNodes: OsloActions,
    registerNode: OsloActions,
    allNodesRegistered: OsloActions,
    setError: OsloActions
}

export type HortenNodesSelectors = HortenSelectors & {
    getComponents: HaldenSelector<[HortenNodeDefaultState]>,
    getRunning: HaldenSelector<{[Alias]:HortenNodeDefaultState}>
}

export type HortenNodesApi = HortenApi
export type HortenNodesHelpers = HortenHelpers

export type HortenNodes = {
    model: HortenNodesModel,
    selectors: HortenNodesSelectors,
    api: HortenNodesApi,
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


export const createHortenNodesApi = createHortenApi({
    fetchItem: () => null
})


export const createHortenNodesEpic = (model: HortenNodesModel, selectors: HortenNodesSelectors, api: HortenNodesApi ) => {

    // PARTSTART: EPICS
    // The Nodes Epic will carry along the EPICS of all the spawned Node
    const registerNode = (action$, state$) =>
        action$.pipe(
            ofType(model.registerNode.request.toString()),
            mergeMap(action => {
                // TODO: mabye by buffer? First make sure old graph is destroyed
                return [model.registerNode.success(action.payload)]

            }));

    const onNodeRegisterCheckAllRegistered = (action$, state$) =>
        action$.pipe(
            ofType(model.registerNode.success),
            mergeMap(action => {
                let state = state$.value
                let running = selectors.getRunning(state, null)
                let components = selectors.getComponents(state,null)
                let running_length = Object.keys(running).length
                let components_length = components.length
                if (running_length == components_length) return [model.allNodesRegistered.request(components)]
                else return empty()


            }));


    const onSetNodesRequestSetNodes = (action$, state$) =>
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
            }));

    const onAllNodesRegisteredPassThrough = createOsloPassThroughEpic(model.allNodesRegistered)

    return combineEpics(
        onNodeRegisterCheckAllRegistered,
        registerNode,
        onSetNodesRequestSetNodes,
        onAllNodesRegisteredPassThrough
    )
};
export type HortenNodesDefaultState = {
    running: any,
    nodes: any,
}
const initialNodesState = {
    running: {},
    nodes: []
};

export const createHortenNodesReducer =  (model: HortenNodesModel, defaultState: HortenNodesDefaultState = initialNodesState): Reducer => handleActions(
    {
        [model.setNodes.success.toString()]: (state, action) => {
            return {...state, touched: true, nodes: action.payload, running: {}}

        },
        [model.registerNode.success.toString()]: (state, action) => {
            let newdict = {}
            console.log("Registering node")
            //TODO: Nameing sceme shoud be simmilar
            newdict[action.payload.nodeid] = action.payload
            return {...state, running: Object.assign(state.running,newdict)}
        },
    },
    defaultState
);


export function createHortenNodes(type: HortenType): ((Alias) => HortenTable) {
    let modelCreator = createHortenNodesModel;
    let apiCreator = createHortenNodesApi;
    let selectorsCreator = createHordenNodesSelectors;
    let helperCreator = createHortenNodesHelpers;
    let epicCreator = createHortenNodesEpic;
    let reducerCreator = createHortenNodesReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator)
}