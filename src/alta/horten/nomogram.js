//@flow
import type {Alias, Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten, createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, takeUntil} from "rxjs/operators";
import {
    createHortenApi, createHortenEpic,
    createHortenEpics,
    createHortenHelpers,
    createHortenModel, createHortenReducer,
    createHortenSelectors
} from "./creators";
import {
    createHaldenAction,
    createHaldenApi,
    createHaldenEpic,
    createHaldenFunctionSelector, createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import type {HaldenSelector} from "../halden";
import type {StavangerNodesModel} from "../../bergen/models";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import {ajax} from "rxjs/ajax";
import * as qs from "querystring";
import {Observable} from "rxjs";
import type {HaldenActions} from "../oslo";
import v4 from "uuid"

export type HortenNomogramModel = HortenModel & {
    modelIN: HaldenActions,
    modelOUT: HaldenActions,
    setGraphFromFlow: HaldenActions,
    setGraphFromNodes: HaldenActions,
    setGraphError: HaldenActions,
    setNodeProgress: HaldenActions,
    setNodeError: HaldenActions,
    setNodeStatus: HaldenActions,
    createShowFromGraph: HaldenActions,
    setShow: HaldenActions,
    nodeRequiresUser: HaldenActions,
}

export type HortenNomogramSelectors = HortenSelectors & {
    getComponents: HaldenSelector,
    getGraphShow: HaldenSelector,
    getDiagram: HaldenSelector,
    getLinksForNode: HaldenSelector,
}


export type HortenNomogramHelpers = HortenHelpers & {}


export type HortenNomogramDefaultState = {
    [string]: any
}

export type HortenNomogramNode = {
    nodeid: string,
    type: string,
    requiresUser: string,
}


export type HortenNomogramDefinition = {
    type: HortenType,
    start: (Array<HortenNomogramNode>) => HortenNomogramNode,
    statusOUT: string,
    statusIN: string,
    connectionWRONG: string,

}

export const STATUSOUT = "Send Output"
export const STATUSIN = "Received Input"
export const WRONGCONNECTION = "Connection WRONG"

const defaultDefinition = {
    type: "Normogramm",
    state: () => {},
    statusOUT: STATUSOUT,
    statusIN: STATUSIN,
    connectionWRONG: WRONGCONNECTION
}



export type HortenNomogram = {
    model: HortenNomogramModel,
    selectors: HortenNomogramSelectors,
    helpers: HortenNomogramHelpers,
    definition: HortenNomogramDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenNomogramDefaultState
}



export const createHortenNomogramModel = createHortenModel({
    modelIN: createHaldenAction("MODEL_IN"),
    modelOUT: createHaldenAction("MODEL_OUT"),
    setGraphReady: createHaldenAction("READY"),
    setGraphError: createHaldenAction("ERROR"),
    setGraphFromFlow: createHaldenAction("FROM_FLOW_SET"),
    setGraphFromNodes: createHaldenAction("FROM_NODES_SET"),
    createShowFromGraph: createHaldenAction("CREATE_SHOW"),
    setNodeProgress: createHaldenAction("NODE_PROGRESS"),
    setNodeStatus: createHaldenAction("NODE_STATUS"),
    setNodeError: createHaldenAction("NODE_ERROR"),
    setShow: createHaldenAction("SET_SHOW"),
    nodeRequiresUser: createHaldenAction("NODE_REQUIRES_USER"),
})

export const createHortenNomogramHelpers = createHortenHelpers()

export const createHortenNomogramSelectors = createHortenSelectors({
    getGraphShow: createHaldenSelector("show"),
    getDiagram: createHaldenFunctionSelector((state) => state.diagram),
    getLinksForNode: createHaldenFunctionSelector( (state, props, params) => {
        let nodeid = params.nodeid
        let diagram = state.diagram

        let links = diagram.links
        let nodes = diagram.nodes
        let node = nodes.find(node => node.nodeid == nodeid)

        // Read: All links that are targeting the node
        return links.filter( item => item.target == node.id)
    }, true)
})


export const createHortenNomogramEpic = createHortenEpic((model: HortenNomogramModel, selectors: HortenNomogramSelectors, helpers, definition: HortenNomogramDefinition) => ({

    findNodesForModel: (action$, state$) =>
        // This one is trying to find the according attached nodes if new model is getting in
        action$.pipe(
            ofType(model.modelIN.request.toString()),
            mergeMap(action => {
                    // data: { representation: { data: ... , meta: ....}, biometa: {data: ..,meta:...}, meta: { nodeid:..., .... }

                    const input = action.payload;
                    const data = action.payload.data;
                    const meta = action.payload.meta;
                    const nodemodel = action.payload.meta.model;
                    let nodes = null
                    let links = null
                    const modelnodeid = action.payload.meta.nodeid;

                    try {
                        let diagram = selectors.getDiagram(state$.value)
                        nodes = diagram.nodes;
                        links = diagram.links;
                    } catch (e) {
                        return [model.setGraphError.request({graph: {text: "Lacking Diagramm"}})]
                    }


                    const actions = [];


                    let mappedchain = links.filter(item => item.sourcePort.startsWith(nodemodel.toUpperCase() + "_OUT")); //TODO: ID comparison

                    console.log("Found the following Nodes for " + nodemodel, mappedchain)
                    mappedchain = mappedchain.filter(link => nodes.find(node => {
                        return (node.nodeid === modelnodeid && node.id === link.source)
                    }) != null);

                    console.log("Filtered and ended up with the folling nodes for " + nodemodel, mappedchain)
                    mappedchain.map(link => {
                        let nodeinstance = nodes.find(node => {
                            return node.id === link.target
                        });
                        if (nodeinstance) {
                            // Checks again if Node was correctly
                            if (link.targetPort.startsWith(nodemodel.toUpperCase() + "_IN") || link.targetPort.startsWith("*")) {

                                let outmodel = {
                                    data: data,
                                    meta: {
                                        ...meta,
                                        model: nodemodel,
                                        target: nodeinstance.nodeid,
                                        origin: meta.nodeid
                                    }
                                }
                                actions.push(model.modelOUT.request(outmodel))
                                actions.push(model.setNodeStatus.request({
                                        node:  nodeinstance.nodeid,
                                        status: definition.statusIN

                                }))
                            } else {
                                actions.push(model.setNodeError.request({
                                        node: meta.nodeid,
                                        error: definition.connectionWRONG
                                }))
                            }

                        }
                    });


                    return actions
                }
            )
        ),

    onGraphSetFromNodes:  (action$, state$) =>
        action$.pipe(
            ofType(model.setGraphFromNodes.request.toString()),
            mergeMap(action => {
                    // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                    let nodes = action.payload
                    let instanceddiagram = {links: [], nodes: nodes}
                    return [model.setGraphFromFlow.success(instanceddiagram),
                        model.createShowFromGraph.request(instanceddiagram)]
                }
            )),
    onGraphSetFromFlowRequest:(action$, state$) =>
        action$.pipe(
            ofType(model.setGraphFromFlow.request.toString()
            ),
            mergeMap(action => {
                    // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                    let diagram = JSON.parse(action.payload.data.diagram)
                    let nodes  = diagram.nodes.map( node => {
                        const instanceid = (node.name + "-" + v4()).toLowerCase()

                        return {...node, nodeid: instanceid, instanceid: instanceid, base: node.id}
                    })
                    let instanceddiagram = {...diagram, nodes: nodes}
                    return [model.setGraphFromFlow.success(instanceddiagram),
                            model.createShowFromGraph.request(instanceddiagram)]
                }
            )),
    onCreateShowFromGraphRequest: (action$, state$) =>
        action$.pipe(
            ofType(model.createShowFromGraph.request.toString()
            ),
            mergeMap(action => {
                    // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                    let diagram = action.payload
                    let orderednodes = [] // OF SHAPE [[FIRST, FIRST],[SECOND, SECOND],[THIRD]]
                    let nodes: Array<HortenNomogramNode> = diagram.nodes
                    let nodeDict = {}

                    nodes.map(node => { nodeDict[node.nodeid] = node })


                    return [model.setShow.success({nodes: nodeDict})]
                }
            )),
    setNodeProgressPassThrough: createHaldenPassThroughEpicFromActions(model.setNodeProgress),
    setNodeErrorPassThrough: createHaldenPassThroughEpicFromActions(model.setNodeError),
    setNodeStatusPassThrough: createHaldenPassThroughEpicFromActions(model.setNodeStatus),
    setNodeRequiresUserPassThrough: createHaldenPassThroughEpicFromActions(model.nodeRequiresUser),
}))


const defaultState = {
    diagram: null,
    show: {
        nodes: {},
        graph: {
            error: null,
            working: false
        }
    }

};

export const createHortenNomogramReducer = createHortenReducer((model: HortenNomogramModel) => (
    {
        [model.setGraphFromFlow.success]: (state, action) => {
            return { ...state, diagram: action.payload};
        },
        [model.setShow.success]: (state, action) => {
            return { ...state, show: {...state.show, ...action.payload}};
        },
        [model.setGraphError.success]: (state, action) => {
            return { ...state, meta: {...state.meta, error: action.payload }};
        },
        [model.setNodeProgress.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.node].progress = action.payload.progress
            return { ...state, show: {...state.show, nodes: nodes }};
        },
        [model.setNodeStatus.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.node].status = action.payload.status
            return { ...state, show: {...state.show, nodes: nodes }};
        },
        [model.setNodeError.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.node].error = action.payload.error
            return { ...state, show: {...state.show, nodes: nodes }};
        },
        [model.nodeRequiresUser.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.node].requiresUser = action.payload.value
            return { ...state, show: {...state.show, nodes: nodes }};
        },
    })
);

export function createHortenNomogram(definition: HortenNomogramDefinition): ((Alias) => HortenNomogram) {
    let modelCreator = createHortenNomogramModel;
    let selectorsCreator = createHortenNomogramSelectors;
    let helperCreator = createHortenNomogramHelpers;
    let epicCreator = createHortenNomogramEpic;
    let reducerCreator = createHortenNomogramReducer;
    let sendDefinition = {...defaultDefinition,...definition}
    return createHorten2(sendDefinition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}