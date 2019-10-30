import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {HomeStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import rootStavanger from "../../rootStavanger";

export const orchestraterEpic = (stavanger: HomeStavanger) => {

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                console.log("Hallo")
                let userid = userIDPortal(state$.value)
                return [
                    stavanger.displays.model.fetchList.request({filter: {creator: userid}}),
                    stavanger.displays.model.osloJoin.request({meta: {room: {creator: userid}}}),
                    stavanger.samples.model.fetchList.request({filter: {creator: userid}}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {creator: userid}}}),
                    stavanger.experiments.model.fetchList.request({filter: {creator: userid}}),
                    stavanger.experiments.model.osloJoin.request({meta: {room: {creator: userid}}}),
                ]
            }));

    const onExperimentFormSubmit = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.experimentForm.model.submitForm.success),
            mergeMap(action => {

                let form = action.payload

                let data = new FormData();
                data.append('description',form.description);
                data.append('name', form.name);
                if (form.file) data.append('image', form.file[0]);
                data.append("creator", userIDPortal(state$.value));
                console.log(data)

                let meta =  {
                    method: "post",
                    suburl: "experiments/",
                    actions: stavanger.experiments.model.postItem,
                }

                return [rootStavanger.http.helpers.makeHttpRequest(data,meta,stavanger.experiments.model.postItem),]

            }));

    const onExperimentPosted = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.experiments.model.postItem.success),
            mergeMap(action => {

                return [stavanger.page.model.setProp.request({key: "modalOpen", value: false})]
            }));


    const apiConnections = combineEpics(
        apiConnector(stavanger.displays),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.experiments),

    )


    return combineEpics(
        onExperimentFormSubmit,
        onExperimentPosted,
        onPageInitLoadSampleRepresentationsAndDisplays,
        apiConnections
        )
}

export default orchestraterEpic