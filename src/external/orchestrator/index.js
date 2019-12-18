import {combineEpics, ofType} from "redux-observable";
import type {ExternalStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {map, mergeMap, take, withLatestFrom} from "rxjs/operators";
import {zip} from "rxjs"
import {userIDPortal} from "../../portals";
import {generateName} from "../../utils";
import rootStavanger from "../../rootStavanger";
import type {HortenVeil} from "../../alta/horten/veil";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import type {HortenCurtain} from "../../alta/horten/curtain";

export const orchestraterEpic = (stavanger: ExternalStavanger) => {

    const external = stavanger.external
    const externalrequests = stavanger.externalrequests
    const page = stavanger.page
    const curtain: HortenCurtain = rootStavanger.curtain
    const registry = stavanger.registry
    const graph = stavanger.graph

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let externalid = action.payload.match.params.externalid;
                page.helpers.log("External Page initiated")
                return [
                    external.model.fetchItem.request({data: {id: externalid}}),
                    externalrequests.model.osloJoin.request({meta: {room: {external: externalid}}})

                ]
            }));

    const onExternalRequestInSendToCurtain = (action$, state$) =>
        action$.pipe(
            ofType(
                externalrequests.model.osloItemCreate.success,
                externalrequests.model.osloItemUpdate.success,
            ),
            mergeMap(action => {
                externalrequests.helpers.log("ExternalRequest in ", action.payload)

                return [
                    curtain.model.messageFromExternal.request(action.payload),
                ]
            }));

    const onNewMessageFromExternalForWardToGraph = (action$, state$) =>
        action$.pipe(
            ofType(curtain.model.messageFromExternal.success),
            mergeMap(action => {
                externalrequests.helpers.log("Forwarding external request", action.payload)
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

    const onExternalRequestSendToApi = (action$, state$) =>
        action$.pipe(
            ofType(curtain.model.sendMessage.request),
            mergeMap(action => {
                externalrequests.helpers.log("Sending ExternalRequest ", action.payload)
                return [
                    externalrequests.model.postItem.request(action.payload)
                ]
            }));

    const loadNodes =  (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setGraphFromFlow.success),
            mergeMap(action => {
                return [
                    registry.model.setNodesFromGraph.request(action.payload)
                ]
            }));

    const loadGraphFromExternal = (action$, state$) =>
            action$.pipe(
                ofType(external.model.fetchItem.success),
                map(action => {
                    return graph.model.setGraphFromExternal.request(action.payload)
                }));





    const apiConnections = combineEpics(
        itemConnector(stavanger.external),
        apiConnector(stavanger.externalrequests)
    )

    return combineOrchestrator(stavanger, {
            onPageInitLoadFlow,
            loadNodes,
            loadGraphFromExternal,
            onForeigNodeOutRequest,
            onExternalRequestInSendToCurtain,
            apiConnections,
            onForeigNodeInRequest,
            onExternalRequestSendToApi,
            onNewMessageFromExternalForWardToGraph
        }

    )
}

export default orchestraterEpic