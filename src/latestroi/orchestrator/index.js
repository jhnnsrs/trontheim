import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {LatestRoiStavanger} from "../stavanger";
import {userIDPortal} from "../../portals";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: LatestRoiStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let userid = userIDPortal(state$.value)
                return [
                    stavanger.rois.model.osloJoin.request({meta: {room: {creator: userid}}}),
                ]
            }));

    const onNewRoiArrivingSetDisplayRoi = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.rois.model.osloItemUpdate.success,
                stavanger.rois.model.osloItemCreate.success),
            mergeMap(action => {
                return [
                    stavanger.roi.model.setItem.request(action.payload),

                ]
            }));

    const onDisplayFetchedLoadTransformationsAndRois = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.roi.model.setItem.success),
            mergeMap(action => {
                let roiid = action.payload.data.id
                console.log(action.payload)
                return [
                    stavanger.transformations.model.fetchList.request({meta: {filter: {roi: roiid}}}),
                    stavanger.transformations.model.osloJoin.request({meta: {room: {roi: roiid}}}),
                    stavanger.reflections.model.fetchList.request({meta: {filter: {roi: roiid}}}),
                    stavanger.reflections.model.osloJoin.request({meta: {room: {roi: roiid}}}),
                    stavanger.volumedatas.model.fetchList.request({meta: {filter: {roi: roiid}}}),
                    stavanger.volumedatas.model.osloJoin.request({meta: {room: {roi: roiid}}}),
                    stavanger.clusterdata.model.fetchList.request({meta: {filter: {roi: roiid}}}),
                    stavanger.clusterdata.model.osloJoin.request({meta: {room: {roi: roiid}}}),
                ]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.roi),
        apiConnector(stavanger.rois),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.reflections),
        apiConnector(stavanger.clusterdata),
        apiConnector(stavanger.volumedatas),
    )


    return combineEpics(
        apiConnections,
        onPageInitLoadSampleRepresentationsAndDisplays,
        onNewRoiArrivingSetDisplayRoi,
        onDisplayFetchedLoadTransformationsAndRois,)
}

export default orchestraterEpic