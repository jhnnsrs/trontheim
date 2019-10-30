import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ImpulsorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: ImpulsorStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const onImpulsIn = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.impulsin.model.setItem.success,
                stavanger.page.model.dynamic("IMPULSE").request
                ),
            mergeMap(action => {
                let sample = action.payload;
                let output = {
                    data: null,
                    meta:{
                        model: constants.IMPULS,
                        nodeid: stavanger.impulsin.model.alias
                    }
                }

                return [stavanger.edge.model.setOutput.request(output)]
            })
        );


    const apiConnections = combineEpics(
        itemConnector(stavanger.impulsin),
        itemConnector(stavanger.impulsout),
    )

    return combineEpics(
        onImpulsIn,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic