import {combineEpics, ofType} from "redux-observable";
import type {LockerWatcherStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenNodeDefinition} from "../../alta/horten/node";
import {buildStatus, GRAPHERROR} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: LockerWatcherStavanger) => {



    const input = stavanger.locker
    const node = stavanger.node
    const page = stavanger.page

    const graph: HortenGraph = stavanger.parent.graph
    const registry: HortenRegistry = stavanger.parent.registry

    const definition: HortenNodeDefinition = stavanger.node.definition

    const onNodeInputReceived = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setNodeIn(stavanger.node.alias).request),
            mergeMap((action) => {
                    console.log(action)

                    let ports =  definition.ports.ins
                    let port = action.meta.port
                    let type = action.meta.type

                    let mappedPort = ports.find(item => item.name === port)
                    console.log(mappedPort)
                    // Check if Correctly Set
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




    //TODO: Set Node Output to FlowDiagram
    const onInputModelIsSetAndStartPressed = (action$, state$) =>
        action$.pipe(
            ofType(node.model.dynamic("START").request),
            withLatestFrom(action$.ofType(input.model.setItem.request)),
            mergeMap((actions) => {
                    let dataStructure = actions[1].payload;
                    return [node.model.setOut("Locker").request(dataStructure)]
                }
                )
            )


    const apiConnections = combineEpics(
        itemConnector(stavanger.locker),
        apiConnector(stavanger.lockers)
    )

    return combineEpics(
        apiConnections,
        onInputModelIsSetAndStartPressed,
        onNodeInputReceived,
        onModelOutPutToGraph,
        onPageInitRegisterNode,)
}

export default orchestraterEpic