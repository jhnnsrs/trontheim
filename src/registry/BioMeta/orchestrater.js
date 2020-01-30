import {combineEpics} from "redux-observable";
import type {LineTransformer} from "./index";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: LineTransformer) => {

    const moduleMaestro = nodeMaestro(stavanger)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["bioimage"],
        parser: "analyzings",
        outputs: ["bioseries"],
        parsing: (action, action$, state$ ) => {
            let bioimage = stavanger.bioimage.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            if (!bioimage) return [stavanger.node.helpers.requireUser("Please set Bioimage First")]

            let analyzing = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    experiment: bioimage.experiment, //TODO: Check if this should be the standard behaviour
                    analyzer: node.entityid,
                    bioimage: bioimage.id,
                    nodeid: stavanger.node.alias
                },
                meta:{
                    buffer: "None"
                }

            }

            return [
                stavanger.analyzings.model.postItem.request(analyzing),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]


        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.analyzings),
        apiConnector(stavanger.bioseries)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic