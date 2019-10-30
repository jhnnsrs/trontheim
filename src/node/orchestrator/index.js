import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {NodeStavanger} from "../stavanger";
import {itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: NodeStavanger) => {

    const onPageInitLoadNode = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let nodeid = action.payload.match.params.nodeid
                return [
                    stavanger.node.model.fetchItem.request({data: {id: nodeid}}),
                ]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.node),
    )


    return combineEpics(
        onPageInitLoadNode,
        apiConnections)
}

export default orchestraterEpic