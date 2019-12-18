
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
export type External = {
    id: string,
    name: NodeInstance,
    path: string,
    ports: any,

}

export type ExternalRequest = {
    id: string,
    instance: NodeInstance,
    data: string, //
    model: string, // Represenenting the type of Model

}


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

    //Settings
    saveSettings: HaldenActions,
    loadSettings: HaldenActions,

    // Node APIS
    onNodeStatusUpdate: HaldenActions,
    onNodeOutput: HaldenActions,
    setNodeInput: HaldenActions,

    //Veil api
    requestPop: HaldenActions<External>,
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
    // Name Like Retrieval
    getNodeByName: (string) => HaldenSelector,

    // This is for Instance Based Retrieval
    getNodeStatus: (string) => HaldenSelector,
    getNode: (string) => HaldenSelector,
    getNodeType: (string) => HaldenSelector,
    getNodeSettings: (string) => HaldenSelector,
    getAliasForInstance: (NodeInstance) => HaldenSelector<Alias>,

    // This is For Alias Base Retrieval
    getInstanceForAlias: (Alias) => HaldenSelector<NodeInstance>,
    getNodeSettingsForAlias: (Alias) => HaldenSelector<NodeInstance>,
    getNodeStatusForAlias: (Alias) => HaldenSelector<NodeStatus>,
    getNodeTypeForAlias: (Alias) => HaldenSelector<NodeType>,
    getNodeForAlias: (Alias) => HaldenSelector<HortenGraphNode>,

}
export type HortenGraphHelpers = HortenHelpers & {}

export type NodeType = {
    location: string,
    external: string
}

export type HortenGraphNode = {
    alias: Alias,
    instance: NodeInstance,
    settings: NodeSettings,
    path: string,
    nodeid: string,
    type: NodeType,
    requiresUser: string,
}

export type HortenGraphDefaultState = {
    graph: {
        nodes: [HortenGraphNode],
        links: [any],
    },
    show: {
        nodes: { [NodeInstance]: HortenGraphNode },
        aliasInstanceMap: { [Alias]: NodeInstance },
        links: []
    }
}

export type NodeSettings = {
    [string]: any
}

export type NodeStatus = {
    code: number,
    message: string
}

export type NodeInstance = string


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
    saveSettings: createHaldenAction("SAVE_SETTINGS"),
    loadSettings: createHaldenAction("LOAD_SETTINGS"),
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

export const createHortenGraphHelpers = createHortenHelpers(




)

