import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenTable} from "../horten/table";
import type {HortenOslo} from "../horten/oslo";

import v4 from 'uuid'
export const tableOsloMaestro = (oslo: HortenOslo) => (list: HortenTable): Epic  => {


    const syncItems = (action$, state$) =>
        action$.pipe(
            ofType(list.model.osloJoin.request),
            mergeMap(action => {
                let {meta, data} = action.payload
                // Allow multiple Rooms to listen to
                const alias = meta.multialias ? list.definition.type + "-" + list.key :  list.definition.type + "-" + list.key + "-" + v4()

                meta = { ...meta,
                        stream: list.definition.type,
                        deleteAction: list.model.osloItemDelete,
                        updateAction: list.model.osloItemUpdate,
                        createAction: list.model.osloItemCreate,
                        alias: alias,
                }
                return [oslo.model.joinRoom.request({meta: meta, data: data})]

            })
        )


    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(syncItems)
}


