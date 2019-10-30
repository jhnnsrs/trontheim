import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {ExhibitStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: ExhibitStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let exhibitid = action.payload.match.params.exhibitid
                return [
                    stavanger.exhibit.model.fetchItem.request({data: {id: exhibitid}}),

                ]
            }));

    const onDisplayFetchedLoadTransformationsAndRois = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.exhibit.model.fetchItem.success),
            mergeMap(action => {
                let repid = action.payload.data.representation
                return [
                    stavanger.transformations.model.fetchList.request({filter: {representation: repid}}),
                    stavanger.transformations.model.osloJoin.request({meta: {room: {representation: repid}}}),
                    stavanger.rois.model.fetchList.request({filter: {representation: repid}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {representation: repid}}}),
                ]
            }));


    const onRepresentationSelectedSetSelectedRepresentation= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.transformations.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedRoi.model.setItem.request(action.payload)]
            }));

    const apiConnections = combineEpics(
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.rois),
        itemConnector(stavanger.exhibit)
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onDisplayFetchedLoadTransformationsAndRois,
        onRepresentationSelectedSetSelectedRepresentation,
        apiConnections)
}

export default orchestraterEpic