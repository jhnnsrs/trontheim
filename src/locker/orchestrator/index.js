import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {LockerStavanger, SampleStavanger} from "../stavanger";
import * as constants from "../../constants";
import {createApiPost, createOsloApi} from "../../alta/oslo/api";
import {apiConnector, itemConnector, userSelector} from "../../rootMaestros";
import rootStavanger from "../../rootStavanger";
import type {HaldenActions} from "../../alta/oslo";
import type {HortenHTTPRequestAuth} from "../../alta/horten/http";
import {userIDPortal, userPortal} from "../../portals";

export const orchestraterEpic = (stavanger: LockerStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let lockerid = action.payload.match.params.lockerid
                return [
                    stavanger.locker.model.fetchItem.request({data: {id: lockerid}}),
                    stavanger.bioimages.model.fetchList.request({filter: {locker: lockerid}}),
                    stavanger.bioimages.model.osloJoin.request({meta: {room: {locker: lockerid}}}),
                    stavanger.bioseries.model.fetchList.request({filter: {locker: lockerid}}),
                    stavanger.bioimageflows.model.fetchList.request({filter: {type: constants.FLOWTYPES.BIOIMAGE}}),
                    stavanger.bioseriesflows.model.fetchList.request({filter: {type: constants.FLOWTYPES.BIOSERIES}}),
                    stavanger.lockerflows.model.fetchList.request({filter: {type: constants.FLOWTYPES.LOCKER}}),
                ]
            }));


    const onRepresentationSelectedSetSelectedRepresentation= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.bioimages.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedBioimage.model.setItem.request(action.payload)]
            }));

    const onBioImageUploadRequest = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("Upload").request),
            mergeMap(action => {
                let data = new FormData();
                console.log("Locker", stavanger.locker.selectors.getData(state$.value).id)
                data.append('file', action.payload[0]);
                data.append('name', action.payload[0].name);
                data.append("creator", userIDPortal(state$.value));
                data.append("locker", stavanger.locker.selectors.getData(state$.value).id );

                console.log(data)

                let meta =  {
                    method: "post",
                    suburl: "upload/",
                    actions: stavanger.page.model.dynamic("UPLOAD"),
                }

                return [rootStavanger.http.helpers.makeHttpRequest(data,meta,stavanger.page.model.dynamic("UPLOAD")),]
                }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.locker),
        apiConnector(stavanger.bioimages),
        apiConnector(stavanger.bioseries),
        apiConnector(stavanger.bioimageflows),
        apiConnector(stavanger.bioseriesflows),
        apiConnector(stavanger.lockerflows)
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onRepresentationSelectedSetSelectedRepresentation,
        onBioImageUploadRequest,
        apiConnections)
}

export default orchestraterEpic