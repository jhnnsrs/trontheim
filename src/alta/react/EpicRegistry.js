import {combineEpics, Epic} from "redux-observable";
import type {Stavanger} from "../stavanger";

export const combineStavangersToEpic = (stavanger: Stavanger, alias: string): Epic  => {
    let epiclist = []
    for (let i in stavanger) {
        if (stavanger[i].alias.toLowerCase() == alias.toLowerCase()) {
            epiclist.push(stavanger[i].epic)
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