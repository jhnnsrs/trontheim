import {combineEpics} from "redux-observable";
import type {BioImageWatcherStavanger} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";
import {NodeConductor} from "../../alta/conductor/node";


export const orchestraterEpic = (stavanger: BioImageWatcherStavanger) => {


    const moduleMaestro = NodeConductor(stavanger)

    const watcherconductor = watcherConductor(stavanger,{
        input: "bioimage",
        list: "bioimages",
        listFilter: (action) => ({filter: action.payload.filter})
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        apiConnector(stavanger.bioimages)
    )

    return combineEpics(
        apiConnections,
        watcherconductor,
        moduleMaestro)
}

export default orchestraterEpic