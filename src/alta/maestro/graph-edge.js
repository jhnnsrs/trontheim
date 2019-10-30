import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {NODE} from "../constants"
import type {HortenNode, HortenNodeModel} from "../horten/node";
import type {HortenGraph} from "../horten/graph";
import {createHortenNodeModel} from "../horten/node";
import {createHortenEdgeModel} from "../horten/edge";
import {EDGE} from "../../constants";
import type {HortenEdgeModel} from "../horten/edge";


export interface GraphStavanger {
    graph: HortenGraph
}

export const graphEdgeMaestro = (graphStavanger: GraphStavanger): Epic  => {

    let graph = graphStavanger.graph
    let edgeHatcher = createHortenEdgeModel

    //TODO: Maybe factor this one out so its actually part of the edge, so no hatching is required
    const setGraphOutputToNode = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.modelOUT.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                let alias = meta.target // Most importat part
                let model = meta.model
                let edge: HortenEdgeModel = edgeHatcher(alias, EDGE, "edge")
                return [edge.setInput.request({data: data, meta: meta})]
            }));

    //TODO: Set Node Progress to FlowDiagram

    return combineEpics(setGraphOutputToNode)
}


