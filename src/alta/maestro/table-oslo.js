import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenTable} from "../horten/table";
import type {HortenOslo} from "../horten/oslo";


export const tableOsloMaestro = (oslo: HortenOslo) => (list: HortenTable): Epic  => {


    const syncItems = (action$, state$) =>
        action$.pipe(
            ofType(list.model.osloJoin.request),
            mergeMap(action => {
                let {meta, data} = action.payload
                meta = { ...meta,
                        stream: list.definition.type,
                        deleteAction: list.model.osloItemDelete,
                        updateAction: list.model.osloItemUpdate,
                        createAction: list.model.osloItemCreate,
                        alias: list.alias + "-" + list.key,
                }
                return [oslo.model.joinRoom.request({meta: meta, data: data})]

            })
        )


    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(syncItems)
}


