import {combineEpics} from "redux-observable";
import type {RoiSelectorStavanger} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: RoiSelectorStavanger) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["sample","display"],
        out: "rois",
        outport: "roi",
        filterActions: (actions, action$, state$) => {

            let sample = stavanger.sample.selectors.getData(state$.value)
            let display = stavanger.display.selectors.getData(state$.value)

            let filter = {
                sample: sample === null ? undefined : sample.id,
                display: display === null ? undefined : display.id,
            }


            return filter

        },
        roomAction: (actions, action$, state$) => {
            let sample = stavanger.sample.selectors.getData(state$.value)
            let display = stavanger.display.selectors.getData(state$.value)

            let room = {}

            if (sample) room["sample"] = sample.id
            if (display) room["display"] = display.id


            return room
        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.rois)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic