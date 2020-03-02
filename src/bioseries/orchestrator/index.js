import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {BioSeriesStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: BioSeriesStavanger) => {


    let unique = "sefosineofinsoienoisnef"


    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let bioseriesid = action.payload.match.params.bioseriesid
                return [
                    stavanger.bioseries.model.fetchItem.request({data: { id: bioseriesid}}),
                    stavanger.converters.model.fetchList.request({meta: {}}),
                    stavanger.conversings.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.samples.model.fetchList.request({meta: {filter: {bioseries: bioseriesid}}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.representations.model.fetchList.request({meta: {filter: {bioseries: bioseriesid}}}),
                    stavanger.representations.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.sampleflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.SAMPLE}}}),
                    stavanger.representationflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.REPRESENTATION}}}),
                ]
            }));


    const onDemandConversing = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("CONVERT").request),
            mergeMap(action => {
                let converter = action.payload.converter.data
                let bioseries = action.payload.bioseries

                let conversing = {
                    data: {
                        creator: userIDPortal(state$.value),
                        override: true,
                        settings: JSON.stringify({normalize: true}),
                        converter: converter.id,
                        bioserie: bioseries.id,
                        nodeid: unique,
                    },
                    meta: {
                        new: true
                    }
                }

                return [stavanger.conversings.model.postItem.request(conversing),]
            }));




    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.sampleflows),
        apiConnector(stavanger.representationflows),
        apiConnector(stavanger.conversings),
        apiConnector(stavanger.converters),
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onDemandConversing,
        apiConnections
        )
}

export default orchestraterEpic