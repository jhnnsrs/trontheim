import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNode, HortenNodeDefinition} from "../alta/horten/node";
import {ActionsObservable, combineEpics, ofType, StateObservable} from "redux-observable";
import {zip} from "rxjs";
import {filter, mergeMap, switchMap} from "rxjs/operators";
import {ATTENTION, buildStatus, GRAPHERROR, NODEERROR, SERVER} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";
import {Action} from "redux";
import type {HortenList} from "../alta/horten/list";
import type {HortenPage} from "../alta/horten/page";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import type {HortenEdge} from "../alta/horten/edge";
import type {HortenTable} from "../alta/horten/table";


export interface TaskMaestroDefinition {
    outputs: [string],
    inputs: [string],
    parsing: (Action, ActionsObservable, StateObservable) => [Action],
}

export interface TaskStavanger extends Stavanger {
    node: HortenNode
}

export const taskMaestro = (stavanger: TaskStavanger, definition: TaskMaestroDefinition) => {
    /**
     * Builds a taskMaestro that helps with a lot of stuff
     *
     * @type {TaskStavanger}
     * @type {TaskStavanger}
     */


    const node: HortenNode = stavanger.node
    const page: HortenPage = stavanger.page
    const parser: HortenTable = stavanger[definition.parser]
    const outputs: [HortenTable] = definition.outputs.map( out => stavanger[out] ? stavanger[out] : null).filter(item => item != null)
    const inputs: [HortenTable] = definition.inputs.map( item => stavanger[item] ? stavanger[item] : null).filter(item => item != null)
    const parserFunc = definition.parsing


    const onPageStartedListenToOutput = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap(action => {
                    const outactions = outputs.map( out => out.model.osloJoin.request({meta: {room: {nodeid: out.model.alias}}}))
                    return [ ...outactions, parser.model.osloJoin.request({meta: {room: {nodeid: node.model.alias}}})]
            }
            ));


    const onModelInAskForWhatBuilder = (input) => (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            mergeMap(action => {
                    let actions = parserFunc(action, action$,state$)
                    return [...actions]

            })
        );

    const onOutPutForwardBuilder = (output) => (action$, state$) =>
        action$.pipe(
            ofType(output.model.osloItemCreate.success,
                output.model.osloItemUpdate.success),
            mergeMap(action => {
                output.helpers.log("New Item Received", action.payload, "on type", output.definition.type)
                // TODO: Maybe a mape for the output key would be better here

                return [node.model.setOut(output.definition.type).request(action.payload)]
            })
        );

    const onParserUpdate = (action$, state$) =>
        action$.pipe(
            ofType(parser.model.osloItemCreate.success,
                parser.model.osloItemUpdate.success),
            mergeMap(action => {
                parser.helpers.log("New Item Received", action.payload, "on type", parser.definition.type)
                // TODO: Maybe a mape for the output key would be better here

                return [node.helpers.setStatus(SERVER.serverProgress, action.payload.data.status)]
            })
        );

    const onOutPutForwarder = combineEpics(...outputs.map(out => onOutPutForwardBuilder(out)))
    const onInPutForwarder = combineEpics(...inputs.map(input => onModelInAskForWhatBuilder(input)))



    return combineOrchestrator(stavanger,{
        onPageStartedListenToOutput,
        onOutPutForwarder,
        onParserUpdate,
        onInPutForwarder
        })
}
