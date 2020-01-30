import {combineEpics} from "redux-observable";
import type {MaxISP} from "./index";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: MaxISP) => {

    const moduleMaestro = nodeMaestro(stavanger, null)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["representation"],
        parser: "filterings",
        outputs: ["representations"],
        parsing: (action, action$, state$ ) => {
            let representation = stavanger.representation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            let filtering = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    filter: node.entityid,
                    experiment: representation.experiment,
                    sample: representation.sample,
                    representation: representation.id,
                    nodeid: stavanger.node.alias
                },
                meta:{
                    buffer: "None"
                }


            }

            stavanger.filterings.helpers.log("posting filtering", filtering)
            return [stavanger.filterings.model.postItem.request(filtering),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")]
        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.filterings),
        apiConnector(stavanger.representations)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic