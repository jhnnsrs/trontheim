import {combineEpics} from "redux-observable";
import type {LineTransformer} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: LineTransformer) => {

    const moduleMaestro = nodeMaestro(stavanger)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["transformation"],
        parser: "evaluatings",
        outputs: ["clusterdata"],
        parsing: (action, action$, state$ ) => {
            let transformation = stavanger.transformation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            if (!transformation) return [stavanger.node.helpers.requireUser("Please set Transformation First")]

            let evaluating = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
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
                    buffer: "of course"
                }


            }
            return [
                stavanger.evaluatings.model.postItem.request(evaluating),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]


        }
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.transformation),
        apiConnector(stavanger.evaluatings),
        apiConnector(stavanger.clusterdata)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic