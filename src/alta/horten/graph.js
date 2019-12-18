
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {mergeMap, switchMap, withLatestFrom, map, take, tap, exhaustMap} from "rxjs/operators";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";

import { of } from 'rxjs';
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
import {WAITING} from "../../constants/nodestatus";
export type NodeID = string

export type HortenGraphModel = HortenModel & {

    // Initial Set
    setGraphFromFlow: HaldenActions,
    setGraphFromExternal: HaldenActions,
    setGraphError: HaldenActions,

    // Show Api:
    resend: HaldenActions,

    // Node API
    setNodeIn: (NodeID) => HaldenActions,

    onExternalIn: HaldenActions,
    onExternalOut: HaldenActions,

    // Out
    foreignNodeIn: HaldenActions,
    foreignNodeOut: HaldenActions,

    // In
    setNodeType: HaldenActions,
    setNodeSettings: HaldenActions,

    // Node APIS
    onNodeStatusUpdate: HaldenActions,
    onNodeOutput: HaldenActions,
    setNodeInput: HaldenActions,

    //Veil api
    requestPop: HaldenActions,
    // Helpers for Components
    createShowFromGraph: HaldenActions,
    setShow: HaldenActions,
    nodeRequiresUser: HaldenActions,


}

export type HortenGraphSelectors = HortenSelectors & {
    getGraphShow: HaldenSelector,
    getGraph: HaldenSelector,
    getLinks: HaldenSelector,
    getNodes: HaldenSelector,
    getLinksForNode: (string) => HaldenSelector,
    getNodeStatus: (string) => HaldenSelector,
    getNodeId: (string) => HaldenSelector,
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
    onExternalIn: createHaldenAction("ON_EXTERNAL_IN"),
    onExternalOut: createHaldenAction("ON_EXTERNAL_OUT"),
    foreignNodeIn: createHaldenAction("SET_FOREIGN_NODE_IN"),
    foreignNodeOut: createHaldenAction("SET_FOREIGN_NODE_OUT"),
    setNodeSettings: createHaldenAction("SET_NODE_SETTINGS"),
    setGraphFromFlow: createHaldenAction("FROM_FLOW_SET"),
    setGraphFromExternal: createHaldenAction("FROM_EXTERNAL_SET"),
    createShowFromGraph: createHaldenAction("CREATE_SHOW"),
    onNodeStatusUpdate: createHaldenAction("NODE_STATUS"),
    setShow: createHaldenAction("SET_SHOW"),
    setGraphError: createHaldenAction("GRAPH_ERROR"),
    requestPop: createHaldenAction("GRAPH_REQUEST_POP"),
    resend: createHaldenAction("GRAPH_RESEND")
})

export const createHortenGraphHelpers = createHortenHelpers()

