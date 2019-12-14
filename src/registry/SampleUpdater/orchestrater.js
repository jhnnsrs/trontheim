import {combineEpics} from "redux-observable";
import type {SampleUpdaterStavanger} from "./index";
import {itemConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";


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