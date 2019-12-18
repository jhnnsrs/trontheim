import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {NodeItemsStavanger} from "../stavanger";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: NodeItemsStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let creatorid = userIDPortal(state$.value)
                return [
                    stavanger.nodes.model.fetchList.request({}),
                    stavanger.nodes.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                ]
            }));


    const onLockerSelect= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.nodes.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedNode.model.setItem.request(action.payload),]
            }));

    const onLockerPostSuccess= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.nodes.model.postItem.success),
            mergeMap(action => {
                return [ stavanger.page.model.setProp.request({ key: "modalOpen", value: false}),]
            }));

    const onLockerFormPost= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.newNode.model.submitForm.success),
            mergeMap(action => {
                let data = action.payload

                console.log(data)
                let node = {
                    data: {...data,
                        nodeclass: data.nodeclass.value,
                        channel: null,
                        inputmodel: JSON.stringify(data.inputmodel.map(item => item.value)),
                        outputmodel: JSON.stringify(data.outputmodel.map(item => item.value)),
                        creator: userIDPortal(state$.value)
                    },
                    meta: {
                        new: true
                    }
                }

                return [
                    stavanger.nodes.model.postItem.request(node),
                    stavanger.page.model.setProp.request({key: "modalOpen", value: false})]
            }));


    const apiConnections = combineEpics(
        apiConnector(stavanger.nodes),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onLockerSelect,
        onLockerPostSuccess,
        onLockerFormPost,
        apiConnections
        )
}

export default orchestraterEpic