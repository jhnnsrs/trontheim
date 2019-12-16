import {combineEpics} from "redux-observable";
import type {IntensityProfiler} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: IntensityProfiler) => {

    const moduleMaestro = nodeMaestro(stavanger)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["transformation"],
        parser: "strainings",
        outputs: ["transformations"],
        parsing: (action, action$, state$ ) => {
            let transformation = stavanger.transformation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)


            if (!transformation) return [stavanger.node.helpers.requireUser("Please set Transformation First")]

            let straining = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    transformation: transformation.id,//is initial
                    sample: transformation.sample,//is initial
                    strainer: node.entityid, // TODO: This is hard coded and wrong
                    nodeid: stavanger.node.alias,
                    override: false
                },
                meta:{
                    buffer: "of course"
                }


            }
            return [
                stavanger.strainings.model.postItem.request(straining),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]


        }
    })


    const apiConnections = combineEpics(
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.strainings)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic