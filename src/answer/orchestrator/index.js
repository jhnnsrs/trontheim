import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {AnswerStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: AnswerStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let answerid = action.payload.match.params.answerid
                let creatorid = userIDPortal(state$.value)
                return [
                    stavanger.answer.model.fetchItem.request({data: { id: answerid}}),
                    stavanger.visualizers.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.visualizers.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.visualizings.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.profiles.model.fetchList.request({meta: {filter: {answer: answerid}}}),
                    stavanger.profiles.model.osloJoin.request({meta: {room: {answer: answerid}}}),
                    stavanger.excelexports.model.fetchList.request({meta: {filter: {answer: answerid}}}),
                    stavanger.excelexports.model.osloJoin.request({meta: {room: {answer: answerid}}}),
                ]
            }));



    const onDemandVisualizing= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("VISUALIZE").request),
            mergeMap(action => {
                let answer = action.payload.answer
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
        itemConnector(stavanger.answer),
        apiConnector(stavanger.visualizers),
        apiConnector(stavanger.visualizings),
        apiConnector(stavanger.profiles),
        apiConnector(stavanger.excelexports),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onDemandVisualizing,
        apiConnections
        )
}

export default orchestraterEpic