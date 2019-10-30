
import {combineEpics, ofType} from "redux-observable";
import type {DisplayNodeStavanger, BioSeriesCollectorStavanger} from "./index";
import {createEdgeMaestro, createModuleMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {audit, filter, map, mergeMap, switchMap, take} from "rxjs/operators";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";
import {collectorConductor} from "../../alta/conductor/collectorconductor";


export const orchestraterEpic = (stavanger: BioSeriesCollectorStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

    const collector = collectorConductor(stavanger,{
        input: "bioseries",
        list: "bioserieslist",
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
        apiConnector(stavanger.bioserieslist)
    )

    return combineEpics(
        apiConnections,
        collector,
        moduleMaestro)
}

export default orchestraterEpic