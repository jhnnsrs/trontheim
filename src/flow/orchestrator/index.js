import {combineEpics, ofType} from "redux-observable";
import {mergeMap, switchMap, take} from "rxjs/operators";
import type {BioImageFlowStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphEdgeMaestro} from "../../alta/maestro/graph-edge";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: BioImageFlowStavanger) => {

    const onPageInitLoadFlows = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                console.log(action.payload)
                return [
                    stavanger.flows.model.fetchList.request({filter: {creator: userIDPortal(state$.value)}}),
                ]
            }));



    const onFlowSelectedLoadedSetGraph = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.flows.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.graph.model.setGraphFromFlow.request(action.payload),
                stavanger.possibleLayouts.model.fetchList.request({filter: {flows: action.payload.data.id}})]
            }));

    const onLayoutSelectedChangeLayout = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.possibleLayouts.model.selectItem.success),
            mergeMap(action => {
                return [stavanger.layout.model.setItem.request(action.payload)]
            }));



    const onGraphSetSetNodes = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.graph.model.setGraphFromFlow.success),
            mergeMap(action => {
                return [ stavanger.nodes.model.setNodes.request({data: {diagram: action.payload}})]
            }));



    const onLayoutUpdatedUpdateLayout = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.layout.model.dynamic("SET_LAYOUT").request),
            switchMap((action) =>
                action$.pipe(
                    ofType(stavanger.layout.model.dynamic("UPDATE_LAYOUT").request),
                    take(1),
                    mergeMap(() => {
                        let layout = action.payload
                        console.log(action.payload)
                        let newlayout = {
                            data:
                                {
                                    id: stavanger.layout.selectors.getData(state$.value).id,
                                    creator: userIDPortal(state$.value),
                                    layout: JSON.stringify(layout),
                                    name: "Test",
                                    flows: [stavanger.flows.selectors.getSelected(state$.value).data.id]
                                },
                            meta: {
                                update: null
                            }
                        }

                        return [ stavanger.layout.model.updateItem.request(newlayout)]
                        }
                    )
                )
            )
        );

    const onLayoutUpdatedCreate = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.layout.model.dynamic("SET_LAYOUT").request),
            switchMap((action) =>
                action$.pipe(
                    ofType(stavanger.layout.model.dynamic("CREATE_LAYOUT").request),
                    take(1),
                    mergeMap(() => {
                            let layout = action.payload
                            console.log(action.payload)
                            let newlayout = {
                                data:
                                    {
                                        creator: userIDPortal(state$.value),
                                        layout: JSON.stringify(layout),
                                        name: "Test",
                                        flows: [stavanger.flows.selectors.getSelected(state$.value).data.id]
                                    },
                                meta: {
                                    update: null
                                }
                            }

                            return [ stavanger.layout.model.postItem.request(newlayout)]
                        }
                    )
                )
            )
        );


    let addin2 = graphEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.flows),
        apiConnector(stavanger.possibleLayouts),
        itemConnector(stavanger.layout)
    )

    return combineEpics(
        onPageInitLoadFlows,
        onFlowSelectedLoadedSetGraph,
        onGraphSetSetNodes,
        onLayoutUpdatedUpdateLayout,
        onLayoutUpdatedCreate,
        onLayoutSelectedChangeLayout,
        apiConnections,addin2)
}

export default orchestraterEpic