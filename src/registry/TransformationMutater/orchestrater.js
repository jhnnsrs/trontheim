import {combineEpics} from "redux-observable";
import type {TransformationMutater} from "./index";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: TransformationMutater) => {

    const moduleMaestro = nodeMaestro(stavanger, null)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["transformation"],
        parser: "mutatings",
        outputs: ["reflections"],
        parsing: (action, action$, state$ ) => {
            let transformation = stavanger.transformation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            let mutatating = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    transformation: transformation.id,//is initial
                    sample: transformation.sample,//is initial
                    mutater: node.entityid,
                    nodeid: stavanger.node.alias,
                    override: false
                },
                meta:{
                    buffer: "of course"
                }

            }

            return [stavanger.mutatings.model.postItem.request(mutatating),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")]
        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.mutatings),
        apiConnector(stavanger.reflections)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic