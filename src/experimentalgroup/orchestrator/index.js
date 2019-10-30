import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {ExperimentalGroupStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: ExperimentalGroupStavanger) => {

    const onPageInitLoadExperimentAndSamples = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let groupid = action.payload.match.params.groupid
                return [
                    stavanger.experimentalGroup.model.fetchItem.request({data: {id: groupid}}),
                    stavanger.samples.model.fetchList.request({filter: {experimentalgroup: groupid}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {experimentalgroup: groupid}}}),
                ]
            }));


    const onSampleSelectedSetSelectedSample = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.samples.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedSample.model.setItem.request(action.payload)]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.experimentalGroup),
        apiConnector(stavanger.samples),
    )

    return combineEpics(onPageInitLoadExperimentAndSamples,onSampleSelectedSetSelectedSample,apiConnections)
}

export default orchestraterEpic