export const createHortenGraphSelectors = createHortenSelectors({
    getGraphShow: createHaldenSelector("show"),
    getGraph: createHaldenFunctionSelector((state) => state.graph),
    getLinks: createHaldenFunctionSelector((state) => state.graph.links),
    getNodes: createHaldenFunctionSelector((state) => state.graph.nodes),
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
    getNodeId: createHaldenFunctionSelector((state, props, params) => {
        let alias = params
        let diagram = state.show

        let links = diagram.links
        let nodes = diagram.nodes
        return nodes[alias].id
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

                    helpers.log("Node Output received ",action.payload)
                    const data = action.payload.data;
                    const meta = action.payload.meta;
                    const type = action.payload.meta.type;
                    const instance = action.payload.meta.instance
                    const port = action.payload.meta.port

                    let instancenodetype = selectors.getNodeType(instance)(state$.value)
                    if (instancenodetype.location == "external" ) {
                        helpers.log("Node itself is an external Node ")
                        let instancenodid = selectors.getNodeId(instance)(state$.value)

                        let outmodel = {
                            data: data,
                            meta: {
                                ...meta,
                                external: instancenodetype.external,
                                instance: instancenodid,
                                port: port,
                            }
                        }

                        return [model.foreignNodeOut.request(outmodel)]
                    }

                    let nodes = []
                    // node.id refers to the unique Diagram ID provided by the Storm-Diagram
                    // node.instanceid refers to the unique InstanceID of the Node
                    let links = []

                    try {
                        let graph = selectors.getGraph(state$.value)
                        helpers.log(graph)
                        nodes = graph.nodes;
                        links = graph.links;
                    } catch (e) {
                        return [model.setGraphError.request({graph: {text: "Lacking Graph"}})]
                    }

                    const actions = [];

                    let originnode = nodes.find(node => node.instance === instance)
                    let originNodeSourceId = originnode.ports.find(item => item.label === port && !item.in).id


                    helpers.log("Found the following Node for Origin of Instance '" + instance + "': ", originnode)
                    helpers.log("Found the following PortId for the Port Output '" + originNodeSourceId)

                    links = links.filter(link => {
                        return link.source === originnode.id && link.sourcePort === originNodeSourceId
                    }); //TODO: Port Comparison

                    helpers.log("Filtered and ended up with the these Links", links)
                    links.map(link => {

                        // Find the Attached Nodes
                        let targetnode = nodes.find(node => {
                            return node.id === link.target
                        });

                        if (targetnode) {
                            // Checks if Diagram is correctly connected

                            let chosenport = targetnode.ports.find(port => port.id === link.targetPort)



                            let outmodel = {
                                data: data,
                                meta: {
                                    ...meta,
                                    model: type,
                                    target: targetnode.instance,
                                    targetid: targetnode.id,
                                    port: chosenport.label,
                                    portid: chosenport.id,
                                    origin: meta.instance
                                }
                            }

                            // Checks if Node is external or Local
                            let targetnodetype = selectors.getNodeType(targetnode.instance)(state$.value)
                            helpers.log("Node has type of : ", targetnodetype,)

                            // Depending on Type send to Veil
                            if (targetnodetype.location === "pop") {

                                outmodel.meta = { ...outmodel.meta, external: targetnodetype.external}

                                actions.push(model.foreignNodeIn.request(outmodel))
                                helpers.log("Pushing to external Representation of Instance " + targetnode.instance +  " at External " + targetnodetype.external + " the Model ",outmodel)
                            }
                            else {
                                helpers.log("Pushing to local Representation of Instance " + targetnode.instance + " the Model",outmodel)
                                helpers.log(model.setNodeIn(targetnode.instance).request)
                                actions.push(model.setNodeIn(targetnode.instance).request(outmodel,outmodel.meta))

                                actions.push(model.onNodeStatusUpdate.request({
                                    instance: targetnode.instance,
                                    status: definition.statusIN
                                }))

                            }

                        }
                        else {
                                actions.push(model.setGraphError.request("Check Connections of " + targetnode.instance + " of Class " + targetnode.nodeid))
                        }

                    });

                    return actions
                }
            )
        ),
    setGraphAndShowFromFlow: (action$, state$) =>
        action$.pipe(
            ofType(model.setGraphFromFlow.request),
            mergeMap(action => {
                // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                let diagram = JSON.parse(action.payload.data.diagram)

                helpers.log(diagram)
                // Instantiate the Nodes with their own instance ID
                let nodes = diagram.nodes.map(node => {
                    const instanceid = (node.name + "-" + v4()).toLowerCase()

                    return {...node,
                        instance: instanceid,
                        base: node.id,
                        nodetype: { location: "local"},
                        status: {
                            code: WAITING.initializing,
                            message: "Initializing.."
                        }}
                })

                // Set the Links
                let links = diagram.links.map(link => link)


                let graph = {links: links, nodes: nodes}
                return [
                    model.setGraphFromFlow.success(graph),
                    model.createShowFromGraph.request(graph)]
                }
            )),
    setGraphAndShowFromExternal: (action$, state$) =>
        action$.pipe(
            ofType(model.setGraphFromExternal.request),
            mergeMap(action => {
                    // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                    let external = action.payload.data
                    const {links, ...rest} = external
                    // Instantiate the Nodes from external with their own instance ID
                    let nodes = [
                        {...rest,
                            instance:  (external.node + "-" + v4()).toLowerCase(),
                            base: external.name,
                            path: external.node,
                            nodetype: { location: "external", external: external.id},
                            ports: JSON.parse(external.ports)

                        }
                    ]

                    // Set the Links

                    let graph = {links: [], nodes: nodes}
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
            ofType(model.requestPop.success),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?
                    let instance = action.payload.name // Node instance in Flow
                    let externalid = action.payload.id // ExternalID

                    return [model.setNodeType.request({ instance: instance, type: { location: "pop", external: externalid}})]
                }
            )),
    onExternalRequestin: (action$, state$) =>
        action$.pipe(
            ofType(model.onExternalIn.request),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?

                    helpers.log("Mapping External In Request to mapped Node" , action.payload)

                    let externalrequest = action.payload.data
                    let modeldata = JSON.parse(externalrequest.data)

                    let nodeinstance = selectors.getGraphShow(state$.value).nodes.find(item => item.id === externalrequest.instance)

                    let payload = {
                        data: modeldata,
                        meta: {
                            target: nodeinstance.instance,
                            model: externalrequest.model,
                            type: externalrequest.model,
                            port: externalrequest.port

                        }
                    }

                    return [model.setNodeIn(externalrequest.instance).request(payload,payload.meta)]
                }
            )),
    onExternalOut: (action$, state$) =>
        action$.pipe(
            ofType(model.onExternalOut.request),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?

                    helpers.log("Mapping External Out Request to Graph" , action.payload)

                    let externalrequest = action.payload.data
                    let modeldata = JSON.parse(externalrequest.data)

                    let nodeinstance = selectors.getGraphShow(state$.value).nodes.find(item => item.id === externalrequest.instance)

                    let payload = {
                        data: modeldata,
                        meta: {
                            instance: nodeinstance.instance,
                            type: externalrequest.model,
                            port: externalrequest.port
                        }
                    }

                    return [model.onNodeOutput.request(payload)]
                }
            )),
    onNodeStatusChanged: createHaldenPassThroughEpicFromActions(model.onNodeStatusUpdate),
    setNodeSettingsPassThrough: createHaldenPassThroughEpicFromActions(model.onNodeStatusUpdate),
    setNodeTypePassTrhough: createHaldenPassThroughEpicFromActions(model.setNodeType),
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
            console.log(action.payload)
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