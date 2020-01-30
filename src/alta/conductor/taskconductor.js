import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {filter, mergeMap} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";
import type {HortenPage} from "../horten/page";
import {buildStatus, SERVER} from "../../constants/nodestatus";


export interface EdgeStavanger {
    edge: HortenEdge,
    page: HortenPage,
    [string]: HortenItem,
}

export interface ParserConfiguration {
    auto: string,
    input: [string],
    output: [string],
    inputModel: string, // The Model Type
    enablePassThrough: boolean,
    parser: string, // The Reference to the list
    parserFunc: (any,any) => any, // params: Payload and State,Should Return the Parsing Object e.g analyzing or filtering
    shouldParseFunc: (any,any) => any, // params: Payload, Stavanger, State,Should Return True if new Conversing is Wanted

}


export const taskConductor = (nodeStavanger: EdgeStavanger, configuration: ParserConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let edge: HortenEdge = nodeStavanger.edge
    let page: HortenPage = nodeStavanger.page
    let outputs: [HortenTable] = configuration.output.map( out => nodeStavanger[out] ? nodeStavanger[out] : null).filter(item => item != null)
    let inputs: [HortenTable] = configuration.input.map( item => nodeStavanger[item] ? nodeStavanger[item] : null).filter(item => item != null)
    if (outputs.length != configuration.output.length) console.log("Error in Output Configuration")
    let parser: HortenTable = nodeStavanger[configuration.parser]
    let parserFunc = configuration.parserFunc
    let shouldParseFunc = configuration.shouldParseFunc
    let stavanger = nodeStavanger


    const onPageStartedListenToOutput = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap(action => {
                    return outputs.map( out => out.model.osloJoin.request({meta: {room: {nodeid: out.model.alias}}}))
                }
            ));


    const onModelInAskForWhatBuilder = (input) => (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            mergeMap(action => {

                let shoudParse = shouldParseFunc(action.payload,state$.value, stavanger)
                if (shoudParse) {
                    let parsing = parserFunc(action.payload,state$.value)

                    console.log("posting parsing to", parsing)
                    return [parser.model.postItem.request(parsing),
                        edge.model.setProgress.request(1),
                        edge.model.setStatus.request(buildStatus(SERVER.serverPost))]


                }
                else {
                    return [edge.model.setProgress.request(0)]
                }
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
                    meta:{
                        model: output.definition.type,
                        nodeid: output.model.alias
                    }

                }
                return [edge.model.setOutput.request(send),
                    edge.model.setProgress.request(0)]
            })
        );

    const onOutPutForwarder = combineEpics(...outputs.map(out => onOutPutForwardBuilder(out)))
    const onInPutForwarder = combineEpics(...inputs.map(input => onModelInAskForWhatBuilder(input)))

    return combineEpics(onPageStartedListenToOutput,onOutPutForwarder,onInPutForwarder)
}