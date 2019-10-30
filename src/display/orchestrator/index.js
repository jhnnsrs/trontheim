import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {DisplayStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: DisplayStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let displayid = action.payload.match.params.displayid
                return [
                    stavanger.display.model.fetchItem.request({data: {id:displayid}}),

                ]
            }));

    const onDisplayFetchedLoadTransformationsAndRois = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.display.model.fetchItem.success),
            mergeMap(action => {
                let repid = action.payload.data.representation
                return [
                    stavanger.canvas.model.setValue.request(JSON.parse(action.payload.data.shape)),
                    stavanger.transformations.model.fetchList.request({meta: {filter: {representation: repid}}}),
                    stavanger.transformations.model.osloJoin.request({meta: {room: {representation: repid}}}),
                    stavanger.rois.model.fetchList.request({meta: {filter: {representation: repid}}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {representation: repid}}}),
                ]
            }));


    const onRoiSelectedShowRoi= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.rois.model.selectItem.request),
            mergeMap(action => {
                return [ stavanger.selectedRoi.model.setItem.request(action.payload)]
            }));

    const apiConnections = combineEpics(
        itemConnector(stavanger.display),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.rois)
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onDisplayFetchedLoadTransformationsAndRois,
        onRoiSelectedShowRoi,
        apiConnections)
}

export default orchestraterEpic