import {combineEpics} from "redux-observable";
import type {DisplayFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphLayoutWatcherConductor} from "../../alta/conductor/graphLayoutConductor";

export const orchestraterEpic = (stavanger: DisplayFlowStavanger) => {


    const watcherConductor = graphLayoutWatcherConductor(stavanger, {
        watcherName: "ExhibitWatcher",
        watcher: "exhibit",
        watcherParamsAccessor: (params) => params.exhibitid,
        flowParamsAccessor: (params) => params.flowid,
        model: constants.EXHIBIT,


    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.exhibit),
        itemConnector(stavanger.flow),
        itemConnector(stavanger.layout),
        apiConnector(stavanger.possibleLayouts),
    )

    return combineEpics(watcherConductor,apiConnections)
}

export default orchestraterEpic