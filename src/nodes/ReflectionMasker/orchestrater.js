import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: ReflectionMaskerStavanger) => {



    const onReflectionSetGetImages = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.reflection.model.setItem.success),
            mergeMap(action => {
                let reflection = action.payload
                // TODO: FIX: We need to fetch the reflection new now because the serializer does return only a relative path and the webfront the real niftipath
                return [
                    stavanger.reflection.model.fetchItem.request({data: { id: reflection.data.id}}),
                    stavanger.masks.model.fetchList.request({filter: {reflection: reflection.data.representation}}),
                    stavanger.masks.model.osloJoin.request({meta: {room: {nodeid: stavanger.masks.model.alias}}}),
                    stavanger.edge.model.requireUser.request(true)
                ]
                }
            ));


    //Maestros

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.masks),
        itemConnector(stavanger.reflection)
    )

    return combineEpics(
        onReflectionSetGetImages,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic