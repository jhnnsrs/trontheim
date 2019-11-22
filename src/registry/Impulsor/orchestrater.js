import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ImpulsorStavanger} from "./index";
import {nodeMaestro} from "../nodeMaestro";


export const orchestraterEpic = (stavanger: ImpulsorStavanger) => {

    const moduleMaestro = nodeMaestro(stavanger)

    const onImpulsIn = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.impulsin.model.setItem.success,
                stavanger.page.model.dynamic("IMPULSE").request
                ),
            mergeMap(action => {
                let sample = action.payload;
                let output = {
                    data: null,
                }

                return [stavanger.node.model.setOut("impuls").request(output)]
            })
        );


    const apiConnections = combineEpics(
    )

    return combineEpics(
        onImpulsIn,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic