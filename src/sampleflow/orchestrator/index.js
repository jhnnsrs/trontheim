import {combineEpics} from "redux-observable";
import type {SampleFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {graphLayoutWatcherConductor} from "../../alta/conductor/graphLayoutConductor";

export const orchestraterEpic = (stavanger: SampleFlowStavanger) => {


    const watcherConductor = graphLayoutWatcherConductor(stavanger, {
        watcherName: "SampleWatcher",
        watcher: "sample",
        watcherParamsAccessor: (params) => params.sampleid,
        flowParamsAccessor: (params) => params.flowid,
        model: constants.SAMPLE,


    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        itemConnector(stavanger.flow),
        itemConnector(stavanger.layout),
        apiConnector(stavanger.possibleLayouts),
    )

    return combineEpics(watcherConductor,apiConnections)
}

export default orchestraterEpic