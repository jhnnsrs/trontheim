import {combineEpics} from "redux-observable";
import type {BioImageSelector} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: BioImageSelector) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["locker",],
        out: "bioimages",
        outport: "bioimage",
        filterActions: (actions, action$, state$) => {

            let locker = stavanger.locker.selectors.getData(state$.value)

            let filter = {
                locker: locker === null ? undefined : locker.id,
            }


            return filter

        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.bioimages)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic