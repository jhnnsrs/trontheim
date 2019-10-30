import {combineEpics} from "redux-observable";
import type {ClusterEvaluatorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: ClusterEvaluatorStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const taskconductor = taskConductor(stavanger,
        {
            input: ["transformation"],
            parser: "evaluating",
            output: ["clusterdata"],
            parserFunc: (payload,state) => {
                let settings = stavanger.settings.selectors.getMerged(state)

                let transformation = stavanger.transformation.selectors.getData(state)

                console.log("THIS ACTUALL?")

                settings = {...settings}
                let node = stavanger.edge.selectors.getModel(state)

                let evaluating = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state),
                        transformation: transformation.id,//is initial
                        sample: transformation.sample,
                        roi: transformation.roi,
                        evaluator: node.entityid,
                        experiment: transformation.experiment,
                        error: "false",
                        override: false,
                        nodeid: node.nodeid,
                    },
                    meta:{
                        buffer: "None"
                    }


                }

                return evaluating
            },
            shouldParseFunc: (payload, state, stavanger) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (payload.meta.model == constants.TRANSFORMATION) return true
                else return false

            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.transformation),
        apiConnector(stavanger.evaluating),
        apiConnector(stavanger.clusterdata)
    )

    return combineEpics(
        taskconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic