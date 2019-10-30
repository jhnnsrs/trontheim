import {combineEpics} from "redux-observable";
import type {UserSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";


export const orchestraterEpic = (stavanger: UserSelectorStavanger) => {

    const cond = selectionConductor(stavanger, {
        output: "creators",
        filters: [],
        filterFunc: (action$,state$) => {

            let filter = {

            }



            return filter
        }
    })


    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.creators)
    )

    return combineEpics(cond,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic