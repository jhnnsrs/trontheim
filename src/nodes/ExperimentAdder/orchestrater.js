import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ExperimentAdderStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {updaterConductor} from "../../alta/conductor/updaterconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: ExperimentAdderStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const onInitializedLoadExperiments = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.request),
            mergeMap( action => {
                let userid = userIDPortal(state$.value)
                return [stavanger.experiments.model.fetchList.request({meta: {filter: { creator: userid}}})]

            })
        )

    const taskconductor = updaterConductor(stavanger,
        {
            input: ["sample"],
            updater: "sample",
            output: ["sampleout"],
            updateFunc: (payload,state) => {
                let settings = stavanger.settings.selectors.getMerged(state)

                let samplein = stavanger.sample.selectors.getData(state)

                console.log(settings, samplein)

                let node = stavanger.edge.selectors.getModel(state)

                let sample = {
                    data: {
                        ...samplein,
                        experiment: settings.experiment,
                        creator: userIDPortal(state),
                        nodeid: node.nodeid
                    },
                    meta:{
                        buffer: "None"
                    }


                }

                return sample
            },
            shouldUpdateFunc: (payload, state, a) => {
                // Payload can either be Slice, Roi, or Representation, if Roi is new Always Update
                if (payload.meta.model === constants.SAMPLE) return true
                if (!stavanger.settings.selectors.getMerged(state).experiment) return false
                if (stavanger.settings.selectors.getMerged(state).experiment === 0) return false

                return false

            }
        });

    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        itemConnector(stavanger.sampleout),
        apiConnector(stavanger.experiments),
    )

    return combineEpics(
        onInitializedLoadExperiments,
        taskconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic