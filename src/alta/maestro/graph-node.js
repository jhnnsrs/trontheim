import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {NODE} from "../constants"
import type {HortenNode, HortenNodeModel} from "../horten/node";
import type {HortenGraph} from "../horten/graph";
import {createHortenNodeModel} from "../horten/node";


export interface GraphStavanger {
    graph: HortenGraph
}

export const graphNodeMaestro = (graphStavanger: GraphStavanger): Epic  => {

    let graph = graphStavanger.graph
    let nodeHatcher = createHortenNodeModel

    //TODO: Set Node Input from FlowDiagram
    const setGraphOutputToNode = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.modelOUT.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                let alias = meta.target
                let model = meta.model
                let node: HortenNodeModel = nodeHatcher(alias, NODE, "node")
                return [node.setInput.request({data: data, meta: meta})]
            }));

    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(setGraphOutputToNode)
}


