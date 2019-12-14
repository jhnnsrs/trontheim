import {combineEpics} from "redux-observable";
import type {BioSeriesCollectorStavanger} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {collectorMaestro} from "../collectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: BioSeriesCollectorStavanger) => {


    const moduleMaestro = nodeMaestro(stavanger,null)

    const collector = collectorMaestro(stavanger,{
        input: "bioseries",
        list: "bioserieslist",
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
        apiConnector(stavanger.bioserieslist)
    )

    return combineOrchestrator( stavanger, {
        apiConnections,
        collector,
        moduleMaestro
    })
}

export default orchestraterEpic