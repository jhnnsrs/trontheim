import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ForeignMaskerStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: ForeignMaskerStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const onInitialitedPost = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.edge.model.setModel.success,
                stavanger.edge.model.dynamic("INITI").request),
            mergeMap( action => {
                let node = stavanger.edge.selectors.getModel(state$.value)

                let foreignStatus = {
                    data: {
                        nodeid: node.nodeid,
                        name: node.name,
                        status: "active",
                        creator: userIDPortal(state$.value)
                    },
                    meta: {
                        meta: true
                    }
                }


                return [stavanger.status.model.postItem.request(foreignStatus)]

            })
        )


    const parserconductor = taskConductor(stavanger,
        {
            input: ["reflection"],
            parser: "foreign",
            output: ["masks"],
            parserFunc: (payload,state) => {
                console.log("THIS ACTUALLY HAPPENED?")
                let node = stavanger.edge.selectors.getModel(state)

                let request = {
                    data:
                        {
                            nodeid: node.nodeid,
                            data: JSON.stringify(payload)

                        },
                    meta:
                        {update: null}
                }

                return request
            },
            shouldParseFunc: (payload, state, stavanger) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (payload.meta.model == constants.REFLECTION) return true
                else return false

            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.reflection),
        apiConnector(stavanger.foreign),
        apiConnector(stavanger.status),
        apiConnector(stavanger.masks),
    )

    return combineEpics(
        onInitialitedPost,
        parserconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic