import type {HortenNode} from "../alta/horten/node";
import {ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenItem} from "../alta/horten/item";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import type {HortenTable} from "../alta/horten/table";
import type {NodeStavanger} from "./lib/types";


export interface CollectorDefinition {
    input: string,
    list: string,
}


export const collectorMaestro = (stavanger: NodeStavanger, definition: CollectorDefinition) => {


    let node: HortenNode = stavanger.node
    let input: HortenItem = stavanger[definition.input]
    let list: HortenTable = stavanger[definition.list]

    //TODO: Set Node Output to FlowDiagram
    const onModelInPushToList = (action$, state$) =>
        action$.pipe(
            ofType(input.model.setItem.success),
            mergeMap(action => {

                let collection = [...list.selectors.getList(state$.value)];
                input.helpers.log("Pushing to this collection", collection)
                collection.push(action.payload)




                return [list.model.setList.request([...collection]),
                    node.helpers.requireUser("Choose an Item from the List")]
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
                return [node.model.setOut("bioseries").request(output)]
            })
        );


    return combineOrchestrator(stavanger, {
        onSelectOnListSetOutput,
        onModelInPushToList,
        }
    )
}
