import {combineEpics} from "redux-observable";
import type {SliceLineTransformer} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: SliceLineTransformer) => {

    const moduleMaestro = nodeMaestro(stavanger)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["representation","roi","slice"],
        parser: "transformings",
        outputs: ["transformations"],
        parsing: (action, action$, state$ ) => {
            let representation = stavanger.representation.selectors.getData(state$.value);
            let slice = stavanger.slice.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let roi = stavanger.roi.selectors.getData(state$.value)



            if (!roi) return [stavanger.node.helpers.requireUser("Please set Roi First")]
            if (!representation) return [stavanger.node.helpers.requireUser("Please set Representation First")]
            if (!slice) return [stavanger.node.helpers.requireUser("Please set Slice First")]


            let sendsettings = {...settings, ...slice}

            let transforming = {
                data: {
                    settings: JSON.stringify(sendsettings),
                    creator: userIDPortal(state$.value),
                    representation: representation.id,//is initial
                    sample: representation.sample,//is initial
                    transformer: 1, // TODO: This is hard coded and wrong
                    nodeid: stavanger.node.alias,
                    roi: roi.id,
                    override: false
                },
                meta:{
                    buffer: "of course"
                }


            }
            return [
                stavanger.transformings.model.postItem.request(transforming),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]


        }
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.roi),
        itemConnector(stavanger.representation),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.transformings)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        addin1
    })
}

export default orchestraterEpic