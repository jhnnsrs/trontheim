import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RoiForSampleStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: RoiForSampleStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let sampleid = action.payload.match.params.sampleid
                return [
                    stavanger.sample.model.fetchItem.request({data: {id: sampleid}}),
                    stavanger.rois.model.fetchList.request({meta: {filter: {sample: sampleid}}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {sample: sampleid}}})
                ]
            }));



    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        apiConnector(stavanger.rois),
    )

    return combineEpics(onPageInitLoadSampleRepresentationsAndDisplays,apiConnections)
}

export default orchestraterEpic