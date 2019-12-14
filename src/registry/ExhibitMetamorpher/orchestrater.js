import {combineEpics} from "redux-observable";
import type {ExhibitMetamorpher} from "./index";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: ExhibitMetamorpher) => {

    const moduleMaestro = nodeMaestro(stavanger, null)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["representation"],
        parser: "metamorphings",
        outputs: ["exhibits"],
        parsing: (action, action$, state$ ) => {
            let representation = stavanger.representation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            let metamorphing = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    representation: representation.id,//is initial
                    sample: representation.sample,//is initial
                    metamorpher: node.entityid,
                    nodeid: stavanger.node.alias,
                    override: false
                },
                meta:{
                    buffer: "of course"
                }

            }

            return [stavanger.metamorphings.model.postItem.request(metamorphing),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")]
        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.metamorphings),
        apiConnector(stavanger.exhibits)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic