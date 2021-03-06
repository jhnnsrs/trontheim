import {combineEpics} from "redux-observable";
import type {LockerWatcherStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";


export const orchestraterEpic = (stavanger: LockerWatcherStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

    const watcherconductors = watcherConductor(stavanger,{
        input: "locker",
        list: "lockers",
        listFilter: (action) => ({filter: action.payload.filter})
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.locker),
        apiConnector(stavanger.lockers)
    )

    return combineEpics(
        apiConnections,
        watcherconductors,
        moduleMaestro)
}

export default orchestraterEpic