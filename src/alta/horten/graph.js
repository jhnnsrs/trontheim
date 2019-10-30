//@flow
import type {Alias,Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap, takeUntil} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {createHortenApi, createHortenHelpers, createHortenModel, createHortenSelectors} from "./creators";
import {createHaldenAction, createHaldenFunctionSelector, createHaldenSelector} from "../halden";
import type {HaldenSelector} from "../halden";
import type {StavangerNodesModel} from "../../bergen/models";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import {combineOsloActionsWithPassThrough} from "../oslo/epics";
import type {HaldenActions} from "../oslo";

export type HortenGraphModel = HortenModel &{
    modelIN: HaldenActions,
    modelOUT: HaldenActions,
    setGraphFromFlow: HaldenActions,
    setGraphError: HaldenActions,
}

export type HortenGraphSelector = HortenSelectors & {
    getComponents: HaldenSelector,
    getGraphShow: HaldenSelector,
    getDiagram: HaldenSelector,
}

export type HortenGraphApi = HortenApi
export type HortenGraphHelpers = HortenHelpers
export type HortenGraphDefaultState = any

export type HortenGraph = {
    model: HortenGraphModel,
    selectors: HortenGraphSelector,
    api: HortenGraphApi,
    helpers: HortenGraphHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenGraphDefaultState
}
export const createHortenGraphModel = createHortenModel({
    modelIN: createHaldenAction("MODEL_IN"),
    modelOUT: createHaldenAction("MODEL_OUT"),
    setGraphReady: createHaldenAction("READY"),
    setGraphError: createHaldenAction("ERROR"),
    setDiagram: createHaldenAction("DIAGRAM_SET"),
    setGraphFromFlow: createHaldenAction("FROM_FLOW_SET"),
})

export const createHortenGraphHelpers = createHortenHelpers()

export const createHortenGraphSelectors = createHortenSelectors({
    getGraphShow: createHaldenSelector("show"),
    getDiagram: createHaldenFunctionSelector((state) => state.data.diagram)
})


export const createHortenGraphApi = createHortenApi({
    fetchItem: () => null
})


export const createHortenGraphEpic = (model: HortenGraphModel, selectors: HortenGraphSelector, api: HortenGraphApi ) => {


    const onModelINSetNodeModel = (action$, state$) =>
        // This one is trying to find the according attached nodes if new model is getting in
        action$.pipe(
            ofType(model.modelIN.request.toString()),
            mergeMap(action => {
                    // data: { representation: { data: ... , meta: ....}, biometa: {data: ..,meta:...}, meta: { nodeid:..., .... }

                    const input = action.payload;
                    const data =  action.payload.data;
                    const meta = action.payload.meta;
                    const nodemodel = action.payload.meta.model;
                    let nodes = null
                    let links = null
                    const modelnodeid = action.payload.meta.nodeid;

                    try {
                        let diagram = selectors.getDiagram(state$.value)
                        nodes = diagram.nodes;
                        links = diagram.links;
                    }
                    catch (e)
                    {
                        return [model.setGraphError.request({ graph: {text: "Lacking Diagramm"}})]
                    }


                    const actions = [];


                    let mappedchain = links.filter(item => item.sourcePort.startsWith(nodemodel.toUpperCase() +"_OUT")); //TODO: ID comparison

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
                            if( link.targetPort.startsWith(nodemodel.toUpperCase() + "_IN")) {

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
                            }
                            else {
                                actions.push(model.setGraphError.request({nodes: {nodeid: nodemodel, text: "Link not set correctly", datain: data}}))
                            }

                        }
                    });


                    return actions
                }
            )
        );

    const onGraphSetFromFlowRequest = (action$, state$) =>
        action$.pipe(
            ofType(model.setGraphFromFlow.request.toString()
            ),
            mergeMap(action => {
                    // TODO: IMPORTANT stavanger detail right now get is not adhering to normal datastucture
                    let diagram = JSON.parse(action.payload.data.diagram)
                    let graph = {data: {...action.payload.data, diagram: diagram}, meta: action.payload.meta}

                    return [model.setGraphFromFlow.success(graph)]
                }
            ));


    const setDiagramPassThrough = combineOsloActionsWithPassThrough(model.setDiagram);

    return combineEpics(onModelINSetNodeModel,setDiagramPassThrough,onGraphSetFromFlowRequest)
};

const initialGraphState = {
    data: {
        creator: null,
        group: null,
        type: null,
        name: "",
        diagram: null,
        error: null,
        description: "",
    },
    meta: {
        error: false,
        loading: false,
        status: false
    },
    show: {
        nodes: []
    }
};

export const createHortenGraphReducer =  (model: HortenGraphModel) => handleActions(
    {
        [model.setDiagram.success.toString()]: (state, action) => {
            return { ...state, data: { ...state.data, diagram: action.payload }};
        },
        [model.setGraphFromFlow.success.toString()]: (state, action) => {
            return { ...state, data: action.payload.data , meta: { ...action.payload.meta, status: "loaded"}};
        },
        [model.setGraphError.success.toString()]: (state, action) => {
            return { ...state, meta: {...state.meta, error: action.payload }};
        },
    },
    initialGraphState
);


export function createHortenGraph(type: HortenType): ((Alias) => HortenGraph) {
    let modelCreator = createHortenGraphModel;
    let apiCreator = createHortenGraphApi;
    let selectorsCreator = createHortenGraphSelectors;
    let helperCreator = createHortenGraphHelpers;
    let epicCreator = createHortenGraphEpic;
    let reducerCreator = createHortenGraphReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator)
}