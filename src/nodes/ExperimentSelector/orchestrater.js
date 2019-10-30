import {combineEpics} from "redux-observable";
import type {ExperimentSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";


export const orchestraterEpic = (stavanger: ExperimentSelectorStavanger) => {

    const cond = selectionConductor(stavanger, {
        output: "experiments",
        filters: ["creator"],
        filterFunc: (action$,state$) => {
            let creator = stavanger.creator.selectors.getData(state$.value)

            let filter = {
                creator: creator === null ? undefined : creator.id,
            }



            return filter
        }
    })



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.experiments)
    )

    return combineEpics(cond,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic