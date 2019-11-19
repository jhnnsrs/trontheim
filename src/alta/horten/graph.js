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
export type NodeID = string

export type HortenGraphModel = HortenModel & {

    // Initial Set
    setGraphFromFlow: HaldenActions,
    setGraphError: HaldenActions,

    // Node API
    setNodeIn: (NodeID) => HaldenActions,

    // Out
    foreignNodeIn: HaldenActions,

    // In
    setNodeType: HaldenActions,
    setNodeSettings: HaldenActions,

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
    getGraph: HaldenSelector,
    getLinksForNode: (string) => HaldenSelector,
    getNodeStatus: (string) => HaldenSelector,
    getNode: (string) => HaldenSelector,
    hasNodePopped: (string) => HaldenSelector,
    getNodeType: (string) => HaldenSelector,
    getNodeSettings: (string) => HaldenSelector,

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
    onNodeOutput: createHaldenAction("NODE_OUTPUT", true),
    setNodeInput: createHaldenAction("SET_NODE_INPUT"),
    setNodeIn: createHaldenAction("NODE_INPUT_SET",false, true),
    setNodeType: createHaldenAction("SET_NODE_TYPE"),
    foreignNodeIn: createHaldenAction("SET_FOREIGN_NODE_IN"),
    setNodeSettings: createHaldenAction("SET_NODE_SETTINGS"),
    setGraphFromFlow: createHaldenAction("FROM_FLOW_SET"),
    createShowFromGraph: createHaldenAction("CREATE_SHOW"),
    onNodeStatusUpdate: createHaldenAction("NODE_STATUS"),
    setShow: createHaldenAction("SET_SHOW"),
    setGraphError: createHaldenAction("GRAPH_ERROR"),
})

export const createHortenGraphHelpers = createHortenHelpers()

export const createHortenGraphSelectors = createHortenSelectors({
    getGraphShow: createHaldenSelector("show"),
    getGraph: createHaldenFunctionSelector((state) => state.graph),
    getNodeStatus: createHaldenFunctionSelector((state, props, params) => {
        let alias = params
        let diagram = state.show

        let links = diagram.links
        let nodes = diagram.nodes
        return nodes[alias]
    }, true),
    getNode: createHaldenFunctionSelector((state, props, params) => {
        let alias = params
        let diagram = state.show

        let links = diagram.links
        let nodes = diagram.nodes
        return nodes[alias]
    }, true),
    hasNodePopped: createHaldenFunctionSelector((state, props, params) => {
        let alias = params
        let diagram = state.show

        let links = diagram.links
        let nodes = diagram.nodes
        return nodes[alias].hasPopped
    }, true),
    getNodeType: createHaldenFunctionSelector((state, props, params) => {
        let alias = params
        let diagram = state.show

        let links = diagram.links
        let nodes = diagram.nodes
        return nodes[alias].nodetype
    }, true),
    getNodeSettings: createHaldenFunctionSelector((state, props, params) => {
        let alias = params
        let diagram = state.show

        let links = diagram.links
        let nodes = diagram.nodes
        return nodes[alias].defaultsettings
    }, true),
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
                    const type = action.payload.meta.type;

                    const instance = action.payload.meta.instance;


                    let nodes = null
                    // node.id refers to the unique Diagram ID provided by the Storm-Diagram
                    // node.instanceid refers to the unique InstanceID of the Node
                    let links = null

                    try {
                        let graph = selectors.getGraph(state$.value)
                        nodes = graph.nodes;
                        links = graph.links;
                    } catch (e) {
                        return [model.setGraphError.request({graph: {text: "Lacking Graph"}})]
                    }

                    const actions = [];


                    let mappedchain = links.filter(item => item.sourcePort.startsWith(type.toUpperCase())); //TODO: ID comparison

                    helpers.log("Found the following Nodes for " + type, mappedchain)
                    mappedchain = mappedchain.filter(link => nodes.find(node => {
                        return (node.instance === instance && node.id === link.source)
                    }) != null);

                    helpers.log("Filtered and ended up with the folling nodes for " + type, mappedchain)
                    mappedchain.map(link => {

                        // Find the Attached Nodes
                        let nodeinstance = nodes.find(node => {
                            return node.id === link.target
                        });

                        if (nodeinstance) {
                            // Checks if Diagram is correctly connected
                            if (link.targetPort.startsWith(type.toUpperCase() + "_IN") || link.targetPort.startsWith("*")) {

                                let outmodel = {
                                    data: data,
                                    meta: {
                                        ...meta,
                                        model: type,
                                        target: nodeinstance.instance,
                                        port: link.targetPort,
                                        origin: meta.nodeid
                                    }
                                }

                                // Checks if Node is ALien or Local
                                let nodetype = selectors.getNodeType(nodeinstance.instance)(state$.value)
                                helpers.log("Node has type of : ", nodetype,)

                                // Depending on Type send to Veil
                                if (nodetype === "pop") {
                                    actions.push(model.foreignNodeIn.request(outmodel))
                                    helpers.log("Pushing to foreignNode ",outmodel)
                                } else {
                                    actions.push(model.setNodeIn(nodeinstance.instance).request(outmodel,outmodel.meta))
                                }


                                actions.push(model.setNodeIn(nodeinstance.instance).request(outmodel,outmodel.meta))


                                    actions.push(model.onNodeStatusUpdate.request({
                                    instance: nodeinstance.instance,
                                    status: definition.statusIN
                                }))

                            } else {
                                actions.push(model.setGraphError.request("Check Connections of " + nodeinstance.instance + " of Class " + nodeinstance.nodeid))
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

                    return {...node, instance: instanceid, base: node.id}
                })

                // Set the Links
                let links = diagram.links.map(link => link)


                let graph = {links: links, nodes: nodes}
                return [
                    model.setGraphFromFlow.success(graph),
                    model.createShowFromGraph.request(graph)]
                }
            )),
    onCreateShowFromGraphRequest: (action$, state$) =>
        action$.pipe(
            ofType(model.createShowFromGraph.request.toString()
            ),
            mergeMap(action => {
                    // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                    let diagram = action.payload
                    let nodes: Array<HortenGraphNode> = diagram.nodes
                    let nodeDict = {}

                    nodes.map(node => {
                        nodeDict[node.instance] = node
                    })


                    return [model.setShow.success({nodes: nodeDict, links: null})]
                }
            )),
    onPopNodeRequestPopNode: (action$, state$) =>
        action$.pipe(
            ofType(model.setNodeType.request),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?
                    let instance = action.payload.instance
                    let type = action.payload.type
                    return [model.setNodeType.success(action.payload)]
                }
            )),
    onNodeStatusChanged: createHaldenPassThroughEpicFromActions(model.onNodeStatusUpdate),
    setNodeSettingsPassThrough: createHaldenPassThroughEpicFromActions(model.onNodeStatusUpdate),
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
            return {...state, show: {...state.show, nodes: action.payload.nodes, links: action.payload.links}};
        },
        [model.onNodeStatusUpdate.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.instance]["status"] = action.payload.status
            return {...state, show: {...state.show, nodes: nodes}};
        },
        [model.setNodeType.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.instance].nodetype = action.payload.type
            return {...state, show: {...state.show, nodes: nodes}};
        },
        [model.setNodeSettings.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            //TODO: Change defaultsettings to a settings parameter in stormdiagram
            nodes[action.payload.instance].defaultsettings = action.payload.settings
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