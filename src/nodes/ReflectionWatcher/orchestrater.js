
import {combineEpics, ofType} from "redux-observable";
import type {DisplayNodeStavanger, ReflectionWatcherStavanger} from "./index";
import {createEdgeMaestro, createModuleMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {audit, filter, map, mergeMap, switchMap, take} from "rxjs/operators";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";


export const orchestraterEpic = (stavanger: ReflectionWatcherStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

    const watcherconductor = watcherConductor(stavanger,{
        input: "reflection",
        list: "reflections",
        listFilter: (action) => ({filter: action.payload.filter})
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.reflection),
        apiConnector(stavanger.reflections)
    )

    return combineEpics(
        apiConnections,
        watcherconductor,
        moduleMaestro)
}

export default orchestraterEpic