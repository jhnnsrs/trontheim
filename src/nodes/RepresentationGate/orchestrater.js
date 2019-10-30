import {combineEpics, ofType} from "redux-observable";
import {buffer, mergeMap, switchMap, take} from "rxjs/operators";
import type {RepresentationGateStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: RepresentationGateStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const onImpulsInFloodRepresentation = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representation.model.setItem.success),
            buffer(action$.ofType(stavanger.impulsin.model.setItem.success)),
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
                        return stavanger.edge.model.setOutput.request(output)
                    })
            )
        );

    //TODO: Set Node Output to FlowDiagram
    const onInputModelIsSetAndStartPressed = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representation.model.setItem.success),
            switchMap((action) =>
                action$.pipe(
                    ofType(stavanger.impulsin.model.setItem.request),
                    take(1),
                    mergeMap(() => {
                            let dataStructure = action.payload;
                            console.log("data forward")
                            let output = {
                                data: dataStructure.data,
                                meta: {
                                    model: stavanger.representation.definition.type,
                                    nodeid: stavanger.representation.model.alias
                                }

                            }
                            return [stavanger.edge.model.setOutput.request(output)]
                        }
                    )
                )
            )
        );


    const apiConnections = combineEpics(
        itemConnector(stavanger.impulsin),
        itemConnector(stavanger.representation),
    )

    return combineEpics(
        onImpulsInFloodRepresentation,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic