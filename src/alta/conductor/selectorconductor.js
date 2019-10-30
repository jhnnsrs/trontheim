import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";
import type {HortenPage} from "../horten/page";


export type EdgeStavanger = {
    edge: HortenEdge,
    page: HortenPage,
    [string]: HortenItem,
}

export type FilterMeta = {
    meta: {filter: any}
}
export type RoomMeta = {
    meta: {room: any}
}


export type SelectorConfiguration = {
    model: string,
    input: string,
    output: string,
    model: string,
    enablePassThrough: boolean,
    filterFunc: (any,any,EdgeStavanger) => FilterMeta, // params: Payload and State,Should Return the Parsing Object e.g analyzing or filtering
    roomFunc: (any,any,EdgeStavanger) => RoomMeta, // params: Payload, Stavanger, State,Should Return True if new Conversing is Wanted

}


export const selectorConductor = (nodeStavanger: EdgeStavanger, configuration: SelectorConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let output: HortenTable = nodeStavanger[configuration.output] ? nodeStavanger[configuration.output] : nodeStavanger.output
    let input: HortenItem = nodeStavanger[configuration.input] ? nodeStavanger[configuration.input] : nodeStavanger.input
    let filterFunc = configuration.filterFunc
    let roomFunc = configuration.roomFunc
    let stavanger = nodeStavanger
    let edge = nodeStavanger.edge
    let model = configuration.model ? configuration.model : output.definition.type




    const onItemIn = (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            mergeMap(action => {
                return [output.model.fetchList.request(filterFunc(action,state$.value, stavanger)),
                    output.model.osloJoin.request(roomFunc(action, state$.value, stavanger)),
                    edge.model.requireUser.request(true)]
            })
        );


    const onItemSelectedForward = (action$, state$) =>
        action$.pipe(
            ofType(output.model.selectItem.request),
            mergeMap(action => {
                let item = action.payload;
                let outputsend= {
                    data: item.data,
                    meta:{
                        model: model,
                        nodeid: output.model.alias
                    }

                }
                return [edge.model.setOutput.request(outputsend),
                    edge.model.requireUser.request(false)]
            })
        );


    return combineEpics(onItemIn,onItemSelectedForward)
}