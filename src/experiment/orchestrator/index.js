import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ExperimentStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: ExperimentStavanger) => {

    const onPageInitLoadExperimentAndSamples = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let experimentid = action.payload.match.params.experimentid
                return [
                    stavanger.newGroup.model.setInitial.request({iscontrol: false}),
                    stavanger.experiment.model.fetchItem.request({data: {id: experimentid}}),
                    stavanger.samples.model.fetchList.request({meta: {filter: {experiment: experimentid}}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {experiment: experimentid}}}),
                    stavanger.expgroups.model.fetchList.request({meta: {filter: {experiment: experimentid}}}),
                    stavanger.expgroups.model.osloJoin.request({meta: {room: {experiment: experimentid}}}),
                    stavanger.animals.model.fetchList.request({meta: {filter: {experiment: experimentid}}}),
                    stavanger.animals.model.osloJoin.request({meta: {room: {experiment: experimentid}}})
                ]
            }));


    const onSampleSelectedSetSelectedSample = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.samples.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedSample.model.setItem.request(action.payload)]
            }));

    const onGroupFormPost = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.newGroup.model.submitForm.success),
            mergeMap(action => {
                let data = action.payload

                let question = {
                    data: {
                        ...data,
                        creator: userIDPortal(state$.value),
                        experiment: stavanger.experiment.selectors.getID(state$.value)
                    },
                    meta: {
                        new: true
                    }
                }

                return [
                    stavanger.expgroups.model.postItem.request(question),
                    stavanger.page.model.setProp.request({key: "modalOpen", value: false})]
            }));

    const apiConnections = combineEpics(
        itemConnector(stavanger.experiment),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.animals),
        apiConnector(stavanger.expgroups),
    )

    return combineEpics(onPageInitLoadExperimentAndSamples,onSampleSelectedSetSelectedSample,apiConnections,onGroupFormPost)
}

export default orchestraterEpic