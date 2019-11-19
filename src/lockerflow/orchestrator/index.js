import {combineEpics, ofType} from "redux-observable";
import type {LockerFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {map, mergeMap, take, withLatestFrom} from "rxjs/operators";
import {zip} from "rxjs"
import {userIDPortal} from "../../portals";
import {generateName} from "../../utils";
import rootStavanger from "../../rootStavanger";
import type {HortenVeil} from "../../alta/horten/veil";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import type {HortenCurtain} from "../../alta/horten/curtain";

export const orchestraterEpic = (stavanger: LockerFlowStavanger) => {

    const flow = stavanger.flow
    const page = stavanger.page
    const curtain: HortenCurtain = rootStavanger.curtain
    const initial = stavanger.locker
    const registry = stavanger.registry
    const layout = stavanger.layout
    const layoutlist = stavanger.possibleLayouts
    const graph = stavanger.graph

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let flowid = action.payload.match.params.flowid;
                page.helpers.log("Flow Page initiated")
                return [
                    flow.model.fetchItem.request({data: {id: flowid}}),
                    initial.model.fetchItem.request({data: {id: action.payload.match.params.lockerid}}),
                    layoutlist.model.fetchList.request({meta: {filter: {flows: flowid}}})
                ]
            }));

    const loadFlowAndFirstItem = (action$, state$) =>

        zip(
            action$.ofType(flow.model.fetchItem.success),
            action$.ofType(initial.model.fetchItem.success),
        ).pipe(
            take(1),
            map(action => {
                let flow = action[0].payload
                return graph.model.setGraphFromFlow.request(flow)
        }));

    const onForeignNodeRequestPassToVeil = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.foreignNodeIn.request),
            mergeMap(action => {
                page.helpers.log("Foreign Node Request")
                return [
                    curtain.model.sendToAlien.request(action.payload)
                ]
            }));

    const loadNodes =  (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setGraphFromFlow.success),
            mergeMap(action => {
                return [
                    registry.model.setNodesFromGraph.request(action.payload)
                ]
            }));

    const onDifferentLayoutSelected =  (action$, state$) =>
        action$.pipe(
            ofType(layoutlist.model.selectItem.request),
            mergeMap(action => {
                return [
                    layout.model.setItem.request(action.payload)
                ]
            }));

    const onLayoutUpdatedCreate = (action$, state$) =>
        action$.pipe(
            ofType(layout.model.dynamic("CREATE_LAYOUT").request),
            withLatestFrom(action$.ofType(layout.model.dynamic("SET_LAYOUT").request)),
            mergeMap(actions =>
                {
                    let thelayout = actions[1].payload
                    layout.helpers.log("Creating the Layout with", thelayout)
                    let newlayout = {
                        data:
                            {
                                creator: userIDPortal(state$.value),
                                layout: JSON.stringify(thelayout),
                                name: generateName(),
                                flows: [flow.selectors.getModel(state$.value).data.id]
                            },
                        meta: {
                            update: null
                        }
                    }

                    return [ layout.model.postItem.request(newlayout)]

                }
                )
        );

    const onLayoutUpdatedUpdate = (action$, state$) =>
        action$.pipe(
            ofType(layout.model.dynamic("UPDATE_LAYOUT").request),
            withLatestFrom(action$.ofType(layout.model.dynamic("SET_LAYOUT").request)),
            mergeMap(actions =>
                {
                    let thelayout = actions[1].payload
                    layout.helpers.log("Updating the Layout with", thelayout)
                    let newlayout = {
                        data:
                            {
                                id: layout.selectors.getData(state$.value).id,
                                creator: userIDPortal(state$.value),
                                layout: JSON.stringify(thelayout),
                                name: layout.selectors.getData(state$.value).name,
                                flows: layout.selectors.getData(state$.value).flows
                            },
                        meta: {
                            update: null
                        }
                    }

                    return [ layout.model.updateItem.request(newlayout)]

                }
            )
        );

    const onLayoutListComesSelectFirstLayout = (action$, state$) =>
        action$.pipe(
            ofType(layoutlist.model.fetchList.success),
            mergeMap(action => {
                let list = layoutlist.selectors.getList(state$.value)
                if (list.length > 0) {
                    let firstitem = list[0]
                    return [layout.model.setItem.request(firstitem)]
                }
                else return [layout.model.setItem.request(
                    {
                        data:
                            {id: 1, name: " No Layout Yet", layout: JSON.stringify({}), creator: 1, flows: []}
                    }

                )]
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

                let watcher = graphrep.nodes.find(item => item.name === "LockerWatcher")

                let modelin = {
                    data: initial.data,
                    meta: { type: constants.LOCKER, origin: "flow", port: "_WATCHER"}
                }
                return [graph.model.setNodeIn(watcher.instance).request(modelin, modelin.meta)]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.locker),
        itemConnector(stavanger.flow),
        itemConnector(stavanger.layout),
        apiConnector(stavanger.possibleLayouts),
    )

    return combineOrchestrator(stavanger, {
            onPageInitLoadFlow,
            loadFlowAndFirstItem,
            loadNodes,
            apiConnections,
            onDifferentLayoutSelected,
            onLayoutListComesSelectFirstLayout,
            onLayoutUpdatedCreate,
            onLayoutUpdatedUpdate,
            allEpicsLoadedSetInitial,
            onForeignNodeRequestPassToVeil
        }

    )
}

export default orchestraterEpic