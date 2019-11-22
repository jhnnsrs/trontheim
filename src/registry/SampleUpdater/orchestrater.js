import {combineEpics} from "redux-observable";
import type {SampleUpdaterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {itemConnector} from "../../rootMaestros";
import {updateConductor} from "../../alta/conductor/updateConductor";
import {buildStatus, SERVER} from "../../constants/nodestatus";
import {nodeMaestro} from "../nodeMaestro";
import {updaterMaestro} from "../updaterMaestro";


export const orchestraterEpic = (stavanger: SampleUpdaterStavanger) => {

    const moduleMaestro = nodeMaestro(stavanger)



    const apiConnections = combineEpics(
        itemConnector(stavanger.sampleout),
    )

    return combineEpics(
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic