import {combineEpics} from "redux-observable";
import type {BioConverter} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: BioConverter) => {

    const moduleMaestro = nodeMaestro(stavanger, null)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["bioseries"],
        parser: "conversings",
        outputs: ["samples","representations"],
        parsing: (action, action$, state$ ) => {
            let bioseries = stavanger.bioseries.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            let conversing = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    bioserie: bioseries.id,//is initial
                    converter: node.entityid,
                    outputvid: 0,
                    experiment: bioseries.experiment, // TODO: Check best practice here
                    nodeid: stavanger.node.alias,
                    override: false
                },
                meta:{
                    buffer: "None"
                }


            }

            stavanger.conversings.helpers.log("Posting", conversing)

            return [
                stavanger.conversings.model.postItem.request(conversing),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]
        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.conversings),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.representations)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic