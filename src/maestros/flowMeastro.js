import rootStavanger from "../rootStavanger";
import {ofType} from "redux-observable";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import type {GraphCurtainDefinition, GraphCurtainStavanger} from "./graphCurtainMaestro";
import type {GraphLayoutStavanger} from "./graphFlowLayoutMaestro";
import type {GraphRegistryStavanger} from "./graphRegistryMaestro";
import type {CurtainExternalStavanger} from "./curtainExternalMaestro";
import {graphRegistryMaestro} from "./graphRegistryMaestro";
import {graphFlowLayoutMaestro} from "./graphFlowLayoutMaestro";
import {curtainExternalMaestro} from "./curtainExternalMaestro";
import {graphCurtainMaestro} from "./graphCurtainMaestro";
import {userIDPortal} from "../portals";
import {OsloString} from "../constants/endpoints";

export interface FlowStavanger extends GraphCurtainStavanger, GraphLayoutStavanger, GraphRegistryStavanger, CurtainExternalStavanger {

}



export const flowMaestro = (stavanger: FlowStavanger, definition: GraphCurtainDefinition) => {

    const initial = definition.initial
    const paramMapper = definition.paramsMap

    const m_graphCurtain = graphCurtainMaestro(stavanger, definition)
    const m_graphRegistry = graphRegistryMaestro(stavanger, definition)
    const m_graphLayout = graphFlowLayoutMaestro(stavanger, definition)
    const m_curtainExternal = curtainExternalMaestro(stavanger, definition)

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let items = paramMapper(action.payload.match.params)

                let flowid = items.flowid;
                let initialid = items.initialid;
                stavanger.page.helpers.log("Flow Page initiated")
                return [
                    stavanger.flow.model.fetchItem.request({data: {id: flowid}}),
                    initial.model.fetchItem.request({data: {id: initialid}}),
                    stavanger.availableLayouts.model.fetchList.request({meta: {filter: {flows: flowid}}}),
                    stavanger.externals.model.osloJoin.request({meta: {room: {creator: userIDPortal(state$.value), subset: OsloString}}})
                ]
            }));


    const allEpicsLoadedSetInitial = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.registry.model.allNodesRegistered.success),
            withLatestFrom(action$.ofType(stavanger.graph.model.setGraphFromFlow.success),action$.ofType(initial.model.fetchItem.success)),
            mergeMap(actions => {
                stavanger.graph.helpers.log("____________________")
                stavanger.graph.helpers.log("=== Flow Started ===")
                let initialinstance = actions[2].payload

                let watchers = stavanger.graph.selectors.getWatcherForModel("BioImageWatcher")(state$.value)

                stavanger.graph.helpers.log(watchers)
                return watchers.map( node => {
                    if (node.outputmodel.includes(initial.type)) {
                        let modelin = {
                            data: initialinstance.data,
                            meta: {type: initial.type, origin: "flow", port: "_watcher"}
                        }
                        return stavanger.graph.model.setNodeIn(node.alias).request(modelin, modelin.meta)
                    }
                    else return stavanger.graph.model.setGraphError.request("Apparently there is a Watcher that takes a different Model in")

                })
            }));



    return combineOrchestrator(stavanger, {
        onPageInitLoadFlow,
        allEpicsLoadedSetInitial,
        m_graphCurtain,
        m_graphRegistry,
        m_graphLayout,
        m_curtainExternal,
        }
    )
}





export const graphMaestro = (stavanger: FlowStavanger, definition: GraphCurtainDefinition) => {

    const initial = definition.initial
    const paramMapper = definition.paramsMap

    const m_graphCurtain = graphCurtainMaestro(stavanger, definition)
    const m_graphRegistry = graphRegistryMaestro(stavanger, definition)
    const m_graphLayout = graphFlowLayoutMaestro(stavanger, definition)
    const m_curtainExternal = curtainExternalMaestro(stavanger, definition)

    const names = ["first","second","third"]
    let items = []

    const modelFetching = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                items = paramMapper(action.payload.match.params)
                return items.map( (item, index) => {

                    let url = item.url;
                    let id = item.id;
                    let type = item.type;

                    stavanger.page.helpers.log(`Loading item ${url}`)
                    return stavanger[names[index]].model.fetchItem.request({data: {id: id}, meta: {url: url}})
                })
            }));

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let flowid = action.payload.match.params.graphid

                stavanger.page.helpers.log("Flow Page initiated")
                return [
                    stavanger.flow.model.fetchItem.request({data: {id: flowid}}),
                    stavanger.availableLayouts.model.fetchList.request({meta: {filter: {flows: flowid}}}),
                    stavanger.externals.model.osloJoin.request({meta: {room: {creator: userIDPortal(state$.value), subset: OsloString}}})
                ]
            }));


    const allEpicsLoadedSetInitial = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.registry.model.allNodesRegistered.success),
            withLatestFrom(action$.ofType(stavanger.graph.model.setGraphFromFlow.success),action$.ofType(initial.model.fetchItem.success)),
            mergeMap(actions => {
                stavanger.graph.helpers.log("____________________")
                stavanger.graph.helpers.log("=== Flow Started ===")
                let initialinstance = actions[2].payload

                let watchers = stavanger.graph.selectors.getWatcherForModel(null)(state$.value)

                stavanger.graph.helpers.log(watchers)
                return watchers.flatMap( node => {
                    items.map( initial => {
                        if (node.outputmodel.includes(initial.type)) {
                            let modelin = {
                                data: initialinstance.data,
                                meta: {type: initial.type, origin: "flow", port: "_watcher"}
                            }
                            return stavanger.graph.model.setNodeIn(node.alias).request(modelin, modelin.meta)
                        } else return stavanger.graph.model.setGraphError.request("Not the right node")
                    })

                })
            }));



    return combineOrchestrator(stavanger, {
            onPageInitLoadFlow,
            modelFetching,
            allEpicsLoadedSetInitial,
            m_graphCurtain,
            m_graphRegistry,
            m_graphLayout,
            m_curtainExternal,
        }
    )
}