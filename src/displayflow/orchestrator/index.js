import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest, switchMap, take} from "rxjs/operators";
import type {DisplayFlowStavanger} from "../stavanger";
import {graphNodeMaestro} from "../../alta/maestro/graph-node";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphEdgeMaestro} from "../../alta/maestro/graph-edge";
import {userIDPortal} from "../../portals";
import {generateName} from "../../utils";
import {graphLayoutWatcherConductor} from "../../alta/conductor/graphLayoutConductor";

export const orchestraterEpic = (stavanger: DisplayFlowStavanger) => {


    const watcherConductor = graphLayoutWatcherConductor(stavanger, {
        watcherName: "DisplayWatcher",
        watcher: "display",
        watcherParamsAccessor: (params) => params.displayid,
        flowParamsAccessor: (params) => params.flowid,
        model: constants.DISPLAY,


    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.display),
        itemConnector(stavanger.flow),
        itemConnector(stavanger.layout),
        apiConnector(stavanger.possibleLayouts),
    )

    return combineEpics(watcherConductor,apiConnections)
}

export default orchestraterEpic