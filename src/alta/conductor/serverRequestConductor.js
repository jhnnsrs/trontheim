import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {filter, map, mergeMap} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";
import type {HortenPage} from "../horten/page";
import {buildStatus, SERVER} from "../../constants/nodestatus";


export interface EdgeStavanger {
    edge: HortenEdge,
    page: HortenPage,
    [string]: HortenItem,
}

export interface ServerRequestConfiguration {
    auto: string,
    inputs: [string],
    outputs: [string],
    parser: string, // The Reference to the list
    parserFunc: (any,any, any) => [any], // params: Payload and State,Should Return the Parsing Object e.g analyzing or filtering
}


export const serverRequestConductor = (nodeStavanger: EdgeStavanger, configuration: ServerRequestConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    try {
        let edge: HortenEdge = nodeStavanger.edge
        let page: HortenPage = nodeStavanger.page
        let outputs: [HortenTable] = configuration.outputs.map(out => nodeStavanger[out] ? nodeStavanger[out] : null).filter(item => item != null)
        let inputs: [HortenTable] = configuration.inputs.map(item => nodeStavanger[item] ? nodeStavanger[item] : null).filter(item => item != null)
        let parser: HortenTable = nodeStavanger[configuration.parser]
        let parserFunc = configuration.parserFunc


        const onPageStartedListenToOutput = (action$, state$) =>
            action$.pipe(
                ofType(page.model.initPage.success),
                mergeMap(action => {
                        return outputs.map(out => out.model.osloJoin.request({meta: {room: {nodeid: out.model.alias}}}))
                    }
                ));

        const onPostItemRequestSetStatus = (action$, state$) =>
            action$.pipe(
                ofType(parser.model.postItem.request),
                map(action => {
                        console.log("Posting Request  to " + parser.definition.url)
                        return edge.model.setStatus.request(buildStatus(SERVER.serverPost))
                    }
                ));


        const onModelInAskForWhatBuilder = (input) => (action$, state$) =>
            action$.pipe(
                ofType(input.model.setItem.success),
                mergeMap(action => {

                    let parsing = parserFunc(action$, state$, action)
                    return parsing

                })
            );

        const onOutPutForwardBuilder = (output) => (action$, state$) =>
            action$.pipe(
                ofType(output.model.osloItemCreate.success,
                    output.model.osloItemUpdate.success),
                filter(action => action.payload.data.nodeid === output.model.alias),
                mergeMap(action => {
                    console.log("called")
                    let modelin = action.payload;
                    let send = {
                        data: modelin.data,
                        meta: {
                            model: output.definition.type,
                            nodeid: output.model.alias
                        }

                    }
                    return [edge.model.setOutput.request(send)]
                })
            );

        const onOutPutForwarder = combineEpics(...outputs.map(out => onOutPutForwardBuilder(out)))
        const onInPutForwarder = combineEpics(...inputs.map(input => onModelInAskForWhatBuilder(input)))

        return combineEpics(onPageStartedListenToOutput, onOutPutForwarder, onInPutForwarder, onPostItemRequestSetStatus)
    }
    catch (e) {
        console.log(e)
        return combineEpics()
    }
}