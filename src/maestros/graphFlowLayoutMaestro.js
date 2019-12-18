import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNodeDefinition} from "../alta/horten/node";
import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, take, withLatestFrom} from "rxjs/operators";
import {buildStatus, DONE, GRAPHERROR, WAITING} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";
import type {HortenMold} from "../alta/horten/mold";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import {userIDPortal} from "../portals";
import type {HortenCurtain} from "../alta/horten/curtain";
import type {HortenTable} from "../alta/horten/table";
import {generateName} from "../utils";
import {zip} from "rxjs";

export interface GraphLayoutStavanger extends Stavanger {
    graph: HortenGraph,
    availableLayouts: HortenTable,
    selectedLayout: HortenItem,
    flow: HortenItem

}


export interface GraphLayoutDefinition {

}


export const graphFlowLayoutMaestro = (stavanger: GraphLayoutStavanger, definition: GraphLayoutDefinition) => {

    const graph = stavanger.graph
    const layoutlist = stavanger.availableLayouts
    const layout = stavanger.selectedLayout
    const flow = stavanger.flow


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

    const loadFlowAndFirstItem = (action$, state$) =>

        zip(
            action$.ofType(flow.model.fetchItem.success),
        ).pipe(
            take(1),
            map(action => {
                let flow = action[0].payload
                return graph.model.setGraphFromFlow.request(flow)
            }));


    return combineOrchestrator(stavanger, {
        onDifferentLayoutSelected,
        onLayoutUpdatedCreate,
        onLayoutUpdatedUpdate,
        loadFlowAndFirstItem,
        onLayoutListComesSelectFirstLayout
        }
    )
}
