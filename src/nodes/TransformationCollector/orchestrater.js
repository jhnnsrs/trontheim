import {combineEpics} from "redux-observable";
import type {TransformationCollectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {collectorConductor} from "../../alta/conductor/collectorconductor";


export const orchestraterEpic = (stavanger: TransformationCollectorStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

    const collector = collectorConductor(stavanger,{
        input: "transformation",
        list: "transformations",
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.transformation),
        apiConnector(stavanger.transformations)
    )

    return combineEpics(
        apiConnections,
        collector,
        moduleMaestro)
}

export default orchestraterEpic