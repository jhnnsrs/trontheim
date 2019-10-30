import {combineEpics} from "redux-observable";
import type {TransformationMutaterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: TransformationMutaterStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const taskconductor = taskConductor(stavanger,
        {
            input: ["transformation"],
            parser: "mutatings",
            output: ["reflections"],
            parserFunc: (payload,state) => {
                let settings = stavanger.settings.selectors.getMerged(state)

                let transformation = stavanger.transformation.selectors.getData(state)

                console.log("THIS ACTUALLY HAPPENED?")

                settings = {...settings}
                let node = stavanger.edge.selectors.getModel(state)

                let mutating = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state),
                        transformation: transformation.id,//is initial
                        sample: transformation.sample,
                        mutater: node.entityid,
                        nodeid: node.nodeid,
                    },
                    meta:{
                        buffer: "None"
                    }


                }

                return mutating
            },
            shouldParseFunc: (payload, state, stavanger) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (payload.meta.model == constants.TRANSFORMATION) return true
                else return false

            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.transformation),
        apiConnector(stavanger.mutatings),
        apiConnector(stavanger.reflections)
    )

    return combineEpics(
        taskconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic