//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
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
    createHaldenFunctionSelector,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import v4 from "uuid"

export type HortenGraphModel = HortenModel & {

    // Initial Set
    setGraphFromFlow: HaldenActions,
    setGraphError: HaldenActions,


    // Node APIS
    onNodeStatusUpdate: HaldenActions,
    onNodeOutput: HaldenActions,
    setNodeInput: HaldenActions,


    // Helpers for Components
    createShowFromGraph: HaldenActions,
    setShow: HaldenActions,
    nodeRequiresUser: HaldenActions,


}

export type HortenGraphSelectors = HortenSelectors & {
    getGraphShow: HaldenSelector,
    getDiagram: HaldenSelector,
    getLinksForNode: HaldenSelector,
}
export type HortenGraphHelpers = HortenHelpers & {}
export type HortenGraphDefaultState = {
    [string]: any
}
export type HortenGraphNode = {
    nodeid: string,
    type: string,
    requiresUser: string,
}
export type HortenGraphDefinition = {
    type: HortenType,
    start: (Array<HortenGraphNode>) => HortenGraphNode,
    statusOUT: string,
    statusIN: string,
    connectionWRONG: string,

}

export const STATUSOUT = "Send Output"
export const STATUSIN = "Received Input"
export const WRONGCONNECTION = "Connection WRONG"

const defaultDefinition = {
    type: "Normogramm",
    state: () => {
    },
    statusOUT: STATUSOUT,
    statusIN: STATUSIN,
    connectionWRONG: WRONGCONNECTION
}


export type HortenGraph = {
    model: HortenGraphModel,
    selectors: HortenGraphSelectors,
    helpers: HortenGraphHelpers,
    definition: HortenGraphDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenGraphDefaultState
}


export const createHortenGraphModel = createHortenModel({
    onNodeOutput: createHaldenAction("NODE_OUTPUT"),
    setNodeInput: createHaldenAction("SET_NODE_INPUT"),
    setGraphFromFlow: createHaldenAction("FROM_FLOW_SET"),
    createShowFromGraph: createHaldenAction("CREATE_SHOW"),
    onNodeStatusUpdate: createHaldenAction("NODE_STATUS"),
    setShow: createHaldenAction("SET_SHOW"),
})

export const createHortenGraphHelpers = createHortenHelpers()

export const createHortenGraphSelectors = createHortenSelectors({
    getGraphShow: createHaldenSelector("show"),
    getGraph: createHaldenFunctionSelector((state) => state.graph),
    getLinksForNode: createHaldenFunctionSelector((state, props, params) => {
        let nodeid = params.nodeid
        let diagram = state.diagram

        let links = diagram.links
        let nodes = diagram.nodes
        let node = nodes.find(node => node.nodeid == nodeid)

        // Read: All links that are targeting the node
        return links.filter(item => item.target == node.id)
    }, true)
})


export const createHortenGraphEpic = createHortenEpic((model: HortenGraphModel, selectors: HortenGraphSelectors, helpers, definition: HortenGraphDefinition) => ({

    onNodeOutputSetNodeInputAccordingToFlow: (action$, state$) =>
        // This one is trying to find the according attached nodes if new model is getting in
        action$.pipe(
            ofType(model.onNodeOutput.request.toString()),
            mergeMap(action => {
                    // data: { representation: { data: ... , meta: ....}, biometa: {data: ..,meta:...}, meta: { instanceid:..., .... }

                    const input = action.payload;
                    const data = action.payload.data;
                    const meta = action.payload.meta;
                    const nodemodel = action.payload.meta.model;

                    const instanceid = action.payload.meta.instanceid;


                    let nodes = null
                    // node.id refers to the unique Diagram ID provided by the Storm-Diagram
                    // node.instanceid refers to the unique InstanceID of the Node
                    let links = null

                    try {
                        let graph = selectors.getDiagram(state$.value)
                        nodes = graph.nodes;
                        links = graph.links;
                    } catch (e) {
                        return [model.setGraphError.request({graph: {text: "Lacking Graph"}})]
                    }

                    const actions = [];

                    let mappedchain = links.filter(item => item.sourcePort.startsWith(nodemodel.toUpperCase() + "_OUT")); //TODO: ID comparison

                    console.log("Found the following Nodes for " + nodemodel, mappedchain)
                    mappedchain = mappedchain.filter(link => nodes.find(node => {
                        return (node.instanceid === instanceid && node.id === link.source)
                    }) != null);

                    console.log("Filtered and ended up with the folling nodes for " + nodemodel, mappedchain)
                    mappedchain.map(link => {

                        // Find the Attached Nodes
                        let nodeinstance = nodes.find(node => {
                            return node.id === link.target
                        });

                        if (nodeinstance) {
                            // Checks if Diagram is correctly connected
                            if (link.targetPort.startsWith(nodemodel.toUpperCase() + "_IN") || link.targetPort.startsWith("*")) {

                                let outmodel = {
                                    data: data,
                                    meta: {
                                        ...meta,
                                        model: nodemodel,
                                        target: nodeinstance.instanceid,
                                        origin: meta.nodeid
                                    }
                                }
                                actions.push(model.setNodeInput.request(outmodel))
                                actions.push(model.onNodeStatusUpdate.request({
                                    instance: nodeinstance.instanceid,
                                    status: definition.statusIN
                                }))

                            } else {
                                actions.push(model.setGraphError.request("Check Connections of " + nodeinstance.instanceid + " of Class " + nodeinstance.nodeid))
                            }

                        }
                    });

                    return actions
                }
            )
        ),
    setGraphAndShowFromFlow: (action$, state$) =>
        action$.pipe(
            ofType(model.setGraphFromFlow.request.toString()
            ),
            mergeMap(action => {
                // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                let diagram = JSON.parse(action.payload.data.diagram)

                // Instantiate the Nodes with their own instance ID
                let nodes = diagram.nodes.map(node => {
                    const instanceid = (node.name + "-" + v4()).toLowerCase()

                    return {...node, instanceid: instanceid, base: node.id}
                })

                // Set the Links
                let links = diagram.links.map(link => link)
                let graph = {links: links, nodes: nodes}
                return [model.setGraphFromFlow.success(graph), model.createShowFromGraph.request(graph)]
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
                    let nodes: Array<HortenGraphNode> = diagram.nodes
                    let nodeDict = {}

                    nodes.map(node => {
                        nodeDict[node.nodeid] = node
                    })


                    return [model.setShow.success(nodeDict)]
                }
            )),
    onNodeStatusChanged: createHaldenPassThroughEpicFromActions(model.onNodeStatusUpdate),
}))


const defaultState = {
    graph: null,
    show: {
        nodes: {},
        graph: {
            error: null,
            working: false
        }
    },
    meta: {
        error: null,
        status: null,
    }

};

export const createHortenGraphReducer = createHortenReducer((model: HortenGraphModel) => (
    {
        // Is setting the Graph
        [model.setGraphFromFlow.success]: (state, action) => {
            return {...state, graph: action.payload};
        },
        [model.setShow.success]: (state, action) => {
            return {...state, show: {...state.show, nodes: action.payload}};
        },
        [model.onNodeStatusUpdate.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.instanceid].status = action.payload.status
            return {...state, show: {...state.show, nodes: nodes}};
        },
    })
);

export function createHortenGraph(definition: HortenGraphDefinition): ((Alias) => HortenGraph) {
    let modelCreator = createHortenGraphModel;
    let selectorsCreator = createHortenGraphSelectors;
    let helperCreator = createHortenGraphHelpers;
    let epicCreator = createHortenGraphEpic;
    let reducerCreator = createHortenGraphReducer;
    let sendDefinition = {...defaultDefinition, ...definition}
    return createHorten2(sendDefinition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}