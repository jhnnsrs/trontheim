import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RepresentationStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: RepresentationStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let representationid = action.payload.match.params.representationid
                return [
                    stavanger.representation.model.fetchItem.request({data: {id: representationid}}),
                    stavanger.displays.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.exhibits.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.displays.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.exhibits.model.osloJoin.request({meta: {room: {representation: representationid}}}),
                    stavanger.rois.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {representation: representationid}}}),
                    stavanger.displayflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.DISPLAY}}}),
                    stavanger.roiflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.ROI}}}),
                ]
            }));




    const apiConnections = combineEpics(
        apiConnector(stavanger.displays),
        apiConnector(stavanger.rois),
        apiConnector(stavanger.displayflows),
        apiConnector(stavanger.roiflows),
        apiConnector(stavanger.exhibits),
        itemConnector(stavanger.representation)
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        apiConnections
        )
}

export default orchestraterEpic