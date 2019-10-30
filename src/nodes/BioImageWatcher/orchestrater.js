
import {combineEpics, ofType} from "redux-observable";
import type {DisplayNodeStavanger, BioImageWatcherStavanger} from "./index";
import {createEdgeMaestro, createModuleMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {audit, filter, map, mergeMap, switchMap, take} from "rxjs/operators";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";


export const orchestraterEpic = (stavanger: BioImageWatcherStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

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