import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {GraphStavanger} from "./graph-node";
import type {HortenNode} from "../horten/node";

export interface NodeStavanger {
    node: HortenNode,
}

export const nodeGraphMaestro = (nodeStavanger: NodeStavanger, graphStavanger: GraphStavanger): Epic  => {

    let graph = graphStavanger.graph
    let node = nodeStavanger.node

    //TODO: Set Node Output to FlowDiagram
    const setNodeOutputToGraph = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setOutput.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                let newmeta = {
                    nodeid: node.alias,
                    model: meta.model
                }
                return [graph.model.modelIN.request({data: data, meta: { ...meta,...newmeta}})]
            }));


    //TODO: Set Node Progress to FlowDiagram
    const setNodeProgressToGraph = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setProgress.success),
            mergeMap(action => {
                let {data, meta} = action.payload
                let newmeta = {
                    nodeid: node.alias,
                    model: meta.model
                }
                return [graph.model.modelIN.request({data: data, meta: { ...meta,...newmeta}})]
            }));




    return combineEpics(setNodeOutputToGraph,setNodeProgressToGraph)
}