
import {combineEpics, ofType} from "redux-observable";
import type {DisplayNodeStavanger, DisplayWatcherStavanger} from "./index";
import {createEdgeMaestro, createModuleMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {audit, filter, map, mergeMap, switchMap, take} from "rxjs/operators";
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