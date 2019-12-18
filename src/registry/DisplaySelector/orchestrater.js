import {combineEpics} from "redux-observable";
import type {DisplaySelectorStavanger} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: DisplaySelectorStavanger) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["sample",],
        out: "displays",
        outport: "Display",
        filterActions: (actions, action$, state$) => {

            let sample = stavanger.sample.selectors.getData(state$.value)

            let filter = {
                sample: sample === null ? undefined : sample.id,
            }


            return filter

        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.displays)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic