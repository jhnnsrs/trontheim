import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNodeDefinition} from "../alta/horten/node";
import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {buildStatus, GRAPHERROR} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";


export interface NodeMeastroDefinition {
    input: (Stavanger) => HortenItem
}


export const nodeMaestro = (stavanger: Stavanger, definition: NodeMeastroDefinition) => {

    const node = stavanger.node
    const page = stavanger.page

    const graph: HortenGraph = stavanger.parent.graph
    const registry: HortenRegistry = stavanger.parent.registry

    const nodeDefinition: HortenNodeDefinition = stavanger.node.definition

    const onNodeInputReceived = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setNodeIn(node.alias).request),
            mergeMap((action) => {
                    console.log(action)

                    let ports =  nodeDefinition.ports.ins
                    let port = action.meta.port
                    let type = action.meta.type

                    let mappedPort = ports.find(item => port.startsWith(item.name.toUpperCase()))
                    console.log(mappedPort)
                    // Check if Correctly Set
                    if (!mappedPort) return [node.model.setStatus.request(buildStatus(GRAPHERROR.connectionError,"No mappedPort found for " + port + " !"))]
                    if (mappedPort.type !== type) {
                        return [node.model.setStatus.request(buildStatus(GRAPHERROR.connectionError,"Type mismatch on Node"))]
                    }


                    return [ stavanger[mappedPort.map].model.setItem.request(action.payload)]
                }
            )
        )

    const onPageInitRegisterNode = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap((action) => {
                    console.log(action)
                    return [registry.model.register(node.alias).request(node.alias)]
                }
            )
        )

    const onModelOutPutToGraph = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setOutput.success),
            mergeMap((action) => {
                    return [graph.model.onNodeOutput.request(action.payload,action.meta)]
                }
            )
        )

    return combineEpics(
        onPageInitRegisterNode,
        onModelOutPutToGraph,
        onNodeInputReceived
    )
}
