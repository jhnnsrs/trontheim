import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNodeDefinition} from "../alta/horten/node";
import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {buildStatus, DONE, GRAPHERROR} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";
import type {HortenMold} from "../alta/horten/mold";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import {userIDPortal} from "../portals";


export interface NodeMeastroDefinition {
    input: (Stavanger) => HortenItem
}


export const nodeMaestro = (stavanger: Stavanger, definition: NodeMeastroDefinition) => {

    const node: HortenNode = stavanger.node
    const page = stavanger.page
    const settings: HortenMold = stavanger.settings

    const graph: HortenGraph = stavanger.parent.graph
    const registry: HortenRegistry = stavanger.parent.registry

    const nodeDefinition: HortenNodeDefinition = stavanger.node.definition

    const onNodeInputReceived = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setNodeIn(node.alias).request),
            mergeMap((action) => {

                    let ports =  nodeDefinition.ports.ins
                    let port = action.meta.port
                    let type = action.meta.type

                    let mappedPort = ports.find(item => port.startsWith(item.name.toUpperCase()))

                    // Check if Correctly Set
                    if (!mappedPort) return [node.model.setStatus.request(buildStatus(GRAPHERROR.connectionError,"No mapped Port found for " + port + " !"))]
                    page.helpers.log("Mapping Incoming of Type '"+ type +"' to '" + mappedPort.map)
                    if (mappedPort.type !== type) {
                        return [node.model.setStatus.request(buildStatus(GRAPHERROR.connectionError,"Type mismatch on Node"))]
                    }


                    return [ stavanger[mappedPort.map].model.setItem.request(action.payload)]
                }
            )
        )


    const onNodeStatusChanged = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setStatus.request),
            mergeMap((action) => {
                    return [graph.model.onNodeStatusUpdate.request({ instance: node.alias, status: action.payload.message, statuscode: action.payload.code}), node.model.setStatus.success(action.payload)]
                }
            )
        )

    const onPageInitRegisterNode = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap((action) => {
                    return [
                        registry.model.register(node.alias).request(node.alias),


                    ]
                }
            )
        )

    const onNodePopRequest = (action$, state$) =>
        action$.pipe(
            ofType(node.model.pop.request),
            mergeMap((action) => {
                    page.helpers.log("Setting Node as Popped")
                    // TODO: Implement here
                    let nodestate = graph.selectors.getNode(node.alias)(state$.value)


                    return [
                        graph.model.requestPop.request(
                            {
                                ...nodestate,
                                creator: userIDPortal(state$.value)
                            }),
                    ]
                }
            )
        )

    const onPageInitGetDefaultSettings = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap((action) => {

                    let defaultSettings = graph.selectors.getNode(node.alias)(state$.value).defaultsettings


                    return [
                        settings.model.setInitial.request(defaultSettings),

                    ]
                }
            )
        )

    const onSettingsSubmittedPublishToGraph = (action$, state$) =>
        action$.pipe(
            ofType(settings.model.submitForm.success),
            mergeMap((action) => {
                    return [
                        settings.model.setInitial.request(action.payload),
                        graph.model.setNodeSettings.request(action.payload),

                    ]
                }
            )
        )

    const onModelOutPutToGraph = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setOutput.success),
            mergeMap((action) => {
                    return [
                        graph.model.onNodeOutput.request(action.payload,action.meta),
                        node.model.setStatus.request(buildStatus(DONE.ouputSend, "Item was forwarded"))]
                }
            )
        )

    return combineOrchestrator(stavanger, {
            onPageInitRegisterNode,
            onModelOutPutToGraph,
            onNodeInputReceived,
            onPageInitGetDefaultSettings,
            onNodeStatusChanged,
            onNodePopRequest,
            onSettingsSubmittedPublishToGraph
        }
    )
}
