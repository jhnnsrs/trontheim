import {combineEpics} from "redux-observable";
import type {SampleSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";


export const orchestraterEpic = (stavanger: SampleSelectorStavanger) => {

    const cond = selectionConductor(stavanger, {
        output: "samples",
        filters: ["user","bioimage","locker"],
        filterFunc: (action$,state$) => {
            let creator = stavanger.user.selectors.getData(state$.value)
            let bioimage = stavanger.bioimage.selectors.getData(state$.value)
            let locker = stavanger.locker.selectors.getData(state$.value)

            let filter = {
                creator: creator === null ? undefined : creator.id,
                bioseries__bioimage: bioimage === null ? undefined : bioimage.id,
                locker: locker === null ? undefined : locker.id,
            }


            return filter
        }
    })



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.samples)
    )

    return combineEpics(cond,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic