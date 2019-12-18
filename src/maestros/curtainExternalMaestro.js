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

export interface CurtainExternalStavanger extends Stavanger {
    curtain: HortenCurtain,
    externals: HortenTable,
    externalrequests: HortenTable,

}


export interface CurtainExternalDefinition {

}


export const curtainExternalMaestro = (stavanger: CurtainExternalStavanger, definition: CurtainExternalDefinition) => {

    const curtain = stavanger.curtain ? stavanger.curtain : rootStavanger.curtain
    const externals = stavanger.externals
    const externalrequests = stavanger.externalrequests


    const onExternalPushSendToApi = (action$, state$) =>
        action$.pipe(
            ofType(curtain.model.pushExternal.request),
            mergeMap(action => {
                externals.helpers.log("Pushing ", action.payload)

                const external = {
                    ...action.payload, meta: { ...action.payload.meta, restaction: "new"}
                }
                return [
                    externals.model.postItem.request(external)
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

    const onApiAchievedPushExternal = (action$, state$) =>
        action$.pipe(
            ofType(
                externals.model.osloItemCreate.success,
                externals.model.osloItemUpdate.success,
            ),
            mergeMap(action => {
                externals.helpers.log("External created", action.payload)

                return [
                    curtain.model.pushExternal.success(action.payload),
                    externalrequests.model.osloJoin.request({meta: {room: {external: action.payload.data.id}, multialias: true}}) //TODO: Stopp to list when you are out
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

    return combineOrchestrator(stavanger, {
        onExternalPushSendToApi,
        onExternalRequestSendToApi,
        onApiAchievedPushExternal,
        onExternalRequestInSendToCurtain
        }
    )
}
