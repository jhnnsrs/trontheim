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
                    stavanger.node.helpers.requireUser("Choose Mask")
                ]
                }
            ));


    //Maestros

    const moduleMaestro = nodeMaestro(stavanger, null)

    const apiConnections = combineEpics(
        itemConnector(stavanger.reflection)
    )

    return combineEpics(
        onReflectionSetGetImages,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic