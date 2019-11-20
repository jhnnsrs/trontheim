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

                return [
                    graph.model.onExternalIn.request(action.payload)
                ]
            }));


    const onForeignNodeRequestPassToVeil = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.foreignNodeIn.request),
            mergeMap(action => {
                page.helpers.log("Foreign Node Request")
                return [
                    curtain.model.sendToAlien.request(action.payload)
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
            onExternalRequestInSendToCurtain,
            apiConnections,
            onForeignNodeRequestPassToVeil,
            onNewMessageFromExternalForWardToGraph
        }

    )
}

export default orchestraterEpic