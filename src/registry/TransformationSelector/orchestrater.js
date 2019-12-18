import {combineEpics} from "redux-observable";
import type {ExperimentSelector} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: ExperimentSelector) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["roi","user","sample","representation"],
        out: "transformations",
        outport: "transformation",
        filterActions: (actions, action$, state$) => {
            let sample = stavanger.sample.selectors.getData(state$.value)
            let representation = stavanger.representation.selectors.getData(state$.value)
            let roi = stavanger.roi.selectors.getData(state$.value)
            let user = stavanger.user.selectors.getData(state$.value)

            let filter = {
                sample: sample === null ? undefined : sample.id,
                creator: user === null ? undefined : user.id,
                representation: representation === null ? undefined : representation.id,
                roi: roi === null ? undefined : roi.id,
            }


            return filter

        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.transformations)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic