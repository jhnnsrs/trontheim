import {combineEpics} from "redux-observable";
import type {DisplayWatcherStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";


export const orchestraterEpic = (stavanger: DisplayWatcherStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

    const watcherconductors = watcherConductor(stavanger,{
        input: "display",
        list: "displays",
        listFilter: (action) => ({filter: action.payload.filter})
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.display),
        apiConnector(stavanger.displays)
    )

    return combineEpics(
        apiConnections,
        watcherconductors,
        moduleMaestro)
}

export default orchestraterEpic