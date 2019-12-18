import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import rootStavanger from "../../rootStavanger";
import {buildStatus, DONE} from "../../constants/nodestatus";

export interface EdgeStavanger {
    edge: HortenEdge,
}

export interface NomogramStavanger {
    graph: HortenNomogram
}

export const nodeGraphMaestro = (nodeStavanger: EdgeStavanger, graphStavanger: NomogramStavanger): Epic  => {

    let graph = graphStavanger.graph
    let edge = nodeStavanger.edge
    let veil = graphStavanger.veil ? graphStavanger.veil : rootStavanger.veil

    //TODO: Set Node Output to FlowDiagram
    const setNodeOutputToGraph = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setOutput.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                let newmeta = {
                    nodeid: edge.alias,
                    model: meta.model
                }
                const payload = {data: data, meta: { ...meta,...newmeta}};

                console.log(payload)

                let isPopped = edge.selectors.isPopped(state$.value)
                let isAlien = edge.selectors.isAlien(state$.value)
                if (isPopped) {
                    return [veil.model.sendMessage.request({...payload, meta: {...meta, channel: isPopped}}),
                        graph.model.setNodeStatus.request({node: edge.alias, status: graph.definition.statusOUT}),
                        edge.model.setStatus.request(buildStatus(DONE.ouputSend))]
                }
                if (isAlien) {
                    return [veil.model.sendMessage.request({...payload, meta: {...meta, alien: isAlien}}),
                        graph.model.setNodeStatus.request({node: edge.alias, status: graph.definition.statusOUT}),
                        edge.model.setStatus.request(buildStatus(DONE.ouputSend))]
                }
                return [graph.model.modelIN.request(payload),
                    graph.model.setNodeStatus.request({node: edge.alias, status: graph.definition.statusOUT}),
                    edge.model.setStatus.request(buildStatus(DONE.ouputSend))]
            }))


    const getLinksFromGraph = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.fetchLinks.request),
            mergeMap(action => {
                let params = {
                    nodeid: edge.alias,
                }

                let links = graph.selectors.getLinksForNode(params)(state$.value)


                return [edge.model.fetchLinks.success(links)]
            }));


    //TODO: Set Node Progress to FlowDiagram
    const setNodeProgressToGraph = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setProgress.success),
            mergeMap(action => {
                let progress = action.payload
                let newmeta = {
                    node: edge.alias,
                    progress: progress
                }
                return [graph.model.setNodeProgress.request(newmeta)]
            }));


    const passRequireUserToGraph = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.requireUser.success),
            mergeMap(action => {
                let bool = action.payload
                let newmeta = {
                    node: edge.alias,
                    value: bool
                }
                return [graph.model.nodeRequiresUser.request(newmeta)]
            }));



    return combineEpics(setNodeOutputToGraph,setNodeProgressToGraph,passRequireUserToGraph,getLinksFromGraph)
}