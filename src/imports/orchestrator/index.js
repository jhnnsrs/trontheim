import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ImportsStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: ImportsStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let creatorid = userIDPortal(state$.value)
                return [
                    stavanger.creator.model.fetchItem.request({data: {id: creatorid}}),
                    stavanger.lockers.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.lockers.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.importings.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.importers.model.fetchList.request({})
                ]
            }));


    const onLockerSelect = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.lockers.model.selectItem.success),
            mergeMap(action => {
                return [
                    stavanger.selectedLocker.model.setItem.request(action.payload),
                    stavanger.bioimages.model.fetchList.request({meta: {filter: {locker: action.payload.data.id}}}),
                    stavanger.bioimages.model.osloJoin.request({meta: {room: {locker: action.payload.data.id}}})]
            }));


    const onDemandImporting = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("IMPORT").request),
            mergeMap(action => {
                let importer = action.payload.importer.data
                let locker = action.payload.locker

                let importing = {
                    data: {
                        creator: userIDPortal(state$.value),
                        override: true,
                        settings: JSON.stringify({normalize: true}),
                        importer: importer.id,
                        locker: locker.id,
                        nodeid: "user",
                    },
                    meta: {
                        new: true
                    }
                }

                return [stavanger.importings.model.postItem.request(importing),]
            }));

    const onLockerFormPost= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.newLocker.model.submitForm.success),
            mergeMap(action => {
                let data = action.payload

                let locker = {
                    data: {
                        creator: userIDPortal(state$.value),
                        name: data.name,
                        location: data.location,
                    },
                    meta: {
                        new: true
                    }
                }

                return [
                    stavanger.lockers.model.postItem.request(locker),
                    stavanger.page.model.setProp.request({key: "modalOpen", value: false})]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.creator),
        apiConnector(stavanger.importings),
        apiConnector(stavanger.importers),
        apiConnector(stavanger.bioimages),
        apiConnector(stavanger.lockers),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onLockerSelect,
        onDemandImporting,
        onLockerFormPost,
        apiConnections
    )
}

export default orchestraterEpic