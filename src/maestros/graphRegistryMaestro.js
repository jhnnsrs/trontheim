import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNodeDefinition} from "../alta/horten/node";
import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {buildStatus, DONE, GRAPHERROR, WAITING} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";
import type {HortenMold} from "../alta/horten/mold";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import {userIDPortal} from "../portals";
import type {HortenCurtain} from "../alta/horten/curtain";
import type {HortenTable} from "../alta/horten/table";

export interface GraphRegistryStavanger extends Stavanger {
    graph: HortenGraph,
    registry: HortenRegistry,

}


export interface GraphRegistryDefinition {

}


export const graphRegistryMaestro = (stavanger: GraphRegistryStavanger, definition: GraphRegistryDefinition) => {

    const graph = stavanger.graph
    const registry = stavanger.registry


    const loadNodes =  (action$, state$) =>
        action$.pipe(
            ofType(graph.model.setGraphFromFlow.success),
            mergeMap(action => {
                return [
                    registry.model.setNodesFromGraph.request(action.payload)
                ]
            }));

    return combineOrchestrator(stavanger, {
        loadNodes
        }
    )
}
