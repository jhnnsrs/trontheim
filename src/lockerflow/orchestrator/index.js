import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest, switchMap, take} from "rxjs/operators";
import type {LockerFlowStavanger} from "../stavanger";
import {graphNodeMaestro} from "../../alta/maestro/graph-node";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphEdgeMaestro} from "../../alta/maestro/graph-edge";
import {userIDPortal} from "../../portals";
import {generateName} from "../../utils";
import {graphLayoutWatcherConductor} from "../../alta/conductor/graphLayoutConductor";

export const orchestraterEpic = (stavanger: LockerFlowStavanger) => {


    const watcherConductor = graphLayoutWatcherConductor(stavanger, {
        watcherName: "LockerWatcher",
        watcher: "locker",
        watcherParamsAccessor: (params) => params.lockerid,
        flowParamsAccessor: (params) => params.flowid,
        model: constants.LOCKER,


    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.locker),
        itemConnector(stavanger.flow),
        itemConnector(stavanger.layout),
        apiConnector(stavanger.possibleLayouts),
    )

    return combineEpics(watcherConductor,apiConnections)
}

export default orchestraterEpic