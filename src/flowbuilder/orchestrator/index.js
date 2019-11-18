import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {FlowBuilderStavanger} from "../stavanger";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal, userPortal} from "../../portals";

export const orchestraterEpic = (stavanger: FlowBuilderStavanger) => {

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let filter = {}
                let roomfilter = { creator: userIDPortal(state$.value)}
                console.log(action.payload)
                return [
                    stavanger.flows.model.fetchList.request({meta: {filter: filter}}),
                    stavanger.flows.model.osloJoin.request({meta: {room: roomfilter}}),
                    stavanger.nodesList.model.fetchList.request({}),
                    stavanger.nodesList.model.osloJoin.request({meta: {room: roomfilter}}),
                ]
            }));


    const onFlowSelectedUpdateFlowForm = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.flows.model.selectItem.success),
            mergeMap(action => {
                    return [stavanger.flowForm.model.setInitial.request(action.payload.data),]
                }
            ));

    const saveFlowFromFlowForm = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.flowForm.model.submitForm.success),
            mergeMap(action => {
                console.log("ValidatedItem", action.payload)
                let flow = {
                    data: {
                        ...action.payload,
                        group: userPortal(state$.value).groups[0],
                        diagram: JSON.stringify(action.payload.diagram),
                        creator: userIDPortal(state$.value)
                    },
                    meta: {error:null}
                };

                if (action.payload.update) {
                    return [stavanger.flows.model.updateItem.request(flow)]
                }
                else {
                    return [stavanger.flows.model.postItem.request(flow)]
                }
            })
        );


    const onGraphSetSetNodes = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.graph.model.setGraphFromFlow.success),
            mergeMap(action => {
                return [ stavanger.nodes.model.setNodes.request(action.payload)]
            }));

    const apiConnections = combineEpics(
        apiConnector(stavanger.nodesList),
        apiConnector(stavanger.flows)
    )


    return combineEpics(onPageInitLoadFlow,
        onFlowSelectedUpdateFlowForm,
        onGraphSetSetNodes,
        saveFlowFromFlowForm,
        apiConnections
    )
}

export default orchestraterEpic