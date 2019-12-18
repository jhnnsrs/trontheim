import {combineEpics} from "redux-observable";
import type {RepresentationSelector} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: RepresentationSelector) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["sample",],
        out: "representations",
        outport: "representation",
        filterActions: (actions, action$, state$) => {

            let sample = stavanger.sample.selectors.getData(state$.value)

            let filter = {
                sample: sample === null ? undefined : sample.id,
            }


            return filter

        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.representations)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic