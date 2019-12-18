import {Epic} from "redux-observable";
import type {Stavanger} from "../stavanger";
import {catchError} from "rxjs/operators";
import {merge} from "rxjs"
import {combineEpicsWithErrorHandling} from "../horten/creators";

export const combineEpics = (...epics) => (...args) =>
    merge(
        ...epics.map(([alias,epic]) =>
            epic(...args).pipe(
                // When epic emits error, rethrow it async and resubscribe.
                // Otherwise, errors will cause cascading termination of all epics.
                    catchError((error, source) => {
                    console.error( alias ,"|", error, source)
                    return source;
                })
            )
        )
    );


export const combineStavangersToEpic = (stavanger: Stavanger, alias: string): Epic  => {
    let epiclist = []
    for (let i in stavanger) {
        if (stavanger[i].alias.toLowerCase() == alias.toLowerCase()) {
            epiclist.push([i,stavanger[i].epic])
        }
    }
    let epic = null
    try {
        epic = combineEpics(...epiclist)
    }
    catch (e) {
        console.error("Error in Stavanger " +stavanger.page.model.alias, e)
    }


    return epic
}


export const combineOrchestrator = (stavanger: Stavanger, epicDict: any): Epic => {

    let epiclist = []
    for (let i in epicDict) {
        epiclist.push([i,epicDict[i]])

    }
    let epic = null
    try {
        epic = combineEpicsWithErrorHandling(stavanger.page.alias, "orchestrator",...epiclist)
    }
    catch (e) {
        console.error("Error in Stavanger " +stavanger.page.model.alias, e)
    }


    return epic
}