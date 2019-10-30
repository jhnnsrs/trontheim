import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {BioImageStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: BioImageStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let bioimageid = action.payload.match.params.bioimageid
                return [
                    stavanger.bioimage.model.fetchItem.request({data: {id: bioimageid}}),
                    stavanger.samples.model.fetchList.request({meta: {filter: {bioimage: bioimageid}}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {bioimage: bioimageid}}}),
                    stavanger.bioseries.model.fetchList.request({meta: {filter: {bioimage: bioimageid}}}),
                    stavanger.bioseries.model.osloJoin.request({meta: {room: {bioimage: bioimageid}}}),
                    stavanger.sampleflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.SAMPLE}}}),
                    stavanger.bioseriesflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.BIOSERIES}}}),
                ]
            }));



    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        apiConnector(stavanger.bioseriesflows),
        apiConnector(stavanger.bioseries),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.sampleflows),
    )



    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,apiConnections
        )
}

export default orchestraterEpic