import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenRestAPI} from "../horten/restapi";
import type {HortenVeil} from "../horten/veil";
import type {HortenOslo} from "../horten/oslo";
import {FOREIGNODEREQUEST} from "../../constants";


export const veilRestApiMaestro = (restAPI: HortenRestAPI) => (oslo: HortenOslo) => (veil: HortenVeil) => {


    //TODO: Set Node Input from FlowDiagram
    const sendAlienEPic = (action$, state$) =>
        action$.pipe(
            ofType(veil.model.sendToAlien.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                meta = {
                    actions: veil.model.sendToAlien,
                    method: "POST",
                    suburl: veil.definition.alienApi,
                    responseType: 'json',
                    ...meta,
                }
                return [restAPI.model.ApiRequest.request({data: data, meta: meta}),]
            }));


    const listenToAlien = (action$, state$) =>
        action$.pipe(
            ofType(veil.model.listenToAlien.request),
            mergeMap(action => {
                let {meta, data} = action.payload
                meta = { ...meta,
                    stream: FOREIGNODEREQUEST,
                    updateAction: veil.model.receiveFromAlien,
                    createAction: veil.model.receiveFromAlien,
                    alias: veil.alias + "-" + veil.key,
                }
                const statusdata = {
                    nodeid: meta.room.nodeid,
                    name: meta.room.nodeid,
                    status: "open",
                    creator: state$.value.root.user.id // No reference possible here
                }
                const statusmeta = {
                    actions: veil.model.dynamic("SEND_STATUS"),
                    method: "POST",
                    suburl: veil.definition.statusApi,
                    responseType: 'json',
                }
                return [oslo.model.joinRoom.request({meta: meta, data: data}),
                    restAPI.model.ApiRequest.request({data: statusdata, meta: statusmeta}),]

            })
        )

    const stopListeningToAlien = (action$, state$) =>
        action$.pipe(
            ofType(veil.model.stopListenToAlien.request),
            mergeMap(action => {
                let {meta, data} = action.payload
                meta = { ...meta,
                    stream: FOREIGNODEREQUEST,
                    updateAction: veil.model.receiveFromAlien,
                    createAction: veil.model.receiveFromAlien,
                    alias: veil.alias + "-" + veil.key,
                }
                return [oslo.model.leaveRoom.request({meta: meta, data: data})]

            })
        )



    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(sendAlienEPic,listenToAlien,stopListeningToAlien)
}