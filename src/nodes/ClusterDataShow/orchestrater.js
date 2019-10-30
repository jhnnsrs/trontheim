import {combineEpics, ofType} from "redux-observable";
import {map} from "rxjs/operators";
import type {ClusterDataShowStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: ClusterDataShowStavanger) => {

    const onReflectionInRoadReal = (action$,state$) =>
        action$.pipe(
            ofType(stavanger.reflection.model.setItem.success),
            map(action => stavanger.reflection.model.fetchItem.request(action.payload))
        )

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.data),
        itemConnector(stavanger.reflection),
    )

    return combineEpics(
        onReflectionInRoadReal,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic