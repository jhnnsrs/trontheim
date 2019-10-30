import {combineEpics} from "redux-observable";
import type {BioConverterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {serverRequestConductor} from "../../alta/conductor/serverRequestConductor";


export const orchestraterEpic = (stavanger: BioConverterStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const conductor = serverRequestConductor(stavanger, {
        inputs: ["bioseries"],
        outputs: ["sample", "representations"],
        parser: "conversings",
        parserFunc: (action$, state$) => {
            let bioseries = stavanger.bioseries.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.edge.selectors.getModel(state$.value)

            let conversing = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    bioserie: bioseries.id,//is initial
                    converter: node.entityid,
                    outputvid: 0,
                    experiment: bioseries.experiment,
                    nodeid: node.nodeid,
                    override: false
                },
                meta:{
                    buffer: "None"
                }


            }
            return [stavanger.conversings.model.postItem.request(conversing),]

        }
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.conversings)
    )

    return combineEpics(
        conductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic