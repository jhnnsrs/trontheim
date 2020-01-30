import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";


export interface EdgeStavanger {
    edge: HortenEdge,
    [string]: HortenTable,
}

export interface CollectorConfiguration {
    input: string,
    list: string, // The Reference to the list

}


export const collectorConductor = (nodeStavanger: EdgeStavanger, configuration: CollectorConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let edge: HortenEdge = nodeStavanger.edge
    let input: HortenItem = nodeStavanger[configuration.input]
    let list: HortenTable = nodeStavanger[configuration.list]

    //TODO: Set Node Output to FlowDiagram
    const onModelInPushToList = (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            mergeMap(action => {

                let collection = [...list.selectors.getList(state$.value)];

                console.log(collection)

                collection.push(action.payload)




                return [list.model.setList.request([...collection]),
                    edge.model.requireUser.request(true)]
            })
        );


    const onSelectOnListSetOutput = (action$, state$) =>
        action$.pipe(
            ofType(list.model.selectItem.success),
            mergeMap(action => {
                let sample = action.payload.data
                let output = {
                    data: sample,
                    meta: {
                        model: list.definition.type,
                        nodeid: input.model.alias
                    }

                }
                return [edge.model.setOutput.request(output),
                    edge.model.requireUser.request(false)]
            })
        );



    return combineEpics(onModelInPushToList,onSelectOnListSetOutput)
}