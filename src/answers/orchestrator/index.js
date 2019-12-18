import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {AnswersStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: AnswersStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let creatorid = userIDPortal(state$.value)
                return [
                    stavanger.creator.model.fetchItem.request({data: { id: creatorid}}),
                    stavanger.answers.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.answers.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.visualizers.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.visualizers.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.profiles.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.profiles.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                ]
            }));



    const onDemandVisualizing= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("VISUALIZE").request),
            mergeMap(action => {
                let answer = action.payload.answer.data
                let visualizer = action.payload.visualizer.data

                let answering = {
                    data: {
                        creator: userIDPortal(state$.value),
                        override: true,
                        settings: JSON.stringify({normalize: true}),
                        visualizer: visualizer.id,
                        nodeid: "user",
                        answer: answer.id,
                    },
                    meta: {
                        new: true
                    }
                }

                return [  stavanger.visualizings.model.postItem.request(answering),]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.creator),
        apiConnector(stavanger.visualizers),
        apiConnector(stavanger.visualizings),
        apiConnector(stavanger.profiles),
        apiConnector(stavanger.answers),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onDemandVisualizing,
        apiConnections
        )
}

export default orchestraterEpic