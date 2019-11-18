import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {SampleStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: SampleStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let sampleid = action.payload.match.params.sampleid
                return [
                    stavanger.sample.model.fetchItem.request({data: {id: sampleid}}),
                    stavanger.representations.model.fetchList.request({meta: {filter: {sample: sampleid}}}),
                    stavanger.representations.model.osloJoin.request({meta: {room: {sample: sampleid}}}),
                    stavanger.displays.model.fetchList.request({meta: {filter: {sample: sampleid}}}),
                    stavanger.exhibits.model.fetchList.request({meta: {filter: {sample: sampleid}}}),
                    stavanger.displayflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.DISPLAY}}}),
                    stavanger.exhibitflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.EXHIBIT}}}),
                    stavanger.sampleflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.SAMPLE}}}),
                ]
            }));


    const onRepresentationSelectedSetSelectedRepresentation= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representations.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedRepresentation.model.setItem.request(action.payload)]
            }));

    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        apiConnector(stavanger.exhibits),
        apiConnector(stavanger.displays),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.displayflows),
        apiConnector(stavanger.exhibitflows),
        apiConnector(stavanger.sampleflows),
    )

    return combineEpics(onPageInitLoadSampleRepresentationsAndDisplays,onRepresentationSelectedSetSelectedRepresentation,apiConnections)
}

export default orchestraterEpic