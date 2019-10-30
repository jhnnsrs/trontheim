import {combineEpics} from "redux-observable";
import type {DisplaySelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";


export const orchestraterEpic = (stavanger: DisplaySelectorStavanger) => {


    const cond = selectionConductor(stavanger, {
        output: "displays",
        filters: ["sample","experiment","representation","user"],
        filterFunc: (action$,state$) => {
            let sample = stavanger.sample.selectors.getData(state$.value)
            let representation = stavanger.representation.selectors.getData(state$.value)
            let experiment = stavanger.experiment.selectors.getData(state$.value)
            let user = stavanger.user.selectors.getData(state$.value)

            let filter = {
                sample: sample === null ? undefined : sample.id,
                creator: user === null ? undefined : user.id,
                representation: representation === null ? undefined : representation.id,
                experiment: experiment === null ? undefined : experiment.id,
            }


            return filter
        }
    })

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.displays)
    )

    return combineEpics(
        cond,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic