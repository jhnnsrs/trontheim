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
    foreign: string,
    list: string, // The Reference to the list

}


export const foreignConductor = (nodeStavanger: EdgeStavanger, configuration: CollectorConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let edge: HortenEdge = nodeStavanger.edge
    let input: HortenItem = nodeStavanger[configuration.input]
    let outputs: [HortenTable] = configuration.output.map( out => nodeStavanger[out] ? nodeStavanger[out] : null).filter(item => item != null)

    let foreign: HortenTable = nodeStavanger[configuration.foreign]

    //TODO: Set Node Output to FlowDiagram
    const onModelInRequireUser = (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            mergeMap(action => {

                let request = {
                    data:
                        {
                            nodeid: edge.selectors.getModel(state$.value).nodeid,
                            data: JSON.stringify(action.payload)

                        },
                    meta:
                        {update: null}
                }



                return [foreign.model.postItem.request(request),
                    edge.model.requireUser.request(true)]
            })
        );





    return combineEpics(onModelInRequireUser)
}