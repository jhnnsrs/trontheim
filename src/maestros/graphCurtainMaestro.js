import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNodeDefinition} from "../alta/horten/node";
import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {buildStatus, DONE, GRAPHERROR, WAITING} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";
import type {HortenMold} from "../alta/horten/mold";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import {userIDPortal} from "../portals";
import type {HortenCurtain} from "../alta/horten/curtain";
import type {HortenTable} from "../alta/horten/table";
import rootStavanger from "../rootStavanger";

export interface GraphCurtainStavanger extends Stavanger {
    graph: HortenGraph,
    curtain: HortenCurtain,

}

export interface SingeFlowParamMap {
    flowid: number,
    initialid: number
}


export interface GraphCurtainDefinition {
    initial: HortenItem,
    paramsMap: (params: any) => SingeFlowParamMap

}


export const graphCurtainMaestro = (stavanger: GraphCurtainStavanger, definition: GraphCurtainDefinition) => {

    const graph = stavanger.graph
    const curtain = stavanger.curtain ? stavanger.curtain : rootStavanger.curtain
    const page = stavanger.page

    const onGraphRequestPopOpenExternal = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.requestPop.request),
            mergeMap(action => {
                page.helpers.log("Open External")
                let node = graph.selectors.getNode(action.payload)(state$.value)
                let graphname = graph.selectors.getGraphName(state$.value)
                // Adding the information from the graph

                let sendnode = { ...node, graphname: graphname}
                page.helpers.log("Of Node", node)
                return [
                    curtain.model.openExternal.request(sendnode)
                ]
            }));

    const onExternalOpenSetPopTrue = (action$, state$) =>
        action$.pipe(
            ofType(curtain.model.openExternal.success),
            mergeMap(action => {
                page.helpers.log("Open External Succeeded")
                return [
                    graph.model.requestPop.success(action.payload)
                ]
            }));


    const onForeigNodeInRequest = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.foreignNodeIn.request),
            mergeMap(action => {
                curtain.helpers.log("Trying to Send to External " + action.payload.meta.external + " the Model " ,action.payload)
                let request = {...action.payload, meta: {...action.payload.meta, kind: "in", instance: action.payload.meta.target}}
                return [
                    curtain.model.sendToExternal.request(request)
                ]
            }));

    const onForeigNodeOutRequest = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.foreignNodeOut.request),
            mergeMap(action => {
                curtain.helpers.log("Trying to Send to External " + action.payload.meta.external + " the Model " ,action.payload)
                let request = {...action.payload, meta: {...action.payload.meta, kind: "out", instance: action.payload.meta.instance}}
                return [
                    curtain.model.sendToExternal.request(request)
                ]
            }));



    const onNewMessageFromExternalForWardToGraph = (action$, state$) =>
        action$.pipe(
            ofType(curtain.model.messageFromExternal.success),
            mergeMap(action => {
                curtain.helpers.log("Forwarding external request", action.payload)
                let kind = action.payload.data.kind

                if (kind === "in")
                    return [graph.model.onExternalIn.request(action.payload)]
                if (kind === "out")
                    return [graph.model.onExternalOut.request(action.payload)]
                else {
                    curtain.helpers.log("No matching Kind for Operation Found")
                    return [graph.model.setGraphError.request("Wrong Kind of ExternalRequest")]
                }
            }));

    return combineOrchestrator(stavanger, {
        onGraphRequestPopOpenExternal,
        onExternalOpenSetPopTrue,
        onForeigNodeInRequest,
        onForeigNodeOutRequest,
        onNewMessageFromExternalForWardToGraph
        }
    )
}
