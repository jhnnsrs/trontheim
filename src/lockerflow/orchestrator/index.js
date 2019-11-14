import {combineEpics} from "redux-observable";
import type {LockerFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphConductor, graphLayoutWatcherConductor} from "../../alta/conductor/graphLayoutConductor";

export const orchestraterEpic = (stavanger: LockerFlowStavanger) => {


    const watcherConductor = graphConductor(stavanger, {
        watcherName: "LockerWatcher",
        watcher: "locker",
        watcherParamsAccessor: (props) => props.match.params.lockerid,
        flowParamsAccessor: (props) => props.match.params.flowid,
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