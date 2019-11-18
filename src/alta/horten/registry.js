//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {mergeMap, switchMap} from "rxjs/operators";
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
    createHaldenEpic,
    createHaldenFunctionSelector,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import {empty, zip} from "rxjs"
import type {NodeID} from "./graph";

export type HortenRegistryModel = HortenModel & {
    setNodes: HaldenActions,
    setNodesFromGraph: HaldenActions,
    onModelIn: HaldenActions,
    registerNode: HaldenActions,
    register: (NodeID) => HaldenActions,
    allNodesRegistered: HaldenActions,
    setError: HaldenActions
}

export type HortenRegistrySelectors = HortenSelectors & {
    getComponents: HaldenSelector,
    getRunning: HaldenSelector,
    getNodeInit: HaldenSelector //TODO: Wrong Type
}

export type HortenRegistryDefinition = {
    type: HortenType
}

export type HortenRegistryHelpers = HortenHelpers

export type HortenRegistry = {
    model: HortenRegistryModel,
    selectors: HortenRegistrySelectors,
    definition: HortenRegistryDefinition,
    helpers: HortenRegistryHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenRegistryDefaultState
}

export const createHortenRegistryModel = createHortenModel({
    setNodes: createHaldenAction("SET_NODES"),
    setNodesFromGraph: createHaldenAction("SET_NODES_FROM_GRAPH"),
    onModelIn: createHaldenAction("ON_MODEL_IN"),
    registerNode: createHaldenAction("REGISTER_NODE", true),
    register: createHaldenAction("REGISTER_NODE", false, true),
    setError: createHaldenAction("SET_ERROR"),
    allNodesRegistered: createHaldenAction("ALL_NODES_REGISTERED"),
})

export const createHortenRegistryHelpers = createHortenHelpers()

export const createHordenRegistrySelectors = createHortenSelectors({
    getComponents: createHaldenSelector("nodes"),
    getRunning: createHaldenSelector("running"),
    getNodeInit: createHaldenFunctionSelector( (state, props, params) => {
        let alias = params.alias
        let nodes = state.nodes
        let alllinks = state.links
        let node = nodes.find(node => node.nodeid == alias)
        let links = alllinks.find(link => node.nodeid == alias) //TODO: Correct here

        // Read: Return the Node InitialState
        return {node: node, links: links}
    }, true)
})


export const createHortenRegistryEpic = createHortenEpic((model: HortenRegistryModel, selectors: HortenRegistrySelectors, helpers: HortenRegistryHelpers, definition: HortenRegistryDefinition) => ({

        registerNode: createHaldenEpic((action$, state$) =>
            action$.pipe(
                ofType(model.registerNode.request),
                mergeMap(action => {
                    let { init, alias} = action.meta
                    // Get the initial Nodestate from the Graph
                    // TODO: mabye by buffer? First make sure old graph is destroyed
                    return [model.registerNode.success(action.payload)]

                }))),
        onNodeRegisterCheckAllRegistered: createHaldenEpic((action$, state$) =>
            action$.pipe(
                ofType(model.setNodes.success),
                switchMap(action => {

                    let nodes = selectors.getComponents(state$.value)

                    let registerActions = nodes.map(node => model.register(node.instance).request.toString())
                    let actionStreams = registerActions.map(action => action$.ofType(action))

                    console.log(registerActions)
                    return zip(...actionStreams).pipe(
                        mergeMap(actions => {
                            console.log(actions)
                            return [model.allNodesRegistered.request("YES")]
                        }
                    )
                    )

                }))),
        onSetNodesFromGraphRequestSetNodes: createHaldenEpic((action$, state$) =>
            action$.pipe(
                ofType(model.setNodesFromGraph.request),
                mergeMap(action => {
                    console.log("Setting Nodes from Graph", action.payload)
                    const graph = action.payload
                    let nodes = graph.nodes

                    // Parse item
                    let newnodes = [];
                    for (let node in nodes) {
                        let object = {...nodes[node]}
                        newnodes.push(object)
                    }
                    return [
                        model.setNodes.success(newnodes),
                    ]
                }))),
        onAllNodesRegisteredPassThrough: createHaldenPassThroughEpicFromActions(model.allNodesRegistered)
    }
));

export type Node = {
    instanceid: string,
    nodeid: string,

}

export type HortenRegistryState = {
    running: any,
    nodes: {
        [instanceid: string]: Node
    },
}

const defaultState = {
    running: {},
    nodes: []
};

export const createHortenRegistryReducer = createHortenReducer((model: HortenRegistryModel) => (
    {
        [model.setNodes.success]: (state: HortenRegistryState, action) => {
            let nodes: Node = action.payload
            return {...state, touched: true, nodes: action.payload, running: {}}

        },
        [model.registerNode.success]: (state: HortenRegistryState, action) => {
            let newdict = {}
            console.log("Registering node")
            console.log(action.payload.nodeid)
            //TODO: Nameing sceme shoud be simmilar
            newdict[action.payload.nodeid] = action.payload
            return {...state, running: Object.assign(state.running, newdict)}
        },
    }
))


export function createHortenRegistry(definition: HortenRegistryDefinition): ((Alias) => HortenRegistry) {
    let modelCreator = createHortenRegistryModel;
    let selectorsCreator = createHordenRegistrySelectors;
    let helperCreator = createHortenRegistryHelpers;
    let epicCreator = createHortenRegistryEpic;
    let reducerCreator = createHortenRegistryReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}