import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {NodeTesterStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: NodeTesterStavanger) => {

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

    return combineEpics(onPageInitLoadNode,apiConnections)
}

export default orchestraterEpic