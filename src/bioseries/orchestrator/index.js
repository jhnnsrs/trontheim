import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {BioSeriesStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: BioSeriesStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let bioseriesid = action.payload.match.params.bioseriesid
                return [
                    stavanger.bioseries.model.fetchItem.request({data: { id: bioseriesid}}),
                    stavanger.samples.model.fetchList.request({meta: {filter: {bioseries: bioseriesid}}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {bioseries: bioseriesid}}}),
                    stavanger.representations.model.fetchList.request({meta: {filter: {bioseries: bioseriesid}}}),
                    stavanger.representations.model.osloJoin.request({meta: {room: {bioseries: bioseriesid}}}),
                    stavanger.sampleflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.SAMPLE}}}),
                    stavanger.representationflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.REPRESENTATION}}}),
                ]
            }));




    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.sampleflows),
        apiConnector(stavanger.representationflows),
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        apiConnections
        )
}

export default orchestraterEpic