export const createHortenGraphSelectors = createHortenSelectors({
    getGraphShow: createHaldenSelector("show"),
    getGraph: createHaldenFunctionSelector((state) => state.graph),
    getLinks: createHaldenFunctionSelector((state) => state.graph.links),
    getNodes: createHaldenFunctionSelector((state) => state.graph.nodes),
    getNodeStatus: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params: NodeInstance) => {
        let node = state.show.nodes[params]
        return  node.status
    }, true),
    getNodeByName: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params: NodeInstance) => {
        let graphnode = state.graph.nodes.find(item => item.name === params)
        let node = state.show.nodes[graphnode.instance]
        return  node
    }, true),
    getNode: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params: NodeInstance) => {
        let node = state.show.nodes[params]
        return  node
    }, true),
    getNodeType: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params: NodeInstance) => {
        let node = state.show.nodes[params]
        return  node.type
    }, true),
    getNodeSettings: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params: NodeInstance) => {
        let node = state.show.nodes[params]
        return  node.settings
    }, true),
    getInstanceForAlias: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params) => {
        let instance = state.show.aliasInstanceMap[params]
        return instance
    }, true),
    getAliasForInstance: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params) => {
        let node = state.show.nodes[params]
        return  node.alias
    }, true),
    getNodeSettingForAlias: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params) => {
        let instance = state.show.aliasInstanceMap[params]
        let node = state.show.nodes[instance]
        return node.settings
    }, true),
    getNodeStatusForAlias: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params) => {
        let instance = state.show.aliasInstanceMap[params]
        let node = state.show.nodes[instance]
        return node.status
    }, true),
    getNodeTypeForAlias: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params) => {
        let instance = state.show.aliasInstanceMap[params]
        let node = state.show.nodes[instance]
        return node.type
    }, true),
    getNodeForAlias: createHaldenFunctionSelector((state: HortenGraphDefaultState, props, params) => {
        let instance = state.show.aliasInstanceMap[params]
        let node = state.show.nodes[instance]
        return node
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


                    let originNode = selectors.getNode(instance)(state$.value)

                    let instancenodetype = originNode.type
                    if (instancenodetype.location === "external" ) {
                        helpers.log("Node itself is an external Node ")

                        let outmodel = {
                            data: data,
                            meta: {
                                ...meta,
                                external: instancenodetype.external,
                                instance: instance,
                                port: port,
                            }
                        }

                        return [model.foreignNodeOut.request(outmodel)]
                    }

                    // node.id refers to the unique Diagram ID provided by the Storm-Diagram
                    // node.instanceid refers to the unique InstanceID of the Node
                    let links = selectors.getLinks(state$.value)
                    let nodes = selectors.getNodes(state$.value)

                    const actions = [];

                    let originNodePortSourceID = originNode.ports.find(item => item.label === port && !item.in).id


                    helpers.log("Found the following Node for Origin of Instance '" + instance + "': ", originNode)
                    helpers.log("Found the following PortId for the Port Output '" + originNodePortSourceID)

                    links = links.filter(link => {
                        return link.source === originNode.id && link.sourcePort === originNodePortSourceID
                    }); //TODO: Port Comparison

                    helpers.log("Filtered and ended up with the these Links", links)
                    links.map(link => {

                        // Find the Attached Nodes
                        let targetnodeinstance = link.target // This is only working because the link target is the id of the flow
                        let targetNode = selectors.getNode(targetnodeinstance)(state$.value)


                        if (targetNode) {
                            // Checks if Diagram is correctly connected

                            let chosenport = targetNode.ports.find(port => port.id === link.targetPort)

                            let outmodel = {
                                data: data,
                                meta: {
                                    ...meta,
                                    model: type,
                                    target: targetNode.instance,
                                    port: chosenport.label,
                                    portid: chosenport.id,
                                    origin: meta.instance
                                }
                            }

                            // Checks if Node is external or Local
                            let targetnodetype = targetNode.type
                            helpers.log("Targeting Node has type of : ", targetnodetype)

                            // Depending on Type send to Veil
                            if (targetnodetype.location === "pop") {

                                outmodel.meta = { ...outmodel.meta, external: targetnodetype.external}

                                actions.push(model.foreignNodeIn.request(outmodel))
                                helpers.log("Pushing to external Representation of Instance " + targetNode.instance +  " at External " + targetnodetype.external + " the Model ",outmodel)
                            }
                            else {
                                helpers.log("Pushing to local Representation of Instance " + targetNode.instance + " at Alias " + targetNode.alias + " the Model",outmodel)


                                actions.push(model.setNodeIn(targetNode.alias).request(outmodel,outmodel.meta))

                                actions.push(model.onNodeStatusUpdate.request({
                                    instance: targetNode.instance,
                                    status: definition.statusIN
                                }))

                            }

                        }
                        else {
                                actions.push(model.setGraphError.request("Check Connections of " + targetNode.instance + " of Class " + targetNode.nodeid))
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
                    const alias = (node.name + "-" + v4()).toLowerCase()

                    return {...node,
                        instance: node.id, // This is the id of the node (correspondes to the graph-id)
                        alias: alias,
                        type: { location: "local", external: null},
                        settings: node.defaultsettings,
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

                    const alias = (external.node + "-" + v4()).toLowerCase()
                    // Instantiate the Nodes from external with their own instance ID
                    let nodes = [
                        {...rest,
                            instance: external.name, // This is the id of the node (correspondes to the graph-id) external-name is right now the holder of this TODO: should be instance
                            alias:  alias,
                            path: external.node,
                            settings: external.defaultsettings,
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
                    let nodeDictByAlias = {}
                    let nodeDictByInstance = {}

                    nodes.map(node => {
                        nodeDictByAlias[node.alias] = node.instance
                        nodeDictByInstance[node.instance] = node
                    })


                    return [model.setShow.success({aliasInstanceMap: nodeDictByAlias, nodes: nodeDictByInstance})]
                }
            )),
    onPopNodeRequestPopNode: (action$, state$) =>
        action$.pipe(
            ofType(model.requestPop.success),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?
                    let external: External = action.payload

                    return [model.setNodeType.request(
                        { instance: external.name,
                            type: {location: "pop", external: external.id}})]
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

                    let alias = selectors.getAliasForInstance(externalrequest.instance)

                    let payload = {
                        data: modeldata,
                        meta: {
                            model: externalrequest.model,
                            type: externalrequest.model,
                            port: externalrequest.port

                        }
                    }

                    return [model.setNodeIn(alias).request(payload,payload.meta)]
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


                    let payload = {
                        data: modeldata,
                        meta: {
                            instance: externalrequest.instance,
                            type: externalrequest.model,
                            port: externalrequest.port
                        }
                    }

                    return [model.onNodeOutput.request(payload)]
                }
            )),
    onSaveSettings: (action$, state$) =>
        action$.pipe(
            ofType(model.saveSettings.request),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?

                    let graphstate = selectors.getGraphShow(state$.value)

                    helpers.log("Graphstate" ,graphstate)



                    return [model.saveSettings.success(graphstate)]
                }
            )),
    onLoadSettings: (action$, state$) =>
        action$.pipe(
            ofType(model.loadSettings.request),
            mergeMap(action => {
                    // TODO: Here an instantiation of the node type on veil should maybe happen?

                    const graphstate = action.payload







                    return [model.saveSettings.success(graphstate)]
                }
            )),
    onNodeStatusChanged: createHaldenPassThroughEpicFromActions(model.onNodeStatusUpdate),
    setNodeSettingsPassThrough: createHaldenPassThroughEpicFromActions(model.setNodeSettings),
    setNodeTypePassTrhough: createHaldenPassThroughEpicFromActions(model.setNodeType),
}))


const defaultState = {
    graph: null,
    show: {
        nodes: {},
        aliasInstanceMap: {},
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
            return {...state, show: {...state.show, ...action.payload}};
        },
        [model.onNodeStatusUpdate.success]: (state, action) => {
            let nodes = {...state.show.nodes}

            nodes[action.payload.instance].status = action.payload.status
            return {...state, show: {...state.show, nodes: nodes}};
        },
        [model.setNodeType.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.instance].type = action.payload.type
            return {...state, show: {...state.show, nodes: nodes}};
        },
        [model.setNodeSettings.success]: (state, action) => {
            let nodes = {...state.show.nodes}
            nodes[action.payload.instance].settings = action.payload.settings
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