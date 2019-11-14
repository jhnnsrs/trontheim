import {combineEpics} from "redux-observable";
import type {BioImageFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphLayoutWatcherConductor} from "../../alta/conductor/graphLayoutConductor";

export const orchestraterEpic = (stavanger: BioImageFlowStavanger) => {


    const watcherConductor = graphLayoutWatcherConductor(stavanger, {
        watcherName: "BioImageWatcher",
        watcher: "bioimage",
        watcherParamsAccessor: (params) => params.bioimageid,
        flowParamsAccessor: (params) => params.flowid,
        model: constants.BIOIMAGE,
    })




    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        itemConnector(stavanger.flow),
        itemConnector(stavanger.layout),
        apiConnector(stavanger.possibleLayouts),
    )

    return combineEpics(watcherConductor, apiConnections)
}

export default orchestraterEpic