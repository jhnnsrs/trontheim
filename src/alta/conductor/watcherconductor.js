import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap, switchMap, take} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";


export interface EdgeStavanger {
    edge: HortenEdge,
    [string]: HortenItem,
}

export interface WatcherConfiguration {
    input: string,
    inputModel: string, // The Model Type
    enablePassThrough: boolean,
    list: string, // The Reference to the list
    listFilter: (any) => any, // Should Return a filter object for the list query

}


export const watcherConductor = (nodeStavanger: EdgeStavanger, configuration: WatcherConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let edge: HortenEdge = nodeStavanger.edge
    let input: HortenItem = nodeStavanger[configuration.input]
    let list: HortenTable = nodeStavanger[configuration.list]
    let filterfunc = configuration.listFilter
    let stavanger = nodeStavanger

    //TODO: Set Node Output to FlowDiagram
    const onInputModelIsSetAndStartPressed = (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            switchMap((action) =>
                action$.pipe(
                    ofType(edge.model.dynamic("START").request),
                    take(1),
                    mergeMap(() => {
                            let dataStructure = action.payload;
                            console.log("data forward")
                            let output = {
                                data: dataStructure.data,
                                meta: {
                                    model: input.definition.type,
                                    nodeid: input.model.alias
                                }

                            }
                            return [edge.model.setOutput.request(output)]
                        }
                    )
                )
            )
        );

    const onSelectRandomFetchList = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.dynamic("START_RANDOM").request),
            mergeMap(action => {
                return [list.model.fetchList.request(filterfunc(action)),
                    edge.model.setProgress.request(1)]
            })
        );

    const onFetchListSendSamle = (action$, state$) =>
        action$.pipe(
            ofType(list.model.fetchList.success),
            mergeMap(action => {
                let sample = action.payload.data[Math.floor(Math.random()* action.payload.data.length)];
                let output = {
                    data: sample,
                    meta: {
                        model: input.definition.type,
                        nodeid: input.model.alias
                    }

                }
                return [edge.model.setOutput.request(output),
                    edge.model.setProgress.request(0)]
            })
        );



    return combineEpics(onInputModelIsSetAndStartPressed,onSelectRandomFetchList,onFetchListSendSamle)
}