import {combineEpics, ofType} from "redux-observable";
import type {SampleSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";
import {mergeMap} from "rxjs/operators";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";
import {nodeMaestro} from "../nodeMaestro";


export const orchestraterEpic = (stavanger: SampleSelectorStavanger) => {


    const addin =  nodeMaestro(stavanger, null)

    const apiConnections = combineEpics(
        apiConnector(stavanger.samples)
    )

    return combineEpics(
        apiConnections,
        addin,
    )
}

export default orchestraterEpic