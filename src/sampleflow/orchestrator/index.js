import {combineEpics, ofType} from "redux-observable";
import type {LockerFlowStavanger, SampleFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {itemConnector} from "../../rootMaestros";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {userIDPortal} from "../../portals";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {flowMaestro} from "../../maestros/flowMeastro";
import {createFlowApi} from "../../conductors/createFlowConductor";
import {OsloString} from "../../constants/endpoints";

export const orchestraterEpic = (stavanger: SampleFlowStavanger) => {

    const flow = stavanger.flow
    const page = stavanger.page
    const initial = stavanger.sample
    const registry = stavanger.registry
    const layoutlist = stavanger.availableLayouts
    const graph = stavanger.graph
    const externals = stavanger.externals

    const m_flow = flowMaestro(stavanger, null)

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let flowid = action.payload.match.params.flowid;
                let sampleid = action.payload.match.params.sampleid;
                page.helpers.log("Flow Page initiated")
                return [
                    flow.model.fetchItem.request({data: {id: flowid}}),
                    initial.model.fetchItem.request({data: {id: sampleid}}),
                    layoutlist.model.fetchList.request({meta: {filter: {flows: flowid}}}),
                    externals.model.osloJoin.request({meta: {room: {creator: userIDPortal(state$.value), subset: OsloString}}})
                ]
            }));


    const allEpicsLoadedSetInitial = (action$, state$) =>
        action$.pipe(
            ofType(registry.model.allNodesRegistered.success),
            withLatestFrom(action$.ofType(graph.model.setGraphFromFlow.success),action$.ofType(initial.model.fetchItem.success)),
            mergeMap(actions => {
                graph.helpers.log("____________________")
                graph.helpers.log("=== Flow Started ===")
                let graphrep = actions[1].payload
                let initial = actions[2].payload

                let watcher = graph.selectors.getNodeByName("SampleWatcher")(state$.value)
                if (!watcher) return [graph.model.setGraphError.request("No Watcher for this Graph")]

                let modelin = {
                    data: initial.data,
                    meta: { type: constants.SAMPLE, origin: "flow", port: "_watcher"}
                }
                return [graph.model.setNodeIn(watcher.alias).request(modelin, modelin.meta)]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        createFlowApi(stavanger)
    )

    return combineOrchestrator(stavanger, {
        onPageInitLoadFlow,
        allEpicsLoadedSetInitial,
        m_flow,
        apiConnections
        }

    )
}

export default orchestraterEpic