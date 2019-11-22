import {combineEpics} from "redux-observable";
import type {ExperimentSelector} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: ExperimentSelector) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["user"],
        out: "experiments",
        outport: "experiment",
        filterActions: (actions, action$, state$) => {

            let creator = stavanger.user.selectors.getData(state$.value)

            let filter = {
                creator: creator === null ? undefined : creator.id,
            }


            return filter

        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.experiments)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic