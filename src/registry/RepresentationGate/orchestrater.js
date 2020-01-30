import {combineEpics, ofType} from "redux-observable";
import {buffer, merge, mergeMap} from "rxjs/operators";
import type {RepresentationGate} from "./index";
import {apiConnector} from "../../rootMaestros";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {nodeMaestro} from "../nodeMaestro";
import {NODE} from "../../constants/nodestatus";
import * as constants from "../../constants";


export const orchestraterEpic = (stavanger: RepresentationGate) => {

    const onImpulsInFloodRepresentation = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representation.model.setItem.success),
            buffer(action$.ofType(stavanger.impuls.model.setItem.success)),
            mergeMap(actions =>
                actions.map( action => {
                    let rep = action.payload;
                    let output = {
                        data: rep.data,
                        meta:{
                            model: constants.REPRESENTATION,
                            nodeid: stavanger.representation.model.alias
                        }
                    }
                    return stavanger.node.model.setOut("representation").request(output)
                })
            )
        );



    const moduleMaestro = nodeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.representations),
    )

    return combineOrchestrator(stavanger, {
        onImpulsInFloodRepresentation,
        apiConnections,
        moduleMaestro
    })
}

export default orchestraterEpic