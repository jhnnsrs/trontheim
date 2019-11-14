import {combineEpics} from "redux-observable";
import type {BioSeriesCollectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
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