import {combineEpics} from "redux-observable";
import type {MaskRevampingStavanger} from "./index";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: MaskRevampingStavanger) => {

    const moduleMaestro = nodeMaestro(stavanger, null)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["mask","transformation"],
        parser: "revampings",
        outputs: ["transformations"],
        parsing: (action, action$, state$ ) => {
            let mask = stavanger.mask.selectors.getData(state$.value);
            let transformation = stavanger.transformation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            let revamping = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
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

            stavanger.revampings.helpers.log("Posting", revamping)

            return [
                stavanger.revampings.model.postItem.request(revamping),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]
        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.revampings),
        apiConnector(stavanger.transformations),
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic