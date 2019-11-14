import {combineEpics} from "redux-observable";
import type {DisplayFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
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