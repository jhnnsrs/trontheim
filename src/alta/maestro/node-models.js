import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {GraphStavanger} from "./graph-node";
import type {HortenNode} from "../horten/node";
import type {HortenPage} from "../horten/page";
import type {HortenDetail} from "../horten/detail";
import * as _ from "lodash"

export interface ModelsStavanger {
    [string]: HortenDetail,
}

export interface NodeStavanger {
    [string]: HortenDetail,
    node: HortenNode,
}

export const nodeModelsMaestro = (nodeStavanger: NodeStavanger, modelsStavanger: ModelsStavanger): Epic  => {

    // This allows for
    let modelStavanger = modelsStavanger ? modelsStavanger : nodeStavanger
    let node = nodeStavanger.node

    //TODO: Set Node Output to FlowDiagram
    const onModelInSetStavangerModel = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setInput.request),
            mergeMap(action => {
                let {meta} = action.payload
                let actionslist = []
                _.mapValues(modelStavanger, (value) => {
                    try {
                        if (meta.model === value.type) actionslist.push(value.model.setItem.request(action.payload))
                    }
                    catch(e){
                        console.warn("Multiple models found where list and detail are mixed")
                        actionslist.push(node.model.dynamic("WARNING").request(e))
                    }
                })
                return actionslist
            }));





    return combineEpics(onModelInSetStavangerModel)
}