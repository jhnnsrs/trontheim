import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenOslo} from "../horten/oslo";
import type {HortenItem} from "../horten/item";


export const itemOsloMaestro = (oslo: HortenOslo) => (item: HortenItem): Epic  => {


    const syncItems = (action$, state$) =>
        action$.pipe(
            ofType(item.model.osloJoin.request),
            mergeMap(action => {
                let {meta, data} = action.payload
                console.log(meta)
                meta = { ...meta,
                        stream: item.definition.type,
                        deleteAction: item.model.osloItemDelete,
                        updateAction: item.model.osloItemUpdate,
                        createAction: item.model.osloItemCreate,
                        alias: item.alias + "-" + item.key,
                }
                return [oslo.model.joinRoom.request({meta: meta, data: data})]

            })
        )


    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(syncItems)
}


