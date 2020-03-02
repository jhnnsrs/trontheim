import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {BioImageStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: BioImageStavanger) => {

    let unique = "Naoinaoinaoina"

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let bioimageid = action.payload.match.params.bioimageid
                return [
                    stavanger.bioimage.model.fetchItem.request({data: {id: bioimageid}}),
                    stavanger.analyzers.model.fetchList.request({meta: {}}),
                    stavanger.analyzings.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.samples.model.fetchList.request({meta: {filter: {bioimage: bioimageid}}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {bioimage: bioimageid}}}),
                    stavanger.bioseries.model.fetchList.request({meta: {filter: {bioimage: bioimageid}}}),
                    stavanger.bioseries.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.sampleflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.SAMPLE}}}),
                    stavanger.bioseriesflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.BIOSERIES}}}),
                ]
            }));


    const onDemandAnalyzing = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("ANALYZE").request),
            mergeMap(action => {
                let analyzer = action.payload.analyzer.data
                let bioimage = action.payload.bioimage

                let analyzing = {
                    data: {
                        creator: userIDPortal(state$.value),
                        override: true,
                        settings: JSON.stringify({normalize: true}),
                        analyzer: analyzer.id,
                        bioimage: bioimage.id,
                        nodeid: unique,
                    },
                    meta: {
                        new: true
                    }
                }

                return [stavanger.analyzings.model.postItem.request(analyzing),]
            }));



    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        apiConnector(stavanger.bioseriesflows),
        apiConnector(stavanger.bioseries),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.sampleflows),
        apiConnector(stavanger.analyzers),
        apiConnector(stavanger.analyzings),
    )



    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onDemandAnalyzing,
        apiConnections
        )
}

export default orchestraterEpic