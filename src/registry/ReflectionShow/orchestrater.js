import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ReflectionShowStavanger} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";


export const orchestraterEpic = (stavanger: ReflectionShowStavanger) => {





    const onReflectionSetGetImages = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.reflectionin.model.setItem.success),
            mergeMap(action => {
                let reflection = action.payload
                // TODO: FIX: We need to fetch the reflection new now because the serializer does return only a relative path and the webfront the real niftipath
                return [
                    stavanger.reflection.model.fetchItem.request({data: { id: reflection.data.id}}),
                    stavanger.masks.model.fetchList.request({filter: {representation: reflection.data.representation}}),
                    stavanger.masks.model.osloJoin.request({meta: {room: {nodeid: stavanger.reflection.model.alias}}}),
                    stavanger.node.helpers.requireUser("Choose Mask")
                ]
                }
            ));


    //Maestros

    const moduleMaestro = nodeMaestro(stavanger, null)

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