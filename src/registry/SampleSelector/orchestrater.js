import {combineEpics} from "redux-observable";
import type {SampleSelectorStavanger} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: SampleSelectorStavanger) => {


    const addin =  nodeMaestro(stavanger, null)

    const addin2 = selectorMeastro(stavanger, {
        filters: ["locker","bioimage"],
        out: "samples",
        outport: "sample",
        filterActions: (actions, action$, state$) => {

            let creator = stavanger.user.selectors.getData(state$.value)
            let bioimage = stavanger.bioimage.selectors.getData(state$.value)
            let locker = stavanger.locker.selectors.getData(state$.value)

            let filter = {
                creator: creator === null ? undefined : creator.id,
                bioseries__bioimage: bioimage === null ? undefined : bioimage.id,
                bioseries__bioimage__locker: locker === null ? undefined : locker.id,
            }


            return filter

        }
    })



    const apiConnections = combineEpics(
        apiConnector(stavanger.samples)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            addin2
        }
    )
}

export default orchestraterEpic