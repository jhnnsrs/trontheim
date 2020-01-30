import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ImpulsorStavanger} from "./index";
import {nodeMaestro} from "../nodeMaestro";


export const orchestraterEpic = (stavanger: ImpulsorStavanger) => {

    const moduleMaestro = nodeMaestro(stavanger)


    const apiConnections = combineEpics(
    )

    return combineEpics(
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic