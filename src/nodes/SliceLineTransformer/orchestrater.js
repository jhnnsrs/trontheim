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
            input: ["roi","slice","representation"],
            parser: "transformings",
            output: ["transformations"],
            parserFunc: (payload,state) => {
                let settings = stavanger.settings.selectors.getMerged(state)

                let representation = stavanger.representation.selectors.getData(state)
                let roi = stavanger.roi.selectors.getData(state)
                let slice = stavanger.slice.selectors.getData(state)

                console.log("THIS ACTUALLY HAPPENED?")

                settings = {...settings, ...slice}
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
            shouldParseFunc: (payload, state, a) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (!stavanger.representation.selectors.getData(state)) return false
                if (!stavanger.slice.selectors.getData(state)) return false
                if (!stavanger.roi.selectors.getData(state)) return false

                if (payload.meta.model == constants.SLICE) return true

                else return false

            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.roi),
        itemConnector(stavanger.representation),
        itemConnector(stavanger.slice),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.transformings)
    )

    return combineEpics(
        taskconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic