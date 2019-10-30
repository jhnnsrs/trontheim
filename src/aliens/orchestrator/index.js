import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {NodeItemsStavanger} from "../stavanger";
import {apiConnector, itemConnector, userSelector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: NodeItemsStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let creatorid = userIDPortal(state$.value)
                return [
                    stavanger.nodes.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                ]
            }));


    const onLockerSelect= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.nodes.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedNode.model.setItem.request(action.payload),]
            }));




    const apiConnections = combineEpics(
        apiConnector(stavanger.nodes),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onLockerSelect,
        apiConnections
        )
}

export default orchestraterEpic