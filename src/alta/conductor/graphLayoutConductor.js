import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {combineLatest, mergeMap, switchMap, take, withLatestFrom, zipAll} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";
import type {HortenPage} from "../horten/page";
import {userIDPortal} from "../../portals";
import {generateName} from "../../utils";
import {graphNodeMaestro} from "../maestro/graph-node";
import {graphEdgeMaestro} from "../maestro/graph-edge";
import type {HortenNodes} from "../horten/nodes";
import {autoResetMaestro} from "../maestro/autoreset";


export interface GraphLayoutStavanger {
    edge: HortenEdge,
    page: HortenPage,
    graph: HortenNomogram,
    [string]: HortenItem,
}

export interface ParserConfiguration {
    // Hortens
    graph: string,
    flow: string,
    watcher: string,
    nodes: string,
    possibleLayouts: string,
    layout: string,

    // Accessors
    watcherParamsAccessor: (any) => number,
    flowParamsAccessor: (any) => number,

    // Model
    model: string,
    watcherName: string,

}


export const graphLayoutWatcherConductor = (stavanger: GraphLayoutStavanger, configuration: ParserConfiguration): Epic  => {

    // Necessary Models for this Conductor
    let flow: HortenItem = configuration.flow ? stavanger[configuration.flow] : stavanger.flow
    let watcher: HortenItem = configuration.watcher ? stavanger[configuration.watcher] : stavanger.watcher
    let nodes: HortenNodes = configuration.nodes ? stavanger[configuration.nodes] : stavanger.nodes
    let graph: HortenNomogram = configuration.graph ? stavanger[configuration.graph] : stavanger.graph
    let possibleLayouts: HortenTable = configuration.possibleLayouts ? stavanger[configuration.possibleLayouts] : stavanger.possibleLayouts
    let layout: HortenItem = configuration.layout ? stavanger[configuration.layout] : stavanger.layout

    // Accessor to get the Loading Params
    let watcherParamsAccessor = configuration.watcherParamsAccessor
    let flowParamsAccessor = configuration.flowParamsAccessor

    // Model Constant
    let MODEL = configuration.model
    let WATCHERNAME = configuration.watcherName


    const autoreset = autoResetMaestro(stavanger)

    const onPageInitLoadFlow = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                console.log(action.payload)
                return [
                    flow.model.fetchItem.request({data: {id: flowParamsAccessor(action.payload.match.params)}}),
                    watcher.model.fetchItem.request({data: {id: watcherParamsAccessor(action.payload.match.params)}}),
                ]
            }));


    const onFlowSelectedLoadedSetGraph = (action$, state$) =>
        action$.pipe(
            ofType(flow.model.fetchItem.success),
            mergeMap(action => {
                return [
                    possibleLayouts.model.fetchList.request({meta: {filter: {flows: action.payload.data.id}}}),
                    possibleLayouts.model.osloJoin.request({meta: {room: {creator: userIDPortal(state$.value)}}}),]
            }));

    const onFlowAndLayoutLoaded = (action$, state$) =>
        action$.pipe(
            ofType(flow.model.fetchItem.success),
            mergeMap(action => {
                return [
                    graph.model.setGraphFromFlow.request(action.payload),]
            }));

    const onLayoutSelectedChangeLayout = (action$, state$) =>
        action$.pipe(
            ofType(possibleLayouts.model.selectItem.success),
            mergeMap(action => {
                return [layout.model.setItem.request(action.payload)]
            }));


    const onLayoutListComesSelectFirstLayout = (action$, state$) =>
        action$.pipe(
            ofType(possibleLayouts.model.fetchList.success),
            mergeMap(action => {
                let list = possibleLayouts.selectors.getList(state$.value)
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







    const onLayoutUpdatedUpdateLayout = (action$, state$) =>
        action$.pipe(
            ofType(layout.model.dynamic("SET_LAYOUT").request),
            switchMap((action) =>
                action$.pipe(
                    ofType(layout.model.dynamic("UPDATE_LAYOUT").request),
                    take(1),
                    mergeMap(() => {
                            let thelayout = action.payload
                            console.log(action.payload)
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
                )
            )
        );

    const onLayoutUpdatedCreate = (action$, state$) =>
        action$.pipe(
            ofType(layout.model.dynamic("SET_LAYOUT").request),
            switchMap((action) =>
                action$.pipe(
                    ofType(layout.model.dynamic("CREATE_LAYOUT").request),
                    take(1),
                    mergeMap(() => {
                            let thelayout = action.payload
                            console.log(action.payload)
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
                )
            )
        );



    const onGraphAndSampleLoadedStartFlow = (action$, state$) =>
        action$.pipe(
            ofType(watcher.model.fetchItem.success),
            withLatestFrom(action$.ofType(nodes.model.allNodesRegistered.success)),
            mergeMap(actions => {
                console.log("STARTING THE FLOW")
                let watchingdata = actions[0].payload
                let components = actions[1].payload
                console.log(components)
                let thewatcher = components.find(item => item.name === WATCHERNAME)
                console.log(thewatcher)

                let modelin = {
                    data: watchingdata.data,
                    meta: {target: thewatcher.nodeid, model: MODEL, origin: "null"}
                }
                return [ stavanger.graph.model.modelOUT.request(modelin)]
            }));


    const onGraphSetNodes = (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setGraphFromFlow.success),
            mergeMap(action => {
                return [ nodes.model.setNodes.request({data: {diagram: action.payload}})]
            }));


    let addin = graphNodeMaestro(stavanger)
    let addin2 = graphEdgeMaestro(stavanger)

    return combineEpics(
        onPageInitLoadFlow,
        onLayoutUpdatedCreate,
        onLayoutListComesSelectFirstLayout,
        onLayoutUpdatedUpdateLayout,
        onLayoutSelectedChangeLayout,
        onFlowSelectedLoadedSetGraph,
        onGraphSetNodes,
        onGraphAndSampleLoadedStartFlow,
        onFlowAndLayoutLoaded,
        addin,
        addin2,
        autoreset,
        )

}