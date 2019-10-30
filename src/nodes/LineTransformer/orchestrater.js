import {combineEpics} from "redux-observable";
import type {SliceLineTransformer} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: SliceLineTransformer) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const taskconductor = taskConductor(stavanger,
        {
            input: ["roi","representation"],
            parser: "transformings",
            output: ["transformations"],
            parserFunc: (payload,state) => {
                let settings = stavanger.settings.selectors.getMerged(state)

                let representation = stavanger.representation.selectors.getData(state)
                let roi = stavanger.roi.selectors.getData(state)

                console.log("THIS ACTUALLY HAPPENED?")

                settings = {...settings}
                let node = stavanger.edge.selectors.getModel(state)

                let transforming = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state),
                        representation: representation.id,//is initial
                        sample: representation.sample,
                        transformer: node.entityid,
                        experiment: representation.experiment,
                        roi: roi.id,
                        nodeid: node.nodeid,
                    },
                    meta:{
                        buffer: "None"
                    }


                }

                return transforming
            },
            shouldParseFunc: (payload, state, stavanger) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (payload.meta.model == constants.ROI) return true
                else return false

            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.roi),
        itemConnector(stavanger.representation),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.transformings)
    )

    return combineEpics(
        taskconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic