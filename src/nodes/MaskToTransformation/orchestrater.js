import {combineEpics} from "redux-observable";
import type {MaskMasking} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: MaskMasking) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const taskconductor = taskConductor(stavanger,
        {
            input: ["mask","transformation"],
            parser: "revampings",
            output: ["transformations"],
            parserFunc: (payload,state) => {
                let settings = stavanger.settings.selectors.getMerged(state)

                let transformation = stavanger.transformation.selectors.getData(state)
                let mask = stavanger.mask.selectors.getData(state)

                console.log("THIS ACTUALL?")

                settings = {...settings}
                let node = stavanger.edge.selectors.getModel(state)

                let revamping = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state),
                        transformation: transformation.id,//is initial
                        sample: transformation.sample,
                        revamper: node.entityid,
                        experiment: transformation.experiment,
                        mask: mask.id,
                        nodeid: node.nodeid,
                    },
                    meta:{
                        buffer: "None"
                    }

                }

                return revamping
            },
            shouldParseFunc: (payload, state, stavanger) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (payload.meta.model == constants.MASK) return true
                else return false

            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.transformation),
        itemConnector(stavanger.mask),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.revampings)
    )

    return combineEpics(
        taskconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic