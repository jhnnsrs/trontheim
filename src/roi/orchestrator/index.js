import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {RoiStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: RoiStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let roiid = action.payload.match.params.roiid
                return [
                    stavanger.roi.model.fetchItem.request({data: {id:roiid}}),

                ]
            }));

    const onDisplayFetchedLoadTransformationsAndRois = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.roi.model.fetchItem.success),
            mergeMap(action => {
                let roiid = action.payload.data.id
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
        apiConnector(stavanger.clusterdata),
        apiConnector(stavanger.volumedatas),
        apiConnector(stavanger.reflections),
        apiConnector(stavanger.transformations),
        itemConnector(stavanger.roi),
    )



    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onDisplayFetchedLoadTransformationsAndRois,
        apiConnections)
}

export default orchestraterEpic