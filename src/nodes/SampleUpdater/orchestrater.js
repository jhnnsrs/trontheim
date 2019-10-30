import {combineEpics} from "redux-observable";
import type {SampleUpdaterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {itemConnector} from "../../rootMaestros";
import {updateConductor} from "../../alta/conductor/updateConductor";
import {buildStatus, SERVER} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: SampleUpdaterStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const updater = updateConductor(stavanger, {
        input: "sample",
        output: "sampleout",
        mold: "settings",
        updaters: ["experiment","experimentalgroup","animal"],
        updateFunc: (action$, state$) => {

            let inputSample = stavanger.sample.selectors.getData(state$.value)
            let experiment = stavanger.experiment.selectors.getData(state$.value)
            let experimentalgroup = stavanger.experimentalgroup.selectors.getData(state$.value)
            let animal = stavanger.animal.selectors.getData(state$.value)

            let update = {
                animal: animal === null ? undefined : animal.id,
                experimentalgroup: experimentalgroup === null ? undefined : experimentalgroup.id,
                experiment: experiment === null ? undefined : experiment.id,
            }

            let updatedSample = {
                data: {
                    ...inputSample,
                    ...update,
                    nodeid: stavanger.edge.model.alias},
                meta: {error: null}
            }

            return [stavanger.sampleout.model.updateItem.request(updatedSample),
                stavanger.edge.model.setStatus.request(buildStatus(SERVER.serverPost))]
        }
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.sampleout),
    )

    return combineEpics(
        updater,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic