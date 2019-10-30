import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {QuestionsStavanger} from "../stavanger";
import {apiConnector, itemConnector, userSelector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: QuestionsStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let creatorid = userIDPortal(state$.value)
                return [
                    stavanger.creator.model.fetchItem.request({data: { id: creatorid}}),
                    stavanger.questions.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.oracles.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.questions.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                    stavanger.answers.model.fetchList.request({meta: {filter: {creator: creatorid}}}),
                    stavanger.answers.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                ]
            }));


    const onQuestionPostSuccess= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.questions.model.postItem.success),
            mergeMap(action => {
                return [ stavanger.page.model.setProp.request({ key: "modalOpen", value: false}),]
            }));

    const onDemandAnswering= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("ANSWER").request),
            mergeMap(action => {
                let question = action.payload.question.data
                let oracle = action.payload.oracle.data

                let answering = {
                    data: {
                        creator: userIDPortal(state$.value),
                        override: true,
                        settings: JSON.stringify({normalize: true}),
                        oracle: oracle.id,
                        nodeid: "user",
                        question: question.id,
                    },
                    meta: {
                        new: true
                    }
                }

                return [  stavanger.answerings.model.postItem.request(answering),]
            }));

    const onQuestionFormPost= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.newQuestion.model.submitForm.success),
            mergeMap(action => {
                let data = action.payload

                let question = {
                    data: {
                        creator: userIDPortal(state$.value),
                        name: data.name,
                        nodeid: "user",
                        querystring: data.querystring,
                    },
                    meta: {
                        new: true
                    }
                }

                return [
                    stavanger.questions.model.postItem.request(question),
                    stavanger.page.model.setProp.request({key: "modalOpen", value: false})]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.creator),
        apiConnector(stavanger.answerings),
        apiConnector(stavanger.oracles),
        apiConnector(stavanger.questions),
        apiConnector(stavanger.answers),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onDemandAnswering,
        onQuestionPostSuccess,
        onQuestionFormPost,
        apiConnections
        )
}

export default orchestraterEpic